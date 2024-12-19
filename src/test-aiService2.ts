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
    
    // 添加调试日志，查看 generateResponse 的返回值类型
    const eventEmitter = await aiService.generateResponse([{
      role: 'user',
      content: '你好,请做个自我介绍'
    }])
    console.log('EventEmitter type:', Object.prototype.toString.call(eventEmitter))
    console.log('EventEmitter methods:', Object.getOwnPropertyNames(eventEmitter))

    // 在设置监听器之前先检查 eventEmitter 的状态
    if (!eventEmitter || typeof eventEmitter.on !== 'function') {
      throw new Error('Invalid EventEmitter received')
    }

    let fullResponse = ''

    // 添加更详细的事件监听器调试
    const events = ['token', 'done', 'error', 'close']
    events.forEach(event => {
      console.log(`Setting up listener for ${event} event`)
      eventEmitter.on(event, (...args) => {
        console.log(`Event "${event}" triggered with args:`, args)
      })
    })

    eventEmitter.on('token', (token: string) => {
      console.log('\nToken received:', token)
      fullResponse += token
    })

    return new Promise((resolve, reject) => {
      let isCompleted = false;

      eventEmitter.on('done', () => {
        isCompleted = true;
        console.log('\nResponse completed!')
        console.log('Final response:', fullResponse)
        resolve(true)
      })

      eventEmitter.on('error', (error: unknown) => {
        isCompleted = true;
        console.error('\nError received:', error)
        if (error instanceof Error) {
          // 可以安全地访问 error.message, error.stack 等
        }
        reject(error as Error)
      })

      eventEmitter.on('close', () => {
        console.log('\nConnection closed')
        if (!isCompleted) {
          reject(new Error('Connection closed before completion'))
        }
      })

      // 建议添加一个配置项
      const TIMEOUT_MS = 10000
      setTimeout(() => {
        if (!isCompleted) {
          console.log('\nTimeout Debug Info:')
          console.log('EventEmitter state:', {
            hasListeners: events.map(e => ({
              event: e,
              listenerCount: eventEmitter.listenerCount(e)
            })),
            fullResponseLength: fullResponse.length,
            isCompleted
          })
          reject(new Error(`Response timeout after ${TIMEOUT_MS}ms`))
        }
      }, TIMEOUT_MS)
    })
  } catch (error: unknown) {
    console.error('Test failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
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