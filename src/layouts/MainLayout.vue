<template>
  <div class="flex h-screen bg-gray-50">
    <!-- 左侧导航 -->
    <nav class="w-64 bg-white border-r border-gray-200">
      <div class="p-4">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-8" />
          <span class="text-xl font-bold">SDRobot</span>
        </div>
      </div>
      
      <div class="mt-6 space-y-4">
        <!-- 主要导航项 -->
        <div class="space-y-1">
          <router-link 
            v-for="item in mainMenuItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
            :class="{ 'bg-primary/10 text-primary': isCurrentRoute(item.path) }"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>

        <!-- Outbound 分组 -->
        <div class="pt-4">
          <div class="px-4 py-2">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {{ t('nav.outbound') }}
            </h3>
          </div>
          <div class="space-y-1">
            <router-link 
              v-for="item in outboundMenuItems" 
              :key="item.path"
              :to="item.path"
              class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
              :class="{ 'bg-primary/10 text-primary': isCurrentRoute(item.path) }"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              <span>{{ item.name }}</span>
              <span 
                v-if="item.badge" 
                class="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {{ item.badge }}
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 右侧内容区 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部状态栏 -->
      <TopStatusBar />

      <!-- 主要内容区域 -->
      <div class="flex-1 overflow-auto">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import TopStatusBar from '@/components/TopStatusBar.vue'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  InboxIcon,
  MegaphoneIcon,
  ClockIcon,
  EnvelopeIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  LanguageIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { t, locale } = useI18n()

const userName = ref('John Doe')

// 主要导航项
const mainMenuItems = computed(() => [
  { name: t('nav.dashboard'), path: '/', icon: HomeIcon },
  { name: t('nav.chat'), path: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: t('nav.integrations'), path: '/integrations', icon: PuzzlePieceIcon },
  { name: t('nav.leads'), path: '/leads', icon: UserGroupIcon },
])

// Outbound 分组导航项
const outboundMenuItems = computed(() => [
  { 
    name: t('nav.inbox'), 
    path: '/inbox', 
    icon: InboxIcon,
    badge: '120'
  },
  { 
    name: t('nav.campaigns'), 
    path: '/campaigns', 
    icon: MegaphoneIcon 
  },
  { 
    name: t('nav.pendingApproval'), 
    path: '/pending-approval', 
    icon: ClockIcon,
    badge: '120'
  },
  { 
    name: t('nav.mailboxes'), 
    path: '/mailboxes', 
    icon: EnvelopeIcon 
  },
  { 
    name: t('nav.analytics'), 
    path: '/analytics', 
    icon: ChartBarIcon 
  }
])

const isCurrentRoute = (path: string): boolean => {
  return route.path === path
}

// 工具栏功能
const showHelp = () => {
  // 实现帮助中心功能
  console.log('Show help center')
}

const showSettings = () => {
  // 实现设置中心功能
  console.log('Show settings')
}

const changeLanguage = (lang: string) => {
  locale.value = lang
}

const showProfile = () => {
  // 实现个人资料功能
  console.log('Show profile')
}

const logout = () => {
  // 实现登出功能
  console.log('Logout')
}
</script> 