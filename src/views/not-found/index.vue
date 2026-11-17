<script setup lang="ts">
import logoUrl from '@/assets/images/logo.png'
</script>

<template>
  <main class="not-found">
    <img class="brand-mark" :src="logoUrl" alt="百宝箱 Logo" />
    <strong>404</strong>
    <h1>这个口袋里，还没有内容</h1>
    <p>页面不存在，回工作台看看吧。</p>
    <router-link to="/" class="button primary"
      >返回工作台
      <span
        class="iconfont icon-xiayibu"
        style="font-size: 16px"
        aria-hidden="true"
      ></span
    ></router-link>
  </main>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  background: #f1f6ee;
}
.not-found > strong {
  font-size: 100px;
  line-height: 1;
  letter-spacing: -7px;
  color: #9aba92;
  font-weight: 500;
}
.not-found h1 {
  font-size: 24px;
  color: #6b8564;
}
.not-found p {
  font-size: 12px;
  color: #9daf95;
}
.not-found .button {
  margin-top: 10px;
}
@media (max-width: 650px) {
  .not-found h1 {
    font-size: 21px;
  }
}
</style>
