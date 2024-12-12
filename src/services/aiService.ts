import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// 创建一个简单的事件发射器
class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

class AIService extends SimpleEventEmitter {
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const url = `${API_URL}/api/ai/chat`
      console.log('Frontend sending request to:', url)
      console.log('Frontend request data:', messages)

      const response = await axios.post(`${API_URL}/api/ai/chat`, {
        messages
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      console.log('Response received:', response.data)
      return response.data.message
    } catch (error: any) {
      console.error('API Error:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  }
}

export const aiService = new AIService() 