<template>
  <div class="relative" :style="{ width: size + 'px', height: size + 'px' }">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 36 36"
      class="circular-chart"
    >
      <!-- 背景圆环 -->
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
        class="circle-bg"
      />
      <!-- 进度圆环 -->
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="`${normalizedDashArray}, ${CIRCLE_CIRCUMFERENCE}`"
        class="circle"
      />
      <!-- 百分比文字 -->
      <text 
        x="18" 
        y="20.35" 
        class="percentage"
        :style="{ fontSize: `${size * 0.25}px` }"
      >{{ clampedPercentage }}%</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 36,
  strokeWidth: 3,
  color: '#8B5CF6',
  bgColor: '#E5E7EB'
})

// 圆的周长 (2 * π * r), r = 15.9155
const CIRCLE_CIRCUMFERENCE = 100

// 确保百分比在 0-100 之间
const clampedPercentage = computed(() => {
  return Math.min(100, Math.max(0, Math.round(props.percentage)))
})

// 计算实际的 dasharray 值
const normalizedDashArray = computed(() => {
  return (clampedPercentage.value / 100) * CIRCLE_CIRCUMFERENCE
})
</script>

<style scoped>
.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

.circle-bg {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.circle {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.percentage {
  font-family: system-ui, -apple-system, sans-serif;
  text-anchor: middle;
  font-weight: 600;
  fill: currentColor;
}
</style> 