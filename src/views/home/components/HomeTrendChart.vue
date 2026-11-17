<script setup lang="ts">
import { computed, ref } from 'vue'
import HomeChart from './HomeChart.vue'
import type { HomeChartOption } from '../types'
import { usageTrends, activeUserTrends } from '@/mock/home'
import { formatNumber, formatTime } from '@/utils/index'
import type { TrendPeriod } from '../types'

/** 趋势图当前展示的天数范围。 */
const period = ref<TrendPeriod>(7)
/** 为每个数据点生成对应日期，确保 7 天和 14 天序列完整对齐。 */
const labels = computed(() =>
  Array.from({ length: period.value }, (_, index) => {
    /** 当前数据点对应的本地日期。 */
    const day = new Date()
    day.setDate(day.getDate() - (period.value - index - 1))
    return formatTime(day, 'MM/dd')
  }),
)
/** 使用 ECharts 的坐标轴、图例、提示框和双折线展示模拟趋势。 */
const option = computed<HomeChartOption>(() => ({
  animationDuration: 300,
  color: ['#20866c', '#98bdac'],
  textStyle: { fontFamily: 'sans-serif' },
  legend: {
    top: 0,
    right: 8,
    itemWidth: 11,
    itemHeight: 7,
    textStyle: { color: '#96a298', fontSize: 10 },
  },
  tooltip: {
    trigger: 'axis',
    renderMode: 'richText',
    confine: true,
    axisPointer: { type: 'line', lineStyle: { color: '#b9d3c7' } },
  },
  grid: {
    top: 40,
    right: 12,
    bottom: 6,
    left: 4,
    outerBoundsMode: 'same',
    outerBoundsContain: 'axisLabel',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: labels.value,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#a4aea8',
      fontSize: 10,
      interval: period.value === 14 ? 1 : 0,
      hideOverlap: true,
      showMinLabel: true,
      showMaxLabel: true,
    },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 1000,
    interval: 250,
    axisLabel: { color: '#a4aea8', fontSize: 10, formatter: formatNumber },
    splitLine: { lineStyle: { color: '#edf0ee', type: 'dashed' } },
  },
  series: [
    {
      name: '工具使用',
      type: 'line',
      data: usageTrends[period.value],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#20866c', width: 2.5 },
      itemStyle: { borderColor: '#20866c', color: '#fff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#20866c26' },
            { offset: 1, color: '#20866c00' },
          ],
        },
      },
      tooltip: {
        // 使用次数补充单位，并明确为模拟统计。
        valueFormatter: (value) => `${formatNumber(Number(value))} 次（示例）`,
      },
    },
    {
      name: '活跃用户',
      type: 'line',
      data: activeUserTrends[period.value],
      showSymbol: false,
      lineStyle: { color: '#98bdac', width: 2, type: 'dashed' },
      tooltip: {
        // 活跃用户补充人数单位，并明确为模拟统计。
        valueFormatter: (value) => `${formatNumber(Number(value))} 人（示例）`,
      },
    },
  ],
}))
</script>

<template>
  <section class="panel trend-panel">
    <div class="panel-heading">
      <div>
        <h2>使用趋势 <span class="subtle-badge">示例</span></h2>
        <p>看看工具如何融入每一天</p>
      </div>
      <div class="segmented" role="group" aria-label="趋势统计周期">
        <button
          :class="{ active: period === 7 }"
          :aria-pressed="period === 7"
          @click="period = 7"
        >
          近 7 天
        </button>
        <button
          :class="{ active: period === 14 }"
          :aria-pressed="period === 14"
          @click="period = 14"
        >
          近 14 天
        </button>
      </div>
    </div>
    <div class="line-chart">
      <HomeChart
        :option="option"
        :label="`近 ${period} 天工具使用及活跃用户示例趋势，非真实统计`"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.subtle-badge {
  font-size: 8px;
  color: #a2aca5;
  background: #f5f7f5;
  padding: 2px 5px;
  margin-left: 4px;
  font-weight: 400;
  vertical-align: middle;
  border-radius: 3px;
}
.segmented {
  display: inline-flex;
  background: #f5f7f5;
  padding: 3px;
  border-radius: 5px;
  white-space: nowrap;
}
.segmented button {
  font-size: 10px;
  color: #95a096;
  padding: 5px 9px;
  border-radius: 4px;
}
.segmented button.active {
  background: #fff;
  color: #5e806a;
  box-shadow: 0 1px 4px #324c3410;
}
.line-chart {
  height: 258px;
  padding: 0 18px 18px;
  margin-top: 17px;
}
@media (min-width: 1600px) {
  .line-chart {
    height: 284px;
    padding-bottom: 26px;
  }
}
@media (max-width: 650px) {
  .segmented button {
    padding: 4px 7px;
    font-size: 9px;
  }
  .line-chart {
    height: 240px;
    padding: 0 12px 16px;
  }
}
</style>
