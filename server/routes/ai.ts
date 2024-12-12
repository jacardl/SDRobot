import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { ChatCompletionRequestMessage } from 'openai'
import { callAIService } from '../services/aiService'

const router = express.Router()

// 存储聊天历史（实际应用中应该使用数据库）
const chatHistories = new Map<string, {
  messages: ChatCompletionRequestMessage[]
  createdAt: number
  updatedAt: number
}>()

// 创建新对话
router.post('/chat/create', (req, res) => {
  const conversationId = uuidv4()
  const now = Date.now()
  
  chatHistories.set(conversationId, {
    messages: [],
    createdAt: now,
    updatedAt: now
  })
  
  res.json({
    id: conversationId,
    messages: [],
    createdAt: now,
    updatedAt: now
  })
})

// 发送消息
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body
    
    // 获取或创建对话历史
    let history = chatHistories.get(conversationId)
    if (!history) {
      history = {
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      chatHistories.set(conversationId, history)
    }
    
    // 添加用户消息
    history.messages.push({
      role: 'user',
      content: message
    })
    
    // 调用 AI API（这里需要实现具体的 AI 服务调用）
    const aiResponse = await callAIService(history.messages)
    
    // 添加 AI 响应
    history.messages.push({
      role: 'assistant',
      content: aiResponse
    })
    
    // 更新时间戳
    history.updatedAt = Date.now()
    
    res.json({
      message: aiResponse,
      conversationId
    })
  } catch (error) {
    console.error('Chat Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
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