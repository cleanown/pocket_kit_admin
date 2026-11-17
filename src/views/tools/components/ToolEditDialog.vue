<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAdminStore } from '@/store/admin'
import { colors, toolIcons } from '@/config/appearance'
import type { Tool, ToolForm, ToolEditDialogEmits } from '../types'
/** 工具编辑弹窗的事件发送器，用于通知父页面清理路由参数。 */
const emit = defineEmits<ToolEditDialogEmits>()
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 当前模块弹窗的显示状态。 */
const dialog = ref(false)
/** Element Plus 表单实例，用于校验和清理校验结果。 */
const formRef = ref<FormInstance>()
/** 当前编辑记录的标识，空字符串代表新增记录。 */
const editing = ref('')
/** 根据工具记录创建独立的编辑表单，未传记录时使用新增默认值。 */
function createToolForm(tool?: Tool): ToolForm {
  return {
    name: tool?.name || '',
    slug: tool?.slug || '',
    description: tool?.description || '',
    categoryId: tool?.categoryId || store.data.categories[0]?.id || '',
    icon: tool?.icon || 'icon-moshubang',
    color: tool?.color || colors[0]!,
    status: tool?.status || 'draft',
    featured: tool?.featured ?? false,
  }
}
/** 编辑中的表单副本，保存前不直接修改已展示的数据。 */
const form = reactive<ToolForm>(createToolForm())
/** 当前模块的表单校验规则。 */
const rules: FormRules = {
  name: [
    {
      required: true,
      whitespace: true,
      message: '请输入工具名称',
      trigger: 'blur',
    },
    { max: 30, message: '最多 30 个字符', trigger: 'blur' },
  ],
  slug: [
    { required: true, message: '请输入工具标识', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      message: '使用小写字母、数字和短横线',
      trigger: 'blur',
    },
    { max: 60, message: '最多 60 个字符', trigger: 'blur' },
    {
      // 工具标识在当前工具之外必须保持唯一。
      validator: (_, value, callback) =>
        callback(
          store.data.tools.some(
            (t) => t.slug === value && t.id !== editing.value,
          )
            ? new Error('该工具标识已存在')
            : undefined,
        ),
      trigger: 'blur',
    },
  ],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [
    {
      required: true,
      whitespace: true,
      message: '请输入工具描述',
      trigger: 'blur',
    },
    { max: 150, message: '最多 150 个字符', trigger: 'blur' },
  ],
}
/** 初始化当前记录并打开模块弹窗。 */
function open(tool?: Tool) {
  editing.value = tool?.id || ''
  Object.assign(form, createToolForm(tool))
  dialog.value = true
  formRef.value?.clearValidate()
}
/** 校验并保存当前编辑内容，再关闭弹窗。 */
async function save() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  /** 保存前整理和规范化后的数据。 */
  const values = {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
    updatedAt: new Date().toISOString(),
  }
  if (editing.value) {
    /** 当前路由或编辑标识对应的工具记录。 */
    const tool = store.data.tools.find((t) => t.id === editing.value)
    if (tool) Object.assign(tool, values)
  } else
    store.data.tools.unshift({ ...values, id: crypto.randomUUID(), uses: 0 })
  store.log(editing.value ? '更新工具信息' : '创建工具', form.name)
  dialog.value = false
  ElMessage.success('工具已保存到本地')
}

// 向工具页面公开弹窗入口。
defineExpose({ open })
</script>

<template>
  <el-dialog
    v-model="dialog"
    :title="editing ? '编辑工具' : '添加工具'"
    width="580px"
    destroy-on-close
    @close="emit('close')"
    ><el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="save"
      ><div class="form-grid">
        <el-form-item label="工具名称" prop="name"
          ><el-input
            v-model="form.name"
            placeholder="例如：二维码生成"
            maxlength="30" /></el-form-item
        ><el-form-item label="工具标识" prop="slug"
          ><el-input
            v-model="form.slug"
            placeholder="例如：qr-code"
            maxlength="60"
        /></el-form-item>
      </div>
      <el-form-item label="工具描述" prop="description"
        ><el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="150"
          show-word-limit
          placeholder="用一句话介绍这个工具"
      /></el-form-item>
      <div class="form-grid">
        <el-form-item label="所属分类" prop="categoryId"
          ><el-select v-model="form.categoryId" placeholder="请选择分类"
            ><el-option
              v-for="c in store.data.categories"
              :key="c.id"
              :label="c.name"
              :value="c.id" /></el-select
          ><small v-if="!store.data.categories.length"
            >请先到分类管理创建分类。</small
          ></el-form-item
        ><el-form-item label="发布状态"
          ><el-select v-model="form.status"
            ><el-option label="草稿" value="draft" /><el-option
              label="已上架"
              value="published" /><el-option
              label="已下架"
              value="offline" /></el-select
        ></el-form-item>
      </div>
      <el-form-item label="工具图标"
        ><div class="icon-options">
          <button
            v-for="item in toolIcons"
            :key="item"
            type="button"
            :aria-label="`选择 ${item} 图标`"
            :aria-pressed="form.icon === item"
            :class="{ selected: form.icon === item }"
            @click="form.icon = item"
          >
            <span :class="item" class="iconfont" aria-hidden="true"></span>
          </button></div
      ></el-form-item>
      <el-form-item label="主题颜色"
        ><div class="color-options">
          <button
            v-for="item in colors"
            :key="item"
            type="button"
            :aria-label="`选择颜色 ${item}`"
            :aria-pressed="form.color === item"
            :style="{ background: item }"
            @click="form.color = item"
          >
            <span
              v-if="form.color === item"
              class="iconfont icon-duigou"
              style="font-size: 17px"
              aria-hidden="true"
            ></span>
          </button></div
      ></el-form-item>
      <el-form-item label="首页推荐"
        ><el-switch v-model="form.featured" /><span class="switch-help"
          >在推荐列表中展示该工具</span
        ></el-form-item
      ></el-form
    ><template #footer
      ><button class="button" @click="dialog = false">取消</button
      ><button class="button primary" @click="save">保存工具</button></template
    ></el-dialog
  >
</template>

<style lang="scss" scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
.icon-options {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.icon-options button {
  width: 39px;
  height: 39px;
  border: 1px solid #e6ece7;
  border-radius: 7px;
  color: #9bac9e;
  display: grid;
  place-items: center;
}
.icon-options button.selected {
  background: #edf6ef;
  border-color: #8eb69d;
  color: #608e6d;
}
.color-options {
  display: flex;
  gap: 12px;
}
.color-options button {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
}
@media (max-width: 650px) {
  .icon-options {
    gap: 6px;
  }
  .icon-options button {
    width: 34px;
    height: 34px;
  }
}
</style>
