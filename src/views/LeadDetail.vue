<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- 个人信息卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-start justify-between">
        <!-- 左侧头像和基本信息 -->
        <div class="flex items-start space-x-4">
          <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img :src="lead.avatar" :alt="lead.name" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">{{ lead.name }}</h1>
            <p class="text-lg text-gray-600">{{ lead.position }} at {{ lead.company }}</p>
            <p class="text-purple-600 mt-1">{{ lead.email }}</p>
            <div class="flex items-center text-gray-500 mt-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ lead.location }}</span>
            </div>
          </div>
        </div>
        <!-- 右侧社交媒体链接 -->
        <div class="flex space-x-3">
          <a v-if="lead.linkedin" :href="lead.linkedin" target="_blank" class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a v-if="lead.twitter" :href="lead.twitter" target="_blank" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- About Person 卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About {{ lead.name.split(' ')[0] }}</h2>
      <div class="grid grid-cols-2 gap-6">
        <!-- 兴趣爱好 -->
        <div>
          <div class="flex items-center mb-3">
            <h3 class="text-gray-600">Interests</h3>
            <span class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">Scraped from X</span>
          </div>
          <p class="text-gray-700">{{ lead.interests }}</p>
        </div>
        <!-- 洞察 -->
        <div>
          <div class="flex items-center mb-3">
            <h3 class="text-gray-600">Insights</h3>
            <span class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">Scraped from LinkedIn</span>
          </div>
          <p class="text-gray-700">{{ lead.insights }}</p>
        </div>
      </div>
    </div>

    <!-- About Company 卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About {{ lead.company }}</h2>
      <div class="grid grid-cols-4 gap-6">
        <div>
          <h3 class="text-purple-600 mb-2">Headcount</h3>
          <p class="text-gray-700 text-lg">{{ lead.companyInfo.headcount }}</p>
        </div>
        <div>
          <h3 class="text-purple-600 mb-2">Funding Stage</h3>
          <p class="text-gray-700 text-lg">{{ lead.companyInfo.fundingStage }}</p>
        </div>
        <div>
          <h3 class="text-purple-600 mb-2">Revenue</h3>
          <p class="text-gray-700 text-lg">{{ lead.companyInfo.revenue }}</p>
        </div>
        <div>
          <h3 class="text-purple-600 mb-2">Website</h3>
          <a :href="lead.companyInfo.website" target="_blank" class="text-blue-600 hover:underline text-lg">
            {{ lead.companyInfo.website.replace('https://', '') }}
          </a>
        </div>
      </div>
    </div>

    <!-- Tech Stack 卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Tech Stack</h2>
      <div class="flex space-x-4">
        <div v-for="tech in lead.techStack" :key="tech.name" 
             class="w-12 h-12 rounded-lg flex items-center justify-center"
             :class="tech.bgColor">
          <img :src="tech.icon" :alt="tech.name" class="w-8 h-8" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 示例数据
const lead = ref({
  name: 'Dennis Jackson',
  position: 'CTO',
  company: 'Pinkus',
  email: 'dennis@pinkus.com',
  location: 'London, United Kingdom',
  avatar: '/src/assets/user-avatar.svg',
  linkedin: 'https://linkedin.com/in/dennisjackson',
  twitter: 'https://twitter.com/dennisjackson',
  interests: 'Tech, AI, Management',
  insights: 'Looking for 3rd party marketing services',
  companyInfo: {
    headcount: '250+',
    fundingStage: 'Series A',
    revenue: '$10-20M',
    website: 'https://pinkus.com'
  },
  techStack: [
    {
      name: 'Bootstrap',
      icon: '/src/assets/tech/bootstrap.svg',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Swift',
      icon: '/src/assets/tech/swift.svg',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Vue',
      icon: '/src/assets/tech/vue.svg',
      bgColor: 'bg-green-100'
    }
  ]
})
</script> 