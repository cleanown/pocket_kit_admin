import 'vue-router'

declare module 'vue-router' {
  /** 路由同时提供页面信息和侧栏菜单配置。 */
  interface RouteMeta {
    /** 页面或一级菜单的显示名称。 */
    title?: string
    /** Iconfont 字体图标类名。 */
    icon?: string
    /** 是否隐藏该路由及其子菜单。 */
    hidden?: boolean
    /** 菜单使用的业务角标。 */
    badge?: 'pendingFeedback'
  }
}
