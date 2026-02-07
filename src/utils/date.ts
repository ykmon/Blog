/**
 * 日期格式化工具
 * 数据源统一使用 ISO 格式 (YYYY-MM-DD)，展示时按需格式化
 */

const MONTH_NAMES_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * 格式化为英文短日期：Jan 21, 2026
 */
export function formatDateEN(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTH_NAMES_EN[month - 1]} ${day}, ${year}`;
}

/**
 * 格式化为中文月日：1月21日
 */
export function formatDateCN(iso: string): string {
  const [, month, day] = iso.split('-').map(Number);
  return `${month}月${day}日`;
}

/**
 * 安全解析 ISO 日期为时间戳（用于排序）
 * 比 new Date(string) 更可靠，不受时区/浏览器差异影响
 */
export function parseISODate(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}
