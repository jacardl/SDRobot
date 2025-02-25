<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- 头部区域 -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900">{{ t('mailboxes.title') }}</h1>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
            {{ mailboxStore.totalMailboxes }} / {{ mailboxStore.maxMailboxes }}
          </span>
        </div>
        <p class="text-gray-500 mt-1">{{ t('mailboxes.description') }}</p>
      </div>
      <button
        @click="showAddMailboxModal = true"
        :disabled="!mailboxStore.canAddMore"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        {{ t('add') }}
      </button>
    </div>

    <!-- 邮箱列表 -->
    <div class="mt-8 bg-white rounded-lg shadow overflow-hidden">
      <div v-if="mailboxStore.loading" class="p-8 text-center text-gray-500">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p class="mt-2">{{ t('mailboxes.loading') }}</p>
      </div>

      <div v-else-if="mailboxStore.error" class="p-8 text-center text-red-500">
        <ExclamationCircleIcon class="h-8 w-8 mx-auto" />
        <p class="mt-2">{{ t('mailboxes.error') }}</p>
        <button
          @click="mailboxStore.loadMailboxes"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {{ t('retry') }}
        </button>
      </div>

      <div v-else-if="mailboxStore.mailboxes.length === 0" class="p-8 text-center text-gray-500">
        <EnvelopeIcon class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ t('mailboxes.noMailboxes.title') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ t('mailboxes.noMailboxes.description') }}</p>
        <div class="mt-6">
          <button
            @click="showAddMailboxModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            {{ t('add') }}
          </button>
        </div>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accounts
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center gap-1 group relative">
                Daily Email Capacity
                <InformationCircleIcon class="h-4 w-4 text-gray-400 cursor-help" />
                <div class="hidden group-hover:block absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  The number of emails that can be sent from this mailbox per day
                </div>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
              Status
              <button class="ml-1 text-gray-400 hover:text-gray-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center gap-1 group relative">
                Mailbox Health
                <InformationCircleIcon class="h-4 w-4 text-gray-400 cursor-help" />
                <div class="hidden group-hover:block absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  Overall health score based on deliverability and engagement metrics
                </div>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div class="flex items-center gap-1 group relative">
                Use This Mailbox
                <InformationCircleIcon class="h-4 w-4 text-gray-400 cursor-help" />
                <div class="hidden group-hover:block absolute left-0 top-6 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  Toggle to enable or disable this mailbox for sending emails
                </div>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="mailbox in mailboxStore.mailboxes" :key="mailbox.email" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img class="h-8 w-8" src="@/assets/google-icon.svg" alt="Google" />
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ mailbox.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="relative w-12 h-12">
                <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    stroke-width="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#16A34A"
                    stroke-width="8"
                    fill="none"
                    :stroke-dasharray="`${2 * Math.PI * 40}`"
                    :stroke-dashoffset="`${2 * Math.PI * 40 * (1 - mailbox.capacity / 100)}`"
                    class="transition-all duration-300"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-semibold text-gray-900">{{ mailbox.capacity }}%</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap relative">
              <div 
                class="flex items-center space-x-1 cursor-help" 
                ref="statusRef"
                @mouseenter="showTooltip(mailbox, $event)" 
                @mouseleave="hideTooltip"
              >
                <div 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(mailbox.status)"
                >
                  {{ mailbox.status }}
                </div>
                <MailboxStatusTooltip 
                  v-if="hoveredMailbox === mailbox.email"
                  :mailbox="mailbox"
                  :trigger-ref="tooltipTriggerRef"
                />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center space-x-1">
                <div class="relative w-12 h-12">
                  <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E5E7EB"
                      stroke-width="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      :stroke="getHealthColor(mailbox.health)"
                      stroke-width="8"
                      fill="none"
                      :stroke-dasharray="`${2 * Math.PI * 40}`"
                      :stroke-dashoffset="`${2 * Math.PI * 40 * (1 - mailbox.health / 100)}`"
                      class="transition-all duration-300"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-sm font-semibold text-gray-900">{{ mailbox.health }}%</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <Switch
                v-model="mailbox.enabled"
                @change="mailboxStore.toggleMailboxEnabled(mailbox.email)"
                class="relative inline-flex h-6 w-11 items-center rounded-full"
                :class="[mailbox.enabled ? 'bg-green-600' : 'bg-gray-200']"
              >
                <span class="sr-only">Enable mailbox</span>
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                  :class="[mailbox.enabled ? 'translate-x-6' : 'translate-x-1']"
                />
              </Switch>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="confirmDisconnect(mailbox)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-full text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Disconnect
                <TrashIcon class="ml-2 h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加邮箱对话框 -->
    <TransitionRoot appear :show="showAddMailboxModal" as="template">
      <Dialog as="div" @close="showAddMailboxModal = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Add Email Address
                </DialogTitle>
                
                <!-- Gmail 快速连接按钮 -->
                <div class="mt-4">
                  <button
                    @click="connectGmail"
                    class="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <img class="h-5 w-5" src="@/assets/google-icon.svg" alt="Google" />
                    <span class="text-sm font-medium">Connect with Google</span>
                  </button>
                </div>

                <div class="mt-4 relative">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                  </div>
                  <div class="relative flex justify-center text-sm">
                    <span class="bg-white px-2 text-gray-500">Or add manually</span>
                  </div>
                </div>

                <!-- 手动添加邮箱表单 -->
                <form @submit.prevent="addManualMailbox" class="mt-4 space-y-4">
                  <!-- 邮箱地址 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">电子邮件地址</label>
                    <input
                      v-model="manualMailbox.email"
                      type="email"
                      @input="detectMailboxSettings"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      required
                    />
                  </div>

                  <!-- 用户名 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">用户名</label>
                    <input
                      v-model="manualMailbox.username"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      required
                    />
                  </div>

                  <!-- 密码 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">密码</label>
                    <input
                      v-model="manualMailbox.password"
                      type="password"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      required
                    />
                  </div>

                  <!-- 账户类型 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">账户类型</label>
                    <select
                      v-model="manualMailbox.type"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    >
                      <option value="POP">POP</option>
                      <option value="IMAP">IMAP</option>
                    </select>
                  </div>

                  <!-- 收件服务器 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">收件服务器</label>
                    <input
                      v-model="manualMailbox.incomingServer"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      required
                    />
                  </div>

                  <!-- 发件服务器 -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">发件服务器</label>
                    <input
                      v-model="manualMailbox.outgoingServer"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      required
                    />
                  </div>

                  <!-- 按钮组 -->
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      @click="showAddMailboxModal = false"
                    >
                      {{ t('cancel') }}
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      {{ t('login') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- 断开连接确认对话框 -->
    <TransitionRoot appear :show="!!mailboxToDisconnect" as="template">
      <Dialog as="div" @close="mailboxToDisconnect = null" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Disconnect Mailbox
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to disconnect {{ mailboxToDisconnect?.email }}? This action cannot be undone.
                  </p>
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    @click="mailboxToDisconnect = null"
                  >
                    {{ t('cancel') }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="disconnectMailbox"
                  >
                    {{ t('disconnect') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Switch,
} from '@headlessui/vue'
import {
  PlusIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import { useMailboxStore } from '@/stores/mailbox'
import { type Mailbox } from '@/data/mailboxData'
import { mailboxService } from '@/services/mailbox'
import { GOOGLE_CONFIG } from '@/config/google'
import CircleProgress from '@/components/CircleProgress.vue'
import MailboxStatusTooltip from '@/components/MailboxStatusTooltip.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const mailboxStore = useMailboxStore()
const showAddMailboxModal = ref(false)
const mailboxToDisconnect = ref<Mailbox | null>(null)
const hoveredMailbox = ref<string | null>(null)
const tooltipTriggerRef = ref<HTMLElement | undefined>(undefined)

// 在 script setup 顶部添加类型定义
interface ManualMailbox {
  email: string;
  username: string;
  password: string;
  type: 'POP' | 'IMAP';
  incomingServer: string;
  outgoingServer: string;
}

// 添加响应式变量
const manualMailbox = ref<ManualMailbox>({
  email: '',
  username: '',
  password: '',
  type: 'POP',
  incomingServer: '',
  outgoingServer: ''
})

// 获取已连接的 Gmail 账户
const connectedGmailAccounts = computed(() => 
  mailboxStore.mailboxes.filter(m => m.provider === 'gmail')
)

// 连接 Gmail
const connectGmail = async () => {
  console.log('Connect Gmail button clicked')
  try {
    if (!mailboxStore.canAddMore) {
      console.warn('Maximum mailbox limit reached')
      return
    }

    console.log('Getting auth URL...')
    const authUrl = mailboxService.getGmailAuthUrl()
    console.log('Generated auth URL:', authUrl)

    localStorage.setItem('gmail_auth_pending', 'true')
    console.log('Redirecting to auth URL...')
    window.location.href = authUrl
  } catch (error) {
    console.error('Failed to connect Gmail:', error)
  }
}

// 断开 Gmail 连接
const disconnectGmail = async (account: any) => {
  try {
    // 从 store 中移除邮箱
    mailboxStore.removeMailbox(account.email)
    
    // 清除相关的本地存储
    localStorage.removeItem(`gmail_token_${account.email}`)
    
    // 可选：通知端清除令牌
    await fetch(`${import.meta.env.VITE_APP_URL}/api/gmail/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: account.email })
    })
  } catch (error) {
    console.error('Failed to disconnect Gmail:', error)
  }
}

// 确认断开连接
const confirmDisconnect = (account: any) => {
  mailboxToDisconnect.value = account
}

// 断开邮箱连接
const disconnectMailbox = () => {
  if (!mailboxToDisconnect.value) return
  mailboxStore.removeMailbox(mailboxToDisconnect.value.email)
  mailboxToDisconnect.value = null
}

// 获取状态样式
const getStatusClass = (status: Mailbox['status']) => {
  switch (status) {
    case 'Healthy':
      return 'bg-green-50 text-green-700'
    case 'Warning':
      return 'bg-yellow-50 text-yellow-700'
    case 'Urgent Issues':
      return 'bg-red-50 text-red-700'
  }
}

// 获取状态图标
const getStatusIcon = (status: Mailbox['status']) => {
  switch (status) {
    case 'Healthy':
      return CheckCircleIcon
    case 'Warning':
      return ExclamationCircleIcon
    case 'Urgent Issues':
      return ExclamationTriangleIcon
  }
}

// 获取健康度颜色
const getHealthColor = (health: number) => {
  if (health >= 80) return '#16A34A' // green-600
  if (health >= 60) return '#CA8A04' // yellow-600
  return '#DC2626' // red-600
}

const showTooltip = (mailbox: any, event: MouseEvent) => {
  hoveredMailbox.value = mailbox.email
  tooltipTriggerRef.value = event.currentTarget as HTMLElement
}

const hideTooltip = () => {
  hoveredMailbox.value = null
  tooltipTriggerRef.value = undefined
}

// 自动检测邮箱设置
const detectMailboxSettings = () => {
  const email = manualMailbox.value.email
  const domain = email.split('@')[1]
  
  if (!domain) return
  
  // 常见邮箱服务商配置
  const configs: Record<string, Partial<ManualMailbox>> = {
    'gmail.com': {
      type: 'POP',
      incomingServer: 'pop.gmail.com',
      outgoingServer: 'smtp.gmail.com'
    },
    'outlook.com': {
      type: 'POP',
      incomingServer: 'pop3.live.com',
      outgoingServer: 'smtp.live.com'
    }
  }

  // 设置默认用户名
  manualMailbox.value.username = email

  // 应用预设配置
  const config = configs[domain]
  if (config) {
    Object.assign(manualMailbox.value, config)
  }
}

// 添加手动配置的邮箱
const addManualMailbox = async () => {
  try {
    // 验证邮箱连接
    const result = await mailboxService.verifyManualMailbox(manualMailbox.value)
    if (result.success) {
      await mailboxStore.addMailbox({
        email: manualMailbox.value.email,
        provider: 'other',
        capacity: 100,
        enabled: true,
        status: 'Healthy',
        health: 100,
        statusChecks: {
          spf: true,
          dmarc: true,
          dkim: true,
          rdns: true,
          aRecord: true,
          mxRecord: true
        }
      })

      // 清空表单内容
      manualMailbox.value = {
        email: '',
        username: '',
        password: '',
        type: 'POP',
        incomingServer: '',
        outgoingServer: ''
      }

      // 关闭弹窗
      showAddMailboxModal.value = false
    }
  } catch (error) {
    console.error('Failed to add mailbox:', error)
  }
}

// 初始化
onMounted(() => {
  // 检查是否有待处理的 Gmail 授权
  const pendingAuth = localStorage.getItem('gmail_auth_pending')
  if (pendingAuth) {
    localStorage.removeItem('gmail_auth_pending')
    // 可以显示一个提示或者执行其他操作
  }
  
  mailboxStore.loadMailboxes()

  // 检查环境变量和配置
  console.log('Mailboxes mounted, checking config:', {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: import.meta.env.VITE_APP_URL,
    googleConfig: GOOGLE_CONFIG
  })
})
</script>

<style scoped>
@media (max-width: 640px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style> 