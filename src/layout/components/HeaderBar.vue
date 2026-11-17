<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/store/admin'
import type { HeaderBarEmits, HeaderBarProps } from '../types'

// 读取布局统一管理的设备模式与抽屉状态。
defineProps<HeaderBarProps>()

// 通知布局切换导航的展开状态。
defineEmits<HeaderBarEmits>()
/** 当前路由，用于读取查询条件和页面信息。 */
const route = useRoute()
/** 使用路由匹配层级展示面包屑，与侧栏菜单名称保持一致。 */
const breadcrumbs = computed(() =>
  route.matched.filter((record) => record.meta.title && !record.meta.hidden),
)
/** 路由实例，用于页面跳转及同步查询参数。 */
const router = useRouter()
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 顶部工具搜索框的输入内容。 */
const search = ref('')
/** 待跟进反馈数量，随本地反馈状态自动更新。 */
const pending = computed(
  () => store.data.feedback.filter((f) => f.status === 'pending').length,
)
/** 提交顶部搜索条件并进入工具管理页面。 */
function submit() {
  router.push({
    path: '/tools',
    query: search.value.trim() ? { q: search.value.trim() } : {},
  })
  search.value = ''
}
/** 返回演示入口页，不执行服务端退出操作。 */
function logout() {
  router.push('/login')
}
</script>
<template>
  <header class="header-bar">
    <div class="breadcrumb">
      <button
        class="icon-button navigation-toggle"
        :aria-label="mobile ? (menuOpen ? '关闭导航' : '打开导航') : (collapsed ? '展开侧边栏' : '折叠侧边栏')"
        :title="mobile ? '导航菜单' : (collapsed ? '展开侧边栏' : '折叠侧边栏')"
        :aria-expanded="mobile ? menuOpen : !collapsed"
        @click="$emit('menu')"
      >
        <span class="iconfont icon-liebiao" aria-hidden="true"></span>
      </button>
      <template v-for="(record, index) in breadcrumbs" :key="record.path">
        <span
          v-if="index"
          class="iconfont icon-xiayibu1 breadcrumb-root"
          style="font-size: 13px"
          aria-hidden="true"
        ></span>
        <strong v-if="index === breadcrumbs.length - 1">{{
          record.meta.title
        }}</strong>
        <span v-else class="breadcrumb-root">{{ record.meta.title }}</span>
      </template>
    </div>
    <div class="header-actions">
      <form class="global-search" role="search" @submit.prevent="submit">
        <span
          class="iconfont icon-sousuofangda"
          style="font-size: 17px"
          aria-hidden="true"
        ></span
        ><input
          v-model="search"
          aria-label="搜索工具"
          placeholder="搜索工具…"
        /><kbd>↵</kbd>
      </form>
      <span class="environment-pill">演示模式</span
      ><router-link
        to="/feedback"
        class="icon-button notification-button"
        :aria-label="`${pending} 条待处理反馈`"
        ><span class="iconfont icon-xiaoxitongzhi" aria-hidden="true"></span
        ><i v-if="pending"></i></router-link
      ><span class="header-divider"></span
      ><el-dropdown trigger="click" @command="logout"
        ><button class="profile-button">
          <span class="avatar">A</span
          ><span class="profile-text">管理员<small>演示工作台</small></span
          ><span
            class="iconfont icon-xiajiantou"
            style="font-size: 14px"
            aria-hidden="true"
          ></span></button
        ><template #dropdown
          ><el-dropdown-menu
            ><el-dropdown-item command="logout"
              >返回入口页</el-dropdown-item
            ></el-dropdown-menu
          ></template
        ></el-dropdown
      >
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header-bar {
  position: sticky;
  top: 0;
  z-index: 30;
  flex-shrink: 0;
  height: 78px;
  background: #fff;
  border-bottom: 1px solid #e9eeeb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  gap: 16px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 15px;
  white-space: nowrap;
  font-size: 12px;
}
.breadcrumb-root {
  color: #a0aaa5;
}
.breadcrumb strong {
  font-weight: 500;
}
.header-actions {
  display: flex;
  gap: 21px;
  align-items: center;
}
.global-search {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #99a39d;
  background: #f7f9f8;
  padding: 8px 10px;
  border: 1px solid #eef1ef;
  border-radius: 7px;
}
.global-search input {
  background: transparent;
  border: 0;
  outline: none;
  width: 136px;
  font-size: 11px;
  color: #53675d;
}
.global-search input::placeholder {
  color: #9ba59f;
}
kbd {
  font-size: 12px;
  color: #a9b0ac;
  padding: 0 4px;
  background: white;
  border: 1px solid #e8ece9;
  border-radius: 3px;
}
.environment-pill {
  font-size: 10px;
  border: 1px solid #dceadf;
  padding: 3px 7px;
  color: #7a9b7b;
  border-radius: 4px;
  white-space: nowrap;
}
.notification-button {
  position: relative;
}
.notification-button i {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #d6a16d;
  border: 1px solid white;
  border-radius: 50%;
  right: 5px;
  top: 3px;
}
.header-divider {
  height: 25px;
  width: 1px;
  background: #edf0ee;
}
.profile-button {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 33px;
  height: 33px;
  background: #e9eee4;
  color: #738863;
  font-size: 15px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.profile-text {
  font-size: 11px;
  text-align: left;
  font-weight: 600;
  line-height: 1.35;
}
.profile-text small {
  display: block;
  font-size: 9px;
  font-weight: 400;
  color: #a1aaa5;
  margin-top: 4px;
}
.navigation-toggle {
  display: inline-flex;
}
@media (max-width: 1280px) {
  .header-bar {
    padding: 0 25px;
  }
  .header-actions {
    gap: 14px;
  }
}
@media (max-width: 1080px) {
  .global-search {
    display: none;
  }
}
@media (max-width: 880px) {
  .navigation-toggle {
    display: inline-flex;
  }
  .header-bar {
    height: 67px;
    padding: 0 22px;
  }
}
@media (max-width: 650px) {
  .header-bar {
    padding: 0 16px;
    gap: 10px;
    height: 63px;
  }
  .header-actions {
    gap: 12px;
  }
  .breadcrumb {
    gap: 8px;
    font-size: 11px;
  }
  .breadcrumb-root {
    display: none;
  }
  .profile-text,
  .header-divider,
  .environment-pill {
    display: none;
  }
  .profile-button {
    gap: 5px;
  }
  .avatar {
    width: 29px;
    height: 29px;
    font-size: 12px;
  }
}
</style>
