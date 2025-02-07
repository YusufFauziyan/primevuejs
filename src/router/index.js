import AppLayout from '@/layout/AppLayout.vue'
import BreadCumbLayoutVue from '@/layout/BreadCumbLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/home/view/HomeView.vue'),
        },
        {
          path: '/shop',
          component: BreadCumbLayoutVue,
          children: [
            {
              path: '/shop',
              name: 'Shop',
              component: () => import('@/views/shop/view/ShopView.vue'),
            },
            {
              path: ':id',
              name: 'ShopDetail',
              component: () => import('@/views/shop/view/ShopDetailView.vue'),
              props: true,
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/view/LoginView.vue'),
    },
  ],
})

export default router
