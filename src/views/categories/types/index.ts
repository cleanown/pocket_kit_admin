/** 工具分类记录。 */
export interface Category {
  /** 记录唯一标识。 */
  id: string
  /** 界面展示名称。 */
  name: string
  /** 功能或应用说明。 */
  description: string
  /** 主题颜色值。 */
  color: string
  /** Iconfont 图标类名，例如 icon-zitidaima。 */
  icon: string
  /** 分类显示顺序，数值越小越靠前。 */
  sort: number
}

/** 分类编辑表单字段。 */
export type CategoryForm = Omit<Category, 'id'>
