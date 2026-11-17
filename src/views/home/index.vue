<script setup lang="ts">
import HomeWelcome from './components/HomeWelcome.vue'
import HomeStats from './components/HomeStats.vue'
import HomeTrendChart from './components/HomeTrendChart.vue'
import HomeCategoryChart from './components/HomeCategoryChart.vue'
import HomePopularTools from './components/HomePopularTools.vue'
import HomeActivity from './components/HomeActivity.vue'
/** 工作台顶部展示的本地日期与星期。 */
const today = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())
</script>

<template>
  <div class="dashboard">
    <div class="page-heading">
      <div>
        <div class="eyebrow">OVERVIEW</div>
        <h1>工作台<span class="heading-dot">.</span></h1>
        <p>欢迎回来，管理员。这里是百宝箱的最新概况。</p>
      </div>
      <div class="heading-actions">
        <span class="today"
          ><span
            class="iconfont icon-renwujincheng"
            style="font-size: 16px"
            aria-hidden="true"
          ></span
          >{{ today }}</span
        ><router-link class="button primary" to="/tools?create=1"
          ><span
            class="iconfont icon-icon_tianjia"
            style="font-size: 17px"
            aria-hidden="true"
          ></span
          >添加工具</router-link
        >
      </div>
    </div>
    <HomeWelcome />
    <HomeStats />
    <div class="dashboard-charts">
      <HomeTrendChart />
      <HomeCategoryChart />
    </div>
    <div class="dashboard-bottom">
      <HomePopularTools />
      <HomeActivity />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.today {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #929d96;
  font-size: 10px;
  margin-right: 5px;
}
@media (max-width: 1280px) {
  .today {
    display: none;
  }
}
.dashboard-charts,
.dashboard-bottom {
  display: grid;
  grid-template-columns: minmax(0, 2.12fr) minmax(270px, 1fr);
  gap: 22px;
  margin-bottom: 23px;
}
.dashboard-bottom {
  margin-bottom: 0;
}
@media (max-width: 1280px) {
  .dashboard-charts,
  .dashboard-bottom {
    gap: 18px;
    grid-template-columns: minmax(0, 1.9fr) minmax(245px, 1fr);
  }
}
@media (max-width: 1080px) {
  .dashboard-charts,
  .dashboard-bottom {
    grid-template-columns: minmax(0, 1.7fr) minmax(230px, 1fr);
  }
}
@media (max-width: 880px) {
  .dashboard-charts,
  .dashboard-bottom {
    grid-template-columns: minmax(0, 1.8fr) minmax(240px, 1fr);
  }
}
@media (max-width: 650px) {
  .dashboard-charts,
  .dashboard-bottom {
    grid-template-columns: 1fr;
    gap: 17px;
    margin-bottom: 17px;
  }
}
</style>
