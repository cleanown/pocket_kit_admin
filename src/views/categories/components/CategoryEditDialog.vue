<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAdminStore } from '@/store/admin'
import { colors, toolIcons } from '@/config/appearance'
import type { Category, CategoryForm } from '../types'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 当前模块弹窗的显示状态。 */
const dialog = ref(false)
/** 当前编辑记录的标识，空字符串代表新增记录。 */
const editing = ref('')
/** Element Plus 表单实例，用于校验和清理校验结果。 */
const formRef = ref<FormInstance>()
/** 编辑中的表单副本，保存前不直接修改已展示的数据。 */
const form = reactive<CategoryForm>({
  name: '',
  description: '',
  icon: 'icon-moshubang',
  color: colors[0]!,
  sort: 1,
})
/** 当前模块的表单校验规则。 */
const rules: FormRules = {
  name: [
    {
      required: true,
      whitespace: true,
      message: '请输入分类名称',
      trigger: 'blur',
    },
    { max: 20, message: '最多 20 个字符', trigger: 'blur' },
    {
      // 分类名称去除首尾空白后不得与其他分类重复。
      validator: (_, value, cb) =>
        cb(
          store.data.categories.some(
            (c) => c.name === value.trim() && c.id !== editing.value,
          )
            ? new Error('分类名称已存在')
            : undefined,
        ),
      trigger: 'blur',
    },
  ],
  description: [{ max: 80, message: '最多 80 个字符', trigger: 'blur' }],
}
/** 初始化当前记录并打开模块弹窗。 */
function open(c?: Category) {
  editing.value = c?.id || ''
  Object.assign(
    form,
    c || {
      name: '',
      description: '',
      icon: 'icon-moshubang',
      color: colors[0]!,
      sort: Math.max(0, ...store.data.categories.map((c) => c.sort)) + 1,
    },
  )
  dialog.value = true
}
/** 校验并保存当前编辑内容，再关闭弹窗。 */
async function save() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  /** 保存前整理和规范化后的数据。 */
  const values = {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
  }
  /** 根据当前标识找到的已有记录。 */
  const existing = store.data.categories.find((c) => c.id === editing.value)
  if (existing) Object.assign(existing, values)
  else store.data.categories.push({ ...values, id: crypto.randomUUID() })
  store.log(existing ? '更新分类' : '创建分类', values.name)
  dialog.value = false
  ElMessage.success('分类已保存')
}
// 向分类页面公开弹窗入口。
defineExpose({ open })
</script>

<template>
  <el-dialog
    v-model="dialog"
    :title="editing ? '编辑分类' : '新增分类'"
    width="520px"
    destroy-on-close
    ><el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      @submit.prevent="save"
      ><el-form-item label="分类名称" prop="name"
        ><el-input
          v-model="form.name"
          maxlength="20"
          placeholder="例如：生活实用" /></el-form-item
      ><el-form-item label="分类描述" prop="description"
        ><el-input
          v-model="form.description"
          type="textarea"
          maxlength="80"
          show-word-limit
          :rows="2" /></el-form-item
      ><el-form-item label="分类图标"
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
      <el-form-item label="显示排序"
        ><el-input-number
          v-model="form.sort"
          :min="1"
          :max="999"
          :precision="0"
        /><span class="switch-help">数值越小，排序越靠前</span></el-form-item
      ></el-form
    ><template #footer
      ><button class="button" @click="dialog = false">取消</button
      ><button class="button primary" @click="save">保存分类</button></template
    ></el-dialog
  >
</template>

<style lang="scss" scoped>
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
