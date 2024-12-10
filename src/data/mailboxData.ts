export interface Mailbox {
  email: string
  capacity: number
  enabled: boolean
  status: 'Healthy' | 'Warning' | 'Urgent Issues'
  health: number // 0-100
}

// 默认邮箱数据
export const defaultMailboxes: Mailbox[] = [
  {
    email: 'jaspar@sdrobot.com',
    capacity: 75,
    enabled: true,
    status: 'Urgent Issues',
    health: 60
  },
  {
    email: 'jasparcarjack@sdrobot.com',
    capacity: 70,
    enabled: true,
    status: 'Warning',
    health: 75
  },
  {
    email: 'jasparcj@sdrobot.com',
    capacity: 75,
    enabled: true,
    status: 'Healthy',
    health: 90
  }
]

// 健康度阈值
export const healthThresholds = {
  healthy: 80,
  warning: 60
}

// 获取状态基于健康度
export function getStatusFromHealth(health: number): Mailbox['status'] {
  if (health >= healthThresholds.healthy) return 'Healthy'
  if (health >= healthThresholds.warning) return 'Warning'
  return 'Urgent Issues'
}

// 创建新邮箱的默认值
export function createDefaultMailbox(email: string): Mailbox {
  return {
    email,
    capacity: 75,
    enabled: true,
    status: 'Healthy',
    health: 90
  }
} 