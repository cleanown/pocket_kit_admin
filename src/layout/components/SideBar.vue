<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import logoUrl from '@/assets/images/logo.png'
import type { MenuInstance } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'
import { resolveRoutePath } from '@/utils'
import type { SideBarProps, SideBarEmits, NavigationItem } from '../types'

// 读取导航在桌面侧栏或移动抽屉中的展示模式。
const props = withDefaults(defineProps<SideBarProps>(), { mobile: false, collapsed: false })
// 通知布局关闭移动端导航。
const emit = defineEmits<SideBarEmits>()
/** 当前路由用于同步 Element Plus 菜单的选中项。 */
const route = useRoute()
/** 从路由实例读取菜单配置，避免在布局中重复维护导航。 */
const router = useRouter()
/** 布局菜单按配置顺序展示，过滤隐藏项后将唯一子页面提升为一级入口。 */
const menuGroups = computed<NavigationItem[]>(() =>
  router.options.routes
    .filter((record) => !record.meta?.hidden && record.children?.length)
    .map((record) => {
      /** 当前布局下的可见页面，兼容相对和绝对子路径。 */
      const children: NavigationItem[] = (record.children ?? [])
        .filter((page) => page.meta?.title && !page.meta.hidden)
        .map((page) => ({
          path: resolveRoutePath(page.path, record.path),
          meta: page.meta,
          children: [],
        }))
      /** 单页面直接作为一级入口，多页面优先使用父路由的名称和图标。 */
      return children.length === 1
        ? children[0]!
        : {
            path: record.path,
            meta: {
              title: record.meta?.title || children[0]?.meta?.title,
              icon: record.meta?.icon || children[0]?.meta?.icon,
            },
            children,
          }
    })
    .filter((menu) => menu.meta?.title),
)
/** 二级菜单实例，用于在路由切换时展开当前页面所属分组。 */
const menuRef = ref<MenuInstance>()
/** 当前页面所属的一级导航。 */
const activeGroup = computed(
  () =>
    menuGroups.value.find(
      (group) =>
        group.children.length &&
        group.children.some((item) => item.path === route.path),
    )?.path,
)
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 当前待处理反馈数量，供导航角标展示。 */
const pending = computed(
  () => store.data.feedback.filter((item) => item.status === 'pending').length,
)
/** 页面跳转后展开对应一级导航，浏览器前进和后退同样生效。 */
watch(
  () => [route.path, props.collapsed],
  async () => {
    await nextTick()
    if (!props.collapsed && activeGroup.value) menuRef.value?.open(activeGroup.value)
  },
  { flush: 'post' },
)
</script>
<template>
  <aside class="sidebar" :class="{ 'is-mobile': mobile, 'is-collapsed': collapsed }" aria-label="侧边导航">
    <div class="sidebar-brand">
      <router-link to="/" class="brand" @click="$emit('close')"
        ><img class="brand-mark" :src="logoUrl" alt="百宝箱 Logo" />
        <span v-if="!collapsed">Pocket Kit<small>百宝箱 · 管理后台</small></span></router-link
      >
      <el-button
        v-if="mobile"
        text
        circle
        class="sidebar-close"
        aria-label="关闭导航"
        @click="emit('close')"
      >
        <span class="iconfont icon-guanbi" aria-hidden="true"></span>
      </el-button>
    </div>
    <div v-if="!collapsed" class="workspace">
      <img class="workspace-icon" :src="logoUrl" alt="" />
      <span>百宝箱工作空间<small>本地演示环境</small></span>
      <span class="workspace-dot"></span>
    </div>
    <el-menu
      ref="menuRef"
      :default-active="route.path"
      :default-openeds="activeGroup ? [activeGroup] : []"
      :collapse="collapsed"
      :collapse-transition="false"
      router
      class="navigation-menu"
      aria-label="主导航"
      @select="emit('close')"
    >
      <template v-for="group in menuGroups" :key="group.path">
        <el-sub-menu v-if="group.children.length" :index="group.path">
          <template #title>
            <i
              v-if="group.meta?.icon"
              :class="group.meta.icon"
              class="iconfont"
              aria-hidden="true"
            ></i>
            <span class="menu-label">{{ group.meta?.title }}</span>
          </template>
          <el-menu-item
            v-for="item in group.children"
            :key="item.path"
            :index="item.path"
          >
            <i
              v-if="item.meta?.icon"
              :class="item.meta.icon"
              class="iconfont"
              aria-hidden="true"
            ></i>
            <span>{{ item.meta?.title }}</span>
            <span
              v-if="item.meta?.badge === 'pendingFeedback' && pending"
              class="nav-count"
              >{{ pending }}</span
            >
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="group.path">
          <i
            v-if="group.meta?.icon"
            :class="group.meta.icon"
            class="iconfont"
            aria-hidden="true"
          ></i>
          <template #title>
          <span class="menu-label">{{ group.meta?.title }}</span>
          <span
            v-if="group.meta?.badge === 'pendingFeedback' && pending"
            class="nav-count"
            >{{ pending }}</span
          >
          </template>
        </el-menu-item>
      </template>
    </el-menu>
    <div v-if="!collapsed" class="sidebar-bottom">
      <div class="demo-card">
        <span class="demo-card-icon"
          ><span
            class="iconfont icon-moshubang"
            aria-hidden="true"
          ></span></span
        ><strong>把小事，做得更好。</strong>
        <p>每一个好用的工具，<br />都从这里开始。</p>
        <router-link to="/tools" @click="$emit('close')"
          >管理我的工具
          <span
            class="iconfont icon-xiayibu"
            style="font-size: 16px"
            aria-hidden="true"
          ></span
        ></router-link>
      </div>
      <div class="sidebar-version">
        <span class="green-dot"></span> 本地工作台 <span>v1.0.0</span>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  width: var(--sidebar-width, 236px);
  background: #fff;
  border-right: 1px solid #e9eeeb;
  position: fixed;
  inset: 0 auto 0 0;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 31px 20px 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
}
.workspace {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 11px;
  border: 1px solid #e9eeeb;
  border-radius: 9px;
  margin: 33px 0 30px;
  font-weight: 600;
  font-size: 11px;
}
.workspace small {
  display: block;
  font-size: 10px;
  font-weight: 400;
  color: #929c97;
  margin-top: 3px;
}
.workspace-icon {
  display: block;
  flex-shrink: 0;
  object-fit: contain;
  width: 30px;
  height: 30px;
  background: #edf5ef;
  color: #36856b;
  border-radius: 6px;
  font-size: 15px;
}
.workspace-dot {
  width: 6px;
  height: 6px;
  background: #82b59e;
  border-radius: 50%;
  margin-left: auto;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
}
.sidebar-close {
  flex-shrink: 0;
}
.navigation-menu {
  --el-menu-bg-color: #fff;
  --el-menu-text-color: #6c7a73;
  --el-menu-active-color: #20866c;
  --el-menu-hover-bg-color: #f5f8f6;
  --el-menu-item-height: 46px;
  --el-menu-sub-item-height: 42px;
  --el-menu-base-level-padding: 14px;
  --el-menu-level-padding: 18px;
  border-right: 0;
  flex-shrink: 0;
}
.navigation-menu :deep(.el-sub-menu__title) {
  gap: 13px;
  margin-bottom: 6px;
  border-radius: 7px;
  font-size: 13px;
}
.navigation-menu :deep(.el-sub-menu + .el-sub-menu) {
  margin-top: 8px;
}
.navigation-menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--green);
  font-weight: 600;
}
.navigation-menu :deep(.el-menu-item) {
  gap: 13px;
  margin-bottom: 6px;
  border-radius: 7px;
  font-size: 13px;
}
.navigation-menu :deep(.el-menu-item.is-active) {
  background: #eaf4ee;
  font-weight: 600;
}
.navigation-menu :deep(.el-menu--inline .el-menu-item) {
  font-size: 12px;
}
.navigation-menu :deep(.el-menu--inline .iconfont) {
  font-size: 16px;
}
.nav-count {
  margin-left: auto;
  font-size: 10px;
  line-height: 18px;
  min-width: 18px;
  text-align: center;
  background: #faf0df;
  color: #bc9250;
  border-radius: 4px;
  padding: 0 6px;
}
.sidebar-bottom {
  margin-top: auto;
  padding-top: 40px;
}
.demo-card {
  background: #f5f8f4;
  border: 1px solid #e7eee4;
  border-radius: 10px;
  padding: 18px 17px;
  position: relative;
}
.demo-card-icon {
  display: block;
  color: #688e63;
  margin-bottom: 10px;
}
.demo-card strong {
  font-size: 12px;
  font-weight: 600;
}
.demo-card p {
  color: #94a08f;
  font-size: 11px;
  line-height: 1.9;
  margin: 6px 0 15px;
}
.demo-card a {
  font-size: 11px;
  color: #628264;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-version {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 9px;
  color: #9ea9a3;
  padding: 22px 2px;
}
.sidebar-version > span:last-child {
  margin-left: auto;
}
@media (max-width: 1280px) {
  .sidebar {
    padding-left: 16px;
    padding-right: 16px;
  }
}
.sidebar.is-collapsed {
  padding: 31px 8px 0;
}
.sidebar.is-collapsed .sidebar-brand {
  justify-content: center;
  margin-bottom: 33px;
}
.sidebar.is-collapsed .brand-mark {
  flex-shrink: 0;
}
.sidebar.is-collapsed .navigation-menu {
  width: 100%;
}
.sidebar.is-collapsed .navigation-menu :deep(.el-sub-menu__title),
.sidebar.is-collapsed .navigation-menu :deep(.el-menu-item) {
  padding: 0 !important;
  justify-content: center;
  gap: 0;
}
.sidebar.is-collapsed .navigation-menu :deep(.el-sub-menu__icon-arrow),
.sidebar.is-collapsed .navigation-menu .menu-label,
.sidebar.is-collapsed .navigation-menu .nav-count {
  display: none;
}
.sidebar.is-mobile {
  position: static;
  width: 100%;
  height: 100%;
  border-right: 0;
  padding-top: 24px;
}
.sidebar.is-mobile .brand {
  font-size: 20px;
}
@media (max-width: 767px) {
  .sidebar-bottom {
    padding-top: 30px;
  }
}
</style>
