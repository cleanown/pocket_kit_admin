import { iconfontClasses, legacyIconClasses } from '@/config/appearance'

/** 将子路由与父路径合并为菜单使用的绝对路径，保留绝对子路径。 */
export function resolveRoutePath(path: string, parentPath = ''): string {
  return (
    (path.startsWith('/') ? path : `${parentPath}/${path}`)
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '') || '/'
  )
}

/**
 * 格式化时间
 * @param value Date、日期字符串或毫秒时间戳
 * @param format 格式模板，默认 yyyy-MM-dd HH:mm:ss
 */
export function formatTime(
  value: Date | string | number | null | undefined,
  format = 'yyyy-MM-dd HH:mm:ss',
): string {
  if (value == null || value === '') return ''

  /** 将传入值转换为可格式化的日期对象。 */
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  /** 将日期各部分补齐为指定长度的数字字符串。 */
  const pad = (num: number, length = 2) => String(num).padStart(length, '0')

  /** 日期模板标记与对应格式化值的映射。 */
  const tokens: Record<string, string> = {
    yyyy: pad(date.getFullYear(), 4),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
  }

  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, (token) => tokens[token]!)
}

/** 按中文数字分组规则格式化统计值。 */
export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value)
}
/** 复用公共时间方法，生成列表日期或月日时分文本。 */
export function formatDate(value: string, time = false) {
  return formatTime(value, time ? 'MM/dd HH:mm' : 'yyyy/MM/dd')
}
/** 将内存文本生成为下载文件，并在下载后释放临时地址。 */
export function downloadFile(
  filename: string,
  content: string,
  type = 'application/json',
) {
  /** 当前下载内容的临时 Blob 地址。 */
  const url = URL.createObjectURL(new Blob([content], { type }))
  /** 触发浏览器文件下载的临时链接。 */
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
/** 生成带 UTF-8 标记的 CSV，并转义引号及表格公式前缀。 */
export function toCsv(rows: (string | number)[][]) {
  return (
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value)
                .replace(/^[=+@\-\t\r]/, "'$&")
                .replace(/"/g, '""')}"`,
          )
          .join(','),
      )
      .join('\r\n')
  )
}

/** 返回指定天数之前的 ISO 时间，供演示数据生成使用。 */
export function daysAgo(days: number) {
  /** 用于推算相对日期的临时日期对象。 */
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

/** 将旧图标名或字体图标类转换为字体包内有效的 Iconfont 类。 */
export function getIconfontClass(value: string | null | undefined): string {
  /** 旧名称优先转换；无效或缺失的图标统一使用功能图标兜底。 */
  const iconClass = legacyIconClasses[value || ''] || value || ''
  return iconfontClasses.has(iconClass) ? iconClass : 'icon-gongnengdingyi'
}
