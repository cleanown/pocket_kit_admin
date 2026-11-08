import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "@/router/index"
import userStore from './store/user'
import './style.scss'
import App from './App.vue'

const pinia = createPinia()
userStore(pinia).init()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
