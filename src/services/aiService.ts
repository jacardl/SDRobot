
import { EventEmitter } from '../utils/EventEmitter'
import { json } from 'stream/consumers'
import { count, error } from 'console'

// API 配置
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// 类型定义
interface Message {
  role: string
  content: string
}

interface AIResponse {
  output: string
  error?: string
}

class AIService {
  private retryCount = 3
  private retryDelay = 1000

  async generateResponse(messages: Message[]): Promise<EventEmitter> {
    const eventEmitter = new EventEmitter()

    try {
      console.log('Frontend sending request to:', `${API_URL}/api/ai/chat`)
      console.log('Request data:', { messages })

      const response = await fetch(`${API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify({ messages })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
    
        if (!response.body) {
          throw new Error('Response body is null')
        }
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedData = ''
        while(true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          console.log('Raw chunk received:', chunk)

          accumulatedData += chunk
          // 按行分割
          const lines = accumulatedData.split('\n')
          // 保留最后一个可能不完整的行
          accumulatedData = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue

            if (line.startsWith('data: ')) {
              const dataContent = line.slice(6).trim()
              // 检查是否是结束标记
              if (dataContent === '[DONE]') {
                eventEmitter.emit('done')
                continue
              }

              try {
                // 尝试解析数据
                const parsedData = JSON.parse(dataContent)
                console.log('Parsed data:', parsedData)
                
                // 直接检查并使用 parsedData 中的内容
                if (parsedData.data?.content) {
                  if (typeof parsedData.data.content === 'string') {
                    eventEmitter.emit('message', parsedData.data.content)
                  } else if (parsedData.data.content.output) {
                    eventEmitter.emit('token', parsedData.data.content.output)
                  }
                }
              } catch (parseError) {
                console.log('Failed to parse data:', dataContent)
                // 如果解析失败，尝试直接发送内容
                if (dataContent && typeof dataContent === 'string') {
                  eventEmitter.emit('token', dataContent)
                }
              }
            }
          }
        }
        return eventEmitter

        } catch (error) {
          console.error('Request error:', error)
          eventEmitter.emit('error', error)
          throw error
        }
    }
  }

export const aiService = new AIService()