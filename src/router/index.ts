import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home/index.vue"
import Login from "@/views/login/index.vue"

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/test',
    component: () => import("@/views/test/index.vue")
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router