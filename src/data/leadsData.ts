// 工作流阶段定义
export const WORKFLOW_STAGES = {
  NEW: 'New Lead',          // 新线索，初始状态
  CONTACTED: 'Contacted',   // 已联系，等待响应
  ENGAGED: 'Engaged',       // 已回应，正在互动
  QUALIFIED: 'Qualified',   // 已确认有效，符合目标客户
  NURTURING: 'Nurturing',   // 培育中，持续跟进
  NEGOTIATING: 'Negotiating', // 谈判中，深入商谈
  CLOSED_WON: 'Closed Won', // 已成交
  CLOSED_LOST: 'Closed Lost' // 已流失
} as const

export type WorkflowStage = typeof WORKFLOW_STAGES[keyof typeof WORKFLOW_STAGES]

// 基础 Lead 类型定义
export interface Lead {
  id: number
  name: string
  email: string
  avatar: string
  position: string
  company: string
  phone: string
  location: string
  linkedin?: string
  twitter?: string
  about: string
  stage: WorkflowStage
  active: boolean
  lastContact: Date
  companyInfo: CompanyInfo
  notes: Note[]
  emails: Email[]
  interests: string
  insights: string
  techStack: TechStack[]
}

// 公司信息类型定义
export interface CompanyInfo {
  headcount: string
  industry: string
  revenue: string
  website: string
  fundingStage?: string
}

// 笔记类型定义
export interface Note {
  id: number
  author: {
    name: string
    avatar: string
  }
  date: string
  content: string
}

// 邮件类型定义
export interface Email {
  id: number
  subject: string
  date: string
  status: string
  preview: string
}

// 技术栈类型定义
export interface TechStack {
  name: string
  icon: string
  bgColor: string
}

// 技术栈映射
export const techStackMap: Record<string, string[]> = {
  'AI Innovations': ['Python', 'TensorFlow', 'React'],
  'Cloud Solutions Pro': ['AWS', 'Docker', 'Node'],
  'DevOps Cloud': ['Docker', 'Jenkins', 'Node'],
  'Blockchain Solutions': ['React', 'Node', 'Vue'],
  'EdTech Innovations': ['React', 'Node', 'Vue'],
  'FinTech Solutions': ['React', 'Node', 'Vue'],
  'GameDev Studio': ['React', 'Node', 'Vue'],
  'HealthTech Systems': ['React', 'Node', 'Vue'],
  'IoT Technologies': ['React', 'Node', 'Vue'],
  'MLOps Solutions': ['Python', 'TensorFlow', 'React'],
  'Quantum Technologies': ['Python', 'React', 'Node'],
  'Robotics Innovation': ['Python', 'React', 'Node'],
  'VR Systems': ['React', 'Node', 'Vue']
}

// 技术栈颜色映射
export const techStackColors: Record<string, string> = {
  'React': 'bg-blue-100',
  'Node': 'bg-green-100',
  'Vue': 'bg-emerald-100',
  'Python': 'bg-yellow-100',
  'TensorFlow': 'bg-orange-100',
  'Docker': 'bg-blue-100',
  'Jenkins': 'bg-red-100',
  'AWS': 'bg-orange-100'
}

// 公司规模映射
export const companyScaleMap = {
  small: {
    headcount: '10-50',
    fundingStage: 'Seed',
    revenue: '$1-5M'
  },
  medium: {
    headcount: '51-200',
    fundingStage: 'Series A',
    revenue: '$5-20M'
  },
  large: {
    headcount: '201-500',
    fundingStage: 'Series B',
    revenue: '$20-50M'
  }
}

// 职位映射
export const positionMap: Record<string, { interests: string, insights: string }> = {
  CTO: {
    interests: 'Technical architecture, scalability, innovation',
    insights: 'Focus on technical benefits and ROI'
  },
  VP: {
    interests: 'Team management, process optimization, strategic planning',
    insights: 'Focus on operational efficiency and team productivity'
  },
  Director: {
    interests: 'Department growth, resource allocation, leadership',
    insights: 'Focus on departmental goals and team development'
  },
  Engineer: {
    interests: 'Technical skills, problem solving, coding practices',
    insights: 'Focus on technical implementation and best practices'
  },
  Researcher: {
    interests: 'Innovation, academic collaboration, cutting-edge technology',
    insights: 'Focus on research applications and industry trends'
  },
  Lead: {
    interests: 'Team leadership, technical direction, mentoring',
    insights: 'Focus on team technical growth and project success'
  }
}

// 工作流阶段样式映射
export const stageStyleMap: Record<WorkflowStage, string> = {
  [WORKFLOW_STAGES.NEW]: 'bg-blue-100 text-blue-800',
  [WORKFLOW_STAGES.CONTACTED]: 'bg-yellow-100 text-yellow-800',
  [WORKFLOW_STAGES.ENGAGED]: 'bg-indigo-100 text-indigo-800',
  [WORKFLOW_STAGES.QUALIFIED]: 'bg-green-100 text-green-800',
  [WORKFLOW_STAGES.NURTURING]: 'bg-purple-100 text-purple-800',
  [WORKFLOW_STAGES.NEGOTIATING]: 'bg-orange-100 text-orange-800',
  [WORKFLOW_STAGES.CLOSED_WON]: 'bg-emerald-100 text-emerald-800',
  [WORKFLOW_STAGES.CLOSED_LOST]: 'bg-gray-100 text-gray-800'
}

// Leads 数据
export const leads: Lead[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    position: 'Chief Technology Officer',
    company: 'TechCorp Inc.',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: 'https://twitter.com/sarahchen',
    about: 'Sarah is a seasoned technology leader with over 15 years of experience in building scalable systems.',
    stage: WORKFLOW_STAGES.QUALIFIED,
    active: true,
    lastContact: new Date('2024-01-15T09:30:00'),
    companyInfo: {
      headcount: '1,000-5,000 employees',
      industry: 'Technology',
      revenue: '$50M - $100M',
      website: 'https://techcorp.com'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: 'Yesterday at 2:30 PM',
        content: 'Had a great initial call. Very interested in our enterprise solution.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Follow-up: Product Demo Discussion',
        date: 'Today at 10:30 AM',
        status: 'sent',
        preview: 'Thank you for your time yesterday. As discussed, I\'m attaching the detailed proposal...'
      }
    ],
    interests: 'Technical architecture, scalability, innovation',
    insights: 'Focus on technical benefits and ROI',
    techStack: [
      {
        name: 'React',
        icon: '/src/assets/tech/react.svg',
        bgColor: 'bg-blue-100'
      },
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      },
      {
        name: 'Vue',
        icon: '/src/assets/tech/vue.svg',
        bgColor: 'bg-emerald-100'
      }
    ]
  },
  {
    id: 2,
    name: 'Michael Johnson',
    email: 'm.johnson@innovatelabs.io',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
    position: 'VP of Engineering',
    company: 'Innovation Labs',
    phone: '+1 (555) 234-5678',
    location: 'Boston, MA',
    linkedin: 'https://linkedin.com/in/mjohnson',
    twitter: 'https://twitter.com/mjohnson',
    about: 'Michael leads the engineering team at Innovation Labs, focusing on cutting-edge software solutions.',
    stage: WORKFLOW_STAGES.NEW,
    active: false,
    lastContact: new Date('2024-01-15T14:15:00'),
    companyInfo: {
      headcount: '100-500 employees',
      industry: 'Software Development',
      revenue: '$10M - $20M',
      website: 'https://innovatelabs.io'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'David Lee',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '3 days ago',
        content: 'Discussed potential partnership opportunities for AI integration.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Partnership Proposal',
        date: '2 days ago',
        status: 'sent',
        preview: 'Following up on our discussion about AI integration partnership...'
      }
    ],
    interests: 'Team management, process optimization, strategic planning',
    insights: 'Focus on operational efficiency and team productivity',
    techStack: [
      {
        name: 'React',
        icon: '/src/assets/tech/react.svg',
        bgColor: 'bg-blue-100'
      },
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      },
      {
        name: 'Vue',
        icon: '/src/assets/tech/vue.svg',
        bgColor: 'bg-emerald-100'
      }
    ]
  },
  {
    id: 3,
    name: 'Rachel Thompson',
    email: 'r.thompson@aimedical.io',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    position: 'Head of AI Research',
    company: 'AI Medical Solutions',
    phone: '+1 (555) 345-6789',
    location: 'Boston, MA',
    linkedin: 'https://linkedin.com/in/rachelthompson',
    twitter: 'https://twitter.com/rachelthompson',
    about: 'Rachel leads AI research in medical imaging and diagnostic solutions.',
    stage: WORKFLOW_STAGES.ENGAGED,
    active: true,
    lastContact: new Date('2024-01-14T10:30:00'),
    companyInfo: {
      headcount: '50-100 employees',
      industry: 'Healthcare Technology',
      revenue: '$5M - $10M',
      website: 'https://aimedical.io'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'David Lee',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '2 days ago',
        content: 'Demonstrated strong interest in our AI diagnostic tools.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'AI Integration Proposal',
        date: 'Yesterday',
        status: 'sent',
        preview: 'Following up on our discussion about AI medical imaging integration...'
      }
    ],
    interests: 'Healthcare AI, Medical Imaging, Research Collaboration',
    insights: 'Seeking advanced AI solutions for medical diagnostics',
    techStack: [
      {
        name: 'Python',
        icon: '/src/assets/tech/python.svg',
        bgColor: 'bg-yellow-100'
      },
      {
        name: 'TensorFlow',
        icon: '/src/assets/tech/tensorflow.svg',
        bgColor: 'bg-orange-100'
      }
    ]
  },
  {
    id: 4,
    name: 'Daniel Park',
    email: 'd.park@fintech.co',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    position: 'CTO',
    company: 'FinTech Solutions',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    linkedin: 'https://linkedin.com/in/danielpark',
    twitter: 'https://twitter.com/danielpark',
    about: 'Daniel leads technological innovation in financial services.',
    stage: WORKFLOW_STAGES.QUALIFIED,
    active: true,
    lastContact: new Date('2024-01-13T15:45:00'),
    companyInfo: {
      headcount: '100-500 employees',
      industry: 'Financial Technology',
      revenue: '$20M - $50M',
      website: 'https://fintech.co'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '3 days ago',
        content: 'Very interested in our payment processing solutions.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Payment Integration Discussion',
        date: '2 days ago',
        status: 'sent',
        preview: 'Here are the technical specifications for the payment integration...'
      }
    ],
    interests: 'Fintech Innovation, Blockchain, Security',
    insights: 'Looking for secure payment processing solutions',
    techStack: [
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      },
      {
        name: 'React',
        icon: '/src/assets/tech/react.svg',
        bgColor: 'bg-blue-100'
      }
    ]
  },
  {
    id: 5,
    name: 'Emma Wilson',
    email: 'emma.w@edtech.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    position: 'Product Director',
    company: 'EdTech Innovations',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    linkedin: 'https://linkedin.com/in/emmawilson',
    twitter: 'https://twitter.com/emmawilson',
    about: 'Emma specializes in educational technology and learning platforms.',
    stage: WORKFLOW_STAGES.NURTURING,
    active: true,
    lastContact: new Date('2024-01-12T11:20:00'),
    companyInfo: {
      headcount: '50-100 employees',
      industry: 'Education Technology',
      revenue: '$5M - $10M',
      website: 'https://edtech.edu'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '4 days ago',
        content: 'Discussed potential integration with their learning management system.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'LMS Integration Proposal',
        date: '3 days ago',
        status: 'sent',
        preview: 'Regarding the integration with your learning management system...'
      }
    ],
    interests: 'EdTech, Learning Analytics, Student Engagement',
    insights: 'Seeking ways to improve student engagement through AI',
    techStack: [
      {
        name: 'Vue',
        icon: '/src/assets/tech/vue.svg',
        bgColor: 'bg-emerald-100'
      },
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      }
    ]
  },
  {
    id: 6,
    name: 'Marcus Brown',
    email: 'm.brown@devops.cloud',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=face',
    position: 'DevOps Lead',
    company: 'DevOps Cloud',
    phone: '+1 (555) 678-9012',
    location: 'Seattle, WA',
    linkedin: 'https://linkedin.com/in/marcusbrown',
    twitter: 'https://twitter.com/marcusbrown',
    about: 'Marcus specializes in cloud infrastructure and DevOps automation.',
    stage: WORKFLOW_STAGES.CONTACTED,
    active: true,
    lastContact: new Date('2024-01-11T14:15:00'),
    companyInfo: {
      headcount: '10-50 employees',
      industry: 'Cloud Computing',
      revenue: '$1M - $5M',
      website: 'https://devops.cloud'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
        },
        date: '5 days ago',
        content: 'Interested in our CI/CD pipeline solutions.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'DevOps Automation Discussion',
        date: '4 days ago',
        status: 'sent',
        preview: 'Here\'s our proposal for automating your deployment pipeline...'
      }
    ],
    interests: 'DevOps, Cloud Architecture, Automation',
    insights: 'Looking to improve deployment efficiency',
    techStack: [
      {
        name: 'Docker',
        icon: '/src/assets/tech/docker.svg',
        bgColor: 'bg-blue-100'
      },
      {
        name: 'Jenkins',
        icon: '/src/assets/tech/jenkins.svg',
        bgColor: 'bg-red-100'
      }
    ]
  },
  {
    id: 7,
    name: 'Sophia Lee',
    email: 's.lee@blockchain.io',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    position: 'Blockchain Architect',
    company: 'Blockchain Solutions',
    phone: '+1 (555) 789-0123',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sophialee',
    twitter: 'https://twitter.com/sophialee',
    about: 'Sophia leads blockchain implementation and smart contract development.',
    stage: WORKFLOW_STAGES.NEW,
    active: true,
    lastContact: new Date('2024-01-10T16:30:00'),
    companyInfo: {
      headcount: '10-50 employees',
      industry: 'Blockchain',
      revenue: '$1M - $5M',
      website: 'https://blockchain.io'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'David Lee',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '6 days ago',
        content: 'Initial discussion about blockchain integration needs.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Blockchain Integration',
        date: '5 days ago',
        status: 'sent',
        preview: 'Following up on our discussion about blockchain integration...'
      }
    ],
    interests: 'Blockchain, Smart Contracts, DeFi',
    insights: 'Exploring blockchain solutions for supply chain',
    techStack: [
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      },
      {
        name: 'React',
        icon: '/src/assets/tech/react.svg',
        bgColor: 'bg-blue-100'
      }
    ]
  },
  {
    id: 8,
    name: 'Ryan Martinez',
    email: 'r.martinez@gamedev.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    position: 'Game Development Lead',
    company: 'GameDev Studio',
    phone: '+1 (555) 890-1234',
    location: 'Los Angeles, CA',
    linkedin: 'https://linkedin.com/in/ryanmartinez',
    twitter: 'https://twitter.com/ryanmartinez',
    about: 'Ryan specializes in game development and real-time graphics.',
    stage: WORKFLOW_STAGES.NEGOTIATING,
    active: true,
    lastContact: new Date('2024-01-09T13:45:00'),
    companyInfo: {
      headcount: '50-100 employees',
      industry: 'Gaming',
      revenue: '$5M - $10M',
      website: 'https://gamedev.com'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '7 days ago',
        content: 'Discussed integration of our AI NPCs in their game engine.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Game AI Integration',
        date: '6 days ago',
        status: 'sent',
        preview: 'Here\'s the technical specification for the AI NPC integration...'
      }
    ],
    interests: 'Game Development, AI NPCs, Real-time Graphics',
    insights: 'Looking for advanced AI solutions for NPCs',
    techStack: [
      {
        name: 'Python',
        icon: '/src/assets/tech/python.svg',
        bgColor: 'bg-yellow-100'
      },
      {
        name: 'TensorFlow',
        icon: '/src/assets/tech/tensorflow.svg',
        bgColor: 'bg-orange-100'
      }
    ]
  },
  {
    id: 9,
    name: 'Jessica Taylor',
    email: 'j.taylor@healthtech.care',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    position: 'Healthcare Solutions Director',
    company: 'HealthTech Systems',
    phone: '+1 (555) 901-2345',
    location: 'Houston, TX',
    linkedin: 'https://linkedin.com/in/jessicataylor',
    twitter: 'https://twitter.com/jessicataylor',
    about: 'Jessica leads healthcare technology solutions and integrations.',
    stage: WORKFLOW_STAGES.CLOSED_WON,
    active: false,
    lastContact: new Date('2024-01-08T09:15:00'),
    companyInfo: {
      headcount: '100-500 employees',
      industry: 'Healthcare Technology',
      revenue: '$20M - $50M',
      website: 'https://healthtech.care'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '8 days ago',
        content: 'Successfully implemented our solution in their system.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Implementation Success',
        date: '7 days ago',
        status: 'sent',
        preview: 'Congratulations on the successful implementation...'
      }
    ],
    interests: 'Healthcare Integration, Patient Care, Data Security',
    insights: 'Successfully implemented our healthcare solutions',
    techStack: [
      {
        name: 'React',
        icon: '/src/assets/tech/react.svg',
        bgColor: 'bg-blue-100'
      },
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      }
    ]
  },
  {
    id: 10,
    name: 'Kevin Zhang',
    email: 'k.zhang@iot.tech',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    position: 'IoT Solutions Architect',
    company: 'IoT Technologies',
    phone: '+1 (555) 012-3456',
    location: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/kevinzhang',
    twitter: 'https://twitter.com/kevinzhang',
    about: 'Kevin specializes in IoT solutions and embedded systems.',
    stage: WORKFLOW_STAGES.CLOSED_LOST,
    active: false,
    lastContact: new Date('2024-01-07T14:20:00'),
    companyInfo: {
      headcount: '10-50 employees',
      industry: 'Internet of Things',
      revenue: '$1M - $5M',
      website: 'https://iot.tech'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
        },
        date: '9 days ago',
        content: 'Decided to go with a different solution.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Follow-up Discussion',
        date: '8 days ago',
        status: 'sent',
        preview: 'Thank you for considering our IoT solutions...'
      }
    ],
    interests: 'IoT, Embedded Systems, Edge Computing',
    insights: 'Chose a different IoT solution provider',
    techStack: [
      {
        name: 'Python',
        icon: '/src/assets/tech/python.svg',
        bgColor: 'bg-yellow-100'
      },
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      }
    ]
  },
  {
    id: 11,
    name: 'Amanda White',
    email: 'a.white@mlops.ai',
    avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=100&h=100&fit=crop&crop=face',
    position: 'ML Operations Lead',
    company: 'MLOps Solutions',
    phone: '+1 (555) 123-4567',
    location: 'Portland, OR',
    linkedin: 'https://linkedin.com/in/amandawhite',
    twitter: 'https://twitter.com/amandawhite',
    about: 'Amanda leads machine learning operations and deployment strategies.',
    stage: WORKFLOW_STAGES.ENGAGED,
    active: true,
    lastContact: new Date('2024-01-06T11:30:00'),
    companyInfo: {
      headcount: '50-100 employees',
      industry: 'Machine Learning',
      revenue: '$5M - $10M',
      website: 'https://mlops.ai'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'David Lee',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '10 days ago',
        content: 'Exploring our ML model deployment solutions.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'ML Pipeline Integration',
        date: '9 days ago',
        status: 'sent',
        preview: 'Regarding the integration of our ML pipeline solution...'
      }
    ],
    interests: 'MLOps, Model Deployment, Pipeline Automation',
    insights: 'Seeking efficient ML model deployment solutions',
    techStack: [
      {
        name: 'Python',
        icon: '/src/assets/tech/python.svg',
        bgColor: 'bg-yellow-100'
      },
      {
        name: 'TensorFlow',
        icon: '/src/assets/tech/tensorflow.svg',
        bgColor: 'bg-orange-100'
      }
    ]
  },
  {
    id: 12,
    name: 'Thomas Anderson',
    email: 't.anderson@vr.systems',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
    position: 'VR Development Director',
    company: 'VR Systems',
    phone: '+1 (555) 234-5678',
    location: 'Denver, CO',
    linkedin: 'https://linkedin.com/in/thomasanderson',
    twitter: 'https://twitter.com/thomasanderson',
    about: 'Thomas specializes in virtual reality development and immersive experiences.',
    stage: WORKFLOW_STAGES.QUALIFIED,
    active: true,
    lastContact: new Date('2024-01-05T15:45:00'),
    companyInfo: {
      headcount: '10-50 employees',
      industry: 'Virtual Reality',
      revenue: '$1M - $5M',
      website: 'https://vr.systems'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '11 days ago',
        content: 'Interested in integrating our AI solutions in VR environments.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'VR Integration Proposal',
        date: '10 days ago',
        status: 'sent',
        preview: 'Here\'s our proposal for AI integration in VR environments...'
      }
    ],
    interests: 'Virtual Reality, Immersive Tech, AI Integration',
    insights: 'Looking to enhance VR experiences with AI',
    techStack: [
      {
        name: 'React',
        icon: '/src/assets/tech/react.svg',
        bgColor: 'bg-blue-100'
      },
      {
        name: 'Node',
        icon: '/src/assets/tech/node.svg',
        bgColor: 'bg-green-100'
      }
    ]
  }
]

// 辅助函数
export const getLeadById = (id: number): Lead | undefined => {
  return leads.find(lead => lead.id === id)
}

export const enrichLeadData = (lead: Lead) => {
  const companySize = lead.id % 3 === 0 ? 'large' : lead.id % 2 === 0 ? 'medium' : 'small'
  const companyInfo = companyScaleMap[companySize]
  const techStack = techStackMap[lead.company] || ['React', 'Node', 'Vue']

  return {
    ...lead,
    companyInfo: {
      ...lead.companyInfo,
      ...companyInfo
    },
    techStack: techStack.map(tech => ({
      name: tech,
      icon: `/src/assets/tech/${tech.toLowerCase()}.svg`,
      bgColor: techStackColors[tech] || 'bg-gray-100'
    }))
  }
}
export const isActive = (stage: WorkflowStage): boolean => {
  return ![WORKFLOW_STAGES.CLOSED_LOST, WORKFLOW_STAGES.CLOSED_WON].includes(stage as "Closed Lost" | "Closed Won")
}

export const getStageClass = (stage: WorkflowStage): string => {
  return stageStyleMap[stage]
} 