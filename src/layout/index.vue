<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div class="layout">
    <SideBar></SideBar>
    <div class="layout-content">
      <HeaderBar></HeaderBar>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout{
  
}
</style>