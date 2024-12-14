import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { aiRouter } from './routes/ai'  // 使用命名导入

dotenv.config()

// 验证必要的环境变量
const requiredEnvVars = ['COZE_API_KEY', 'COZE_BOT_ID']
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`)
    process.exit(1)
  }
})

const app = express()
const PORT = process.env.PORT || 3000

// 添加请求日志（放在最前面）
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.use(cors())
app.use(express.json())

// 添加根路由（用于测试服务器是否运行）
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: PORT
    }
  })
})

app.use('/api/ai', aiRouter)

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  })
})

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

// server/src/app.ts
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    path: req.path,
    body: req.body
  })
  next()
})