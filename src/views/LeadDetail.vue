<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 返回按钮 -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <button 
        @click="router.back()" 
        class="flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Leads
      </button>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="lead" class="bg-white rounded-lg shadow">
        <!-- 个人信息卡片 -->
        <div class="p-6">
          <div class="flex items-start space-x-6">
            <img :src="lead.avatar" alt="Lead avatar" class="w-24 h-24 rounded-lg object-cover" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ lead.name }}</h2>
                  <p class="text-sm text-gray-500">{{ lead.position }} at {{ lead.company }}</p>
                </div>
                <div class="flex items-center space-x-4">
                  <button 
                    @click="handleComposeEmail"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Compose Email
                  </button>
                  <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Edit
                  </button>
                </div>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Email</p>
                  <p class="mt-1">{{ lead.email }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Phone</p>
                  <p class="mt-1">{{ lead.phone }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Location</p>
                  <p class="mt-1">{{ lead.location }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Social</p>
                  <div class="mt-1 flex space-x-3">
                    <a v-if="lead.linkedin" :href="lead.linkedin" target="_blank" class="text-gray-400 hover:text-gray-500">
                      <span class="sr-only">LinkedIn</span>
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd" />
                      </svg>
                    </a>
                    <a v-if="lead.twitter" :href="lead.twitter" target="_blank" class="text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Twitter</span>
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 切换部分 -->
        <div class="border-t border-gray-200">
          <div class="px-6">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.name"
                @click="currentTab = tab.id"
                :class="[
                  currentTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ tab.name }}
                <span
                  v-if="tab.count"
                  :class="[
                    currentTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-900',
                    'ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium'
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Tab 内容 -->
          <div class="p-6">
            <!-- About Tab -->
            <div v-if="currentTab === 'about'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">About</h3>
                <p class="mt-2 text-gray-600">{{ lead.about }}</p>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Company Information</h3>
                <dl class="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ lead.company }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Industry</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ lead.companyInfo?.industry }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Company Size</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ lead.companyInfo?.headcount }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Website</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      <a :href="lead.companyInfo?.website" target="_blank" class="text-primary hover:text-primary-dark">
                        {{ lead.companyInfo?.website }}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Notes Tab -->
            <div v-if="currentTab === 'notes'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Notes</h3>
                <button class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Add Note
                </button>
              </div>
              <div class="space-y-4">
                <div v-for="note in lead.notes" :key="note.id" class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center space-x-2">
                      <img :src="note.author.avatar" alt="" class="h-8 w-8 rounded-full" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ note.author.name }}</p>
                        <p class="text-xs text-gray-500">{{ note.date }}</p>
                      </div>
                    </div>
                    <button class="text-gray-400 hover:text-gray-500">
                      <span class="sr-only">Edit note</span>
                      <PencilIcon class="h-4 w-4" />
                    </button>
                  </div>
                  <p class="mt-2 text-sm text-gray-600">{{ note.content }}</p>
                </div>
              </div>
            </div>

            <!-- Emails Tab -->
            <div v-if="currentTab === 'emails'" class="space-y-6">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900">Email History</h3>
              </div>
              <div class="space-y-4">
                <div v-if="showEmailComposer" class="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <div class="space-y-4">
                    <div>
                      <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        v-model="newEmail.subject"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Enter email subject"
                      />
                    </div>
                    <div>
                      <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        id="message"
                        v-model="newEmail.message"
                        rows="4"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        placeholder="Write your message..."
                      ></textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                      <button 
                        @click="showEmailComposer = false"
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Cancel
                      </button>
                      <button 
                        @click="sendEmail"
                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
                <div v-for="email in lead.emails" :key="email.id" class="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div class="p-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="text-base font-medium text-gray-900">{{ email.subject }}</h4>
                        <p class="mt-1 text-sm text-gray-500">{{ email.date }}</p>
                      </div>
                      <span :class="[
                        email.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                      ]">
                        {{ email.status }}
                      </span>
                    </div>
                    <p class="mt-2 text-sm text-gray-600">{{ email.preview }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PencilIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// Tab 配置
const tabs = [
  { id: 'about', name: 'About' },
  { id: 'notes', name: 'Notes', count: '3' },
  { id: 'emails', name: 'Emails', count: '12' }
]

const currentTab = ref('about')
const lead = ref(null)
const showEmailComposer = ref(false)
const newEmail = ref({
  subject: '',
  message: ''
})

// 处理撰写���件
const handleComposeEmail = () => {
  currentTab.value = 'emails'
  showEmailComposer.value = true
}

// 发送邮件
const sendEmail = () => {
  // TODO: 实现发送邮件的逻辑
  lead.value.emails.unshift({
    id: Date.now(),
    subject: newEmail.value.subject,
    date: 'Just now',
    status: 'sent',
    preview: newEmail.value.message
  })
  
  // 重置表单
  newEmail.value = {
    subject: '',
    message: ''
  }
  showEmailComposer.value = false
}

// 模拟数据库中的leads数据
const leadsData = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    position: 'Chief Technology Officer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: 'https://twitter.com/sarahchen',
    about: 'Sarah is a seasoned technology leader with over 15 years of experience in building scalable systems.',
    phone: '+1 (555) 123-4567',
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
      },
      {
        id: 2,
        author: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '2 days ago',
        content: 'Following up on pricing discussion. They need custom quote for their specific requirements.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Follow-up: Product Demo Discussion',
        date: 'Today at 10:30 AM',
        status: 'sent',
        preview: 'Thank you for your time yesterday. As discussed, I\'m attaching the detailed proposal...'
      },
      {
        id: 2,
        subject: 'Re: Integration Questions',
        date: 'Yesterday at 4:15 PM',
        status: 'draft',
        preview: 'I\'ve consulted with our technical team regarding your integration concerns...'
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
    location: 'Boston, MA',
    linkedin: 'https://linkedin.com/in/mjohnson',
    twitter: 'https://twitter.com/mjohnson',
    about: 'Michael leads the engineering team at Innovation Labs, focusing on cutting-edge software solutions.',
    phone: '+1 (555) 234-5678',
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
    ]
  },
  {
    id: 3,
    name: 'Emily Wang',
    email: 'emily.w@dataflow.ai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    position: 'Head of AI Research',
    company: 'DataFlow Systems',
    location: 'Seattle, WA',
    linkedin: 'https://linkedin.com/in/emilywang',
    twitter: 'https://twitter.com/emilywang',
    about: 'Emily is leading groundbreaking research in artificial intelligence and machine learning applications.',
    phone: '+1 (555) 345-6789',
    companyInfo: {
      headcount: '50-100 employees',
      industry: 'Artificial Intelligence',
      revenue: '$5M - $10M',
      website: 'https://dataflow.ai'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
        },
        date: '1 week ago',
        content: 'Impressive demo of their latest ML models. High potential for collaboration.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'ML Model Integration Proposal',
        date: '3 days ago',
        status: 'sent',
        preview: 'Based on our discussion, I\'ve outlined the integration approach...'
      }
    ]
  },
  {
    id: 4,
    name: 'David Miller',
    email: 'david.miller@cloudtech.dev',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    position: 'Solutions Architect',
    company: 'Cloud Solutions Pro',
    location: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/davidmiller',
    twitter: 'https://twitter.com/davidmiller',
    about: 'David specializes in cloud architecture and infrastructure optimization.',
    phone: '+1 (555) 456-7890',
    companyInfo: {
      headcount: '10-50 employees',
      industry: 'Cloud Computing',
      revenue: '$1M - $5M',
      website: 'https://cloudtech.dev'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '5 days ago',
        content: 'Interested in our cloud optimization services. Setting up follow-up demo.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Cloud Assessment Proposal',
        date: '4 days ago',
        status: 'sent',
        preview: 'Here\'s the detailed assessment plan we discussed...'
      }
    ]
  },
  {
    id: 5,
    name: 'Lisa Zhang',
    email: 'l.zhang@aiinnovate.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    position: 'Machine Learning Lead',
    company: 'AI Innovations',
    location: 'New York, NY',
    linkedin: 'https://linkedin.com/in/lisazhang',
    twitter: 'https://twitter.com/lisazhang',
    about: 'Lisa leads the machine learning team, focusing on computer vision applications.',
    phone: '+1 (555) 567-8901',
    companyInfo: {
      headcount: '100-500 employees',
      industry: 'Artificial Intelligence',
      revenue: '$20M - $50M',
      website: 'https://aiinnovate.com'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '2 weeks ago',
        content: 'Exploring partnership opportunities in computer vision projects.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'CV Project Collaboration',
        date: '1 week ago',
        status: 'sent',
        preview: 'Regarding our discussion about the computer vision collaboration...'
      }
    ]
  },
  {
    id: 6,
    name: 'James Wilson',
    email: 'j.wilson@quantumtech.net',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    position: 'Quantum Computing Researcher',
    company: 'Quantum Technologies',
    location: 'Cambridge, MA',
    linkedin: 'https://linkedin.com/in/jameswilson',
    twitter: 'https://twitter.com/jameswilson',
    about: 'James is pioneering research in quantum computing applications.',
    phone: '+1 (555) 678-9012',
    companyInfo: {
      headcount: '50-100 employees',
      industry: 'Quantum Computing',
      revenue: '$5M - $10M',
      website: 'https://quantumtech.net'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'David Lee',
          avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '3 weeks ago',
        content: 'Exploring quantum computing applications in our platform.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Quantum Computing Integration',
        date: '2 weeks ago',
        status: 'sent',
        preview: 'Following up on our quantum computing integration discussion...'
      }
    ]
  },
  {
    id: 7,
    name: 'Sofia Rodriguez',
    email: 'sofia@cybersec.io',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    position: 'Security Director',
    company: 'CyberSec Solutions',
    location: 'Miami, FL',
    linkedin: 'https://linkedin.com/in/sofiarodriguez',
    twitter: 'https://twitter.com/sofiarodriguez',
    about: 'Sofia leads cybersecurity initiatives and threat prevention strategies.',
    phone: '+1 (555) 789-0123',
    companyInfo: {
      headcount: '100-500 employees',
      industry: 'Cybersecurity',
      revenue: '$20M - $50M',
      website: 'https://cybersec.io'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '1 month ago',
        content: 'Discussed security integration requirements and compliance needs.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Security Assessment Report',
        date: '3 weeks ago',
        status: 'sent',
        preview: 'I\'ve attached our detailed security assessment findings...'
      }
    ]
  },
  {
    id: 8,
    name: 'Alex Kim',
    email: 'alex.kim@robotics.co',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    position: 'Robotics Engineer',
    company: 'Advanced Robotics',
    location: 'San Jose, CA',
    linkedin: 'https://linkedin.com/in/alexkim',
    twitter: 'https://twitter.com/alexkim',
    about: 'Alex specializes in robotics automation and computer vision integration.',
    phone: '+1 (555) 890-1234',
    companyInfo: {
      headcount: '100-500 employees',
      industry: 'Robotics',
      revenue: '$15M - $30M',
      website: 'https://robotics.co'
    },
    notes: [
      {
        id: 1,
        author: {
          name: 'Maria Garcia',
          avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        date: '2 months ago',
        content: 'Exploring robotics automation integration possibilities.'
      }
    ],
    emails: [
      {
        id: 1,
        subject: 'Robotics Integration Proposal',
        date: '1 month ago',
        status: 'sent',
        preview: 'Based on our discussion about robotics integration...'
      }
    ]
  }
]

onMounted(async () => {
  // 根据路由参数获取对应的lead数据
  const leadId = Number(route.params.id)
  lead.value = leadsData.find(l => l.id === leadId) || null

  // 如果没有找到对应的lead数据，重定向到leads列表页
  if (!lead.value) {
    router.push('/leads')
  }
})
</script> 