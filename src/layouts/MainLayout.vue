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
          <span class="text-xl font-bold transition-opacity duration-300" :class="{ 'opacity-0 w-0': isCollapsed }">Skyline</span>
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
      <TopStatusBar v-if="!hideTopStatusBar" />
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import TopStatusBar from '@/components/TopStatusBar.vue'
import SideNav from '@/components/SideNav.vue'

const route = useRoute()
const hideTopStatusBar = computed(() => {
  return route.name === 'chat' || route.name === 'lead-detail'
})

// 从本地存储获取初始状态，如果没有则默认为展开状态
const isCollapsed = ref(localStorage.getItem('sideNavCollapsed') === 'true')

// 监听状态变化并保存到本地存储
watch(isCollapsed, (newValue) => {
  localStorage.setItem('sideNavCollapsed', newValue.toString())
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script> 