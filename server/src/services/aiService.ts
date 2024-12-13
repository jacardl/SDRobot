import axios from 'axios'

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

interface CozeResponse {
  reply: string
  code?: number
  msg?: string
}

const COZE_API_URL = 'https://api.coze.cn/v3/chat'

class AIService {
  async generateResponse(messages: { role: string; content: string }[]) {
    try {
      // 验证 API Key
      if (!process.env.COZE_API_KEY) {
        throw new Error('COZE_API_KEY is not defined')
      }

      const cozeRequest: CozeRequest = {
        bot_id: process.env.COZE_BOT_ID!,
        user_id: "user_" + Date.now(),
        stream: false,
        auto_save_history: true,
        additional_messages: messages.map(msg => ({
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          content: msg.content,
          content_type: 'text'
        }))
      }

      console.log('Coze request:', JSON.stringify(cozeRequest, null, 2))

      // 正确设置 Authorization header
      const headers = {
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,  // Bearer + 空格 + API Key
        'Content-Type': 'application/json'
      }

      console.log('Request headers:', {
        ...headers,
        'Authorization': headers.Authorization.substring(0, 15) + '...'  // 只打印部分 token
      })

      // 添加响应拦截器来记录原始响应
      axios.interceptors.response.use(response => {
        console.log('Raw response:', {
          status: response.status,
          headers: response.headers,
          data: response.data
        })
        return response
      })

      const response = await axios.post<CozeResponse>(
        COZE_API_URL, 
        cozeRequest,
        { 
          headers, 
          timeout: 30000,
          validateStatus: status => true  // 允许所有状态码
        }
      )

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      console.log('Response data:', response.data)

      // 检查响应状态
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 检查响应数据
      if (!response.data) {
        throw new Error('Empty response data')
      }

      if (response.data.code && response.data.code !== 0) {
        throw new Error(`API error: ${response.data.msg || 'Unknown error'}`)
      }

      if (!response.data.reply) {
        throw new Error('No reply in response')
      }

      return response.data.reply
    } catch (error: any) {
      console.error('Coze API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      throw error
    }
  }
}

export const aiService = new AIService()

export const callAIService = (messages: { role: string; content: string }[]) => {
  return aiService.generateResponse(messages)
} 