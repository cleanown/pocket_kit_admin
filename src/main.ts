import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router/index'
import userStore from './store/user'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 全局加载 Iconfont 字体和图标类，页面无需重复引入。
import './assets/iconfont/iconfont.css'
import './style.scss'

/** 应用共享状态容器。 */
const pinia = createPinia()
userStore(pinia).init()

/** Vue 应用实例，统一注册路由、状态与界面组件。 */
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
