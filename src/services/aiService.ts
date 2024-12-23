import { EventEmitter } from '../utils/EventEmitter'
import axios from 'axios'

// API 配置
const API_URL = import.meta.env.VITE_API_URL

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
      console.log('Frontend sending request to:', `${API_URL}/chat`)
      console.log('Request data:', { messages })

      const response = await axios.post(`${API_URL}/chat`, {
        messages
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        }
      })

      if (!response.data) {
        throw new Error('Response data is null')
      }

      // 创建 TextDecoder 来处理流数据
      const decoder = new TextDecoder()
      let accumulatedData = ''

      // 设置数据处理函数
      response.data.on('data', (chunk: Buffer) => {
        const text = decoder.decode(chunk, { stream: true })
        console.log('Raw chunk received:', text)

        accumulatedData += text
        const lines = accumulatedData.split('\n')
        accumulatedData = lines.pop() || ''

        for (const line of lines) {
          if (line.trim() === '') continue

          if (line.startsWith('data: ')) {
            const dataContent = line.slice(6).trim()
            
            // 检查是否是结束标记
            if (dataContent === '[DONE]') {
              eventEmitter.emit('done')
              return
            }

            try {
              const parsedData = JSON.parse(dataContent)
              console.log('Parsed data:', parsedData)
              
              // 处理不同类型的事件
              if (parsedData.event === 'conversation.message.delta') {
                if (parsedData.data?.content) {
                  // 解析实际的内容
                  const content = parsedData.data.content
                  if (content.includes('event:') && content.includes('data:')) {
                    // 这是一个事件消息，进一步解析
                    const eventLines = content.split('\n')
                    for (const eventLine of eventLines) {
                      if (eventLine.startsWith('data:')) {
                        try {
                          const eventData = JSON.parse(eventLine.slice(5))
                          // 检查不同的数据结构
                          if (eventData.output) {
                            eventEmitter.emit('token', eventData.output)
                            console.log('eventData.output:', eventData.output)
                          } else if (eventData.content) {
                            try {
                              // 尝试解析 content 字段
                              const contentData = JSON.parse(eventData.content)
                              console.log('Content data:', contentData)
                              if (contentData.msg_type === 'generate_answer_finish') {
                                eventEmitter.emit('done')
                              } else if (contentData.output) {
                                console.log('Preparing to emit token:', {
                                  content: contentData.output,
                                  type: typeof contentData.output
                                })
                                eventEmitter.emit('token', String(contentData.output))
                              } 
                            } catch (e) {
                              // 如果 content 不是 JSON，直接发送
                              eventEmitter.emit('token', eventData.content)
                            }
                          }
                        } catch (e) {
                          // 如果解析失败，发送原始内容
                          eventEmitter.emit('token', eventLine.slice(5))
                        }
                      }
                    }
                  } else {
                    // 直接发送内容
                    eventEmitter.emit('token', content)
                  }
                }
              }
            } catch (parseError) {
              console.error('Parse error:', parseError)
              eventEmitter.emit('error', parseError)
            }
          }
        }
      })

      // 处理流结束
      response.data.on('end', () => {
        eventEmitter.emit('done')
      })

      // 处理错误
      response.data.on('error', (error: Error) => {
        console.error('Stream error:', error)
        eventEmitter.emit('error', error)
      })

      return eventEmitter

    } catch (error) {
      console.error('Request error:', error)
      eventEmitter.emit('error', error)
      throw error
    }
  }
}

export const aiService = new AIService()