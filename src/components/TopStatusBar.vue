<template>
  <div class="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative z-10">
    <!-- 左侧和中间区域合并为可点击区域，使用搜索框样式 -->
    <router-link 
      to="/chat" 
      class="flex items-center flex-1 mr-8 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer group max-w-[600px]"
    >
      <!-- 左侧欢迎区域 -->
      <div class="flex items-center">
        <img class="h-8 w-8 rounded-full" src="@/assets/jj-avatar.svg" alt="JJ Avatar" />
        <span class="ml-2 text-gray-700 group-hover:text-gray-900">{{ t('toolbar.greeting') }}</span>
      </div>

      <!-- 填充空间 -->
      <div class="flex-1"></div>

      <!-- 右侧提示文字和箭头 -->
      <div class="flex items-center space-x-2">
        <span class="text-gray-700 group-hover:text-gray-900">{{ t('toolbar.askMe') }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fill-rule="evenodd" 
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
            clip-rule="evenodd" 
          />
        </svg>
      </div>
    </router-link>

    <!-- 右侧统计信息和工具栏 -->
    <div class="flex items-center">
      <!-- 月度目标 -->
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <span class="text-gray-600">{{ t('toolbar.monthlyTarget') }}</span>
        <div class="flex items-center">
          <span class="text-primary">2287</span>
          <span class="text-gray-400">/</span>
          <span class="text-gray-600">3000</span>
        </div>
        <CircularProgress :value="76.23" />
      </div>

      <!-- 邮件队列 -->
      <div class="flex items-center space-x-2 ml-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        <span class="text-gray-600">{{ t('toolbar.emailsInQueue') }}</span>
        <span class="text-primary">3662</span>
      </div>

      <!-- 分隔线 -->
      <div class="h-6 w-px bg-gray-200 mx-6"></div>

      <!-- 工具栏 -->
      <div class="flex items-center space-x-2">
        <!-- 帮助中心 -->
        <button 
          @click="showHelp"
          class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center"
          :title="t('toolbar.help')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- 语言切换 -->
        <Menu as="div" class="relative">
          <MenuButton
            class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center"
            :title="t('toolbar.language')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clip-rule="evenodd" />
            </svg>
          </MenuButton>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-40 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <a
                    @click="changeLanguage('zh')"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                    ]"
                  >
                    中文
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    @click="changeLanguage('en')"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                    ]"
                  >
                    English
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>

        <!-- 账户中心 -->
        <Menu as="div" class="relative">
          <MenuButton
            class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
            :title="t('toolbar.settings')"
          >
            <img
              src="@/assets/user-avatar.svg"
              alt="User avatar"
              class="h-8 w-8 rounded-full"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </MenuButton>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <a
                    @click="showProfile"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                    ]"
                  >
                    {{ t('account.profile') }}
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    @click="showSettings"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                    ]"
                  >
                    {{ t('account.settings') }}
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    @click="logout"
                    :class="[
                      active ? 'bg-gray-50' : '',
                      'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                    ]"
                  >
                    {{ t('account.logout') }}
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import CircularProgress from './CircularProgress.vue'

const router = useRouter()
const { t, locale } = useI18n()

const showHelp = () => {
  console.log('Show help center')
}

const changeLanguage = (lang: string) => {
  locale.value = lang
  document.querySelector('html')?.setAttribute('lang', lang)
}

const showProfile = () => {
  console.log('Show profile')
}

const showSettings = () => {
  console.log('Show settings')
}

const logout = () => {
  console.log('Logout')
}
</script>

<style scoped>
.group:hover {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style> 