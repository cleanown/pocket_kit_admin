/** 用户管理演示记录。 */
export interface Member {
  /** 记录唯一标识。 */
  id: string
  /** 界面展示名称。 */
  name: string
  /** 联系邮箱。 */
  email: string
  /** 用户来源平台，头像组件中用于选择配色。 */
  platform: 'Flutter' | 'UniApp' | 'Web'
  /** 当前记录的业务状态。 */
  status: 'active' | 'disabled'
  /** 用户注册时间。 */
  joinedAt: string
  /** 用户最近活跃时间。 */
  lastActive: string
  /** 累计使用次数。 */
  uses: number
}

/** 用户模块头像组件的展示属性。 */
export interface UserAvatarProps {
  /** 界面展示名称。 */
  name: string
  /** 用户来源平台，头像组件中用于选择配色。 */
  platform?: string
  /** 是否展示详情页的大尺寸头像。 */
  large?: boolean
}
