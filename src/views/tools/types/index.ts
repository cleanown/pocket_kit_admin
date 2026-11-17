/** 工具管理记录。 */
export interface Tool {
  /** 记录唯一标识。 */
  id: string
  /** 界面展示名称。 */
  name: string
  /** 工具的小写英文唯一标识。 */
  slug: string
  /** 功能或应用说明。 */
  description: string
  /** 所属分类标识。 */
  categoryId: string
  /** Iconfont 图标类名，例如 icon-zitidaima。 */
  icon: string
  /** 主题颜色值。 */
  color: string
  /** 当前记录的业务状态。 */
  status: 'published' | 'draft' | 'offline'
  /** 是否在首页推荐。 */
  featured: boolean
  /** 累计使用次数。 */
  uses: number
  /** 最近更新时间。 */
  updatedAt: string
}

/** 新增和编辑工具使用的表单字段。 */
export type ToolForm = Omit<Tool, 'id' | 'uses' | 'updatedAt'>

/** 工具编辑弹窗对父页面发出的事件。 */
export interface ToolEditDialogEmits {
  /** 工具编辑弹窗开始关闭，立即清理路由参数。 */
  close: []
}
