# 百宝箱管理系统

### 项目操作
项目启动：
```
npm run dev
```
项目打包：
```
npm run build
```
### 开发规范
组件规范：
```
1.全局公共组件一律放到src/components内，页面组件一律放到当前文件同目录的components下
2.组件或父级文件夹命令一律采用大驼峰命名，允许 Upload/index.vue 和 Upload/VideoUpload.vue 等结构，例：src/components/Upload/index.vue，src/components/Upload/VideoUpload.vue，src/views/user/components/UserSummary.vue，src/views/user/components/UserEdit.vue
```
常规规范：
```
1.所有生成的变量，方法等都需要添加中文注释,包括参数、回调参数、循环变量、解构变量
2.尽量使用已有引入的插件，框架，公共方法，公共组件
3.所有列表内容的编辑，详情，一律使用element plus的el-dialog组件去呈现，类似这些需要弹窗统一做成组件放置于同模块的components下，便于管理
4.整个 Vue 文件合计不超过1000行，不计空白行和纯注释行
5.所有的网络请求，异常我都在request.ts里面做了处理，loading都在页面内处理，res.code == 200在request.ts里面封装好了，页面内网络请求简单化，参考下面模板
src/api/user.ts:
/**
 * 获取用户列表。
 * @param params 用户列表查询参数。
 * @returns 用户列表请求结果。
 */
export function getList(params: Record<any, any>) {
  return request("POST", "/getList", params)
}
src/views/user/index.vue:
import { getList } from "@/api/user.ts"
// 表格是否正在加载，需要 loading 时使用。
const isTableLoading = ref(false)
// 请求用户列表并处理页面数据。
const _getList = async () => {
  // isTableLoading.value = true //如果需要loading
  // 用户列表请求结果。
  const res = await getList({
    // 查询使用的用户标识。
    id: "1"
  })
  // isTableLoading.value = false //如果需要loading
  if (res.code == 200) {
    //进行数据处理
  }
}
6.所有的公共工具方法放入src/utils/index.ts，例时间格式化，类型判断等
7.style.scss只存放公共样式，页面样式在页面文件内编写
8.所有的模拟数据全部放入src/mock/
9.样式命名统一使用短横线命名
10.方法命名使用小驼峰命名，如果是页面网络请求方法，使用下划线+小驼峰命名，例：_getList
11.图片文件命名统一使用蛇形命名，图片全部统一放在src/assets/images/，命名需按模块正规合理，避免冲突
12.数据类型定义应分别放在同目录模块下的types文件夹内,多个模块共享的类型放src/types/内，接口类型放页面模块内
13.页面内使用pinia store,需中间加上Info,例：const userInfoStore = userStore()，const layoutInfoStore = layoutStore()
14.禁止自动提交代码，所有代码都需要人工检查，人工提交
```
### 最终声明
```
该规范适用于整个项目，不论是新增还是修改
每次生成的代码都要验证一下是否通过
```
