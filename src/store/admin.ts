import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { createSeed } from '@/mock/seed'
import { getIconfontClass } from '@/utils/index'
import type { AdminData } from './types'
/** 本地演示数据的存储键，保留既有键名以兼容已保存内容。 */
const STORAGE_KEY = 'pocket-kit-admin-demo-v1'
/** 创建管理端演示数据仓库，并将修改同步到浏览器存储。 */
export const useAdminStore = defineStore('admin', () => {
  /** 浏览器存储读取或写入异常时展示的提示。 */
  const storageError = ref('')
  /** 读取并检查已保存的数据结构，失败时使用初始演示数据。 */
  function read(): AdminData {
    try {
      /** 从浏览器存储读取的原始 JSON 文本。 */
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        /** 解析后的存储内容，需检查版本及数据集合再使用。 */
        const parsed = JSON.parse(raw) as AdminData
        if (
          parsed.version === 1 &&
          (
            [
              'tools',
              'categories',
              'members',
              'feedback',
              'activities',
            ] as const
          ).every((k) => Array.isArray(parsed[k])) &&
          parsed.settings
        ) {
          // 读取时转换历史图标名，保留已有工具、分类及其他本地数据。
          parsed.tools.forEach((tool) => {
            tool.icon = getIconfontClass(tool.icon)
          })
          parsed.categories.forEach((category) => {
            category.icon = getIconfontClass(category.icon)
          })
          return parsed
        }
        storageError.value = '本地数据版本不匹配，已加载默认演示数据。'
      }
    } catch {
      storageError.value = '无法读取本地数据，已加载默认演示数据。'
    }
    return createSeed()
  }
  /** 管理端工具、分类、用户、反馈、动态和设置的响应式集合。 */
  const data = ref<AdminData>(read())
  /** 同步依赖状态变化，更新列表页码或持久保存本地数据。 */
  watch(
    data,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
        storageError.value = ''
      } catch {
        storageError.value =
          '浏览器存储不可用，本次修改刷新后可能丢失。请导出备份。'
      }
    },
    { deep: true, flush: 'sync' },
  )
  /** 记录本地管理操作，并最多保留最近 50 条动态。 */
  function log(title: string, detail: string) {
    data.value.activities.unshift({
      id: crypto.randomUUID(),
      title,
      detail,
      time: new Date().toISOString(),
    })
    data.value.activities = data.value.activities.slice(0, 50)
  }
  /** 恢复初始演示数据；页面入口在执行前展示确认提示。 */
  function reset() {
    data.value = createSeed()
    log('重置演示数据', '已恢复初始内容')
  }
  /** 根据分类标识获取展示名称，缺失时回退为未分类。 */
  function categoryName(id: string) {
    return data.value.categories.find((c) => c.id === id)?.name || '未分类'
  }
  return { data, log, reset, categoryName, storageError }
})
