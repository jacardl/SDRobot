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
      
      <div class="mt-6">
        <router-link 
          v-for="item in menuItems" 
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
    </nav>

    <!-- 右侧内容区 -->
    <div class="flex-1 overflow-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
  InboxIcon,
  MegaphoneIcon,
  ClockIcon,
  EnvelopeIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Chat with JJ', path: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Integrations', path: '/integrations', icon: PuzzlePieceIcon },
  { name: 'Leads', path: '/leads', icon: UserGroupIcon },
  { 
    name: 'Inbox', 
    path: '/inbox', 
    icon: InboxIcon,
    badge: '120'
  },
  { name: 'Campaigns', path: '/campaigns', icon: MegaphoneIcon },
  { 
    name: 'Pending Approval', 
    path: '/pending-approval', 
    icon: ClockIcon,
    badge: '120'
  },
  { name: 'Mailboxes', path: '/mailboxes', icon: EnvelopeIcon },
  { name: 'Analytics', path: '/analytics', icon: ChartBarIcon }
]

const isCurrentRoute = (path: string): boolean => {
  return route.path === path
}
</script> 