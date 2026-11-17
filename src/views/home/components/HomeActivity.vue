<script setup lang="ts">
import { useAdminStore } from '@/store/admin'
import { formatDate } from '@/utils/index'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
</script>

<template>
  <section class="panel activity-panel">
    <div class="panel-heading">
      <div>
        <h2>最近动态</h2>
        <p>工作空间里的每一点进展</p>
      </div>
      <span
        class="iconfont icon-renwujincheng muted"
        style="font-size: 18px"
        aria-hidden="true"
      ></span>
    </div>
    <div class="activity-list">
      <div
        v-for="(activity, i) in store.data.activities.slice(0, 4)"
        :key="activity.id"
        class="activity-item"
      >
        <span class="activity-dot" :class="{ first: i === 0 }"></span>
        <div>
          <strong>{{ activity.title }}</strong>
          <p>{{ activity.detail }}</p>
          <time>{{ formatDate(activity.time, true) }}</time>
        </div>
      </div>
    </div>
    <router-link to="/settings" class="activity-note"
      ><span
        class="iconfont icon-xinxikongxin"
        style="font-size: 15px"
        aria-hidden="true"
      ></span>
      操作记录仅保存在当前浏览器</router-link
    >
  </section>
</template>

<style lang="scss" scoped>
.activity-list {
  padding: 23px 26px 0;
}
.activity-item {
  display: flex;
  position: relative;
  gap: 15px;
  padding-bottom: 21px;
}
.activity-item:not(:last-child)::after {
  content: '';
  position: absolute;
  width: 1px;
  background: #eaf0eb;
  top: 11px;
  bottom: -1px;
  left: 4px;
}
.activity-dot {
  width: 9px;
  height: 9px;
  border: 2px solid #d8e4da;
  background: white;
  border-radius: 50%;
  margin-top: 5px;
  z-index: 1;
  flex-shrink: 0;
}
.activity-dot.first {
  background: #78a084;
  border-color: #e4eee5;
  box-shadow: 0 0 0 2px #f0f5f0;
}
.activity-item strong {
  font-size: 11px;
  font-weight: 500;
  color: #657d6a;
}
.activity-item p {
  font-size: 10px;
  color: #9aa79d;
  margin: 3px 0;
}
.activity-item time {
  font-size: 9px;
  color: #b1b9b2;
}
.activity-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-top: 1px solid #f0f3f0;
  padding: 13px;
  color: #9fab9f;
  font-size: 9px;
}
@media (max-width: 650px) {
  .activity-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .activity-item:not(:last-child)::after {
    display: none;
  }
}
</style>
