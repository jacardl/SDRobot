<template>
  <div>
    <!-- 主要导航项 -->
    <div class="space-y-1">
      <router-link 
        v-for="item in mainMenuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 group"
        :class="{ 'bg-primary/10 text-primary': isCurrentRoute(item.path) }"
      >
        <component :is="item.icon" class="h-5 w-5" :class="collapsed ? '' : 'mr-3'" />
        <span 
          class="transition-opacity duration-300"
          :class="{ 'opacity-0 w-0 hidden': collapsed }"
        >
          {{ item.name }}
        </span>
        <div 
          v-if="collapsed"
          class="fixed left-16 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
        >
          {{ item.name }}
        </div>
      </router-link>
    </div>

    <!-- Outbound 分组 -->
    <div class="pt-4">
      <div 
        class="px-4 py-2"
        :class="{ 'text-center': collapsed }"
      >
        <h3 
          class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          :class="{ 'opacity-0 w-0 hidden': collapsed }"
        >
          {{ t('nav.outbound') }}
        </h3>
      </div>
      <div class="space-y-1">
        <router-link 
          v-for="item in outboundMenuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 group"
          :class="{ 'bg-primary/10 text-primary': isCurrentRoute(item.path) }"
        >
          <component :is="item.icon" class="h-5 w-5" :class="collapsed ? '' : 'mr-3'" />
          <span 
            class="transition-opacity duration-300"
            :class="{ 'opacity-0 w-0 hidden': collapsed }"
          >
            {{ item.name }}
          </span>
          <span 
            v-if="item.badge && !collapsed" 
            class="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
          >
            {{ item.badge }}
          </span>
          <div 
            v-if="collapsed"
            class="fixed left-16 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
          >
            {{ item.name }}
            <span v-if="item.badge" class="ml-2 bg-gray-700 px-1.5 py-0.5 rounded-full text-xs">
              {{ item.badge }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const { t } = useI18n()

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
</script> 