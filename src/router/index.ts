import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
/** 路由实例，用于页面跳转及同步查询参数。 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          component: () => import('@/views/home/index.vue'),
          meta: { title: '工作台', icon: 'icon-shujukanban' },
        },
      ],
    },
    {
      path: '/tools',
      component: Layout,
      redirect: '/tools/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/tools/index.vue'),
          meta: { title: '工具管理', icon: 'icon-gongnengdingyi' },
        },
        {
          path: '/categories',
          component: () => import('@/views/categories/index.vue'),
          meta: { title: '分类管理', icon: 'icon-fenzuguanli' },
        },
        {
          path: '/users',
          component: () => import('@/views/users/index.vue'),
          meta: { title: '用户管理', icon: 'icon-zuzhiqunzu' },
        },
        {
          path: '/feedback',
          component: () => import('@/views/feedback/index.vue'),
          meta: {
            title: '意见反馈',
            icon: 'icon-xiaoxi',
            badge: 'pendingFeedback',
          },
        },
      ],
    },
    {
      path: '/settings',
      component: Layout,
      redirect: '/settings/index',
      children: [
        {
          path: 'index',
          component: () => import('@/views/settings/index.vue'),
          meta: { title: '系统设置', icon: 'icon-icon_shezhi' },
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录', hidden: true },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/not-found/index.vue'),
      meta: { title: '页面不存在', hidden: true },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
/** 页面跳转完成后同步浏览器标题。 */
router.afterEach((to) => {
  document.title = `${to.meta.title} · 百宝箱管理后台`
})
export default router
