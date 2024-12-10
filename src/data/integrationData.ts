export type IntegrationStatus = 'connected' | 'not_connected' | 'coming_soon'

export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  status: IntegrationStatus
  hasConfig?: boolean
}

export const integrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Used to chat with Artisans and receive notifications.',
    icon: '@/assets/integrations/slack.svg',
    status: 'connected'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Used to export engaged leads to your CRM.',
    icon: '@/assets/integrations/hubspot.svg',
    status: 'connected',
    hasConfig: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Used to export engaged leads to your CRM.',
    icon: '@/assets/integrations/salesforce.svg',
    status: 'not_connected'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Used to send LinkedIn connection requests and messages.',
    icon: '@/assets/integrations/linkedin.svg',
    status: 'coming_soon'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect your Artisan to 1000s of apps.',
    icon: '@/assets/integrations/zapier.svg',
    status: 'coming_soon'
  }
]

export const getIntegrationById = (id: string): Integration | undefined => {
  return integrations.find(integration => integration.id === id)
}

export const updateIntegrationStatus = (id: string, status: IntegrationStatus) => {
  const integration = integrations.find(i => i.id === id)
  if (integration) {
    integration.status = status
  }
} 