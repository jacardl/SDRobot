import axios from 'axios'
import { EventEmitter } from '../utils/EventEmitter'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class AIService {
  async generateResponse(messages: any[]): Promise<EventEmitter> {
    try {
      console.log('Frontend sending request to:', `${API_URL}/api/ai/chat`)
      console.log('Request data:', { messages })

      const eventEmitter = new EventEmitter()

      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        { messages },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          responseType: 'stream'
        }
      )

      response.data.on('data', (chunk: Buffer) => {
        const text = chunk.toString()
        console.log('Frontend Received raw chunk:', text)  // 打印原始数据

        // 检查数据是否以 'data: ' 开头
        if (text.startsWith('data: ')) {
            try {
                // 去掉 'data: ' 前缀后再解析
                const jsonStr = text.substring(6)  // 'data: ' 的长度是 6
                const parsed = JSON.parse(jsonStr)
                
                if (parsed.event === 'conversation.message.delta' && parsed.data) {
                    const { role, type, content } = parsed.data
                    
                    if (role === 'assistant' && type === 'answer') {
                        // 发送内容
                        eventEmitter.emit('token', content)
                        
                        // 如果内容中包含 conversation.chat.completed，发送完成信号
                        if (content.includes('conversation.chat.completed')) {
                            console.log('Chat completed')
                            eventEmitter.emit('done')
                        }
                    }
                }
            } catch (e) {
                console.warn('Parse error:', e)
                console.warn('Failed to parse text:', text)  // 打印导致错误的文本
            }
        } else {
            console.log('Skipping non-data chunk')
        }
      })

      // 保持错误处理
      response.data.on('error', (error: Error) => {
        console.error('Stream error:', error)
        eventEmitter.emit('error', error)
      })

      // 保持结束处理
      response.data.on('end', () => {
        console.log('Stream ended')
        eventEmitter.emit('done')
      })

      return eventEmitter

    } catch (error: any) {
      console.error('Request error:', error)
      throw error
    }
  }
}

export const aiService = new AIService()