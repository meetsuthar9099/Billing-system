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
          meta: { requiresAuth: true, group: 'Dashboard', permission: '' }
        },
        {
          name: 'customer',
          path: 'customer',
          component: () => import('../pages/customer/customer-list.vue'),
          meta: { requiresAuth: true, group: 'Customer', permission: 'View Customer' }
        },
        {
          name: 'company',
          path: 'company',
          component: () => import('../pages/company/company-list.vue'),
          meta: { requiresAuth: true, group: 'Company', permission: '' }
        },
        {
          name: 'invoice',
          path: 'invoice',
          component: () => import('../pages/invoice/invoice-list.vue'),
          meta: { requiresAuth: true, group: 'Invoice', permission: 'View Invoice' },
        },
        {
          name: 'invoice_pdf',
          path: 'invoice/pdf/:id',
          component: () => import('../pages/invoice/invoice-pdf.vue'),
          meta: { requiresAuth: true, group: 'Invoice', permission: 'View Invoice' }
        },
        {
          name: 'invoice_view',
          path: 'invoice/:id',
          component: () => import('../pages/invoice/invoice-view.vue'),
          meta: { requiresAuth: true, group: 'Invoice', permission: '' }
        },
        {
          name: 'expenses',
          path: 'expenses',
          component: () => import('../pages/expenses/expenses-list.vue'),
          meta: { requiresAuth: true, group: 'Expenses', permission: 'View Expense' }
        },
        {
          name: 'expenses_view',
          path: 'expense/:id',
          component: () => import('../pages/expenses/expenses-view.vue'),
          meta: { requiresAuth: true, group: 'Expenses', permission: '' }
        },
        {
          name: 'reports',
          path: 'reports',
          component: () => import('../pages/reports/report-list.vue'),
          meta: { requiresAuth: true, group: 'Reports', permission: 'View Report' }
        },
        {
          name: 'payment',
          path: 'payment',
          component: () => import('../pages/payment/payment-list.vue'),
          meta: { requiresAuth: true, group: 'Payment', permission: 'View Payment' }
        },
        {
          name: 'auditLogs',
          path: 'auditLogs',
          component: () => import('../pages/AuditLogs/logs-list.vue'),
          meta: { requiresAuth: true, group: 'AuditLogs', permission: '' }
        },
        {
          name: 'payment_view',
          path: 'payment/:id',
          component: () => import('../pages/payment/payment-view.vue'),
          meta: { requiresAuth: true, group: 'Payment', permission: '' }
        },
        {
          name: 'invoice_payment_view',
          path: 'payment/:invoice_id/:id',
          component: () => import('../pages/payment/payment-view.vue'),
          meta: { requiresAuth: true, group: 'Payment', permission: '' }
        },
        {
          name: 'customer_view',
          path: 'customer/:id',
          component: () => import('../pages/customer/customer-view.vue'),
          meta: { requiresAuth: true, group: 'Customer', permission: '' }
        },
        {
          name: 'settings',
          path: 'settings',
          component: () => import('../pages/settings/index.vue'),
          meta: { requiresAuth: true, group: 'Settings', permission: '' }
        },
        {
          name: 'typography',
          path: 'typography',
          component: () => import('../pages/typography.vue'),
          meta: { requiresAuth: true, group: 'Typography', permission: '' }
        },
        {
          name: 'icons',
          path: 'icons',
          component: () => import('../pages/icons.vue'),
          meta: { requiresAuth: true, group: 'icons', permission: '' }
        },
        {
          name: 'cards',
          path: 'cards',
          component: () => import('../pages/cards.vue'),
          meta: { requiresAuth: true, group: 'cards', permission: '' }
        },
        {
          name: 'tables',
          path: 'tables',
          component: () => import('../pages/tables.vue'),
          meta: { requiresAuth: true, group: 'tables', permission: '' }
        },
        {
          name: 'form',
          path: 'form-layouts',
          component: () => import('../pages/form-layouts.vue'),
          meta: { requiresAuth: true, group: 'form', permission: '' }
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
        {
          name: '403',
          path: '/forbidden',
          component: () => import('../pages/403.vue'),
          meta: { requiresAuth: false }
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = store.state.isAuthenticate;
    if (isAuthenticated) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
  if (to.meta.permission) {
    const routePermission = to.meta.permission
    const permissions = store.state.permissions
    if (permissions.includes(routePermission)) {
      next()
    } else {
      router.push({ name: '403' })
    }
  }
});
export default router
