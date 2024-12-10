<template>
  <div 
    class="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72"
    :style="tooltipStyle"
  >
    <!-- Email Warmup Status -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-gray-600">Email Warmup</span>
        <svg class="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="text-sm text-gray-500">Email Warmup is automatically enabled for all accounts.</p>
    </div>

    <!-- Mailbox Status -->
    <div>
      <h3 class="text-gray-600 mb-2">Mailbox Status</h3>
      <div class="space-y-2">
        <div v-for="(status, name) in mailboxStatus" :key="name" 
          class="flex items-center justify-between">
          <span class="text-gray-600">{{ name }}</span>
          <svg v-if="status" class="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Mailbox } from '@/data/mailboxData'

interface Props {
  mailbox: Mailbox
  triggerRef?: HTMLElement
}

const props = defineProps<Props>()

const TOOLTIP_WIDTH = 288 // 272px width + 16px spacing
const TOOLTIP_HEIGHT = 320 // Approximate height of the tooltip

const tooltipStyle = computed(() => {
  if (!props.triggerRef) return {}
  
  const rect = props.triggerRef.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 默认位置（在触发元素左侧）
  let left = rect.left - TOOLTIP_WIDTH
  let top = rect.top

  // 如果左侧空间不足，则显示在右侧
  if (left < 0) {
    left = rect.right + 16 // 16px spacing
  }

  // 如果右侧空间不足，则强制显示在左侧，但不超出屏幕
  if (left + TOOLTIP_WIDTH > viewportWidth) {
    left = Math.max(16, viewportWidth - TOOLTIP_WIDTH - 16)
  }

  // 确保顶部不会超出屏幕
  if (top < 16) {
    top = 16
  }

  // 确保底部不会超出屏幕
  if (top + TOOLTIP_HEIGHT > viewportHeight) {
    top = Math.max(16, viewportHeight - TOOLTIP_HEIGHT - 16)
  }

  return {
    top: `${top}px`,
    left: `${left}px`
  }
})

const mailboxStatus = computed(() => ({
  'SPF': props.mailbox.statusChecks.spf,
  'DMARC': props.mailbox.statusChecks.dmarc,
  'DKIM': props.mailbox.statusChecks.dkim,
  'R-DNS': props.mailbox.statusChecks.rdns,
  'A-Record': props.mailbox.statusChecks.aRecord,
  'MX-Record': props.mailbox.statusChecks.mxRecord
}))
</script>
