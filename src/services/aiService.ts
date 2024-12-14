import axios from 'axios'
import { EventEmitter } from '../utils/EventEmitter'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class AIService {
  async generateResponse(messages: any[]): Promise<EventEmitter> {
    try {
      console.log('Frontend sending request to:', `${API_URL}/api/ai/chat`)
      console.log('Request data:', { messages })

      // 创建事件发射器
      const eventEmitter = new EventEmitter()

      // 发送流式请求
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: Date.now()
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          responseType: 'stream'
        }
      )

      // 处理流式响应
      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n')
        lines.forEach(line => {
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') {
              eventEmitter.emit('done')
              return
            }

            try {
              const parsed = JSON.parse(data)
              
              switch (parsed.event) {
                case 'conversation.chat.created':
                case 'conversation.chat.in_progress':
                  eventEmitter.emit('status', parsed.data.status)
                  break

                case 'conversation.message.delta':
                  if (parsed.data.role === 'assistant' && parsed.data.type === 'answer') {
                    eventEmitter.emit('token', parsed.data.content)
                  }
                  break

                case 'conversation.message.completed':
                  if (parsed.data.role === 'assistant' && parsed.data.type === 'answer') {
                    eventEmitter.emit('complete', parsed.data.content)
                  }
                  break

                case 'conversation.chat.completed':
                  eventEmitter.emit('end', parsed.data)
                  break

                case 'error':
                  eventEmitter.emit('error', new Error(parsed.data.msg))
                  break
              }
            } catch (e) {
              console.warn('Failed to parse stream chunk:', data)
            }
          }
        })
      })

      response.data.on('error', (error: Error) => {
        eventEmitter.emit('error', error)
      })

      return eventEmitter

    } catch (error: any) {
      console.error('Frontend API Error:', {
        message: error.message,
        response: error.response?.data
      })
      throw error
    }
  }
}

export const aiService = new AIService()