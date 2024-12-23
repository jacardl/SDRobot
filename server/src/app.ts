import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { aiRouter } from './routes/ai'

// 加载环境变量
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

// 添加请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// CORS 配置 - 允许所有域名访问
app.use(cors({
  origin: true,  // 允许所有域名
  credentials: true
}))

app.use(express.json())

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running'
  })
})

// API 路由
app.use('/api/ai', aiRouter)

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  })
})

// 启动服务器
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