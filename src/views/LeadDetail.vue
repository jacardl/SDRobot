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
import { 
  type Lead,
  getLeadById,
  enrichLeadData,
  getStageClass
} from '@/data/leadsData'

const router = useRouter()
const route = useRoute()
const lead = ref<Lead | null>(null)

// Tab 配置
const tabs = [
  { id: 'about', name: 'About' },
  { id: 'notes', name: 'Notes', count: '3' },
  { id: 'emails', name: 'Emails', count: '12' }
]

const currentTab = ref('about')
const showEmailComposer = ref(false)
const newEmail = ref({
  subject: '',
  message: ''
})

// 处理撰写邮件
const handleComposeEmail = () => {
  currentTab.value = 'emails'
  showEmailComposer.value = true
}

// 发送邮件
const sendEmail = () => {
  if (!lead.value) return
  
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

// 加载 lead 数据
onMounted(() => {
  const leadId = Number(route.params.id)
  const foundLead = getLeadById(leadId)
  if (foundLead) {
    lead.value = enrichLeadData(foundLead)
  } else {
    router.push('/leads')
  }
})
</script> 