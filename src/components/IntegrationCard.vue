<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
      <div class="flex items-start space-x-3 sm:space-x-4">
        <img :src="integration.icon" :alt="integration.name" class="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
        <div class="min-w-0">
          <h3 class="text-base sm:text-lg font-medium text-gray-900 truncate">{{ integration.name }}</h3>
          <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ integration.description }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2 sm:flex-shrink-0">
        <button 
          v-if="integration.hasConfig && integration.status === 'connected'"
          class="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
          @click="$emit('configure', integration)"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          v-if="integration.status === 'connected'"
          class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          @click="$emit('disconnect', integration)"
        >
          <span class="hidden sm:inline">Disconnect</span>
          <span class="sm:hidden">×</span>
        </button>
        <button 
          v-else-if="integration.status === 'not_connected'"
          class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap"
          @click="$emit('connect', integration)"
        >
          <span class="hidden sm:inline">+ Connect</span>
          <span class="sm:hidden">+</span>
        </button>
        <span 
          v-else
          class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-gray-50 cursor-not-allowed whitespace-nowrap"
        >
          <span class="hidden sm:inline">Coming Soon</span>
          <span class="sm:hidden">Soon</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Integration } from '@/data/integrationData'

defineProps<{
  integration: Integration
}>()

defineEmits<{
  (e: 'connect', integration: Integration): void
  (e: 'disconnect', integration: Integration): void
  (e: 'configure', integration: Integration): void
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 