/** 管理端保存的应用演示配置。 */
export interface Settings {
  /** 界面展示名称。 */
  name: string
  /** 功能或应用说明。 */
  description: string
  /** 联系邮箱。 */
  email: string
  /** 是否开放注册的演示配置。 */
  registration: boolean
  /** 是否启用维护模式的演示配置。 */
  maintenance: boolean
}

/** Element Plus 弹窗的关闭回调。 */
export type DialogClose = () => void
