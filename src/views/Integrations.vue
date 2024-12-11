<template>
  <div class="p-4 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Integrations</h1>
        <p class="mt-1 text-sm text-gray-500">Import data to and export data from Artisan.</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        <IntegrationCard
          v-for="integration in integrations"
          :key="integration.id"
          :integration="integration"
          @connect="handleConnect"
          @disconnect="handleDisconnect"
          @configure="handleConfigure"
        />
      </div>
    </div>

    <!-- 配置抽屉 -->
    <TransitionRoot as="template" :show="showConfigDrawer">
      <Dialog as="div" class="relative z-50" @close="showConfigDrawer = false">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div class="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                    <div class="px-4 sm:px-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-base sm:text-lg font-medium text-gray-900">
                          {{ selectedIntegration?.name }} Configuration
                        </DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            @click="showConfigDrawer = false"
                          >
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="relative mt-6 flex-1 px-4 sm:px-6">
                      <!-- 配置内容 -->
                      <div v-if="selectedIntegration?.id === 'hubspot'" class="space-y-6">
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Sync Frequency</label>
                          <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                            <option>Real-time</option>
                            <option>Every hour</option>
                            <option>Every day</option>
                            <option>Every week</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700">Lead Status Mapping</label>
                          <div class="mt-2 space-y-4">
                            <div v-for="status in ['New Lead', 'Contacted', 'Qualified']" :key="status" class="flex items-center space-x-2">
                              <span class="min-w-[80px] text-sm text-gray-500">{{ status }}</span>
                              <select class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                                <option>New</option>
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Qualified</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div class="flex justify-end space-x-3">
                          <button
                            type="button"
                            class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            @click="showConfigDrawer = false"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            class="inline-flex justify-center rounded-md border border-transparent bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            @click="saveConfig"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import IntegrationCard from '@/components/IntegrationCard.vue'
import { integrations, type Integration, updateIntegrationStatus } from '@/data/integrationData'

const showConfigDrawer = ref(false)
const selectedIntegration = ref<Integration | null>(null)

const handleConnect = async (integration: Integration) => {
  try {
    // TODO: 实现实际的连接逻辑
    console.log('Connecting to', integration.name)
    updateIntegrationStatus(integration.id, 'connected')
  } catch (error) {
    console.error('Failed to connect:', error)
  }
}

const handleDisconnect = async (integration: Integration) => {
  try {
    // TODO: 实现实际的断开连接逻辑
    console.log('Disconnecting from', integration.name)
    updateIntegrationStatus(integration.id, 'not_connected')
  } catch (error) {
    console.error('Failed to disconnect:', error)
  }
}

const handleConfigure = (integration: Integration) => {
  selectedIntegration.value = integration
  showConfigDrawer.value = true
}

const saveConfig = async () => {
  try {
    // TODO: 实现实际的配置保存逻辑
    console.log('Saving configuration for', selectedIntegration.value?.name)
    showConfigDrawer.value = false
  } catch (error) {
    console.error('Failed to save configuration:', error)
  }
}
</script> 