import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requireGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requireGuest: true },
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetail.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/auth/UserView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/orders',
      name: 'order-history',
      component: () => import('../views/OrderHistoryView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: () => import('../views/AddressListView.vue'),
      meta: { requireAuth: true },
    },
    {
      path: '/admin/products',
      name: 'adminproducts',
      component: () => import('../views/admin/ProductData.vue'),
      meta: { requireAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/addproduct',
      name: 'TambahProduct',
      component: () => import('../views/admin/TambahProduct.vue'),
      meta: { requireAuth: true, requiresAdmin: true },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  } else if (to.meta.requireGuest && authStore.isAuthenticated) {
    return { name: 'home' }
  }
  if (to.meta.requiresAdmin && !authStore.user?.roles?.includes('admin')) {
    return { name: 'forbidden' }
  }
})

export default router
