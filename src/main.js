import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'

// pinia
import { createPinia } from 'pinia'

// import '@/assets/styles.scss'
import '@/assets/tailwind.css'
import { DefaultTheme } from './theme/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: DefaultTheme(),
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})
app.use(ToastService)
app.use(ConfirmationService)

app.use(pinia)

app.mount('#app')
