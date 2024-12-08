<template>
  <div 
    class="fixed inset-y-0 right-0 w-[600px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col"
    :class="{ 'translate-x-0': show, 'translate-x-full': !show }"
  >
    <!-- 顶部栏 -->
    <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-xl font-semibold text-gray-900">Lead Details</h2>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-500"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="lead" class="p-6 space-y-6">
        <!-- 基本信息 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center space-x-4">
            <img :src="lead.avatar" :alt="lead.name" class="h-16 w-16 rounded-full" />
            <div class="flex-1">
              <h3 class="text-xl font-medium text-gray-900">{{ lead.name }}</h3>
              <p class="text-base text-gray-600">{{ lead.position }} at {{ lead.company }}</p>
              <p class="text-purple-600 mt-1">{{ lead.email }}</p>
              <div class="flex items-center text-gray-500 mt-1">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ lead.location }}</span>
              </div>
            </div>
            <div class="flex space-x-3">
              <a v-if="lead.linkedin" :href="lead.linkedin" target="_blank" 
                 class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a v-if="lead.twitter" :href="lead.twitter" target="_blank" 
                 class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- About Person -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">About {{ lead.name.split(' ')[0] }}</h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="flex items-center mb-3">
                <h3 class="text-gray-600">Interests</h3>
                <span class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">Scraped from X</span>
              </div>
              <p class="text-gray-700">{{ lead.interests }}</p>
            </div>
            <div>
              <div class="flex items-center mb-3">
                <h3 class="text-gray-600">Insights</h3>
                <span class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">Scraped from LinkedIn</span>
              </div>
              <p class="text-gray-700">{{ lead.insights }}</p>
            </div>
          </div>
        </div>

        <!-- About Company -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">About {{ lead.company }}</h2>
          <div class="grid grid-cols-4 gap-6">
            <div>
              <h3 class="text-purple-600 mb-2">Headcount</h3>
              <p class="text-gray-700 text-lg">{{ lead.companyInfo.headcount }}</p>
            </div>
            <div>
              <h3 class="text-purple-600 mb-2">Funding Stage</h3>
              <p class="text-gray-700 text-lg">{{ lead.companyInfo.fundingStage }}</p>
            </div>
            <div>
              <h3 class="text-purple-600 mb-2">Revenue</h3>
              <p class="text-gray-700 text-lg">{{ lead.companyInfo.revenue }}</p>
            </div>
            <div>
              <h3 class="text-purple-600 mb-2">Website</h3>
              <a :href="lead.companyInfo.website" target="_blank" class="text-blue-600 hover:underline text-lg">
                {{ lead.companyInfo.website.replace('https://', '') }}
              </a>
            </div>
          </div>
        </div>

        <!-- Tech Stack -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Tech Stack</h2>
          <div class="flex flex-wrap gap-4">
            <div v-for="tech in lead.techStack" :key="tech.name" 
                 class="w-16 h-16 rounded-lg flex flex-col items-center justify-center"
                 :class="tech.bgColor">
              <img :src="tech.icon" :alt="tech.name" class="w-10 h-10" />
              <span class="text-xs text-gray-600 mt-1">{{ tech.name }}</span>
            </div>
          </div>
        </div>

        <!-- Workflow Stage -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
          <div class="flex items-center justify-between">
            <div>
              <span class="px-3 py-1 text-sm rounded-full" :class="getStageClass(lead.stage)">
                {{ lead.stage }}
              </span>
            </div>
            <div class="flex items-center">
              <div class="h-3 w-3 rounded-full mr-2" :class="lead.active ? 'bg-green-500' : 'bg-gray-300'"></div>
              <span class="text-sm text-gray-600">{{ lead.active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TechStack {
  name: string
  icon: string
  bgColor: string
}

interface CompanyInfo {
  headcount: string
  fundingStage: string
  revenue: string
  website: string
}

interface Lead {
  id: number
  name: string
  email: string
  avatar: string
  position: string
  company: string
  location: string
  linkedin?: string
  twitter?: string
  interests: string
  insights: string
  companyInfo: CompanyInfo
  techStack: TechStack[]
  stage: string
  active: boolean
}

const props = defineProps<{
  lead: Lead
  show: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

// 工作流阶段样式
const getStageClass = (stage: string): string => {
  const classes = {
    'New Lead': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Engaged': 'bg-indigo-100 text-indigo-800',
    'Qualified': 'bg-green-100 text-green-800',
    'Nurturing': 'bg-purple-100 text-purple-800',
    'Negotiating': 'bg-orange-100 text-orange-800',
    'Closed Won': 'bg-emerald-100 text-emerald-800',
    'Closed Lost': 'bg-gray-100 text-gray-800'
  }
  return classes[stage] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style> 