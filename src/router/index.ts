// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/Home/HomeView.vue'
import NotFoundView from '@/views/NotFound/NotFoundView.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import GamesListView from '@/views/Game/GamesListView.vue'
import RoadmapsListView from '@/views/Roadmaps/RoadmapsListView.vue'
import RoadmapView from '@/views/Roadmap/RoadmapView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      {
        path: '/games',
        name: 'games',
        component: GamesListView,
      },
      { path: '/game/:slug', name: 'game', component: RoadmapsListView },
      { path: '/roadmap/:id', name: 'roadmap', component: RoadmapView },
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
