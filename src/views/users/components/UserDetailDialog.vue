<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'
import { ref } from 'vue'
import { formatDate, formatNumber } from '@/utils/index'
import type { Member } from '../types'
/** 详情弹窗当前展示的用户记录。 */
const detail = ref<Member>()
/** 当前模块弹窗的显示状态。 */
const dialog = ref(false)
/** 初始化当前记录并打开模块弹窗。 */
function open(member: Member) {
  detail.value = member
  dialog.value = true
}
// 向用户页面公开详情弹窗入口。
defineExpose({ open })
</script>

<template>
  <el-dialog v-model="dialog" title="用户详情" width="430px" destroy-on-close
    ><template v-if="detail"
      ><div class="member-profile">
        <UserAvatar :name="detail.name" large />
        <h2>{{ detail.name }}</h2>
        <p>{{ detail.email }}</p>
      </div>
      <dl class="detail-list">
        <div>
          <dt>用户 ID</dt>
          <dd>{{ detail.id }}</dd>
        </div>
        <div>
          <dt>账号状态</dt>
          <dd>{{ detail.status === 'active' ? '正常' : '已停用' }}</dd>
        </div>
        <div>
          <dt>注册来源</dt>
          <dd>{{ detail.platform }}</dd>
        </div>
        <div>
          <dt>注册时间</dt>
          <dd>{{ formatDate(detail.joinedAt) }}</dd>
        </div>
        <div>
          <dt>最近活跃</dt>
          <dd>{{ formatDate(detail.lastActive, true) }}</dd>
        </div>
        <div>
          <dt>工具使用次数</dt>
          <dd>{{ formatNumber(detail.uses) }}</dd>
        </div>
      </dl>
      <div class="detail-note">以上信息均为演示数据。</div></template
    ></el-dialog
  >
</template>

<style lang="scss" scoped>
.member-profile {
  text-align: center;
  padding: 12px 0 30px;
}
.member-profile h2 {
  font-size: 20px;
}
.member-profile p {
  color: #9ca89f;
  font-size: 12px;
  margin-top: 8px;
}
.detail-note {
  padding: 25px 0;
  text-align: center;
  color: #a4afa5;
  font-size: 11px;
}
</style>
