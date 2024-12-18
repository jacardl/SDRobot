import { EventSource } from 'eventsource'
import { aiService } from './services/aiService'

// 添加全局声明
declare global {
  var EventSource: typeof EventSource
}
global.EventSource = EventSource

async function testAiService() {
  try {
    console.log('Starting frontend aiService test...')

    return new Promise((resolve, reject) => {
      console.log('Sending test message to AI service...')
      
      aiService.generateResponse([{
        role: 'user',
        content: '你好,请做个自我介绍'
      }])
      .then(eventEmitter => {
        console.log('EventEmitter created, waiting for events...')

        let fullResponse = ''

        // 监听每个token
        eventEmitter.on('token', (token: string) => {
          console.log('\n=== Received Token ===')
          console.log('Raw token:', token)
          //console.log('Token length:', token.length)
          console.log('Token type:', typeof token)
          fullResponse += token
        })
        // 监听状态变化
        eventEmitter.on('status', (status: string) => {
          console.log('\n=== Status Update ===')
          console.log('Status:', status)
        })

        // 监听完整消息
        eventEmitter.on('complete', (content: string) => {
          console.log('\n=== Complete Message ===')
          console.log('Content:', content)
          //console.log('Content length:', content.length)
        })

        // 监听结束事件
        eventEmitter.on('done', (data: any) => {
          console.log('\n=== Chat Ended ===')
          console.log('End data:', data)
          console.log('\n=== Full Response ===')
          console.log('Content:', fullResponse)
          console.log('Total length:', fullResponse.length)
          resolve(true)
        })

        // 监听错误
        eventEmitter.on('error', (error: Error) => {
          console.error('\n=== Error Occurred ===')
          console.error('Error:', error)
          console.error('Error name:', error.name)
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
          reject(error)
        })

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

console.log('Environment:', {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

testAiService()
  .then(() => {
    console.log('\nTest completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nTest failed:', error)
    process.exit(1)
  })