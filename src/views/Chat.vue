<template>
  <!-- 使用 grid 布局 -->
  <div class="grid grid-rows-[1fr,auto] h-screen bg-gray-50">
    <!-- 聊天区域 - 使用 grid 确保正确的滚动行为 -->
    <div 
      ref="chatContainer"
      class="overflow-y-auto scroll-smooth relative"
    >
      <div class="max-w-4xl mx-auto p-4 space-y-4">
        <!-- 欢迎消息 -->
        <div class="flex items-start space-x-3">
          <img src="@/assets/jj-avatar.png" alt="JJ" class="w-10 h-10 rounded-full" />
          <div class="flex flex-col">
            <div class="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
              <p class="text-gray-900">{{ welcomeMessage }}</p>
            </div>
          </div>
        </div>

        <!-- 聊天记录 -->
        <template v-for="message in messages" :key="message.id">
          <!-- AI 消息 -->
          <div 
            v-if="message.type === 'ai'" 
            class="flex items-start space-x-3"
            :data-message-id="message.id"
          >
            <img src="@/assets/jj-avatar.png" alt="JJ" class="w-10 h-10 rounded-full" />
            <div class="flex flex-col">
              <div class="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
                <p class="text-gray-900">
                  {{ isTyping && message.id === messages[messages.length - 1].id 
                    ? displayContents[message.id] || message.content
                    : message.content 
                  }}
                  <!-- 添加等待动画 -->
                  <span 
                    v-if="isLoading && message.id === messages[messages.length - 1].id && !message.content" 
                    class="inline-flex items-center"
                  >
                    <span class="animate-pulse">.</span>
                    <span class="animate-pulse" style="animation-delay: 200ms">.</span>
                    <span class="animate-pulse" style="animation-delay: 400ms">.</span>
                  </span>
                  <!-- 打字机光标 -->
                  <span 
                    v-else-if="isTyping && message.id === messages[messages.length - 1].id" 
                    class="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"
                  >
                  </span>
                </p>
                <!-- 快捷回复按钮 -->
                <div v-if="message.quickReplies" class="mt-3 flex flex-wrap gap-2">
                  <button
                    v-for="reply in message.quickReplies"
                    :key="reply"
                    @click="() => sendMessage(reply)"
                    class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    {{ reply }}
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-500 mt-1">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-else class="flex items-start justify-end space-x-3">
            <div class="flex flex-col items-end">
              <div class="bg-primary text-white rounded-lg p-4 shadow-sm max-w-2xl">
                <p>{{ message.content }}</p>
              </div>
              <span class="text-xs text-gray-500 mt-1">{{ formatTime(message.timestamp) }}</span>
            </div>
            <img src="@/assets/user-avatar.svg" alt="User" class="w-10 h-10 rounded-full" />
          </div>
        </template>
      </div>

      <!-- 停止按钮 -->
      <div 
        v-if="isLoading || isTyping" 
        class="sticky bottom-4 left-0 right-0 flex justify-center z-50"
      >
        <button
          @click="stopResponse"
          class="inline-flex items-center px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 text-gray-600" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <rect x="7" y="7" width="10" height="10" />
          </svg>
          <span class="text-sm font-medium text-gray-600 ml-2">停止</span>
        </button>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-gray-200 bg-white p-4">
      <form @submit.prevent="(e: Event) => sendMessage()" class="flex space-x-4">
        <textarea
          ref="messageInput"
          v-model="newMessage"
          :placeholder="t('chat.placeholder')"
          rows="1"
          class="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent p-2"
          @keydown="handleKeyDown"
        />
        <button
          type="submit"
          :disabled="isLoading || !newMessage.trim()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <template v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ t('chat.typing') }}
          </template>
          <template v-else>
            {{ t('chat.send') }}
          </template>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { constructFromSymbol } from 'date-fns/constants';
import { ref, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

const API_URL = import.meta.env.VITE_APP_URL
console.log('Chat API Configuration:', {
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  API_URL,
  fullUrl: `${API_URL}/api/ai/chat`
})
const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const welcomeMessage = "👋 Hi! 欢迎来到 SDRobot AI！我是 JJ，你的数字销售助手。我在这是为了让你销售之旅更加顺畅。你是想听我做什么，还是直接开始流程呢？"
const isTyping = ref(false)
const typingSpeed = 50
const displayContents = ref<{ [key: number]: string }>({})
const { t } = useI18n()

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 添加中止控制器
const abortController = ref<AbortController | null>(null)

// 处理流式响应
const handleStreamResponse = async (response: Response, aiMessageId: number) => {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No reader available')

  const decoder = new TextDecoder()
  let buffer = ''
  let processedContents = new Set()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(5).trim()
          if (data === '[DONE]') continue

          try {
            const parsedData = JSON.parse(data)
            //console.log('Parsed data:', parsedData)
            
            // 处理不同类型的事件
            if (parsedData.event === 'conversation.message.delta') {
              if (parsedData.data?.content) {
                // 解析际的内容
                const content = parsedData.data.content
                if (content.includes('event:conversation.message.delta') && content.includes('data:')) {
                  const eventLines = content.split('\n')
                  for (const eventLine of eventLines) {
                    if (eventLine.startsWith('data:')) {
                      try {
                        const eventData = JSON.parse(eventLine.slice(5))
                        if (eventData.content) {    
                          const parseOutput = JSON.parse(eventData.content)
                          const output = parseOutput.output
                          
                          if (output !== undefined && output !== 'undefined') {
                            if (!processedContents.has(output)) {
                              processedContents.add(output)
                              
                              const msgIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
                              if (msgIndex !== -1) {
                                messages.value[msgIndex].content += output
                                
                                // 实现打字机效果
                                isTyping.value = true
                                if (!displayContents.value[aiMessageId]) {
                                  displayContents.value[aiMessageId] = ''
                                }
                                
                                let currentIndex = displayContents.value[aiMessageId].length
                                while (currentIndex < messages.value[msgIndex].content.length) {
                                  displayContents.value[aiMessageId] = messages.value[msgIndex].content.slice(0, currentIndex + 1)
                                  await new Promise(resolve => setTimeout(resolve, typingSpeed))
                                  currentIndex++
                                  
                                  // 使用新的滚动函数
                                  if (currentIndex % 3 === 0) { // 每3个字符滚动一次，避免过于频繁
                                    await scrollToMessage(aiMessageId)
                                  }
                                }
                                
                                // 完成后滚动到底
                                isTyping.value = false
                                await scrollToBottom()
                              }
                            }
                          }
                        }
                      } catch (e) {
                        console.warn('Failed to parse event data:', e)
                      }
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.warn('Failed to parse SSE message:', e)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// 添加重试配置
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// 修改发送消息函数
const sendMessage = async (content?: string, retryCount = 0) => {
  const messageContent = content || newMessage.value.trim()
  if (!messageContent || isLoading.value) return

  // 如果是从输入框发送的消息，确保清空
  if (!content) {
    newMessage.value = ''
  }

  // 创建新的中止控制器
  abortController.value = new AbortController()
  const currentMessages = [...messages.value]

  try {
    // 保存当前消息历史
    messages.value.push({
      id: Date.now(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    })

    // 添加 AI 消息占位
    const aiMessageId = Date.now() + 1
    messages.value.push({
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date()
    })

    // 清空输入框并设置加载状态
    newMessage.value = ''
    isLoading.value = true
    scrollToBottom()

    const response = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: messageContent }]
      }),
      signal: abortController.value.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    await handleStreamResponse(response, aiMessageId)

  } catch (error: any) {  // 添加类型断言
    console.error('Chat error:', error)
    
    if (error.name === 'AbortError') {
      console.log('Request aborted')
      return
    }
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`)
      // 恢复到错误前的消息状态
      messages.value = currentMessages
      setTimeout(() => {
        sendMessage(messageContent, retryCount + 1)
      }, RETRY_DELAY * (retryCount + 1))
      return
    }

    // 如果重试失败，恢复到始状态并显示错误
    messages.value = currentMessages
    messages.value.push({
      id: Date.now() + 2,
      type: 'ai',
      content: t('chat.networkError'),
      timestamp: new Date()
    })
  } finally {
    abortController.value = null
    isLoading.value = false
    scrollToBottom()
  }
}

// 修改滚动函数
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    const container = chatContainer.value
    // 立即滚动
    container.scrollTop = container.scrollHeight
    
    // 确保在动画和内容更新后也滚动
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 100)
  }
}

// 在消息列表变化时滚动
watch(() => messages.value.length, () => {
  scrollToBottom()
})

// 在组件挂载时滚动
onMounted(() => {
  scrollToBottom()
})

// 在窗口大小改变时滚动
onMounted(() => {
  window.addEventListener('resize', scrollToBottom)
  return () => {
    window.removeEventListener('resize', scrollToBottom)
  }
})

// 监听消息变化，自动滚动
onMounted(() => {
  scrollToBottom()
})

// 修改处理键盘事件
const handleKeyDown = async (e: KeyboardEvent) => {
  // 检查是否使用输入法
  if (e.isComposing || e.keyCode === 229) {
    return  // 如果输入法正在输入，直接返回
  }

  // 只处理单独的回车键，不处理shift+enter
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()  // 阻止默认行为
    if (newMessage.value.trim()) {
      const messageContent = newMessage.value
      newMessage.value = ''  // 立即清空输入框
      await sendMessage(messageContent)  // 传入完整的消息内容
    }
  }
}

// 初始化对话
const startNewChat = () => {
  messages.value = []
  localStorage.removeItem(STORAGE_KEY)
  newMessage.value = ''
  isLoading.value = false
  scrollToBottom()
}

// 添加新的滚动函��
const scrollToMessage = async (messageId: number) => {
  await nextTick()
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
  if (messageElement && chatContainer.value) {
    const containerHeight = chatContainer.value.clientHeight
    const messageTop = messageElement.getBoundingClientRect().top
    const containerTop = chatContainer.value.getBoundingClientRect().top
    const messageRelativeTop = messageTop - containerTop
    
    // 计算将消息滚动到中间所需的位置
    const scrollPosition = chatContainer.value.scrollTop + messageRelativeTop - (containerHeight / 2)
    
    chatContainer.value.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    })
  }
}

// 添加停止函数
const stopResponse = () => {
  if (abortController.value) {
    abortController.value.abort()
    isTyping.value = false
  }
}

// 加持久化的函数
const STORAGE_KEY = 'chat_history'

// 保存消息到 localStorage
const saveMessages = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}

// 修改加载消息函数
const loadMessages = async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsedMessages = JSON.parse(saved)
    messages.value = parsedMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
    // 等待 DOM 更新后再滚动
    await nextTick()
    scrollToBottom()
  }
}

// 监听消息变化自动保存
watch(() => messages.value, saveMessages, { deep: true })

// 修改组件挂载时的行为
onMounted(async () => {
  await loadMessages() // 等待消息加载完成
  // 使用 setTimeout 确保在所有内容渲染后滚动
  setTimeout(() => {
    scrollToBottom()
  }, 100)
})
</script>

<style>
:root {
  --sidebar-width: 16rem;
}
</style>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

/* 输入框自动调整高度 */
textarea {
  overflow-y: hidden;
}

/* 隐藏 textarea 的 resize 手柄 */
textarea::-webkit-resizer {
  display: none;
}

/* 修改动画样式，移除 @apply */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  display: inline-block;
  margin-left: 0.125rem;
  margin-right: 0.125rem;
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
</style> 