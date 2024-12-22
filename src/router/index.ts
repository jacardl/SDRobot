import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import SimpleLayout from '@/layouts/SimpleLayout.vue'
import Leads from '@/views/Leads.vue'
import LeadDetail from '@/views/LeadDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth/login'
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/Signup.vue'),
          meta: { requiresGuest: true }
        }
      ]
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@/views/Chat.vue')
        },
        {
          path: 'leads',
          name: 'leads',
          component: () => import('@/views/Leads.vue')
        },
        {
          path: 'leads/:id',
          name: 'lead-detail',
          component: () => import('@/views/LeadDetail.vue')
        },
        {
          path: 'integrations',
          name: 'integrations',
          component: () => import('@/views/Integrations.vue')
        },
        {
          path: 'inbox',
          name: 'inbox',
          component: () => import('@/views/Inbox.vue')
        },
        {
          path: 'campaigns',
          name: 'campaigns',
          component: () => import('@/views/Campaigns.vue')
        },
        {
          path: 'pending-approval',
          name: 'pending-approval',
          component: () => import('@/views/PendingApproval.vue')
        },
        {
          path: 'mailboxes',
          name: 'mailboxes',
          component: () => import('@/views/Mailboxes.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/Analytics.vue')
        }
      ]
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: () => import('@/views/OAuthCallback.vue')
    }
  ]
})

console.log('Current routes:', router.getRoutes())

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.checkAuth()

  if (to.path === '/') {
    if (isAuthenticated) {
      next('/dashboard')
    } else {
      next('/auth/login')
    }
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/auth/login')
    return
  }

  if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
    next('/dashboard')
    return
  }

  console.log('Navigating to:', to.path)
  next()
})

export default router 