import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@views/Dashboard.vue')
        },
        {
          path: 'leads',
          name: 'leads',
          component: () => import('@views/Leads.vue')
        },
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@views/Chat.vue')
        },
        {
          path: 'integrations',
          name: 'integrations',
          component: () => import('@views/Integrations.vue')
        },
        {
          path: 'inbox',
          name: 'inbox',
          component: () => import('@views/Inbox.vue')
        },
        {
          path: 'campaigns',
          name: 'campaigns',
          component: () => import('@views/Campaigns.vue')
        },
        {
          path: 'pending-approval',
          name: 'pending-approval',
          component: () => import('@views/PendingApproval.vue')
        },
        {
          path: 'mailboxes',
          name: 'mailboxes',
          component: () => import('@views/Mailboxes.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@views/Analytics.vue')
        }
      ]
    }
  ]
})

export default router 