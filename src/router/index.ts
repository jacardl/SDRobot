import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// 预加载所有视图组件
const viewModules = {
  Dashboard: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  //Chat: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue'),
  Leads: () => import(/* webpackChunkName: "leads" */ '../views/Leads.vue'),
  LeadDetail: () => import(/* webpackChunkName: "lead-detail" */ '../views/LeadDetail.vue'),
  Integrations: () => import(/* webpackChunkName: "integrations" */ '../views/Integrations.vue'),
  Inbox: () => import(/* webpackChunkName: "inbox" */ '../views/Inbox.vue'),
  Campaigns: () => import(/* webpackChunkName: "campaigns" */ '../views/Campaigns.vue'),
  PendingApproval: () => import(/* webpackChunkName: "pending-approval" */ '../views/PendingApproval.vue'),
  Mailboxes: () => import(/* webpackChunkName: "mailboxes" */ '../views/Mailboxes.vue'),
  Analytics: () => import(/* webpackChunkName: "analytics" */ '../views/Analytics.vue')
}

// 预加载认证相关组件
const authModules = {
  Login: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue'),
  Signup: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Signup.vue'),
  OAuthCallback: () => import(/* webpackChunkName: "auth" */ '@/views/OAuthCallback.vue')
}

// 预加载认证组件
Object.values(authModules).forEach(module => {
  module()
})

// 预加载所有组件
Object.values(viewModules).forEach(module => {
  module()
})

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
          component: authModules.Login,
          meta: { requiresGuest: true }
        },
        {
          path: 'signup',
          name: 'signup',
          component: authModules.Signup,
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
          component: viewModules.Dashboard
        },
        // {
        //   path: 'chat',
        //   name: 'chat',
        //   component: viewModules.Chat
        // },
        {
          path: 'leads',
          name: 'leads',
          component: viewModules.Leads
        },
        {
          path: 'leads/:id',
          name: 'lead-detail',
          component: viewModules.LeadDetail
        },
        {
          path: 'integrations',
          name: 'integrations',
          component: viewModules.Integrations
        },
        {
          path: 'inbox',
          name: 'inbox',
          component: viewModules.Inbox
        },
        {
          path: 'campaigns',
          name: 'campaigns',
          component: viewModules.Campaigns
        },
        {
          path: 'pending-approval',
          name: 'pending-approval',
          component: viewModules.PendingApproval
        },
        {
          path: 'mailboxes',
          name: 'mailboxes',
          component: viewModules.Mailboxes
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: viewModules.Analytics
        }
      ]
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: authModules.OAuthCallback
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