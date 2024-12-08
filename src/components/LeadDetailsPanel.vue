<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-10" @close="close">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="px-4 py-6 sm:px-6">
                    <div class="flex items-start justify-between">
                      <h2 class="text-lg font-medium text-gray-900">Lead Details</h2>
                      <button
                        type="button"
                        class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        @click="close"
                      >
                        <XMarkIcon class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <div v-if="lead" class="relative flex-1 px-4 sm:px-6">
                    <div class="space-y-6">
                      <!-- 基本信息 -->
                      <div>
                        <div class="flex items-center">
                          <img
                            :src="lead.avatar"
                            :alt="lead.name"
                            class="h-16 w-16 rounded-full"
                          />
                          <div class="ml-4">
                            <h3 class="text-xl font-medium text-gray-900">
                              {{ lead.name }}
                            </h3>
                            <p class="text-sm text-gray-500">{{ lead.title }}</p>
                          </div>
                        </div>
                        <div class="mt-4 grid grid-cols-2 gap-4">
                          <a
                            href="#"
                            class="flex items-center text-gray-600 hover:text-gray-900"
                          >
                            <EnvelopeIcon class="h-5 w-5 mr-2" />
                            {{ lead.email }}
                          </a>
                          <a
                            href="#"
                            class="flex items-center text-gray-600 hover:text-gray-900"
                          >
                            <MapPinIcon class="h-5 w-5 mr-2" />
                            {{ lead.location }}
                          </a>
                        </div>
                      </div>

                      <!-- 社交媒体链接 -->
                      <div class="flex space-x-4">
                        <a
                          href="#"
                          class="text-gray-400 hover:text-gray-500"
                        >
                          <img src="@/assets/linkedin.svg" alt="LinkedIn" class="h-6 w-6" />
                        </a>
                        <a
                          href="#"
                          class="text-gray-400 hover:text-gray-500"
                        >
                          <img src="@/assets/twitter.svg" alt="Twitter" class="h-6 w-6" />
                        </a>
                      </div>

                      <!-- About -->
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">About {{ lead.name }}</h4>
                        <div class="mt-2">
                          <h5 class="text-xs font-medium text-gray-500">Interests</h5>
                          <div class="mt-1 flex flex-wrap gap-2">
                            <span
                              v-for="interest in lead.interests"
                              :key="interest"
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {{ interest }}
                            </span>
                          </div>
                        </div>
                        <div class="mt-4">
                          <h5 class="text-xs font-medium text-gray-500">Insights</h5>
                          <p class="mt-1 text-sm text-gray-600">
                            {{ lead.insights }}
                          </p>
                        </div>
                      </div>

                      <!-- Company Info -->
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">About {{ lead.company }}</h4>
                        <dl class="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <dt class="text-xs font-medium text-gray-500">Headcount</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ lead.companySize }}</dd>
                          </div>
                          <div>
                            <dt class="text-xs font-medium text-gray-500">Funding</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ lead.funding }}</dd>
                          </div>
                          <div>
                            <dt class="text-xs font-medium text-gray-500">Revenue</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ lead.revenue }}</dd>
                          </div>
                          <div>
                            <dt class="text-xs font-medium text-gray-500">Website</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                              <a :href="lead.website" class="text-primary hover:text-primary-dark">
                                {{ lead.website }}
                              </a>
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <!-- Tech Stack -->
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">Tech Stack</h4>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <img
                            v-for="tech in lead.techStack"
                            :key="tech"
                            :src="'@/assets/tech/' + tech + '.svg'"
                            :alt="tech"
                            class="h-8 w-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  XMarkIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  lead: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script> 