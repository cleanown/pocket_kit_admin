<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/store/admin'
import { formatDate } from '@/utils/index'
import { feedbackLabels as labels } from '../config'
import type { Feedback, FeedbackForm } from '../types'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 当前模块弹窗的显示状态。 */
const dialog = ref(false)
/** 当前操作选中的记录。 */
const selected = ref<Feedback>()
/** 编辑中的表单副本，保存前不直接修改已展示的数据。 */
const form = reactive<FeedbackForm>({ status: 'pending', reply: '' })
/** 初始化当前记录并打开模块弹窗。 */
function open(f: Feedback) {
  selected.value = f
  form.status = f.status
  form.reply = f.reply
  dialog.value = true
}
/** 保存反馈状态与内部处理记录，再关闭弹窗。 */
function save() {
  if (!selected.value) return
  selected.value.status = form.status
  selected.value.reply = form.reply.trim()
  store.log('处理用户反馈', selected.value.title)
  ElMessage.success('处理记录已保存到本地')
  dialog.value = false
}
// 向反馈页面公开详情与处理入口。
defineExpose({ open })
</script>

<template>
  <el-dialog v-model="dialog" title="反馈详情" width="580px" destroy-on-close
    ><template v-if="selected"
      ><div class="feedback-detail">
        <span class="category-tag">{{ selected.type }}</span>
        <h2>{{ selected.title }}</h2>
        <small
          >{{ selected.member }} ·
          {{ formatDate(selected.createdAt, true) }}</small
        >
        <p>{{ selected.content }}</p>
      </div>
      <el-form label-position="top"
        ><el-form-item label="处理状态"
          ><el-select v-model="form.status"
            ><el-option
              v-for="(label, value) in labels"
              :key="value"
              :label="label"
              :value="value" /></el-select></el-form-item
        ><el-form-item label="内部处理记录"
          ><el-input
            v-model="form.reply"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="记录排查进展或处理结果，不会发送给用户" /></el-form-item></el-form></template
    ><template #footer
      ><button class="button" @click="dialog = false">取消</button
      ><button class="button primary" @click="save">
        保存处理记录
      </button></template
    ></el-dialog
  >
</template>

<style lang="scss" scoped>
.feedback-detail h2 {
  font-size: 18px;
  margin: 12px 0 4px;
}
.feedback-detail small {
  font-size: 10px;
  color: #acb6ad;
}
.feedback-detail p {
  padding: 18px;
  margin: 18px 0 25px;
  background: #f6f9f4;
  border-radius: 7px;
  color: #849888;
  line-height: 1.9;
  font-size: 12px;
}
</style>
