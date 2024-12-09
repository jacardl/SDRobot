<template>
  <div class="relative w-full h-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// 注册需要的 Chart.js 组件
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension: number
    }>
  }
  options?: any
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d')
    if (ctx) {
      chart = new Chart(ctx, {
        type: 'line',
        data: props.data,
        options: {
          ...props.options,
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 11
                },
                padding: 8
              },
              border: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 11
                },
                padding: 8
              },
              border: {
                display: false
              }
            }
          },
          plugins: {
            tooltip: {
              enabled: true,
              backgroundColor: 'white',
              titleColor: '#111827',
              bodyColor: '#111827',
              borderColor: '#E5E7EB',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              titleFont: {
                size: 13,
                weight: '600',
                family: "'Inter', sans-serif"
              },
              bodyFont: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              displayColors: true,
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              callbacks: {
                label: function(context: any) {
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  label += context.parsed.y
                  return label
                }
              }
            },
            legend: {
              display: false
            }
          },
          elements: {
            line: {
              tension: 0.4,
              borderWidth: 2
            },
            point: {
              radius: 0,
              hoverRadius: 6,
              hitRadius: 6
            }
          }
        }
      })
    }
  }
})

// 监听数据变化更新图表
watch(() => props.data, (newData) => {
  if (chart) {
    chart.data = newData
    chart.update('none') // 使用 'none' 模式避免动画
  }
}, { deep: true })

// 组件卸载时销毁图表
onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<style scoped>
.relative {
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style> 