import * as dotenv from 'dotenv'
import path from 'path'
import { aiService } from './services/aiService'

// 修正 .env 文件路径
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') })

async function testCozeAPI() {
  // 检查环境变量
  if (!process.env.COZE_API_KEY) {
    console.error('Missing COZE_API_KEY environment variable')
    return
  }
  if (!process.env.COZE_BOT_ID) {
    console.error('Missing COZE_BOT_ID environment variable')
    return
  }

  try {
    console.log('Using configuration:', {
      API_URL: process.env.COZE_API_URL,
      BOT_ID: process.env.COZE_BOT_ID,
      API_KEY: `${process.env.COZE_API_KEY.substring(0, 8)}...`
    })

    const response = await aiService.generateResponse([{
      role: 'user',
      content: 'Hello',
      timestamp: Date.now()
    }])
    
    console.log('API Test Success:', response)
  } catch (error) {
    console.error('API Test Failed:', error)
  }
}

testCozeAPI()