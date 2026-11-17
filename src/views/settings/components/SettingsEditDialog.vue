<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { useAdminStore } from '@/store/admin'
import type { Settings, DialogClose } from '../types'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 当前模块弹窗的显示状态。 */
const dialog = ref(false)
/** 编辑中的表单副本，保存前不直接修改已展示的数据。 */
const form = reactive<Settings>({ ...store.data.settings })
/** Element Plus 表单实例，用于校验和清理校验结果。 */
const formRef = ref<FormInstance>()
/** 当前模块的表单校验规则。 */
const rules: FormRules = {
  name: [
    {
      required: true,
      whitespace: true,
      message: '请输入应用名称',
      trigger: 'blur',
    },
    { max: 30, message: '最多 30 个字符', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }],
  description: [{ max: 150, message: '最多 150 个字符', trigger: 'blur' }],
}
/** 判断当前设置表单相对于已保存数据是否发生修改。 */
function dirty() {
  return JSON.stringify(form) !== JSON.stringify(store.data.settings)
}
/** 初始化当前记录并打开模块弹窗。 */
function open() {
  Object.assign(form, store.data.settings)
  dialog.value = true
}
/** 在弹窗关闭或路由离开前统一确认是否放弃未保存的设置。 */
async function canDiscardChanges() {
  if (!dialog.value || !dirty()) return true
  try {
    await ElMessageBox.confirm('设置尚未保存，确认放弃修改？', '未保存的修改', {
      confirmButtonText: '放弃修改',
      cancelButtonText: '继续编辑',
    })
    return true
  } catch {
    return false
  }
}
/** 关闭设置弹窗前检查未保存修改，并允许取消关闭。 */
async function confirmClose(done: DialogClose) {
  if (await canDiscardChanges()) done()
}
/** 保留原设置页面的路由离开保护，包括浏览器前进或后退操作。 */
onBeforeRouteLeave(canDiscardChanges)
/** 通过未保存修改检查后关闭设置编辑弹窗。 */
function cancel() {
  confirmClose(() => {
    dialog.value = false
  })
}
/** 校验并保存当前编辑内容，再关闭弹窗。 */
async function save() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  store.data.settings = { ...form, name: form.name.trim() }
  Object.assign(form, store.data.settings)
  store.log('更新系统设置', form.name)
  ElMessage.success('设置已保存到本地')
  dialog.value = false
}
// 向设置页面公开编辑弹窗入口。
defineExpose({ open })
</script>

<template>
  <el-dialog
    v-model="dialog"
    title="编辑系统设置"
    width="560px"
    destroy-on-close
    :before-close="confirmClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="save"
      ><el-form-item label="应用名称" prop="name"
        ><el-input v-model="form.name" maxlength="30" /></el-form-item
      ><el-form-item label="应用介绍" prop="description"
        ><el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="150"
          show-word-limit /></el-form-item
      ><el-form-item label="联系邮箱" prop="email"
        ><el-input
          v-model="form.email"
          placeholder="hello@example.com" /></el-form-item
      ><el-form-item label="开放用户注册"
        ><el-switch v-model="form.registration" aria-label="开放用户注册"
      /></el-form-item>
      <el-form-item label="维护模式"
        ><el-switch v-model="form.maintenance" aria-label="维护模式"
      /></el-form-item>
    </el-form>
    <p class="page-hint">运行开关仅保存本地演示配置，尚未接入客户端。</p>
    <template #footer
      ><button class="button" @click="cancel">取消</button
      ><button class="button primary" @click="save">保存设置</button></template
    >
  </el-dialog>
</template>
