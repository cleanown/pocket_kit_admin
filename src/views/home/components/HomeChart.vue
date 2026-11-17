<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EChartsType } from 'echarts/core'
import { init, use } from 'echarts/core'
import { LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { HomeChartProps } from '../types'

/** 统一按需注册现有图表与组件，避免引入整套图表实现。 */
use([
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
])

/** 页面传入的图表配置和中文描述。 */
const props = defineProps<HomeChartProps>()
/** ECharts 使用的实际 DOM 容器。 */
const chartElement = ref<HTMLDivElement>()
/** 当前组件持有的图表实例，不放入深层响应式对象。 */
let chartInstance: EChartsType | undefined
/** 监听容器自身尺寸，覆盖窗口缩放和布局变化。 */
let resizeObserver: ResizeObserver | undefined

/** 容器可见且具备尺寸时初始化图表，并完整应用最新配置。 */
function renderChart() {
  if (!chartElement.value?.clientWidth || !chartElement.value.clientHeight)
    return
  chartInstance ??= init(chartElement.value, undefined, { renderer: 'canvas' })
  chartInstance.setOption(props.option, { notMerge: true })
}

/** 容器首次显示时补建实例，其余尺寸变化仅重新计算画布大小。 */
function resizeChart() {
  if (!chartElement.value?.clientWidth || !chartElement.value.clientHeight)
    return
  if (!chartInstance) renderChart()
  else chartInstance.resize()
}

/** 等待页面挂载后绘制，并监听容器宽高变化。 */
onMounted(() => {
  renderChart()
  resizeObserver = new ResizeObserver(resizeChart)
  if (chartElement.value) resizeObserver.observe(chartElement.value)
})

/** 周期切换或业务数据更新时替换配置，清除旧序列和旧分类。 */
watch(() => props.option, renderChart, { deep: true, flush: 'post' })

/** 路由离开或组件移除时释放观察器与 ECharts 资源。 */
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = undefined
})
</script>

<template>
  <div ref="chartElement" class="home-chart" role="img" :aria-label="label" />
</template>

<style lang="scss" scoped>
.home-chart {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
</style>
