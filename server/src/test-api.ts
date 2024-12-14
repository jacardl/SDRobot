import axios from 'axios'
import * as dotenv from 'dotenv'
import path from 'path'

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') })

interface CozeMessage {
  role: 'user' | 'assistant'
  content: string
  content_type: 'text'
  type?: string
}

interface CozeRequest {
  bot_id: string
  user_id: string
  stream: boolean
  auto_save_history: boolean
  additional_messages: CozeMessage[]
}

async function testCozeAPI() {
  try {
    // 验证环境变量
    if (!process.env.COZE_API_KEY || !process.env.COZE_BOT_ID) {
      throw new Error('Missing required environment variables')
    }

    console.log('Testing with environment variables:', {
      COZE_BOT_ID: process.env.COZE_BOT_ID,
      COZE_API_KEY: process.env.COZE_API_KEY ? '***' + process.env.COZE_API_KEY.slice(-4) : undefined
    })

    // 构建请求
    const request: CozeRequest = {
      bot_id: process.env.COZE_BOT_ID,
      user_id: "test_user_" + Date.now(),
      stream: false, // 先测试非流式响应
      auto_save_history: true,
      additional_messages: [{
        role: 'user',
        content: '你好，请做个自我介绍',
        content_type: 'text'
      }]
    }

    console.log('Sending request:', JSON.stringify(request, null, 2))

    // 发送请求
    const response = await axios.post(
      'https://api.coze.cn/v3/chat',
      request,
      {
        headers: {
          'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    console.log('Response status:', response.status)
    //console.log('Response headers:', response.headers)
    console.log('Response data:', JSON.stringify(response.data, null, 2))

    // 测试流式响应
    console.log('\nTesting streaming response...')
    const streamRequest = {
      ...request,
      stream: true
    }

    const streamResponse = await axios.post(
      'https://api.coze.cn/v3/chat',
      streamRequest,
      {
        headers: {
          'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    )

    streamResponse.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n')
      lines.forEach(line => {
        if (line.startsWith('data:')) {
          const data = line.slice(5)
          try {
            console.log('Stream chunk:', JSON.parse(data))
          } catch (e) {
            console.log('Raw stream chunk:', data)
          }
        }
      })
    })

    streamResponse.data.on('end', () => {
      console.log('Stream ended')
    })

  } catch (error: any) {
    console.error('Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
  }
}

// 运行测试
testCozeAPI()