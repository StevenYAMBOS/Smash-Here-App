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
import UserAccount from '@/views/User/UserAccount.vue'
import ContentBuilderView from '@/views/User/ContentBuilderView.vue'
import TermsAndConditionsView from '@/views/Legal/TermsAndConditionsView.vue'
import GeneralTermsOfUseView from '@/views/Legal/GeneralTermsOfUseView.vue'
import PrivacyPolicyView from '@/views/Legal/PrivacyPolicyView.vue'
import CookiePolicyView from '@/views/Legal/CookiePolicyView.vue'
import FAQView from '@/views/Support/FAQView.vue'
import ContactView from '@/views/Support/ContactView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: '/profile', name: 'profile', component: UserAccount },
      { path: '/dashboard', name: 'dashboard', component: ContentBuilderView },
      {
        path: '/terms-and-conditions',
        name: 'terms-and-conditions',
        component: TermsAndConditionsView,
      },
      {
        path: '/general-terms-of-use',
        name: 'general-terms-of-use',
        component: GeneralTermsOfUseView,
      },
      { path: '/privacy-policy', name: 'privacy-policy', component: PrivacyPolicyView },
      { path: '/cookies-policy', name: 'cookies-policy', component: CookiePolicyView },
      { path: '/faq', name: 'faq', component: FAQView },
      { path: '/contact', name: 'contact', component: ContactView },
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
