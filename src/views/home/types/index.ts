import type { ComposeOption } from 'echarts/core'
import type { LineSeriesOption, PieSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components'

/** 趋势图允许选择的展示周期。 */
export type TrendPeriod = 7 | 14

/** 工作台图表支持的折线、饼图及所需组件配置。 */
export type HomeChartOption = ComposeOption<
  | LineSeriesOption
  | PieSeriesOption
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
>

/** 工作台 ECharts 容器接收的配置与无障碍说明。 */
export interface HomeChartProps {
  /** ECharts 声明式配置，变化后同步刷新实例。 */
  option: HomeChartOption
  /** 图表的中文说明，供辅助阅读工具识别。 */
  label: string
}
