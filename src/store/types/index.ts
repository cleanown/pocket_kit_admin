import type { Tool } from '@/views/tools/types'
import type { Category } from '@/views/categories/types'
import type { Member } from '@/views/users/types'
import type { Feedback } from '@/views/feedback/types'
import type { Settings } from '@/views/settings/types'

/** 本地管理操作动态。 */
export interface Activity {
  /** 记录唯一标识。 */
  id: string
  /** 记录标题。 */
  title: string
  /** 操作动态的简要说明。 */
  detail: string
  /** 操作发生时间。 */
  time: string
}

/** 浏览器中持久保存的完整管理端演示数据。 */
export interface AdminData {
  /** 本地数据结构版本，用于兼容性检查。 */
  version: 1
  /** 工具记录集合。 */
  tools: Tool[]
  /** 分类记录集合。 */
  categories: Category[]
  /** 用户记录集合。 */
  members: Member[]
  /** 反馈记录集合。 */
  feedback: Feedback[]
  /** 最近操作动态集合。 */
  activities: Activity[]
  /** 应用演示配置。 */
  settings: Settings
}
