<template>
  <div class="flex h-full bg-gray-100">
    <!-- 聊天界面 -->
    <div class="flex-1 flex flex-col">
      <!-- 聊天头部 -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-10 w-10" src="@/assets/jj-avatar.svg" alt="JJ" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Chat with JJ</p>
            <p class="text-xs text-gray-500">Your AI Sales Assistant</p>
          </div>
        </div>
      </div>

      <!-- 聊天消息区域 -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <template v-for="message in messages" :key="message.id">
          <!-- AI消息 -->
          <div v-if="message.type === 'ai'" class="flex items-start">
            <div class="flex-shrink-0">
              <img class="h-8 w-8" src="@/assets/jj-avatar.svg" alt="JJ" />
            </div>
            <div class="ml-3 bg-white rounded-lg px-4 py-2 shadow max-w-2xl">
              <p class="text-sm text-gray-900">{{ message.content }}</p>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-else class="flex items-start justify-end">
            <div class="mr-3 bg-primary text-white rounded-lg px-4 py-2 shadow max-w-2xl">
              <p class="text-sm">{{ message.content }}</p>
            </div>
            <div class="flex-shrink-0">
              <img class="h-8 w-8 rounded-full" src="@/assets/user-avatar.svg" alt="You" />
            </div>
          </div>
        </template>
      </div>

      <!-- 输入区域 -->
      <div class="bg-white border-t border-gray-200 px-6 py-4">
        <div class="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            class="flex-1 input"
            v-model="newMessage"
            @keyup.enter="sendMessage"
          />
          <button
            class="ml-4 btn btn-primary"
            @click="sendMessage"
          >
            <PaperAirplaneIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧上下文面板 -->
    <div class="w-80 border-l border-gray-200 bg-white p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Context</h3>
      
      <!-- 当前Lead信息 -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-500 mb-2">Current Lead</h4>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha"
              alt="Aisha Patel"
              class="h-10 w-10 rounded-full"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">Aisha Patel</p>
              <p class="text-xs text-gray-500">CTO at TechWorld</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 建议的回复 -->
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-2">Suggested Responses</h4>
        <div class="space-y-2">
          <button
            v-for="suggestion in suggestedResponses"
            :key="suggestion"
            class="w-full text-left text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg p-3"
            @click="useResponse(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'

interface Message {
  id: number
  type: 'user' | 'ai'
  content: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    type: 'ai',
    content: 'Hello! I\'m JJ, your AI sales assistant. How can I help you today?'
  }
])

const newMessage = ref('')
const messageId = ref(2)

const suggestedResponses = [
  'Tell me more about TechWorld\'s current tech stack.',
  'What are their main pain points?',
  'Schedule a follow-up meeting.',
  'Generate a sales proposal.'
]

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({
    id: messageId.value++,
    type: 'user',
    content: newMessage.value
  })

  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      id: messageId.value++,
      type: 'ai',
      content: 'I understand. Let me help you with that...'
    })
  }, 1000)

  newMessage.value = ''
}

const useResponse = (response: string) => {
  newMessage.value = response
}
</script> 