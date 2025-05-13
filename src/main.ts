import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue)
app.use(router)

app.mount('#app')
