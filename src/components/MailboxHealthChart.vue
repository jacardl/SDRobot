<!-- 邮箱健康度环形图 -->
<template>
  <div class="relative w-full aspect-square">
    <!-- 中心文本 -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
      <div class="text-4xl font-semibold text-gray-900">
        {{ displayedHealth }}%
      </div>
      <div class="text-sm text-gray-500">
        {{ hoveredIndex !== null ? mailboxes[hoveredIndex].name : t('dashboard.healthScore') }}
      </div>
    </div>
    
    <!-- SVG 环形图 -->
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <g>
        <template v-for="(mailbox, index) in mailboxes" :key="mailbox.id">
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Mailbox {
  id: number
  name: string
  health: number
}

// 示例数据
const mailboxes = ref<Mailbox[]>([
  { id: 1, name: 'marketing@sdrobot.ai', health: 95 },
  { id: 2, name: 'sales@sdrobot.ai', health: 88 },
  { id: 3, name: 'support@sdrobot.ai', health: 92 },
  { id: 4, name: 'contact@sdrobot.ai', health: 85 }
])

// 当前悬浮的邮箱索引
const hoveredIndex = ref<number | null>(null)

// 计算平均健康度
const averageHealth = computed(() => {
  const total = mailboxes.value.reduce((sum, box) => sum + box.health, 0)
  return total / mailboxes.value.length
})

// 显示的健康度（根据悬浮状态显示不同的值）
const displayedHealth = computed(() => {
  if (hoveredIndex.value !== null) {
    return mailboxes.value[hoveredIndex.value].health.toFixed(2)
  }
  return averageHealth.value.toFixed(2)
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