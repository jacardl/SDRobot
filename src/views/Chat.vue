<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 聊天区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-24" ref="chatContainer">
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
        <div v-if="message.type === 'ai'" class="flex items-start space-x-3">
          <img src="@/assets/jj-avatar.png" alt="JJ" class="w-10 h-10 rounded-full" />
          <div class="flex flex-col">
            <div class="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
              <p class="text-gray-900">{{ message.content }}</p>
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

      <!-- 输入提示 -->
      <div v-if="isTyping" class="flex items-start space-x-3">
        <img src="@/assets/jj-avatar.png" alt="JJ" class="w-10 h-10 rounded-full" />
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 - 固定在底部 -->
    <div class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4" style="margin-left: var(--sidebar-width);">
      <div class="max-w-4xl mx-auto flex items-center space-x-4">
        <div class="flex-1 relative">
          <div class="relative flex items-center">
            <textarea
              v-model="newMessage"
              @keydown.enter.prevent="handleKeyDown"
              @keydown.shift.enter.prevent="startNewChat"
              rows="1"
              class="block w-full pl-4 pr-20 py-3 text-gray-900 rounded-full border-gray-200 shadow-sm focus:border-primary focus:ring-primary resize-none"
              placeholder="Type your message..."
              style="min-height: 44px; max-height: 120px;"
            ></textarea>
            <div class="absolute right-3 text-xs text-gray-400 pointer-events-none select-none">
              Press Enter to send
              <br />
              Shift + Enter for new chat
            </div>
          </div>
        </div>
        <button
          @click="() => sendMessage()"
          :disabled="!newMessage.trim()"
          class="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { constructFromSymbol } from 'date-fns/constants';
import { ref, onMounted } from 'vue'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)
const welcomeMessage = "👋 Hi! I'm your AI assistant. How can I help you today?"
const isTyping = ref(false)

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 处理流式响应
const handleStreamResponse = async (response: Response, aiMessageId: number) => {
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No reader available')

  const decoder = new TextDecoder()
  let buffer = ''

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
            console.log('Parsed data:', parsedData)
            
            // 处理不同类型的事件
            if (parsedData.event === 'conversation.message.delta') {
              if (parsedData.data?.content) {
                // 解析实际的内容
                const content = parsedData.data.content
                if (content.includes('event:') && content.includes('data:')) {
                  // 这是一个事件消息，进一步解析
                  const eventLines = content.split('\n')
                  for (const eventLine of eventLines) {
                    if (eventLine.startsWith('data:')) {
                      try {
                        const eventData = JSON.parse(eventLine.slice(5))
                        console.log('Parsed event data:', eventData)
                        if (eventData.content) {
                          console.log('Received content:', eventData.content)
                          const parseOutput = JSON.parse(eventData.content)
                          const output = parseOutput.output
                          console.log('Received output:', parseOutput.output)
                          const msgIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
                          if (msgIndex !== -1) {
                            messages.value[msgIndex].content += output
                            scrollToBottom()
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

// 发送消息
const sendMessage = async (content?: string) => {
  const messageContent = content || newMessage.value.trim()
  if (!messageContent || isLoading.value) return

  // 使用 messageContent 替代之前的 content
  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: messageContent,
    timestamp: new Date()
  })

  // 清空输入框并设置加载状态
  newMessage.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    // 创建 AI 消息占位
    const aiMessageId = Date.now()
    messages.value.push({
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date()
    })

    // 发送请求
    const response = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: messageContent }]
      })
    })

    if (!response.ok) throw new Error('Network response was not ok')
    await handleStreamResponse(response, aiMessageId)

  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      id: Date.now(),
      type: 'ai',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// 自动滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }, 0)
}

// 监听消息变化，自动滚动
onMounted(() => {
  scrollToBottom()
})

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (newMessage.value.trim()) {
    sendMessage()
  }
}

// 初始化对话
const startNewChat = () => {
  messages.value = []
  newMessage.value = ''
  isLoading.value = false
  scrollToBottom()
}
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

/* 输入框自动调��高度 */
textarea {
  overflow-y: hidden;
}

/* 隐藏 textarea 的 resize 手柄 */
textarea::-webkit-resizer {
  display: none;
}
</style> 