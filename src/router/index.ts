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
      { 
        path: '', 
        name: 'home', 
        component: HomeView,
        meta: { title: 'Home' }
      },
      { 
        path: '/profile', 
        name: 'profile', 
        component: UserAccount,
        meta: { title: 'My Account' }
      },
      { 
        path: '/dashboard', 
        name: 'dashboard', 
        component: ContentBuilderView,
        meta: { title: 'Content Builder' }
      },
      {
        path: '/terms-and-conditions',
        name: 'terms-and-conditions',
        component: TermsAndConditionsView,
        meta: { title: 'Terms and Conditions' }
      },
      {
        path: '/general-terms-of-use',
        name: 'general-terms-of-use',
        component: GeneralTermsOfUseView,
        meta: { title: 'General Terms of Use' }
      },
      { 
        path: '/privacy-policy', 
        name: 'privacy-policy', 
        component: PrivacyPolicyView,
        meta: { title: 'Privacy Policy' }
      },
      { 
        path: '/cookies-policy', 
        name: 'cookies-policy', 
        component: CookiePolicyView,
        meta: { title: 'Cookie Policy' }
      },
      { 
        path: '/faq', 
        name: 'faq', 
        component: FAQView,
        meta: { title: 'FAQ' }
      },
      { 
        path: '/contact', 
        name: 'contact', 
        component: ContactView,
        meta: { title: 'Contact Us' }
      },
      {
        path: '/games',
        name: 'games',
        component: GamesListView,
        meta: { title: 'Games' }
      },
      { 
        path: '/game/:slug', 
        name: 'game', 
        component: RoadmapsListView,
        meta: { title: 'Game Roadmaps' }
      },
      { 
        path: '/roadmap/:id', 
        name: 'roadmap', 
        component: RoadmapView,
        meta: { title: 'Roadmap' }
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Page Not Found' }
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { 
        path: 'login', 
        name: 'login', 
        component: LoginView,
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
        meta: { title: 'Register' }
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard de navigation pour mettre à jour le titre de la page
router.beforeEach((to, from, next) => {
  // Définir le titre de la page
  const baseTitle = 'Smash Here'
  const pageTitle = to.meta.title as string
  
  if (pageTitle) {
    document.title = `${baseTitle} | ${pageTitle}`
  } else {
    document.title = baseTitle
  }
  
  next()
})

export default router