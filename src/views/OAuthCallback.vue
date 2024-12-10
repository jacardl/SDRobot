<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="error" class="p-8 text-center text-red-500">
        <ExclamationCircleIcon class="h-12 w-12 mx-auto" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">Authentication Failed</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <button
          @click="$router.push('/mailboxes')"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Return to Mailboxes
        </button>
      </div>
      <div v-else class="p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p class="mt-4 text-gray-500">Connecting your mailbox...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { mailboxService } from '@/services/mailbox'

const router = useRouter()
const route = useRoute()
const error = ref<string | null>(null)

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    error.value = 'No authorization code provided'
    return
  }

  try {
    await mailboxService.handleCallback(code)
    router.push('/mailboxes')
  } catch (e) {
    error.value = 'Failed to authenticate with Google. Please try again.'
  }
})
</script> 