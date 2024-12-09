<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Leads</h1>
      <div class="flex space-x-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, email or company..."
            class="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
          Add Lead
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="min-w-full divide-y divide-gray-200">
        <!-- 表头 -->
        <div class="bg-gray-50">
          <div class="grid grid-cols-[48px_minmax(250px,2fr)_minmax(120px,1fr)_minmax(200px,1.5fr)_minmax(100px,1fr)_minmax(130px,1fr)] divide-x divide-gray-200">
            <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input 
                type="checkbox" 
                class="rounded border-gray-300 text-primary focus:ring-primary"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
            </div>
            <div class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </div>
            <div class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Workflow Stage
            </div>
            <div class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </div>
            <div class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engaged
            </div>
            <div class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Contact
            </div>
          </div>
        </div>

        <!-- 表格内容 -->
        <div class="bg-white divide-y divide-gray-200">
          <div 
            v-for="lead in paginatedLeads" 
            :key="lead.id" 
            class="grid grid-cols-[48px_minmax(250px,2fr)_minmax(120px,1fr)_minmax(200px,1.5fr)_minmax(100px,1fr)_minmax(130px,1fr)] divide-x divide-gray-200 hover:bg-gray-50 cursor-pointer"
            @click="openLeadDetails(lead)"
          >
            <div class="px-4 py-4">
              <input 
                type="checkbox" 
                class="rounded border-gray-300 text-primary focus:ring-primary"
                v-model="selectedLeads"
                :value="lead.id"
              />
            </div>
            <div class="px-6 py-4 truncate">
              <div class="flex items-center">
                <img :src="lead.avatar" :alt="lead.name" class="h-8 w-8 rounded-full flex-shrink-0" />
                <div class="ml-4 min-w-0">
                  <div class="text-sm font-medium text-gray-900 truncate">{{ lead.name }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ lead.email }}</div>
                </div>
              </div>
            </div>
            <div class="px-6 py-4 flex items-center">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap"
                :class="getStageClass(lead.stage)"
              >
                {{ lead.stage }}
              </span>
            </div>
            <div class="px-6 py-4 min-w-0">
              <div class="text-sm text-gray-900 truncate">{{ lead.company }}</div>
              <div class="text-sm text-gray-500 truncate">{{ lead.position }}</div>
            </div>
            <div class="px-6 py-4 flex items-center">
              <div class="flex items-center whitespace-nowrap">
                <div 
                  class="h-2.5 w-2.5 rounded-full mr-2 flex-shrink-0"
                  :class="lead.active ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
                <span class="text-sm text-gray-500">
                  {{ lead.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <div class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
              {{ formatDate(lead.lastContact) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredLeads.length }}</span> results
      </div>
      <div class="flex space-x-1">
        <button 
          class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </button>
        <button 
          v-for="page in pageNumbers" 
          :key="page"
          class="min-w-[32px] px-2 py-1 border rounded-md"
          :class="[
            page === -1 ? 'border-transparent' : 'hover:bg-gray-50',
            page === currentPage ? 'bg-primary text-white border-primary' : 'text-gray-700'
          ]"
          @click="page !== -1 && (currentPage = page)"
          :disabled="page === -1"
        >
          {{ page === -1 ? '...' : page }}
        </button>
        <button 
          class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- 右侧抽屉 -->
    <LeadDetailsPanel 
      v-if="selectedLead"
      :lead="selectedLead"
      :show="showDetailsPanel"
      @close="closeLeadDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import LeadDetailsPanel from '../components/LeadDetailsPanel.vue'

interface Lead {
  id: number
  name: string
  email: string
  avatar: string
  stage: WorkflowStage
  company: string
  position: string
  active: boolean
  lastContact: Date
}

// 工作流阶段定义
const WORKFLOW_STAGES = {
  NEW: 'New Lead',          // 新线索，初始状态
  CONTACTED: 'Contacted',   // 已联系，等待响应
  ENGAGED: 'Engaged',       // 已回应，正在互动
  QUALIFIED: 'Qualified',   // 已确认有效，符合目标客户
  NURTURING: 'Nurturing',   // 培育中，持续跟进
  NEGOTIATING: 'Negotiating', // 谈判中，深入商谈
  CLOSED_WON: 'Closed Won', // 已成交
  CLOSED_LOST: 'Closed Lost' // 已流失
} as const

type WorkflowStage = typeof WORKFLOW_STAGES[keyof typeof WORKFLOW_STAGES]

// 更新示例数据
const leads = ref<Lead[]>([
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    stage: WORKFLOW_STAGES.QUALIFIED,
    company: 'TechCorp Inc.',
    position: 'Chief Technology Officer',
    active: true,
    lastContact: new Date('2024-01-15T09:30:00')
  },
  {
    id: 2,
    name: 'Michael Johnson',
    email: 'm.johnson@innovatelabs.io',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
    stage: WORKFLOW_STAGES.NEW,
    company: 'Innovation Labs',
    position: 'VP of Engineering',
    active: false,
    lastContact: new Date('2024-01-15T14:15:00')
  },
  {
    id: 3,
    name: 'Emily Wang',
    email: 'emily.w@dataflow.ai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    stage: WORKFLOW_STAGES.NEGOTIATING,
    company: 'DataFlow Systems',
    position: 'Head of AI Research',
    active: true,
    lastContact: new Date('2024-01-15T11:45:00')
  },
  {
    id: 4,
    name: 'David Miller',
    email: 'david.miller@cloudtech.dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    stage: WORKFLOW_STAGES.CONTACTED,
    company: 'Cloud Solutions Pro',
    position: 'Solutions Architect',
    active: true,
    lastContact: new Date('2024-01-15T16:20:00')
  },
  {
    id: 5,
    name: 'Lisa Zhang',
    email: 'l.zhang@aiinnovate.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    stage: WORKFLOW_STAGES.NURTURING,
    company: 'AI Innovations',
    position: 'Machine Learning Lead',
    active: true,
    lastContact: new Date('2024-01-15T13:05:00')
  },
  {
    id: 6,
    name: 'James Wilson',
    email: 'j.wilson@quantumtech.net',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    stage: WORKFLOW_STAGES.ENGAGED,
    company: 'Quantum Technologies',
    position: 'Quantum Computing Researcher',
    active: true,
    lastContact: new Date('2024-01-15T10:30:00')
  },
  {
    id: 7,
    name: 'Sofia Rodriguez',
    email: 'sofia@cybersec.io',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CLOSED_LOST,
    company: 'CyberSec Solutions',
    position: 'Security Director',
    active: false,
    lastContact: new Date('2024-01-15T15:45:00')
  },
  {
    id: 8,
    name: 'Alex Kim',
    email: 'alex.kim@robotics.co',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.QUALIFIED,
    company: 'Advanced Robotics',
    position: 'Robotics Engineer',
    active: true,
    lastContact: new Date('2024-01-15T12:15:00')
  },
  {
    id: 9,
    name: 'Rachel Green',
    email: 'r.green@biotech.org',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NEW,
    company: 'BioTech Research',
    position: 'Bioinformatics Lead',
    active: false,
    lastContact: new Date('2024-01-15T17:30:00')
  },
  {
    id: 10,
    name: 'Daniel Lee',
    email: 'd.lee@vrsystems.tech',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CLOSED_WON,
    company: 'VR Systems',
    position: 'VR Development Head',
    active: false,
    lastContact: new Date('2024-01-15T14:45:00')
  },
  {
    id: 11,
    name: 'Emma Thompson',
    email: 'emma.t@blockchain.io',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.QUALIFIED,
    company: 'Blockchain Solutions',
    position: 'Blockchain Architect',
    active: true,
    lastContact: new Date('2024-01-15T11:15:00')
  },
  {
    id: 12,
    name: 'Marcus Brown',
    email: 'm.brown@iottech.com',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NEW,
    company: 'IoT Technologies',
    position: 'IoT Solutions Lead',
    active: false,
    lastContact: new Date('2024-01-15T16:45:00')
  },
  {
    id: 13,
    name: 'Anna Martinez',
    email: 'anna.m@edtech.edu',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NEGOTIATING,
    company: 'EdTech Innovations',
    position: 'Educational Technology Director',
    active: true,
    lastContact: new Date('2024-01-15T13:30:00')
  },
  {
    id: 14,
    name: 'Ryan Taylor',
    email: 'ryan.t@fintech.finance',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CONTACTED,
    company: 'FinTech Solutions',
    position: 'Financial Systems Architect',
    active: false,
    lastContact: new Date('2024-01-15T10:05:00')
  },
  {
    id: 15,
    name: 'Julia Park',
    email: 'j.park@healthtech.care',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NURTURING,
    company: 'HealthTech Systems',
    position: 'Healthcare Solutions Lead',
    active: true,
    lastContact: new Date('2024-01-15T15:55:00')
  },
  {
    id: 16,
    name: 'Chris Anderson',
    email: 'c.anderson@devops.cloud',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.ENGAGED,
    company: 'DevOps Cloud',
    position: 'DevOps Manager',
    active: true,
    lastContact: new Date('2024-01-15T12:40:00')
  },
  {
    id: 17,
    name: 'Nina Patel',
    email: 'nina.p@datasci.ai',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CLOSED_LOST,
    company: 'Data Science AI',
    position: 'Data Science Director',
    active: false,
    lastContact: new Date('2024-01-15T17:20:00')
  },
  {
    id: 18,
    name: 'Thomas Wright',
    email: 't.wright@gamedev.studio',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NEGOTIATING,
    company: 'Game Development Studio',
    position: 'Game Engine Architect',
    active: true,
    lastContact: new Date('2024-01-15T14:25:00')
  },
  {
    id: 19,
    name: 'Maria Garcia',
    email: 'm.garcia@mlops.ai',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CONTACTED,
    company: 'MLOps Solutions',
    position: 'ML Operations Lead',
    active: false,
    lastContact: new Date('2024-01-15T11:50:00')
  },
  {
    id: 20,
    name: 'Kevin Chang',
    email: 'k.chang@quantum.computing',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NURTURING,
    company: 'Quantum Computing Labs',
    position: 'Quantum Algorithm Researcher',
    active: true,
    lastContact: new Date('2024-01-15T16:15:00')
  },
  {
    id: 21,
    name: 'Laura Wilson',
    email: 'l.wilson@cybersecurity.net',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.QUALIFIED,
    company: 'Cybersecurity Experts',
    position: 'Security Operations Manager',
    active: true,
    lastContact: new Date('2024-01-15T13:45:00')
  },
  {
    id: 22,
    name: 'Samuel Kim',
    email: 's.kim@robotics.tech',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CLOSED_WON,
    company: 'Robotics Innovation',
    position: 'Automation Director',
    active: false,
    lastContact: new Date('2024-01-15T10:30:00')
  },
  {
    id: 23,
    name: 'Isabella Chen',
    email: 'i.chen@bioinfo.science',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.ENGAGED,
    company: 'Bioinformatics Research',
    position: 'Computational Biology Lead',
    active: true,
    lastContact: new Date('2024-01-15T15:40:00')
  },
  {
    id: 24,
    name: 'Oliver Brown',
    email: 'o.brown@vr.technology',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NEW,
    company: 'VR Technology Solutions',
    position: 'VR Experience Director',
    active: false,
    lastContact: new Date('2024-01-15T12:25:00')
  },
  {
    id: 25,
    name: 'Sophie Martin',
    email: 's.martin@blockchain.tech',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NEGOTIATING,
    company: 'Blockchain Technology',
    position: 'DeFi Solutions Architect',
    active: true,
    lastContact: new Date('2024-01-15T17:10:00')
  },
  {
    id: 26,
    name: 'William Lee',
    email: 'w.lee@iot.solutions',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.QUALIFIED,
    company: 'IoT Solutions Group',
    position: 'Connected Devices Lead',
    active: true,
    lastContact: new Date('2024-01-15T14:35:00')
  },
  {
    id: 27,
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@edtech.solutions',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CONTACTED,
    company: 'EdTech Solutions',
    position: 'Learning Systems Architect',
    active: false,
    lastContact: new Date('2024-01-15T11:20:00')
  },
  {
    id: 28,
    name: 'Andrew Zhang',
    email: 'a.zhang@fintech.solutions',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.NURTURING,
    company: 'FinTech Innovations',
    position: 'Payment Systems Director',
    active: true,
    lastContact: new Date('2024-01-15T16:55:00')
  },
  {
    id: 29,
    name: 'Grace Wang',
    email: 'g.wang@healthtech.solutions',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.CLOSED_LOST,
    company: 'HealthTech Innovations',
    position: 'Medical Systems Lead',
    active: false,
    lastContact: new Date('2024-01-15T13:15:00')
  },
  {
    id: 30,
    name: 'Robert Taylor',
    email: 'r.taylor@devops.solutions',
    avatar: '/src/assets/user-avatar.svg',
    stage: WORKFLOW_STAGES.ENGAGED,
    company: 'DevOps Solutions',
    position: 'Infrastructure Architect',
    active: true,
    lastContact: new Date('2024-01-15T10:50:00')
  }
])

// 搜索和分页
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 5
const selectedLeads = ref<number[]>([])

// 搜索结果
const filteredLeads = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return leads.value.filter(lead => 
    lead.name.toLowerCase().includes(query) ||
    lead.email.toLowerCase().includes(query) ||
    lead.company.toLowerCase().includes(query)
  )
})

// 分页计算
const totalPages = computed(() => Math.ceil(filteredLeads.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => Math.min(startIndex.value + pageSize, filteredLeads.value.length))

// 当前页数据
const paginatedLeads = computed(() => {
  return filteredLeads.value.slice(startIndex.value, endIndex.value)
})

// 生成页码数组
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []
  
  // 显示当前页附近的页码和首尾页
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || // 第一页
      i === total || // 最后一页
      (i >= current - 1 && i <= current + 1) // 当前页及其前后页
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== -1) {
      // 添加省略号标记
      pages.push(-1)
    }
  }
  
  return pages
})

// 监听搜索，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
})

// 批量选择
const isAllSelected = computed(() => {
  return paginatedLeads.value.length > 0 && 
    paginatedLeads.value.every(lead => selectedLeads.value.includes(lead.id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedLeads.value = selectedLeads.value.filter(
      id => !paginatedLeads.value.find(lead => lead.id === id)
    )
  } else {
    const currentPageIds = paginatedLeads.value.map(lead => lead.id)
    selectedLeads.value = [...new Set([...selectedLeads.value, ...currentPageIds])]
  }
}

// 工作流阶段样式
const getStageClass = (stage: WorkflowStage): string => {
  const classes = {
    [WORKFLOW_STAGES.NEW]: 'bg-blue-100 text-blue-800',
    [WORKFLOW_STAGES.CONTACTED]: 'bg-yellow-100 text-yellow-800',
    [WORKFLOW_STAGES.ENGAGED]: 'bg-indigo-100 text-indigo-800',
    [WORKFLOW_STAGES.QUALIFIED]: 'bg-green-100 text-green-800',
    [WORKFLOW_STAGES.NURTURING]: 'bg-primary-light text-primary',
    [WORKFLOW_STAGES.NEGOTIATING]: 'bg-orange-100 text-orange-800',
    [WORKFLOW_STAGES.CLOSED_WON]: 'bg-emerald-100 text-emerald-800',
    [WORKFLOW_STAGES.CLOSED_LOST]: 'bg-gray-100 text-gray-800'
  }
  return classes[stage] || 'bg-gray-100 text-gray-800'
}

// 判断是否处于活跃状态
const isActive = (stage: WorkflowStage): boolean => {
  const activeStages = [
    WORKFLOW_STAGES.ENGAGED,
    WORKFLOW_STAGES.QUALIFIED,
    WORKFLOW_STAGES.NURTURING,
    WORKFLOW_STAGES.NEGOTIATING,
    WORKFLOW_STAGES.CONTACTED
  ]
  return activeStages.includes(stage)
}

// 更新日期格式化函数
const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // 如果是今天的日期，只显示时间
  if (days === 0) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(date)
  }

  // 如果是最近7天内的日期，显示周几和时间
  if (days < 7) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date)
  }

  // 其他情况显示月日和时间
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

// 详情面板相关
const showDetailsPanel = ref(false)
const selectedLead = ref<Lead | null>(null)

// 添加打开和关闭详情面板的方法
const openLeadDetails = (lead: Lead) => {
  selectedLead.value = enrichLeadData(lead)
  showDetailsPanel.value = true
}

const closeLeadDetails = () => {
  showDetailsPanel.value = false
  selectedLead.value = null
}

// 添加数据丰富方法
const enrichLeadData = (lead: Lead) => {
  // 根据行业和职位推断使用的技术栈
  const techStackMap = {
    'AI Innovations': ['Python', 'TensorFlow', 'React'],
    'Cloud Solutions Pro': ['AWS', 'Docker', 'Node'],
    'DevOps Cloud': ['Docker', 'Jenkins', 'Node'],
    'Blockchain Solutions': ['React', 'Node', 'Vue'],
    'EdTech Innovations': ['React', 'Node', 'Vue'],
    'FinTech Solutions': ['React', 'Node', 'Vue'],
    'GameDev Studio': ['React', 'Node', 'Vue'],
    'HealthTech Systems': ['React', 'Node', 'Vue'],
    'IoT Technologies': ['React', 'Node', 'Vue'],
    'MLOps Solutions': ['Python', 'TensorFlow', 'React'],
    'Quantum Technologies': ['Python', 'React', 'Node'],
    'Robotics Innovation': ['Python', 'React', 'Node'],
    'VR Systems': ['React', 'Node', 'Vue']
  }

  // 根据公司规模推断融资阶段和收入
  const companyScaleMap = {
    small: {
      headcount: '10-50',
      fundingStage: 'Seed',
      revenue: '$1-5M'
    },
    medium: {
      headcount: '51-200',
      fundingStage: 'Series A',
      revenue: '$5-20M'
    },
    large: {
      headcount: '201-500',
      fundingStage: 'Series B',
      revenue: '$20-50M'
    }
  }

  // 根据邮箱域名生成公司网站
  const website = `https://${lead.email.split('@')[1]}`

  // 生成社交媒体链接
  const generateSocialLinks = (name: string) => {
    const formattedName = name.toLowerCase().replace(' ', '')
    return {
      linkedin: `https://linkedin.com/in/${formattedName}`,
      twitter: `https://twitter.com/${formattedName}`
    }
  }

  // 根据职位生成兴趣和洞察
  const generateInterestsAndInsights = (position: string) => {
    const positionMap = {
      'CTO': {
        interests: 'Tech Architecture, Cloud Computing, Team Leadership',
        insights: 'Looking for scalable cloud solutions'
      },
      'CEO': {
        interests: 'Business Strategy, Leadership, Innovation',
        insights: 'Exploring new market opportunities'
      },
      'Engineering Manager': {
        interests: 'Software Development, Team Management, Agile',
        insights: 'Building high-performance engineering teams'
      },
      'Product Manager': {
        interests: 'Product Strategy, UX Design, Market Research',
        insights: 'Seeking user feedback and analytics tools'
      },
      'Director': {
        interests: 'Strategic Planning, Operations, Growth',
        insights: 'Optimizing operational efficiency'
      }
    }

    const defaultInterests = 'Technology, Innovation, Professional Growth'
    const defaultInsights = 'Exploring industry solutions'

    const roleType = Object.keys(positionMap).find(role => position.includes(role))
    return roleType ? positionMap[roleType] : { interests: defaultInterests, insights: defaultInsights }
  }

  // 生成完整的详细信息
  const companySize = lead.id % 3 === 0 ? 'large' : lead.id % 2 === 0 ? 'medium' : 'small'
  const companyInfo = companyScaleMap[companySize]
  const socialLinks = generateSocialLinks(lead.name)
  const { interests, insights } = generateInterestsAndInsights(lead.position)
  const techStack = techStackMap[lead.company] || ['React', 'Node', 'Vue']

  const techStackColors = {
    'React': 'bg-blue-100',
    'Node': 'bg-green-100',
    'Vue': 'bg-emerald-100',
    'Python': 'bg-yellow-100',
    'TensorFlow': 'bg-orange-100',
    'Docker': 'bg-blue-100',
    'Jenkins': 'bg-red-100',
    'AWS': 'bg-orange-100'
  }

  return {
    ...lead,
    location: 'San Francisco, CA',
    linkedin: socialLinks.linkedin,
    twitter: socialLinks.twitter,
    interests,
    insights,
    companyInfo: {
      ...companyInfo,
      website
    },
    techStack: techStack.map(tech => ({
      name: tech,
      icon: `/src/assets/tech/${tech.toLowerCase()}.svg`,
      bgColor: techStackColors[tech] || 'bg-gray-100'
    })),
    active: isActive(lead.stage)
  }
}
</script>

<style scoped>
/* 添加样式确保下拉菜单显示在最上层 */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

/* 搜索框的层级 */
.relative input {
  z-index: 10;
}

/* 下拉菜单的层级要高于搜索框 */
.absolute.z-50 {
  z-index: 50;
}
</style> 