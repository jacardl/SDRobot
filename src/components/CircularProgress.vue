<template>
  <div class="relative w-6 h-6">
    <!-- 背景圆环 -->
    <svg class="w-6 h-6 transform -rotate-90">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        class="text-gray-200"
      />
      <!-- 进度圆环 -->
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="text-primary transition-all duration-300"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number // 0-100 之间的进度值
}>()

const circumference = 2 * Math.PI * 10 // 圆的周长
const strokeDasharray = computed(() => circumference)
const dashOffset = computed(() => {
  // 确保值在0-100之间
  const clampedValue = Math.min(Math.max(props.value, 0), 100)
  // 计算偏移量，保留两位小数
  return Number((circumference - (clampedValue / 100) * circumference).toFixed(2))
})
</script> 