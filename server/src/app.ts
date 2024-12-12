import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRouter from './routes/ai'

// 确保在最开始加载环境变量
dotenv.config()

// 验证环境变量
const requiredEnvVars = ['COZE_API_KEY', 'COZE_BOT_ID', 'COZE_API_URL']
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`)
    process.exit(1)
  }
})

const app = express()

app.use(cors({
  origin: 'http://localhost:4174',
  credentials: true
}))

app.use(express.json())

// 添加全局请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// API 路由
app.use('/api/ai', aiRouter)

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = process.env.PORT || 3000
console.log(`Server starting on port ${PORT}...`)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})