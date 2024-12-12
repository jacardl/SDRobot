export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface CozeResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
}

export interface ChatHistory {
  id: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
} 