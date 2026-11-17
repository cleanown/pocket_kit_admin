import type { RouteMeta } from 'vue-router'

/** 从页面路由生成的导航项，分组仅用于显示。 */
export interface NavigationItem {
  /** 页面绝对路径或菜单分组标识。 */
  path: string
  /** 导航名称、图标及角标。 */
  meta?: RouteMeta
  /** 分组下的可见页面。 */
  children: NavigationItem[]
}

/** 侧边导航接收的布局状态。 */
export interface SideBarProps {
  /** 桌面侧栏是否仅显示图标。 */
  collapsed?: boolean
  /** 是否在移动端抽屉中展示导航。 */
  mobile?: boolean
}
/** 侧边导航向布局发送的事件。 */
export interface SideBarEmits {
  /** 请求关闭移动端导航。 */
  close: []
}
/** 顶部栏向布局发送的事件。 */
export interface HeaderBarEmits {
  /** 请求切换导航的展开状态。 */
  menu: []
}

/** 顶部栏接收的移动端导航状态。 */
export interface HeaderBarProps {
  /** 桌面侧栏是否折叠。 */
  collapsed: boolean
  /** 是否展示移动端菜单按钮。 */
  mobile: boolean
  /** 移动端抽屉当前是否展开。 */
  menuOpen: boolean
}
