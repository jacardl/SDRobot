<!-- 邮箱健康度环形图 -->
<template>
  <div class="relative w-full aspect-square">
    <!-- 中心文本 -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <div class="text-4xl font-semibold text-gray-900">
        {{ displayedHealth }}%
      </div>
      <div class="text-sm text-gray-500">
        {{ hoveredIndex !== null ? sortedMailboxes[hoveredIndex].email : t('dashboard.healthScore') }}
      </div>
    </div>
    
    <!-- SVG 环形图 -->
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <g>
        <template v-for="(mailbox, index) in sortedMailboxes" :key="mailbox.email">
          <!-- 计算每个环的位置和大小 -->
          <circle
            :cx="50"
            :cy="50"
            :r="44 - index * 5"
            :stroke-width="4"
            :stroke-dasharray="`${(mailbox.health / 100) * (2 * Math.PI * (44 - index * 5))} ${2 * Math.PI * (44 - index * 5)}`"
            fill="none"
            class="transition-all duration-300"
            :class="[
              'stroke-primary',
              { 'opacity-40': hoveredIndex !== null && hoveredIndex !== index }
            ]"
            style="transform-origin: center;"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          />
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMailboxStore } from '@/stores/mailbox'

const { t } = useI18n()
const mailboxStore = useMailboxStore()

// 当前悬浮的邮箱索引
const hoveredIndex = ref<number | null>(null)

// 获取排序后的邮箱列表
const sortedMailboxes = computed(() => mailboxStore.sortedMailboxes)

// 显示的健康度（根据悬浮状态显示不同的值）
const displayedHealth = computed(() => {
  if (hoveredIndex.value !== null && sortedMailboxes.value[hoveredIndex.value]) {
    return sortedMailboxes.value[hoveredIndex.value].health.toFixed(2)
  }
  return mailboxStore.averageHealth.toFixed(2)
})

// 初始化时加载邮箱数据
onMounted(() => {
  mailboxStore.loadMailboxes()
})
</script>

<style scoped>
circle {
  transition: all 0.3s ease;
}

.text-center > div {
  transition: all 0.3s ease;
}
</style> 