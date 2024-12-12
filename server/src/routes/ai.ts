import { Router } from 'express'
import { aiService } from '../services/aiService'
import type { ChatMessage, ChatHistory } from '../types/chat'

const router = Router()

// 内存存储聊天历史（实际应用应该使用数据库）
const chatHistories = new Map<string, ChatHistory>()

// 创建新对话
router.post('/chat/create', (req, res) => {
  const id = Date.now().toString()
  const now = Date.now()
  
  const history: ChatHistory = {
    id,
    messages: [],
    createdAt: now,
    updatedAt: now
  }
  
  chatHistories.set(id, history)
  res.json(history)
})

// 发送消息
router.post('/chat', async (req, res) => {
  try {
    // 1. 记录收到的请求
    console.log('=== Chat Request Start ===')
    console.log('Received request:', {
      body: req.body,
      headers: req.headers
    })

    // 2. 记录调用 AI 服务前
    console.log('Calling AI service...')
    const result = await aiService.generateResponse(req.body.messages)
    console.log('AI service response:', result)
    
    // 3. 记录发送响应前
    console.log('Sending response:', result)
    console.log('=== Chat Request End ===')
    
    res.json({ message: result })
  } catch (error: any) {
    // 4. 记录错误详情
    console.error('=== Chat Error ===')
    console.error('Server Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    })
    res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
})

// 获取聊天历史
router.get('/chat/:conversationId', (req, res) => {
  const { conversationId } = req.params
  const history = chatHistories.get(conversationId)
  
  if (!history) {
    return res.status(404).json({ error: 'Conversation not found' })
  }
  
  res.json(history)
})

export default router 