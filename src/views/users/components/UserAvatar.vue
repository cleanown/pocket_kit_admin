<script setup lang="ts">
import type { UserAvatarProps } from '../types'
// 设置头像显示值、来源配色与尺寸默认值。
withDefaults(defineProps<UserAvatarProps>(), { platform: '', large: false })
</script>

<template>
  <span
    class="member-avatar"
    :class="[platform.toLowerCase(), { 'is-large': large }]"
    >{{ name.slice(-2) }}</span
  >
</template>

<style lang="scss" scoped>
.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #90a186;
  background: #edf2e9;
  font-size: 12px;
}
.member-avatar.uniapp {
  background: #f4eef7;
  color: #a391b5;
}
.member-avatar.web {
  background: #eef3f8;
  color: #8da4ba;
}

.member-avatar.is-large {
  width: 72px;
  height: 72px;
  margin: 0 auto 15px;
  font-size: 24px;
}
</style>
