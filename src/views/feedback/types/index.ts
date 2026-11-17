/** 用户反馈与内部处理记录。 */
export interface Feedback {
  /** 记录唯一标识。 */
  id: string
  /** 提交反馈的演示用户名称。 */
  member: string
  /** 记录标题。 */
  title: string
  /** 用户提交的反馈正文。 */
  content: string
  /** 反馈类型。 */
  type: '建议' | '问题'
  /** 当前记录的业务状态。 */
  status: 'pending' | 'processing' | 'resolved'
  /** 反馈提交时间。 */
  createdAt: string
  /** 内部处理记录，不向用户发送消息。 */
  reply: string
}

/** 反馈处理弹窗可编辑的字段。 */
export type FeedbackForm = Pick<Feedback, 'status' | 'reply'>
