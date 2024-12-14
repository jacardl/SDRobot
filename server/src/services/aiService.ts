import axios from 'axios'
import { EventEmitter } from 'events'

// Coze API 相关类型定义
interface CozeMessage {
  role: 'user' | 'assistant'
  content: string
  content_type: 'text'
}

interface CozeRequest {
  bot_id: string
  user_id: string
  stream: boolean
  auto_save_history: boolean
  additional_messages: CozeMessage[]
}

interface StreamChunk {
  event: string
  data: any
}

const COZE_API_URL = 'https://api.coze.cn/v3/chat'

class AIService {
  async generateResponse(messages: { role: string; content: string }[]): Promise<EventEmitter> {
    try {
      // 验证 API Key
      if (!process.env.COZE_API_KEY) {
        throw new Error('COZE_API_KEY is not defined')
      }

      const cozeRequest: CozeRequest = {
        bot_id: process.env.COZE_BOT_ID!,
        user_id: "user_" + Date.now(),
        stream: true,
        auto_save_history: true,
        additional_messages: messages.map(msg => ({
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          content: msg.content,
          content_type: 'text'
        }))
      }

      console.log('Coze request:', JSON.stringify(cozeRequest, null, 2))

      // 创建事件发射器
      const eventEmitter = new EventEmitter()

      // 发送请求
      const response = await axios.post(
        COZE_API_URL,
        cozeRequest,
        {
          headers: {
            'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
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
              const parsed: StreamChunk = JSON.parse(data)
              
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
      console.error('Coze API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
      throw error
    }
  }
}

export const aiService = new AIService()

export const callAIService = (messages: { role: string; content: string }[]) => {
  return aiService.generateResponse(messages)
} 