import slackIcon from '@/assets/integrations/slack.svg'
import hubspotIcon from '@/assets/integrations/hubspot.svg'
import salesforceIcon from '@/assets/integrations/salesforce.svg'
import linkedinIcon from '@/assets/integrations/linkedin.svg'
import zapierIcon from '@/assets/integrations/zapier.svg'

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
    description: 'Used to chat with SDRobot and receive notifications.',
    icon: slackIcon,
    status: 'connected'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Used to export engaged leads to your CRM.',
    icon: hubspotIcon,
    status: 'connected',
    hasConfig: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Used to export engaged leads to your CRM.',
    icon: salesforceIcon,
    status: 'not_connected'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Used to send LinkedIn connection requests and messages.',
    icon: linkedinIcon,
    status: 'coming_soon'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect your SDRobot to 1000s of apps.',
    icon: zapierIcon,
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