import axios from 'axios'
import { EventEmitter } from 'events'
import type { ChatMessage } from '../types/chat'

const COZE_API_URL = process.env.COZE_API_URL || 'https://api.coze.cn/v3/chat'
console.log('Using API URL:', COZE_API_URL)

const COZE_API_KEY = process.env.COZE_API_KEY

export class AIService extends EventEmitter {
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post(COZE_API_URL, {
        bot_id: process.env.COZE_BOT_ID,
        messages: messages.map(msg => ({
          role: msg.role === 'user' ? 'Human' : 'Assistant',
          content: msg.content
        })),
        stream: true
      }, {
        headers: {
          'Authorization': process.env.COZE_API_KEY as string,
          'Content-Type': 'application/json'
        },
        responseType: 'stream',
        timeout: 30000
      })

      let content = ''
      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.choices && data.choices[0].delta.content) {
                const newContent = data.choices[0].delta.content
                content += newContent
                this.emit('update', newContent)
              }
            } catch (e) {
              console.error('Parse chunk error:', e)
            }
          }
        }
      })

      return new Promise((resolve, reject) => {
        response.data.on('end', () => {
          this.emit('complete', content)
          resolve(content)
        })
        response.data.on('error', (err: Error) => {
          this.emit('error', err)
          reject(err)
        })
      })

    } catch (error) {
      this.emit('error', error)
      throw error
    }
  }
}

export const aiService = new AIService() 