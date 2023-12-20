import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'admin',
      path: '/',
      redirect: '/dashboard',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
          meta: { requiresAuth: true, group: 'Dashboard' }
        },
        {
          name: 'customer',
          path: 'customer',
          component: () => import('../pages/customer/customer-list.vue'),
          meta: { requiresAuth: true, group: 'Customer' }
        },
        {
          name: 'company',
          path: 'company',
          component: () => import('../pages/company/company-list.vue'),
          meta: { requiresAuth: true, group: 'Company' }
        },
        {
          name: 'invoice',
          path: 'invoice',
          component: () => import('../pages/invoice/invoice-list.vue'),
          meta: { requiresAuth: true, group: 'Invoice' },
        },
        {
          name: 'invoice_pdf',
          path: 'invoice/pdf/:id',
          component: () => import('../pages/invoice/invoice-pdf.vue'),
          meta: { requiresAuth: true, group: 'Invoice' }
        },
        {
          name: 'invoice_view',
          path: 'invoice/:id',
          component: () => import('../pages/invoice/invoice-view.vue'),
          meta: { requiresAuth: true, group: 'Invoice' }
        },
        {
          name: 'payment',
          path: 'payment',
          component: () => import('../pages/payment/payment-list.vue'),
          meta: { requiresAuth: true, group: 'Payment' }
        },
        {
          name: 'auditLogs',
          path: 'auditLogs',
          component: () => import('../pages/AuditLogs/logs-list.vue'),
          meta: { requiresAuth: true, group: 'AuditLogs' }
        },
        {
          name: 'payment_view',
          path: 'payment/:id',
          component: () => import('../pages/payment/payment-view.vue'),
          meta: { requiresAuth: true, group: 'Payment' }
        },
        {
          name: 'invoice_payment_view',
          path: 'payment/:invoice_id/:id',
          component: () => import('../pages/payment/payment-view.vue'),
          meta: { requiresAuth: true, group: 'Payment' }
        },
        {
          name: 'customer_view',
          path: 'customer/:id',
          component: () => import('../pages/customer/customer-view.vue'),
          meta: { requiresAuth: true, group: 'Customer' }
        },
        {
          name: 'account_settings',
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
          meta: { requiresAuth: true, group: 'Account Settings' }
        },
        {
          name: 'settings',
          path: 'settings',
          component: () => import('../pages/settings/index.vue'),
          meta: { requiresAuth: true, group: 'Settings' }
        },
        {
          name: 'typography',
          path: 'typography',
          component: () => import('../pages/typography.vue'),
          meta: { requiresAuth: true, group: 'Typography' }
        },
        {
          name: 'icons',
          path: 'icons',
          component: () => import('../pages/icons.vue'),
          meta: { requiresAuth: true, group: 'icons' }
        },
        {
          name: 'cards',
          path: 'cards',
          component: () => import('../pages/cards.vue'),
          meta: { requiresAuth: true, group: 'cards' }
        },
        {
          name: 'tables',
          path: 'tables',
          component: () => import('../pages/tables.vue'),
          meta: { requiresAuth: true, group: 'tables' }
        },
        {
          name: 'form',
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
          meta: { requiresAuth: true, group: 'form' }
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
          meta: { requiresAuth: false }
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('../pages/register.vue'),
          meta: { requiresAuth: false }
        },
        {
          name: '404',
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
          meta: { requiresAuth: false }
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = store.state.isAuthenticate;
    console.log(isAuthenticated, "isAuthenticated");
    if (isAuthenticated) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});
export default router
