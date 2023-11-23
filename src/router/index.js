import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: '/',
      path: '/', redirect: '/dashboard'
    },
    {
      name: 'Admin',
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          name: 'Dashboard',
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          name: 'Customer',
          path: 'customer',
          component: () => import('../pages/customer/customer-list.vue'),
        },
        {
          name: 'Customer View',
          path: 'customer/:id',
          component: () => import('../pages/customer/customer-view.vue'),
        },
        {
          name: 'Account Settings',
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
        },
        {
          name: 'Typography',
          path: 'typography',
          component: () => import('../pages/typography.vue'),
        },
        {
          name: 'icons',
          path: 'icons',
          component: () => import('../pages/icons.vue'),
        },
        {
          name: 'cards',
          path: 'cards',
          component: () => import('../pages/cards.vue'),
        },
        {
          name: 'tables',
          path: 'tables',
          component: () => import('../pages/tables.vue'),
        },
        {
          name: 'form',
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
        },
      ],
    },
    {
      name: 'Auth',
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          name: 'Login',
          path: 'login',
          component: () => import('../pages/login.vue'),
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          name: '404',
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})

export default router
