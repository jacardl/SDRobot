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
          v-for="(page, index) in paginationButtons" 
          :key="index"
          class="min-w-[32px] px-2 py-1 border rounded-md"
          :class="[
            typeof page === 'string' ? 'border-transparent cursor-default' : 'hover:bg-gray-50',
            page === currentPage ? 'bg-primary text-white border-primary' : 'text-gray-700'
          ]"
          @click="typeof page === 'number' && (currentPage = page)"
          :disabled="typeof page === 'string'"
        >
          {{ page }}
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
      :lead="{
        ...selectedLead,
        location: selectedLead.location || '',
        companyInfo: {
          headcount: selectedLead.companyInfo?.headcount || '',
          fundingStage: selectedLead.companyInfo?.fundingStage || '',
          revenue: '',
          website: '',
          industry: selectedLead.companyInfo?.industry || ''
        }
      }"
      :show="showDetailsPanel" 
      @close="closeLeadDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import LeadDetailsPanel from '../components/LeadDetailsPanel.vue'
import { useRouter } from 'vue-router'
import { 
  type Lead, 
  type WorkflowStage,
  WORKFLOW_STAGES,
  leads as leadsData,
  getStageClass,
  enrichLeadData
} from '@/data/leadsData'

// 搜索和分页
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10
const selectedLeads = ref<number[]>([])
const leads = ref<Lead[]>(leadsData)

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

// 生成分页按钮数组
const paginationButtons = computed(() => {
  const buttons: (number | string)[] = []
  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)
  
  let startPage = Math.max(1, currentPage.value - halfVisible)
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  // 添加第一页
  if (startPage > 1) {
    buttons.push(1)
    if (startPage > 2) buttons.push('...')
  }
  
  // 添加中间页码
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(i)
  }
  
  // 添加最后页
  if (endPage < totalPages.value) {
    if (endPage < totalPages.value - 1) buttons.push('...')
    buttons.push(totalPages.value)
  }
  
  return buttons
})

// 当前页数据
const paginatedLeads = computed(() => {
  return filteredLeads.value.slice(startIndex.value, endIndex.value)
})

// 全选状态
const isAllSelected = computed(() => {
  return paginatedLeads.value.length > 0 && 
    paginatedLeads.value.every(lead => selectedLeads.value.includes(lead.id))
})

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedLeads.value = selectedLeads.value.filter(
      id => !paginatedLeads.value.some(lead => lead.id === id)
    )
  } else {
    const newSelectedLeads = new Set(selectedLeads.value)
    paginatedLeads.value.forEach(lead => newSelectedLeads.add(lead.id))
    selectedLeads.value = Array.from(newSelectedLeads)
  }
}

// 日期格式化
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
}

const router = useRouter()
const showDetailsPanel = ref(false)
const selectedLead = ref<Lead | null>(null)

// 打开 lead 详情
const openLeadDetails = (lead: Lead) => {
  router.push(`/leads/${lead.id}`)
}

// 关闭 lead 详情
const closeLeadDetails = () => {
  showDetailsPanel.value = false
  selectedLead.value = null
}

// 监听搜索，重置分页
watch(searchQuery, () => {
  currentPage.value = 1
})
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