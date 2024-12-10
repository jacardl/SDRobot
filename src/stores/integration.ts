import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Integration, IntegrationStatus } from '@/data/integrationData'
import { integrations as defaultIntegrations } from '@/data/integrationData'

export const useIntegrationStore = defineStore('integration', () => {
  const integrations = ref<Integration[]>(defaultIntegrations)

  const updateStatus = (id: string, status: IntegrationStatus) => {
    const integration = integrations.value.find(i => i.id === id)
    if (integration) {
      integration.status = status
    }
  }

  const getById = (id: string): Integration | undefined => {
    return integrations.value.find(integration => integration.id === id)
  }

  return {
    integrations,
    updateStatus,
    getById
  }
}) 