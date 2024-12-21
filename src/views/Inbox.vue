<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 头部 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Inbox</h1>
        <p class="text-sm text-gray-500">
          Conversations from all of your connected email accounts.
        </p>
      </div>

      <!-- 两列布局 -->
      <div class="grid grid-cols-[350px,1fr] gap-6">
        <!-- 左侧联系人列表 -->
        <div class="bg-white rounded-lg shadow">
          <!-- 搜索栏 -->
          <div class="p-4 border-b">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                placeholder="Search by name, company or email..."
              />
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <!-- 状态标签 -->
          <div class="flex p-2 space-x-2 border-b">
            <button
              v-for="status in ['Engaged', 'Sent', 'Pending']"
              :key="status"
              @click="currentStatus = status.toLowerCase()"
              :class="[
                'px-3 py-1 rounded-full text-sm flex-1',
                currentStatus === status.toLowerCase()
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ status }}
            </button>
          </div>

          <!-- 联系人列表 -->
          <div class="overflow-y-auto" style="height: calc(100vh - 240px)">
            <div
              v-for="contact in filteredContacts"
              :key="contact.email"
              @click="selectContact(contact)"
              class="p-4 hover:bg-gray-50 cursor-pointer border-b"
              :class="{ 'bg-gray-50': selectedContact?.email === contact.email }"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon class="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ contact.name }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ contact.email }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Last contact: {{ formatDate(contact.lastContact) }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': contact.status === 'engaged',
                      'bg-blue-100 text-blue-800': contact.status === 'sent',
                      'bg-gray-100 text-gray-800': contact.status === 'pending'
                    }"
                  >
                    {{ contact.unreadCount || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧邮件内容 -->
        <div class="bg-white rounded-lg shadow">
          <!-- 邮件列表头部 -->
          <div class="p-4 border-b flex justify-between items-center">
            <div>
              <h2 class="text-lg font-medium text-gray-900">
                {{ selectedContact ? selectedContact.name : 'Select a contact' }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ selectedContact?.email }}
              </p>
            </div>
            <button 
              @click="refreshMessages"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <ArrowPathIcon class="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>

          <!-- 邮件列表内容 -->
          <div class="overflow-y-auto" style="height: calc(100vh - 180px)">
            <div v-if="!selectedContact" class="p-8 text-center text-gray-500">
              <EnvelopeIcon class="h-12 w-12 mx-auto text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No contact selected</h3>
              <p class="mt-1 text-sm text-gray-500">Select a contact to view conversation history</p>
            </div>

            <template v-else>
              <div class="divide-y divide-gray-200">
                <div
                  v-for="message in contactMessages"
                  :key="message.id"
                  class="p-4 hover:bg-gray-50"
                  :class="{ 'bg-blue-50': !message.isRead }"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">
                      {{ formatDate(message.date) }}
                    </span>
                    <span 
                      class="text-xs px-2 py-1 rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': message.status === 'engaged',
                        'bg-blue-100 text-blue-800': message.status === 'sent',
                        'bg-gray-100 text-gray-800': message.status === 'pending'
                      }"
                    >
                      {{ message.status }}
                    </span>
                  </div>
                  <h3 class="text-sm font-medium text-gray-900 mt-1">
                    {{ message.subject }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ message.snippet }}
                  </p>
                  <div class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                    <span>Via: {{ message.sourceMailbox }}</span>
                    <span v-if="message.sequence">·</span>
                    <span v-if="message.sequence">Sequence: {{ message.sequence }}</span>
                  </div>

                  <!-- 添加回��区域 -->
                  <div class="mt-4" v-if="message.showReply">
                    <textarea
                      v-model="message.replyContent"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Type your reply..."
                    ></textarea>
                    <div class="mt-2 flex justify-end space-x-2">
                      <button
                        @click="message.showReply = false"
                        class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        @click="sendReply(message, message.replyContent)"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                  
                  <!-- 添加回复按钮 -->
                  <button
                    v-else
                    @click="message.showReply = true"
                    class="mt-2 text-sm text-green-600 hover:text-green-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMailboxStore } from '@/stores/mailbox'
import { mailboxService } from '@/services/mailbox'
import { 
  EnvelopeIcon, 
  UserIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon 
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import type {Mailbox, GmailMailbox } from '@/services/mailbox'

interface Contact {
  email: string
  name: string
  lastContact: Date
  status: 'engaged' | 'sent' | 'pending'
  unreadCount: number
}

interface Message {
  id: string
  subject: string
  from: string
  date: Date
  snippet: string
  isRead: boolean
  status: 'engaged' | 'sent' | 'pending'
  sourceMailbox: string
  sequence?: number
  labels?: string[]
  showReply: boolean
  replyContent: string
  threadId?: string
}

interface GmailMessage {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
  isRead: boolean
  labels?: string[]
  threadId?: string
}

const mailboxStore = useMailboxStore()
const messages = ref<Message[]>([])
const contacts = ref<Contact[]>([])
const selectedContact = ref<Contact | null>(null)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const currentStatus = ref('all')

// 过滤联系人列表
const filteredContacts = computed(() => {
  let result = contacts.value

  if (currentStatus.value !== 'all') {
    result = result.filter(contact => contact.status === currentStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    )
  }

  return result
})

// 获取当前选中联系人的所有邮件
const contactMessages = computed(() => {
  if (!selectedContact.value?.email) return []
  const email = selectedContact.value.email
  return messages.value.filter(msg => 
    msg.from === email || 
    msg.subject.toLowerCase().includes(email.toLowerCase())
  ).sort((a, b) => b.date.getTime() - a.date.getTime())
})

const formatDate = (date: Date) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

// 选择联系人
const selectContact = (contact: Contact) => {
  selectedContact.value = contact
}

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const allMessages = []
    for (const mailbox of mailboxStore.enabledMailboxes) {
      if (mailbox.provider === 'gmail') {
        try {
          const gmailMessages = await mailboxService.getGmailMessages(mailbox)
          const processedMessages = gmailMessages.map((msg: GmailMessage) => ({
            ...msg,
            sourceMailbox: mailbox.email,
            status: determineMessageStatus(msg),
            sequence: determineSequence(msg),
            date: new Date(msg.date),
            showReply: false,
            replyContent: ''
          }))
          allMessages.push(...processedMessages)
        } catch (e) {
          console.error(`Failed to load messages for ${mailbox.email}:`, e)
        }
      }
    }
    
    messages.value = allMessages
    
    // 提取并整理联系人信息
    const contactMap = new Map<string, Contact>()
    for (const msg of allMessages) {
      const email = msg.from
      if (!contactMap.has(email)) {
        contactMap.set(email, {
          email,
          name: email.split('@')[0],
          lastContact: msg.date,
          status: msg.status as 'engaged' | 'sent' | 'pending',
          unreadCount: msg.isRead ? 0 : 1
        })
      } else {
        const contact = contactMap.get(email)!
        if (msg.date > contact.lastContact) {
          contact.lastContact = msg.date
          contact.status = msg.status as 'engaged' | 'sent' | 'pending'
        }
        if (!msg.isRead) contact.unreadCount++
      }
    }
    
    contacts.value = Array.from(contactMap.values())
      .sort((a, b) => b.lastContact.getTime() - a.lastContact.getTime())
    
  } catch (e) {
    error.value = 'Failed to load data'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const refreshMessages = () => {
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})

const determineMessageStatus = (message: any): 'engaged' | 'sent' | 'pending' => {
  if (message.labels?.includes('INBOX') && !message.isRead) return 'engaged'
  if (message.labels?.includes('SENT')) return 'sent'
  return 'pending'
}

const determineSequence = (message: any): number | undefined => {
  return undefined // 实现序列号逻辑
}

// 添加发送邮件的方法
const sendReply = async (message: Message, content: string) => {
  try {
    loading.value = true
    const contact = selectedContact.value
    if (!contact?.email) return

    const mailbox = mailboxStore.enabledMailboxes.find(m => 
      m.provider === 'gmail' && 'accessToken' in m && 'refreshToken' in m
    ) as GmailMailbox | undefined

    if (!mailbox) {
      console.error('No valid Gmail mailbox found')
      return
    }

    await mailboxService.sendGmailMessage(mailbox as GmailMailbox, {
      to: contact.email,
      subject: `Re: ${message.subject}`,
      content: content,
      threadId: message.threadId
    })

    // 刷新消息列表
    await loadData()
    message.showReply = false  // 发送成功后关闭回复框
  } catch (error) {
    console.error('Failed to send reply:', error)
  } finally {
    loading.value = false
  }
}

// 标记消息已读
const markAsRead = async (message: Message) => {
  const mailbox = mailboxStore.enabledMailboxes.find(m => 
    m.provider === 'gmail' && 
    'accessToken' in m && 
    m.email === message.sourceMailbox
  ) as GmailMailbox | undefined

  if (!mailbox) return

  try {
    await mailboxService.markGmailMessageRead(mailbox, message.id)
    message.isRead = true
  } catch (error) {
    console.error('Failed to mark message as read:', error)
  }
}
</script> 