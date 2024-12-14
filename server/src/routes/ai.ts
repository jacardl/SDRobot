// server/src/routes/ai.ts
import express from 'express'
import { aiService } from '../services/aiService'

const router = express.Router()

router.post('/chat', async (req, res) => {
  console.log('Received chat request:', {
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers
  })
  
  try {
    const eventEmitter = await aiService.generateResponse(req.body.messages)
    
    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // 转发事件到客户端
    eventEmitter.on('token', (token) => {
      res.write(`data: ${JSON.stringify({ event: 'conversation.message.delta', data: { role: 'assistant', type: 'answer', content: token } })}\n\n`)
    })

    eventEmitter.on('done', () => {
      res.write('data: [DONE]\n\n')
      res.end()
    })

  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    })
  }
})

export const aiRouter = router