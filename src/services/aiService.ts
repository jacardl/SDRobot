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
          if (done) {
            eventEmitter.emit('done')
            break
          }
          
          const chunk = decoder.decode(value, { stream: true })
          console.log('Raw chunk received:', chunk)

          accumulatedData += chunk
          const lines = accumulatedData.split('\n')
          accumulatedData = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue

            if (line.startsWith('data: ')) {
              const dataContent = line.slice(6).trim()
              
              // 检查是否是结束标记
              if (dataContent === '[DONE]') {
                eventEmitter.emit('done')
                return eventEmitter
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