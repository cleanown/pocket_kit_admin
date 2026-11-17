<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'
import SideBar from './components/SideBar.vue'
import { useAdminStore } from '@/store/admin'
/** 移动端侧边导航的展开状态。 */
const open = ref(false)
/** 桌面侧栏是否折叠为图标导航。 */
const collapsed = ref(false)
/** 统一桌面与移动端的导航断点，桌面侧栏不受抽屉开关影响。 */
const mobileQuery = window.matchMedia('(max-width: 767px)')
/** 当前是否使用移动端抽屉导航。 */
const isMobile = ref(mobileQuery.matches)
/** 当前路由，用于在导航完成后收起移动端抽屉。 */
const route = useRoute()
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()

/** 跨越断点时同步布局状态，并清除旧的抽屉展开状态。 */
function updateViewport(event: MediaQueryListEvent) {
  isMobile.value = event.matches
  open.value = false
}

/** 切换当前设备对应的抽屉或桌面侧栏。 */
function toggleMenu() {
  if (isMobile.value) open.value = !open.value
  else collapsed.value = !collapsed.value
}

/** 注册窗口断点变化监听。 */
onMounted(() => mobileQuery.addEventListener('change', updateViewport))
/** 布局卸载时释放断点监听。 */
onBeforeUnmount(() => mobileQuery.removeEventListener('change', updateViewport))
/** 路由跳转成功后关闭移动端抽屉，包括浏览器前进和后退。 */
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>
<template>
  <div class="layout" :class="{ 'is-collapsed': collapsed && !isMobile }">
    <SideBar v-if="!isMobile" :collapsed="collapsed" />
    <el-drawer
      v-else
      v-model="open"
      title="导航菜单"
      direction="ltr"
      size="236px"
      :with-header="false"
      body-class="navigation-drawer-body"
      append-to-body
    >
      <SideBar mobile @close="open = false" />
    </el-drawer>
    <div class="layout-content">
      <HeaderBar :mobile="isMobile" :menu-open="open" :collapsed="collapsed" @menu="toggleMenu" />
      <main class="main-content">
        <el-alert
          v-if="store.storageError"
          :title="store.storageError"
          type="warning"
          show-icon
          :closable="false"
          class="storage-alert"
        /><router-view />
      </main>
      <footer class="page-footer">
        <span>© {{ new Date().getFullYear() }} Pocket Kit · 小工具，大用处</span
        ><span><i class="green-dot"></i> 演示数据 · 仅保存在当前浏览器</span>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  --sidebar-width: 236px;
  min-height: 100vh;
}
.layout.is-collapsed {
  --sidebar-width: 72px;
}
.layout-content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  width: 100%;
  max-width: 1690px;
  margin: 0 auto;
  padding: 31px 34px 26px;
  flex: 1;
}
.page-footer {
  padding: 18px 34px;
  border-top: 1px solid #e9eeeb;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  font-size: 9px;
  color: #a4aea6;
  margin-top: 8px;
}
.page-footer > span:last-child {
  display: flex;
  gap: 6px;
  align-items: center;
}
.storage-alert {
  margin-bottom: 22px;
}
/* 抽屉挂载在 body 下，使用专属类清除组件库默认内边距。 */
:global(.navigation-drawer-body) {
  padding: 0;
  overflow: hidden;
}
@media (max-width: 1280px) {
  .layout {
    --sidebar-width: 213px;
  }
  .main-content {
    padding: 27px 25px;
  }
}
@media (max-width: 767px) {
  .layout-content {
    margin-left: 0;
  }
  .main-content {
    padding: 25px 22px;
  }
  .page-footer {
    padding-left: 22px;
    padding-right: 22px;
  }
}
@media (max-width: 650px) {
  .main-content {
    padding: 22px 16px;
  }
  .page-footer {
    padding: 16px;
    font-size: 8px;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
