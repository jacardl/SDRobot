<template>
  <div class="p-6 space-y-6">
    <!-- 待处理邮件 -->
    <div 
      class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      @click="router.push('/pending-approval')"
    >
      <div class="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span class="text-gray-700">{{ t('dashboard.emailsPending') }}</span>
        <span class="text-purple-600 font-medium">769</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- 主要内容区 -->
    <div class="flex space-x-6">
      <!-- 分析图 -->
      <div class="flex-1 bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <h2 class="text-lg font-medium text-gray-900">{{ t('dashboard.analytics') }}</h2>
            <select v-model="selectedPeriod" class="border rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="30">{{ t('dashboard.past30Days') }}</option>
              <option value="7">{{ t('dashboard.past7Days') }}</option>
              <option value="90">{{ t('dashboard.past90Days') }}</option>
            </select>
          </div>
          <div class="flex items-center space-x-6 text-sm">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span class="text-gray-600">{{ t('dashboard.responses') }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span class="text-gray-600">{{ t('dashboard.leadsEnrolled') }}</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span class="text-gray-600">{{ t('dashboard.emailsSent') }}</span>
            </div>
          </div>
        </div>
        
        <div class="h-64">
          <LineChart 
            :data="analyticsData"
            :options="chartOptions"
          />
        </div>
      </div>

      <!-- 邮箱健康状态 -->
      <div 
        class="w-80 bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        @click="router.push('/mailboxes')"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-medium text-gray-900">{{ t('dashboard.mailboxHealth') }}</h2>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <div class="w-full">
          <MailboxHealthChart />
        </div>
      </div>
    </div>

    <!-- 底部统计信息 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 连续处理记录 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="space-y-2">
            <h3 class="text-primary font-semibold text-lg">{{ t('dashboard.dayStreak', { days: 0 }) }}</h3>
            <p class="text-sm text-gray-500">{{ t('dashboard.streakHint') }}</p>
          </div>
          <div class="p-2 bg-primary-light rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-7 gap-2">
          <template v-for="(day, index) in weekDays" :key="index">
            <div 
              class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium"
              :class="[
                index === 0 ? 'bg-primary text-white' : // Monday is active
                index >= 5 ? 'bg-gray-700 text-white' : // Weekend
                'bg-gray-200 text-gray-500' // Other weekdays
              ]"
            >
              {{ day }}
            </div>
          </template>
        </div>
      </div>

      <!-- 响应率 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-gray-900 font-semibold text-lg">{{ t('dashboard.responseRate') }}</h3>
          <div class="text-sm text-gray-500">{{ t('dashboard.past30Days') }}</div>
        </div>
        
        <div class="relative">
          <!-- 状态文本 -->
          <div class="flex justify-between text-sm text-gray-500 mb-4">
            <span>{{ t('dashboard.responseRateUhOh') }}</span>
            <span>{{ t('dashboard.responseRateGood') }}</span>
          </div>
          
          <!-- 进度条容器 -->
          <div class="relative">
            <!-- 百分比指示器 -->
            <div 
              class="absolute h-6 pl-3 pr-4 bg-[#FF6B6B] rounded-full flex items-center transition-all duration-300 z-10"
              :style="{ 
                left: `${(responseRate / maxRate) * 100}%`,
                top: '-0.5rem',
                transform: 'translateX(-50%)'
              }"
            >
              <span class="text-white text-xs font-medium">{{ responseRate }}%</span>
            </div>
            
            <!-- 进度条 -->
            <div class="h-2 bg-gray-100 rounded-full">
              <div 
                class="h-full bg-[#FF6B6B] rounded-full transition-all duration-300"
                :style="{ width: `${(responseRate / maxRate) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 邮件容量 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ t('dashboard.emailCapacity') }}</h3>
        <div class="flex justify-between items-start mb-4">
          <div class="space-y-3">
            <div class="text-2xl font-bold text-gray-900">420/510</div>
            <p class="text-sm text-gray-600 max-w-[280px] leading-relaxed">
              {{ t('dashboard.capacityHint') }}
            </p>
          </div>
          <CircularProgress :value="82" :size="48" class="text-primary">
            <template #default="{ value }">
              <span class="text-sm font-medium">{{ value }}%</span>
            </template>
          </CircularProgress>
        </div>
        <p class="text-sm text-gray-500 mt-4">
          {{ t('dashboard.capacityDescription') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import CircularProgress from '@/components/CircularProgress.vue'
import LineChart from '@/components/LineChart.vue'
import MailboxHealthChart from '@/components/MailboxHealthChart.vue'

const { t } = useI18n()
const router = useRouter()

const selectedPeriod = ref('30')
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// 生成日期标签
const generateDateLabels = (days: number) => {
  const labels = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    // 格式化日期为 "MMM DD" 格式
    const label = new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: '2-digit'
    }).format(date)
    labels.push(label)
  }
  
  return labels
}

// 生成随机整数数据
const generateRandomData = (days: number, min: number, max: number) => {
  return Array.from({ length: days }, () => 
    Math.floor(Math.random() * (max - min + 1) + min)
  )
}

// 图表数据
const analyticsData = computed(() => {
  const days = parseInt(selectedPeriod.value)
  const labels = generateDateLabels(days)
  
  // 根据不同时间范围设置不同的数据范围
  const dataRanges = {
    responses: { min: 2, max: 8 },
    leadsEnrolled: { min: 3, max: 10 },
    emailsSent: { min: 15, max: 25 }
  }

  return {
    labels,
    datasets: [
      {
        label: t('dashboard.responses'),
        data: generateRandomData(days, dataRanges.responses.min, dataRanges.responses.max),
        borderColor: 'rgb(96, 165, 250)',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4
      },
      {
        label: t('dashboard.leadsEnrolled'),
        data: generateRandomData(days, dataRanges.leadsEnrolled.min, dataRanges.leadsEnrolled.max),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4
      },
      {
        label: t('dashboard.emailsSent'),
        data: generateRandomData(days, dataRanges.emailsSent.min, dataRanges.emailsSent.max),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        stepSize: 1, // 确保只显示整数刻度
        precision: 0  // 不显示小数
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

// 响应率数据
const responseRate = ref(3.1)
const maxRate = ref(15) // 最大比率为15%
</script>

<style scoped>
.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
</style> 