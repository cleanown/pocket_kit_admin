/**
 * 格式化时间
 * @param value Date、日期字符串或毫秒时间戳
 * @param format 格式模板，默认 yyyy-MM-dd HH:mm:ss
 */
export function formatTime(
  value: Date | string | number | null | undefined,
  format = 'yyyy-MM-dd HH:mm:ss',
): string {
  if (value == null || value === '') return '';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (num: number, length = 2) =>
    String(num).padStart(length, '0');

  const tokens: Record<string, string> = {
    yyyy: pad(date.getFullYear(), 4),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
  };

  return format.replace(
    /yyyy|MM|dd|HH|mm|ss|SSS/g,
    (token) => tokens[token]!,
  );
}