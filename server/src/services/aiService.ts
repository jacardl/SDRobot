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
      const response = await axios({
        method: 'post',
        url: COZE_API_URL,
        data: cozeRequest,
        headers: {
          'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        responseType: 'stream',
        timeout: 30000,  // 30秒超时
        maxRedirects: 5,
        validateStatus: (status) => status < 500  // 只有状态码大于等于500时才认为是错误
      })

      // 添加调试日志
      console.log('Coze API response status:', response.status)
      console.log('Coze API response headers:', response.headers)

      // 处理流式响应
      const stream = response.data
      stream.on('data', (chunk: Buffer) => {
        const text = chunk.toString()
        
        // 直接发送原始数据
        eventEmitter.emit('token', text)

        // 保留原有的处理逻辑以维持内部功能
        const lines = text.split('\n')
        lines.forEach(line => {
          if (!line.trim()) return;
          
          const [eventPart, dataPart] = line.split('data:');
          if (!dataPart) return;

          try {
            const eventType = eventPart.replace('event:', '').trim();
            const data = dataPart.trim();
            const parsed = JSON.parse(data);

            // 当收到对话完成事件时发送完成信号
            if (eventType === 'conversation.chat.completed') {
              eventEmitter.emit('done');
            }
          } catch (e) {
            console.warn('Parse error:', e);
          }
        });
      })

      stream.on('error', (error: Error) => {
        console.error('Stream error:', error)
        eventEmitter.emit('error', error)
      })

      stream.on('end', () => {
        console.log('Stream ended')  // 添加调试日志
        eventEmitter.emit('done')
      })

      // 前端接收流式响应
      eventEmitter.on('token', (token: string) => {
        process.stdout.write(token) // 实时显示响应
      })

      eventEmitter.on('complete', (content: string) => {
        console.log('\n\nFull message:', content)
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