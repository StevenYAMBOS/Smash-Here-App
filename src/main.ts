import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.use(ToastPlugin, { position: 'top-right' })

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
if (userStore.token) {
  userStore.fetchProfile()
}

app.mount('#app')
