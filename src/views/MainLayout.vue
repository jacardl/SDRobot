<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 左侧导航 -->
    <nav 
      class="bg-white border-r border-gray-200 transition-all duration-300"
      :class="isCollapsed ? 'w-16' : 'w-64'"
    >
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center space-x-2" :class="{ 'justify-center': isCollapsed }">
          <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-8" />
          <span class="text-xl font-bold transition-opacity duration-300" :class="{ 'opacity-0 w-0': isCollapsed }">SDRobot</span>
        </div>
        <button 
          @click="toggleCollapse" 
          class="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          :class="{ 'rotate-180': isCollapsed }"
          :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div class="mt-6">
        <SideNav :collapsed="isCollapsed" />
      </div>
    </nav>

    <!-- 右侧内容区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopStatusBar v-if="!hideTopStatusBar">
        <!-- 语言选择器 -->
        <div class="flex items-center ml-4">
          <select 
            v-model="locale" 
            class="form-select rounded-md border-gray-300 text-sm focus:border-primary focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </TopStatusBar>
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TopStatusBar from '@/components/TopStatusBar.vue'
import SideNav from '@/components/SideNav.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { locale } = useI18n()

// 隐藏顶部状态栏的页面
const hideTopStatusBar = computed(() => {
  return route.name === 'chat' || route.name === 'lead-detail'
})

// 侧边栏折叠状态
const isCollapsed = ref(localStorage.getItem('sideNavCollapsed') === 'true')

// 监听折叠状态变化
watch(isCollapsed, (newValue) => {
  localStorage.setItem('sideNavCollapsed', newValue.toString())
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 用户菜单相关
const showUserMenu = ref(false)
const userAvatar = 'https://ui-avatars.com/api/?name=User'

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
  showUserMenu.value = false
}
</script> 