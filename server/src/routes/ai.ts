import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { aiService } from '../services/aiService'

const router = express.Router()

// 存储聊天历史
const chatHistories = new Map<string, {
  messages: any[]
  createdAt: number
  updatedAt: number
}>()

// 发送消息
router.post('/chat', async (req, res) => {
  try {
    console.log('=== Chat Request Start ===')
    console.log('Request body:', req.body)

    const { messages } = req.body
    
    if (!Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request format. Messages array is required.' 
      })
    }

    // 调用 AI 服务
    console.log('Calling AI service with messages:', messages)
    const result = await aiService.generateResponse(messages)
    console.log('AI service response:', result)

    return res.json({ message: result })

  } catch (error: any) {
    console.error('Chat Error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    })
    
    // 返回更详细的错误信息
    return res.status(500).json({ 
      error: 'AI Service Error',
      message: error.message,
      details: error.response?.data || error.stack
    })
  }
})

// 获取聊天历史
router.get('/chat/:conversationId', (req, res) => {
  const { conversationId } = req.params
  const history = chatHistories.get(conversationId)
  
  if (!history) {
    return res.status(404).json({ error: 'Conversation not found' })
  }
  
  res.json({
    id: conversationId,
    messages: history.messages,
    createdAt: history.createdAt,
    updatedAt: history.updatedAt
  })
})

export default router 