<template>
  <div class="relative w-8 h-8">
    <!-- 背景圆环 -->
    <svg class="w-full h-full transform -rotate-90">
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke-width="2.5"
        stroke="currentColor"
        fill="none"
        class="text-gray-200"
      />
      <!-- 进度圆环 -->
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke-width="2.5"
        :stroke-dasharray="strokeDasharray"
        :stroke-dashoffset="strokeDashoffset"
        stroke="currentColor"
        fill="none"
        class="text-purple-500 transition-all duration-300 ease-in-out"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number // 0-100 之间的进度值
}>()

const circumference = 2 * Math.PI * 14 // 圆的周长
const strokeDasharray = computed(() => `${circumference} ${circumference}`)
const strokeDashoffset = computed(() => 
  circumference - (props.value / 100) * circumference
)
</script> 