<script setup lang="ts">
import { computed } from 'vue'
import HomeChart from './HomeChart.vue'
import type { HomeChartOption } from '../types'
import { useAdminStore } from '@/store/admin'
import { formatNumber } from '@/utils/index'

/** 管理端共享状态，提供当前分类与工具数量。 */
const store = useAdminStore()
/** 实时统计每个分类下的工具数量，供环形图与分类导航共用。 */
const distribution = computed(() =>
  store.data.categories.map((category) => ({
    ...category,
    count: store.data.tools.filter((tool) => tool.categoryId === category.id)
      .length,
  })),
)
/** 分类数量及总数的文本说明，辅助阅读工具无需读取画布即可获取分布。 */
const description = computed(
  () =>
    `工具分类分布，共 ${store.data.tools.length} 个工具。${distribution.value.map((category) => `${category.name} ${category.count} 个`).join('，')}`,
)
/** 使用 ECharts 环形饼图；过滤零数量分类，空数据时保留中性圆环。 */
const option = computed<HomeChartOption>(() => ({
  animationDuration: 300,
  title: {
    text: formatNumber(store.data.tools.length),
    subtext: '全部工具',
    left: 'center',
    top: '30%',
    itemGap: 4,
    textStyle: { color: '#273c35', fontSize: 26, fontWeight: 600 },
    subtextStyle: { color: '#a1aca4', fontSize: 10 },
  },
  tooltip: {
    trigger: 'item',
    renderMode: 'richText',
    confine: true,
    textStyle: { fontSize: 10 },
    padding: 6,
    formatter: '{b}\n{c} 个工具（{d}%）',
  },
  series: [
    {
      type: 'pie',
      radius: ['73%', '96%'],
      center: ['50%', '50%'],
      label: { show: false },
      labelLine: { show: false },
      stillShowZeroSum: false,
      showEmptyCircle: true,
      emptyCircleStyle: { color: '#edf1ef' },
      emphasis: { scale: false },
      data: distribution.value
        .filter((category) => category.count > 0)
        .map((category) => ({
          name: category.name,
          value: category.count,
          itemStyle: { color: category.color },
        })),
    },
  ],
}))
</script>

<template>
  <section class="panel distribution-panel">
    <div class="panel-heading">
      <div>
        <h2>工具分类分布</h2>
        <p>丰富的工具，有序的管理</p>
      </div>
      <span
        class="iconfont icon-fenzuguanli muted"
        style="font-size: 18px"
        aria-hidden="true"
      ></span>
    </div>
    <div class="category-chart">
      <HomeChart :option="option" :label="description" />
    </div>
    <div class="distribution-legend">
      <router-link
        v-for="category in distribution"
        :key="category.id"
        :to="{ path: '/tools', query: { category: category.id } }"
      >
        <span
          ><i :style="{ background: category.color }" />{{
            category.name
          }}</span
        ><strong>{{ category.count }} <small>个</small></strong>
      </router-link>
      <p v-if="!distribution.length" class="muted">暂无分类</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.category-chart {
  height: 144px;
  width: 144px;
  margin: 22px auto 21px;
}
.distribution-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px 20px;
  padding: 0 24px 22px;
}
.distribution-legend i {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}
.distribution-legend a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  font-size: 10px;
}
.distribution-legend a > span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8a988f;
  min-width: 0;
  overflow-wrap: anywhere;
}
.distribution-legend strong {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}
.distribution-legend small {
  font-size: 8px;
  color: #b2bab4;
}
@media (min-width: 1600px) {
  .category-chart {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}
@media (max-width: 1280px) {
  .distribution-legend {
    padding: 0 19px 22px;
    gap: 13px;
  }
}
@media (max-width: 1080px) {
  .distribution-legend {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .category-chart {
    width: 125px;
    height: 125px;
    margin-top: 18px;
    margin-bottom: 17px;
  }
}
@media (max-width: 650px) {
  .distribution-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .distribution-panel .panel-heading {
    grid-column: span 2;
  }
  .category-chart {
    margin: 23px auto;
    width: 125px;
    height: 125px;
  }
  .distribution-legend {
    padding: 26px 23px 23px 0;
    gap: 12px;
  }
}
</style>
