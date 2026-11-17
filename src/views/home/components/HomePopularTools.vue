<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/store/admin'
import { formatNumber } from '@/utils/index'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 按累计使用次数降序选出的前五个工具。 */
const popular = computed(() =>
  [...store.data.tools].sort((a, b) => b.uses - a.uses).slice(0, 5),
)
</script>

<template>
  <section class="panel popular-panel">
    <div class="panel-heading">
      <div>
        <h2>热门工具</h2>
        <p>那些被频繁打开的实用好物</p>
      </div>
      <router-link to="/tools" class="text-link"
        >全部工具
        <span
          class="iconfont icon-xiayibu"
          style="font-size: 15px"
          aria-hidden="true"
        ></span
      ></router-link>
    </div>
    <div class="simple-table-wrap">
      <table class="simple-table">
        <thead>
          <tr>
            <th>工具名称</th>
            <th>所属分类</th>
            <th>使用次数 <span class="muted">↓</span></th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tool, i) in popular" :key="tool.id">
            <td>
              <div class="tool-cell">
                <span class="rank" :class="{ 'top-rank': i < 3 }">{{
                  String(i + 1).padStart(2, '0')
                }}</span
                ><span
                  class="tool-icon"
                  :style="{
                    background: tool.color + '15',
                    color: tool.color,
                  }"
                  ><span
                    :class="tool.icon"
                    class="iconfont"
                    aria-hidden="true"
                  ></span></span
                ><span
                  ><strong>{{ tool.name }}</strong
                  ><small>{{ tool.slug }}</small></span
                >
              </div>
            </td>
            <td>{{ store.categoryName(tool.categoryId) }}</td>
            <td class="tabular">{{ formatNumber(tool.uses) }}</td>
            <td>
              <span class="status" :class="tool.status"
                ><i></i
                >{{
                  { published: '已上架', draft: '草稿', offline: '已下架' }[
                    tool.status
                  ]
                }}</span
              >
            </td>
            <td>
              <router-link
                :to="`/tools?edit=${tool.id}`"
                class="icon-button"
                :aria-label="`编辑${tool.name}`"
                ><span
                  class="iconfont icon-xiayibu1"
                  style="font-size: 15px"
                  aria-hidden="true"
                ></span
              ></router-link>
            </td>
          </tr>
          <tr v-if="!popular.length">
            <td colspan="5">暂无工具，点击右上角添加工具。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.simple-table-wrap {
  overflow-x: auto;
  padding: 15px 22px 4px;
}
.simple-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  white-space: nowrap;
}
.simple-table th {
  text-align: left;
  font-weight: 400;
  color: #9ba79e;
  background: #f8faf8;
  padding: 10px 8px;
}
.simple-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #f1f4f1;
  color: #8b978e;
}
.simple-table tr:last-child td {
  border: 0;
}
.rank {
  color: #b7c0b9;
  font-size: 9px;
  width: 11px;
  font-variant-numeric: tabular-nums;
}
.rank.top-rank {
  color: #9cad95;
}
@media (max-width: 1280px) {
  .simple-table-wrap {
    padding-left: 14px;
    padding-right: 14px;
  }
  .simple-table .tool-cell strong {
    font-size: 11px;
  }
  .simple-table .tool-icon {
    width: 30px;
    height: 30px;
  }
}
@media (max-width: 650px) {
  .simple-table {
    min-width: 450px;
  }
}
</style>
