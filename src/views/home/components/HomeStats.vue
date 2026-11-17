<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/store/admin'
import { formatNumber } from '@/utils/index'
import { statTrends } from '@/mock/home'
import HomeChart from './HomeChart.vue'
import type { HomeChartOption } from '../types'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 所有工具的累计使用次数之和。 */
const totalUses = computed(() =>
  store.data.tools.reduce((sum, tool) => sum + tool.uses, 0),
)
/** 当前已上架工具的数量。 */
const published = computed(
  () => store.data.tools.filter((t) => t.status === 'published').length,
)
/** 待跟进反馈数量，随本地反馈状态自动更新。 */
const pending = computed(
  () => store.data.feedback.filter((f) => f.status !== 'resolved').length,
)

/** 生成统计卡片使用的 ECharts 迷你折线配置。 */
function createSparklineOption(
  values: number[],
  color: string,
): HomeChartOption {
  return {
    animation: false,
    grid: { top: 3, right: 2, bottom: 3, left: 2 },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
      data: values.map((_, index) => index),
    },
    yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
    series: [
      {
        type: 'line',
        data: values,
        showSymbol: false,
        silent: true,
        lineStyle: { color, width: 1.7 },
      },
    ],
  }
}
/** 三张统计卡片的模拟趋势配置，直接交给本模块的 HomeChart 绘制。 */
const sparklineOptions = {
  tools: createSparklineOption(statTrends.tools, '#91b6a2'),
  uses: createSparklineOption(statTrends.uses, '#a3b8d2'),
  members: createSparklineOption(statTrends.members, '#bba9ca'),
}
</script>

<template>
  <section class="stats-grid" aria-label="内容概览">
    <article class="stat-card">
      <div class="stat-top">
        <span>工具总数</span
        ><span class="stat-icon mint"
          ><span class="iconfont icon-gongnengdingyi" aria-hidden="true"></span
        ></span>
      </div>
      <div class="stat-value">
        {{ formatNumber(store.data.tools.length) }}<small>个</small>
        <div class="sparkline">
          <HomeChart
            :option="sparklineOptions.tools"
            label="工具数量变化示例，非真实统计"
          />
        </div>
      </div>
      <div class="stat-bottom">
        <span class="stat-positive">{{ published }} 个已上架</span
        ><span>持续丰富工具箱</span>
      </div>
    </article>
    <article class="stat-card">
      <div class="stat-top">
        <span>累计使用次数</span
        ><span class="stat-icon blue"
          ><span
            class="iconfont icon-tubiao-zhexiantu"
            aria-hidden="true"
          ></span
        ></span>
      </div>
      <div class="stat-value">
        {{ formatNumber(totalUses) }}<small>次</small>
        <div class="sparkline">
          <HomeChart
            :option="sparklineOptions.uses"
            label="工具使用变化示例，非真实统计"
          />
        </div>
      </div>
      <div class="stat-bottom">
        <span class="muted">示例统计</span><span>全部工具累计</span>
      </div>
    </article>
    <article class="stat-card">
      <div class="stat-top">
        <span>用户总数</span
        ><span class="stat-icon purple"
          ><span class="iconfont icon-zuzhiqunzu" aria-hidden="true"></span
        ></span>
      </div>
      <div class="stat-value">
        {{ formatNumber(store.data.members.length) }}<small>人</small>
        <div class="sparkline">
          <HomeChart
            :option="sparklineOptions.members"
            label="用户数量变化示例，非真实统计"
          />
        </div>
      </div>
      <div class="stat-bottom">
        <span class="stat-positive"
          >{{
            store.data.members.filter((m) => m.status === 'active').length
          }}
          个正常账号</span
        ><span>示例用户</span>
      </div>
    </article>
    <article class="stat-card">
      <div class="stat-top">
        <span>待跟进反馈</span
        ><span class="stat-icon orange"
          ><span class="iconfont icon-xiaoxi" aria-hidden="true"></span
        ></span>
      </div>
      <div class="stat-value">
        {{ pending.toString().padStart(2, '0') }}<small>条</small
        ><router-link to="/feedback" class="stat-arrow" aria-label="查看反馈"
          ><span class="iconfont icon-xiayibu" aria-hidden="true"></span
        ></router-link>
      </div>
      <div class="stat-bottom">
        <span class="stat-warning"
          >{{
            store.data.feedback.filter((f) => f.status === 'pending').length
          }}
          条待处理</span
        ><span>每个声音都值得倾听</span>
      </div>
    </article>
  </section>
</template>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 23px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e8eeea;
  border-radius: 9px;
  padding: 18px 19px 14px;
  min-width: 0;
}
.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #89988f;
  font-size: 11px;
}
.stat-value {
  font-size: 30px;
  font-weight: 650;
  letter-spacing: -1px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 6px 0 12px;
  line-height: 1.3;
  font-variant-numeric: tabular-nums;
}
.stat-value small {
  font-size: 10px;
  color: #a1aaa5;
  font-weight: 400;
  letter-spacing: 0;
}
.sparkline {
  flex-shrink: 0;
  width: 67px;
  height: 32px;
  margin-left: auto;
}
.stat-bottom {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  font-size: 9px;
  color: #a4ada7;
  border-top: 1px solid #f0f3f1;
  padding-top: 11px;
  white-space: nowrap;
}
.stat-positive {
  color: #739b7e;
}
.stat-warning {
  color: #c0a16e;
}
.stat-arrow {
  display: grid;
  place-items: center;
  margin-left: auto;
  background: #faf6ed;
  border-radius: 50%;
  width: 27px;
  height: 27px;
  color: #c0a16e;
}
@media (max-width: 1280px) {
  .stats-grid {
    gap: 13px;
  }
  .stat-card {
    padding: 16px 14px 13px;
  }
  .stat-value {
    font-size: 27px;
    gap: 5px;
  }
  .sparkline {
    width: 47px;
  }
  .stat-bottom {
    font-size: 8px;
  }
}
@media (max-width: 1080px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .stat-bottom > span:last-child {
    display: none;
  }
  .stat-value {
    font-size: 25px;
  }
  .stat-value small {
    font-size: 8px;
  }
  .sparkline {
    width: 35px;
  }
}
@media (max-width: 880px) {
  .stats-grid {
    gap: 15px;
  }
  .stat-value {
    font-size: 28px;
  }
  .sparkline {
    width: 45px;
  }
}
@media (max-width: 650px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 17px;
  }
  .stat-card {
    padding: 13px 14px 12px;
  }
  .stat-top {
    font-size: 10px;
  }
  .stat-value {
    font-size: 27px;
    margin: 6px 0 10px;
  }
  .stat-bottom {
    padding-top: 9px;
    font-size: 9px;
  }
  .sparkline {
    width: 48px;
    height: 29px;
  }
}
</style>
