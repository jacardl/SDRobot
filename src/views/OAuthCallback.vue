<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4">Connecting your Gmail account...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMailboxStore } from '@/stores/mailbox'
import { mailboxService } from '@/services/mailbox'
import type { GmailMailbox } from '@/services/mailbox'

const router = useRouter()
const mailboxStore = useMailboxStore()

onMounted(async () => {
  try {
    // 获取授权码和状态
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    
    // 验证状态（防止 CSRF）
    const savedState = localStorage.getItem('gmail_auth_state')
    if (state !== savedState) {
      throw new Error('Invalid state')
    }

    if (!code) throw new Error('No authorization code')

    // 处理授权回调
    const mailboxData = await mailboxService.handleGmailCallback(code)
    
    // 添加到 store (移除 JSON.stringify)
    await mailboxStore.addMailbox(mailboxData as GmailMailbox)
    
    // 清理状态
    localStorage.removeItem('gmail_auth_state')
    localStorage.removeItem('gmail_auth_pending')
    
    // 重定向回邮箱页面
    router.push('/mailboxes')
  } catch (error) {
    console.error('OAuth callback error:', error)
    router.push('/mailboxes?error=auth_failed')
  }
})
</script> 