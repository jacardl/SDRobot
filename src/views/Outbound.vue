<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Outbound</h1>
      <p class="mt-2 text-gray-600">Manage your outbound campaigns and sequences</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 gap-6">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Total Sequences</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900">24</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Active Campaigns</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900">12</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Response Rate</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900">32%</p>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Active Sequences</h2>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-for="i in 5" :key="i" class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Enterprise Follow-up Sequence</h3>
                <p class="mt-1 text-sm text-gray-500">Last updated 2 hours ago</p>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑将在这里添加
</script> 