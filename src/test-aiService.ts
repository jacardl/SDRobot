// src/test-aiService.ts
import { aiService } from './services/aiService'

async function testAiService() {
  try {
    console.log('Starting frontend aiService test...')

    // 创建一个Promise来等待所有事件完成
    return new Promise((resolve, reject) => {
      aiService.generateResponse([{
        role: 'user',
        content: '你好，请做个自我介绍'
      }])
      .then(eventEmitter => {
        console.log('EventEmitter created, waiting for events...')

        let fullResponse = ''

        eventEmitter.on('token', (token: string) => {
          process.stdout.write(token) // 实时打印token，模拟打字机效果
          fullResponse += token
        })

        eventEmitter.on('status', (status: string) => {
          console.log('\nStatus update:', status)
        })

        eventEmitter.on('complete', (content: string) => {
          console.log('\n\nFull message:', content)
          console.log('\nStored response:', fullResponse)
        })

        eventEmitter.on('error', (error: Error) => {
          console.error('\nError occurred:', error)
          reject(error)
        })

        eventEmitter.on('done', () => {
          console.log('\nChat completed')
          resolve(true)
        })

        // 设置超时保护
        setTimeout(() => {
          reject(new Error('Test timeout after 30 seconds'))
        }, 30000)
      })
      .catch(error => {
        console.error('Failed to create EventEmitter:', error)
        reject(error)
      })
    })

  } catch (error: any) {
    console.error('Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}

// 运行测试
console.log('Environment:', {
  API_URL: import.meta.env.VITE_APP_URL || 'http://localhost:3000'
})

testAiService()
  .then(() => {
    console.log('Test completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })