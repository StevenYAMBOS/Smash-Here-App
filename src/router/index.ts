// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/Home/HomeView.vue'
import NotFoundView from '@/views/NotFound/NotFoundView.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      // {
      //   path: 'roadmaps',
      //   name: 'roadmaps',
      //   component: () => import('@/views/Roadmaps/RoadmapsListView.vue'),
      // },
      // { path: 'jeu/:id', name: 'game', component: () => import('@/views/Game/GameView.vue') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginView },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
