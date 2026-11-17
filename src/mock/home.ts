import type { TrendPeriod } from '@/views/home/types'
/** 近 7 天与近 14 天的工具使用次数模拟序列。 */
export const usageTrends: Record<TrendPeriod, number[]> = {
  7: [264, 382, 326, 560, 435, 608, 728],
  14: [210, 312, 275, 435, 370, 510, 465, 628, 580, 710, 650, 780, 690, 840],
}
/** 近 7 天与近 14 天的活跃用户模拟序列。 */
export const activeUserTrends: Record<TrendPeriod, number[]> = {
  7: [140, 186, 164, 242, 218, 306, 345],
  14: [95, 150, 128, 205, 182, 250, 228, 310, 277, 352, 326, 395, 360, 425],
}
/** 统计卡片的模拟趋势数值，统一交给 ECharts 绘制。 */
export const statTrends = {
  tools: [5, 13, 10, 23, 17, 29, 26, 35],
  uses: [4, 9, 6, 19, 14, 28, 24, 34],
  members: [7, 10, 6, 18, 16, 26, 23, 33],
}
