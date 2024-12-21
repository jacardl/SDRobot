import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mailboxService } from '@/services/mailbox'
import { 
  type Mailbox, 
  defaultMailboxes, 
  getStatusFromHealth, 
  createDefaultMailbox 
} from '@/data/mailboxData'
import type { GmailMailbox } from '@/services/mailbox'

export const useMailboxStore = defineStore('mailbox', () => {
  const mailboxes = ref<Mailbox[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const totalMailboxes = computed(() => mailboxes.value.length)
  const maxMailboxes = 6
  const canAddMore = computed(() => totalMailboxes.value < maxMailboxes)
  const totalCapacity = computed(() => 
    mailboxes.value.reduce((sum, box) => sum + box.capacity, 0)
  )
  const averageHealth = computed(() => {
    if (mailboxes.value.length === 0) return 0
    return Math.round(
      mailboxes.value.reduce((sum, box) => sum + box.health, 0) / mailboxes.value.length
    )
  })

  // 获取排序后的邮箱列表（按健康度降序）
  const sortedMailboxes = computed(() => {
    return [...mailboxes.value].sort((a, b) => b.health - a.health)
  })

  // 加载邮箱数据
  const loadMailboxes = async () => {
    loading.value = true
    error.value = null
    try {
      // 检查是否已认证
      if (mailboxService.isAuthenticated()) {
        const email = mailboxService.getCurrentEmail()
        if (email && !mailboxes.value.find(m => m.email === email)) {
          // 添加新认证的邮箱
          mailboxes.value.push(createDefaultMailbox(email))
        }
      }

      // 如果没有数据，加载默认数据
      if (mailboxes.value.length === 0) {
        mailboxes.value = [...defaultMailboxes]
      }
    } catch (e) {
      error.value = 'Failed to load mailboxes. Please try again.'
    } finally {
      loading.value = false
    }
  }

  // 添加邮箱
  const addMailbox = (mailbox: Mailbox | GmailMailbox) => {
    mailboxes.value.push(mailbox)
  }

  // 移除邮箱
  const removeMailbox = (email: string) => {
    const index = mailboxes.value.findIndex(m => m.email === email)
    if (index > -1) {
      mailboxes.value.splice(index, 1)
      // 同时断开邮箱连接
      if (mailboxService.getCurrentEmail() === email) {
        mailboxService.disconnect()
      }
    }
  }

  // 更新邮箱状态
  const updateMailboxStatus = (email: string, status: Partial<Mailbox>) => {
    const mailbox = mailboxes.value.find(m => m.email === email)
    if (mailbox) {
      Object.assign(mailbox, status)
    }
  }

  // 更新邮箱健康度
  const updateMailboxHealth = (email: string, health: number) => {
    const mailbox = mailboxes.value.find(m => m.email === email)
    if (mailbox) {
      mailbox.health = Math.max(0, Math.min(100, health))
      mailbox.status = getStatusFromHealth(mailbox.health)
    }
  }

  // 更新邮箱容量
  const updateMailboxCapacity = (email: string, capacity: number) => {
    const mailbox = mailboxes.value.find(m => m.email === email)
    if (mailbox) {
      mailbox.capacity = Math.max(0, Math.min(100, capacity))
    }
  }

  // 切换邮箱启用状态
  const toggleMailboxEnabled = (email: string) => {
    const mailbox = mailboxes.value.find(m => m.email === email)
    if (mailbox) {
      mailbox.enabled = !mailbox.enabled
    }
  }

  // 添加计算属性
  const enabledMailboxes = computed(() => 
    mailboxes.value.filter(mailbox => mailbox.enabled)
  )

  return {
    mailboxes,
    loading,
    error,
    totalMailboxes,
    maxMailboxes,
    canAddMore,
    totalCapacity,
    averageHealth,
    sortedMailboxes,
    loadMailboxes,
    addMailbox,
    removeMailbox,
    updateMailboxStatus,
    updateMailboxHealth,
    updateMailboxCapacity,
    toggleMailboxEnabled,
    enabledMailboxes  // 导出计算属性
  }
}) 