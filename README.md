项目开发严格按照AGENT.md要求

## 本地开发

```bash
npm run dev
npm run build
```

`npm run build` 包含 TypeScript 检查与生产打包。

## 代码目录

```text
src/
  assets/images/             # 图片资源，使用蛇形命名
  components/                # 仅存放全局公共组件
  config/                    # 共用的非模拟配置
  layout/
    components/              # 布局专属组件
    types/                   # 布局属性与事件类型
  mock/                      # 初始演示数据、模拟趋势
  store/
    types/                   # 仓库聚合数据类型
  utils/index.ts             # 公共工具方法
  views/<module>/
    components/              # 模块专属组件与 el-dialog 弹窗
    types/                   # 模块业务与组件类型
    index.vue                # 页面与页面样式
  style.scss                 # 共享主题、基础样式与组件库公共样式
```

工具、分类、用户详情、反馈处理和系统设置弹窗各自放在所属模块的 `components` 中。页面通过弹窗公开的 `open` 方法传入当前记录；编辑使用表单副本，保存后更新现有 Pinia 仓库。

页面组件在所属模块的 `components` 下平铺为大驼峰命名的 Vue 文件，类型统一放在模块的 `types` 下。外观选择控件直接写在工具和分类各自的编辑弹窗内，不再单独包装页面子组件。

图标统一使用已全局引入的 Iconfont 字体类，直接在页面使用 `<span class="iconfont icon-bianji" aria-hidden="true"></span>`。工具和分类图标均保存字体包内的实际类名，读取本地数据时兼容旧版图标名。

目前业务数据仍是本地演示数据，继续使用原存储键以保留当前浏览器中已有内容。服务端请求后续按 `AGENT.md` 的 `src/api` 封装规范接入。

## 导航

导航使用 Element Plus 的 `el-menu`、`el-sub-menu` 和 `el-menu-item` 构成二级菜单。“工作空间”和“系统”为可展开、收起的一级导航，现有页面为二级导航；当前页面对应的分组自动展开，选中项与路由同步。宽度从 768px 起，侧栏固定常驻左侧，内容区按侧栏宽度留出空间；小于 768px 使用 `el-drawer`，选择二级菜单或完成路由跳转后自动收起。侧栏内容统一由布局模块的 `SideBar.vue` 提供。

路由统一维护在 `src/router/index.ts`，使用“顶层布局 → 子页面”两级结构。导航直接读取顶层路由的 `children`，不需要额外的菜单入口标记或分组配置。过滤隐藏页面后，只有一个子页面则直接显示该页面；多个子页面则显示分组，名称和图标优先使用父路由的 `meta`，未配置时使用首个可见子页面。子路径不以 `/` 开头时会拼接父路径，以 `/` 开头时保留绝对路径。`meta.hidden` 隐藏菜单，`meta.badge` 控制角标。多个分组可同时展开，PC 支持折叠图标导航，移动端使用抽屉导航。

## 图表

所有图表统一使用 ECharts。工作台组件在 `src/views/home/components` 下平铺，直接引用同级的 `HomeChart.vue`。ECharts 按需注册、容器缩放、配置更新和实例销毁均集中在该 Vue 文件内，类型统一放在 `src/views/home/types/index.ts` 中，不再为图表组件建立额外目录或注册文件。

工作台的使用趋势、分类环形图和统计卡片迷你折线均使用该组件；统计卡片直接生成配置并调用 `HomeChart.vue`，不再经过迷你图表包装组件。模拟趋势数据统一存放在 `src/mock/home.ts`。
