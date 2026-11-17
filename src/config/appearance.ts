import { glyphs } from '@/assets/iconfont/iconfont.json'

/** 工具与分类编辑共用的 Iconfont 图标类。 */
export const toolIcons = [
  'icon-zitidaima',
  'icon-xingzhuang-tupian',
  'icon-xingzhuang-wenzi',
  'icon-liujisuan',
  'icon-charulianjie',
  'icon-renwujincheng',
  'icon-shiyongwendang',
  'icon-moshubang',
]
/** 工具与分类编辑共用的主题色选项。 */
export const colors = [
  '#20866c',
  '#6284d9',
  '#b482d5',
  '#dc9b45',
  '#d87f81',
  '#5f9dab',
]

/** 字体包中实际存在的图标类，用于校验本地保存的图标。 */
export const iconfontClasses = new Set(
  glyphs.map((glyph) => `icon-${glyph.font_class}`),
)

/** 兼容旧版本保存的语义图标名，统一转换成当前 Iconfont 图标类。 */
export const legacyIconClasses: Record<string, string> = {
  grid: 'icon-shujukanban',
  toolbox: 'icon-gongnengdingyi',
  layers: 'icon-fenzuguanli',
  users: 'icon-zuzhiqunzu',
  message: 'icon-xiaoxi',
  settings: 'icon-icon_shezhi',
  search: 'icon-sousuofangda',
  plus: 'icon-icon_tianjia',
  arrow: 'icon-xiayibu',
  chevron: 'icon-xiayibu1',
  down: 'icon-xiajiantou',
  trend: 'icon-tubiao-zhexiantu',
  download: 'icon-yunduanxiazai',
  bell: 'icon-xiaoxitongzhi',
  clock: 'icon-renwujincheng',
  check: 'icon-duigou',
  close: 'icon-guanbi',
  logout: 'icon-icon_rukou',
  menu: 'icon-liebiao',
  code: 'icon-zitidaima',
  image: 'icon-xingzhuang-tupian',
  type: 'icon-xingzhuang-wenzi',
  calculator: 'icon-liujisuan',
  link: 'icon-charulianjie',
  spark: 'icon-moshubang',
  info: 'icon-xinxikongxin',
  file: 'icon-shiyongwendang',
  edit: 'icon-bianji',
}
