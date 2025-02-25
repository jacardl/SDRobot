<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/logo.svg" alt="Logo" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ t('auth.createAccount') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {{ t('auth.or') }}
        <router-link to="/auth/login" class="font-medium text-green-600 hover:text-green-500">
          {{ t('auth.signIn') }}
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSignup">
          <!-- 错误提示 -->
          <div v-if="error" class="mb-4 rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ t(error) }}
                </h3>
              </div>
            </div>
          </div>

          <!-- 邮箱输入 -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              {{ t('auth.emailAddress') }}
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="credentials.email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              {{ t('auth.password') }}
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- 注册按钮 -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <template v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ t('auth.creatingAccount') }}
              </template>
              <template v-else>
                {{ t('auth.signUpButton') }}
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/auth'
import type { SignupCredentials } from '@/types/auth'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const credentials = reactive<SignupCredentials>({
  email: '',
  password: ''
})

const handleSignup = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.signup(credentials)
    router.push('/dashboard')
  } catch (e: any) {
    // 使用国际化的错误消息
    error.value = e.message === 'Email already exists' 
      ? 'auth.emailExists' 
      : 'auth.signupFailed'
  } finally {
    loading.value = false
  }
}
</script> 