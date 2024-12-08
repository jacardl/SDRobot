<template>
  <div class="p-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Leads (1202)</h1>
        <p class="text-sm text-gray-500">All leads found by JJ and uploaded by you.</p>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="mb-6">
      <div class="relative">
        <input
          type="text"
          placeholder="Search by name, company or email..."
          class="w-full input pl-10"
          v-model="searchQuery"
        />
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
      </div>
    </div>

    <!-- Leads 列表 -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-8 py-3 pl-4">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                />
              </th>
              <th
                v-for="header in tableHeaders"
                :key="header.key"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header.label }}
                <ChevronUpDownIcon v-if="header.sortable" class="h-4 w-4 inline-block ml-1" />
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="lead in filteredLeads"
              :key="lead.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="openLeadDetails(lead)"
            >
              <td class="py-4 pl-4">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary focus:ring-primary"
                  v-model="selectedLeads"
                  :value="lead.id"
                  @click.stop
                />
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center">
                  <img
                    :src="lead.avatar"
                    :alt="lead.name"
                    class="h-10 w-10 rounded-full"
                  />
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">{{ lead.name }}</div>
                    <div class="text-gray-500">{{ lead.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-primary rounded-full h-2"
                    :style="{ width: lead.progress + '%' }"
                  ></div>
                </div>
              </td>
              <td class="px-4 py-4 text-gray-500">{{ lead.company }}</td>
              <td class="px-4 py-4 text-gray-500">{{ lead.lastActivity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center">
          <button class="btn text-gray-600 disabled:opacity-50" disabled>
            Previous
          </button>
          <div class="mx-4 flex items-center space-x-1">
            <button
              v-for="page in 10"
              :key="page"
              class="px-3 py-1 rounded-md"
              :class="page === currentPage ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ page }}
            </button>
          </div>
          <button class="btn text-gray-600">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Lead 详情面板 -->
  <LeadDetailsPanel
    :is-open="isDetailsPanelOpen"
    :lead="selectedLead"
    @close="closeLeadDetails"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'
import LeadDetailsPanel from '@components/LeadDetailsPanel.vue'

// 表格头部配置
const tableHeaders = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'progress', label: 'Workflow Stage', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'lastActivity', label: 'Last Activity', sortable: true }
]

// 模拟数据
const leads = ref([
  {
    id: 1,
    name: 'Aisha Patel',
    email: 'aisha.patel@techworld.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    progress: 60,
    company: 'TechWorld',
    lastActivity: '2h ago',
    title: 'CTO',
    location: 'San Francisco, USA',
    interests: ['Tech', 'AI', 'Management'],
    insights: 'Looking for 3rd party marketing services',
    companySize: '250+',
    funding: 'Series A',
    revenue: '$10-20M',
    website: 'techworld.com',
    techStack: ['react', 'node', 'aws']
  }
])

// 状态管理
const searchQuery = ref('')
const selectedLeads = ref<number[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const isDetailsPanelOpen = ref(false)
const selectedLead = ref<any>(null)

// 计算属性
const filteredLeads = computed(() => {
  return leads.value.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 方法
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedLeads.value = filteredLeads.value.map(lead => lead.id)
  } else {
    selectedLeads.value = []
  }
}

const openLeadDetails = (lead: any) => {
  selectedLead.value = lead
  isDetailsPanelOpen.value = true
}

const closeLeadDetails = () => {
  isDetailsPanelOpen.value = false
  selectedLead.value = null
}
</script> 