<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 聊天区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-24" ref="chatContainer">
      <!-- 欢迎消息 -->
      <div class="flex items-start space-x-3">
        <img src="@/assets/jj-avatar.png" alt="JJ" class="w-10 h-10 rounded-full" />
        <div class="flex flex-col">
          <div class="bg-white rounded-lg p-4 shadow-sm max-w-2xl">
            <p class="text-gray-900">{{ welcomeMessage.content }}</p>
          </div>
          <span class="text-xs text-gray-500 mt-1">{{ formatTime(welcomeMessage.timestamp) }}</span>
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
                  @click="sendMessage(reply)"
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
          @click="sendMessage(newMessage)"
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
import { ref, watch, nextTick, onMounted } from 'vue'
import { aiService } from '@/services/aiService'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

const messages = ref<Message[]>([])
const newMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// 初始欢迎消息
const welcomeMessage = {
  id: Date.now(),
  type: 'ai' as const,
  content: "👋 Welcome! I'm JJ, your digital sales assistant. I'm here to help you manage leads and boost your sales performance. How can I assist you today?",
  timestamp: new Date()
}

// 初始化对话
const startNewChat = () => {
  messages.value = []
  newMessage.value = ''
  isTyping.value = false
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = 0
    }
  })
}

// 在组件挂载时初始化对话
onMounted(() => {
  startNewChat()
})

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (newMessage.value.trim()) {
    sendMessage(newMessage.value)
  }
}

// 自动调整输入框高度
const handleInput = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
}

// 监听输入事件
watch(newMessage, () => {
  nextTick(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  })
})

// 设置侧边栏宽度变量
onMounted(() => {
  const updateSidebarWidth = () => {
    const isCollapsed = localStorage.getItem('sideNavCollapsed') === 'true'
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '4rem' : '16rem')
  }
  
  updateSidebarWidth()
  window.addEventListener('storage', updateSidebarWidth)
})

// 滚动到最新消息
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 监听消息列表变化，自动滚动到底部
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// 监听打字状态变化，自动滚动到底部
watch(isTyping, () => {
  scrollToBottom()
})

// 发送消息
const sendMessage = async (content: string) => {
  if (!content.trim()) return

  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: content.trim(),
    timestamp: new Date()
  })

  // 清空输入框
  newMessage.value = ''
  isTyping.value = true

  try {
    // 创建AI消息占位
    const aiMessageId = Date.now()
    const aiMessage = {
      id: aiMessageId,
      type: 'ai' as const,
      content: '',
      timestamp: new Date()
    }
    messages.value.push(aiMessage)

    // 调用AI服务
    const eventEmitter = await aiService.generateResponse([{
      role: 'user',
      content: content
    }])

    // 处理流式响应
    let fullResponse = ''

    eventEmitter.on('token', (token: string) => {
      console.log('Chat.vue received token:', {
        token,
        type: typeof token,
        length: token.length,
        raw: JSON.stringify(token)
      })
      
      // 确保 token 是字符串
      const tokenStr = String(token)
      fullResponse += tokenStr
      
      const msgIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
      if (msgIndex !== -1) {
        messages.value[msgIndex].content = fullResponse
      }
    })

    eventEmitter.on('error', (error: Error) => {
      console.error('Chat Error:', error)
      const msgIndex = messages.value.findIndex(msg => msg.id === aiMessageId)
      if (msgIndex !== -1) {
        messages.value[msgIndex].content = 'Sorry, I encountered an error. Please try again.'
      }
    })

    eventEmitter.on('done', () => {
      isTyping.value = false
    })

  } catch (error) {
    console.error('Chat Error:', error)
    messages.value.push({
      id: Date.now(),
      type: 'ai',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    })
  } finally {
    isTyping.value = false
  }
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

/* 输入框自动调整高��� */
textarea {
  overflow-y: hidden;
}

/* 隐藏 textarea 的 resize 手柄 */
textarea::-webkit-resizer {
  display: none;
}
</style> 