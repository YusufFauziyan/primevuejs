import AppLayout from '@/layout/AppLayout.vue'
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
