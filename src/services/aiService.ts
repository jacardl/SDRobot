import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class AIService {
  async generateResponse(messages: any[]): Promise<string> {
    try {
      console.log('Frontend sending request to:', `${API_URL}/api/ai/chat`)
      console.log('Request data:', { messages })

      const response = await axios.post(`${API_URL}/api/ai/chat`, {
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: Date.now()
        }))
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Frontend received response:', response.data)
      
      if (!response.data || !response.data.message) {
        throw new Error('Invalid response format')
      }

      return response.data.message
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