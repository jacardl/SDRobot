import axios from 'axios'
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

      let accumulatedData = ''

      response.data.on('data', (chunk: Buffer) => {
        try {
          const rawChunk = chunk.toString()
          console.log('Raw chunk received:', rawChunk)
          
          // 累积数据
          accumulatedData += rawChunk
          
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
                    eventEmitter.emit('token', parsedData.data.content)
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
        } catch (error) {
          console.error('Chunk processing error:', error)
        }
      })

      response.data.on('error', (error: Error) => {
        console.error('Stream error:', error)
        eventEmitter.emit('error', error)
      })

      response.data.on('end', () => {
        console.log('Stream ended')
        // 处理可能残留的数据
        if (accumulatedData.trim()) {
          console.log('Processing remaining data:', accumulatedData)
          try {
            const finalData = JSON.parse(accumulatedData)
            eventEmitter.emit('message', finalData)
          } catch (e) {
            console.log('Could not parse remaining data')
          }
        }
        eventEmitter.emit('done')
      })

      return eventEmitter

    } catch (error: any) {
      console.error('Request error:', error)
      // 重试逻辑
      if (this.retryCount > 0) {
        this.retryCount--
        console.log(`Retrying... ${this.retryCount} attempts remaining`)
        await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        return this.generateResponse(messages)
      }
      eventEmitter.emit('error', error)
      throw error
    }
  }

  // 重置重试计数器
  resetRetryCount() {
    this.retryCount = 3
  }
}

export const aiService = new AIService()