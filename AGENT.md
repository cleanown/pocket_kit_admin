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
2.组件或父级文件夹命令一律采用大驼峰命名，例：src/components/Upload/index.vue，src/components/Upload/VideoUpload.vue，src/views/user/components/UserSummary.vue，src/views/user/components/UserEdit.vue
```
常规规范：
```
1.所有生成的变量，方法等都需要添加注释
2.尽量使用已有引入的插件，框架，公共方法，公共组件
3.所有的编辑，详情，一律使用element plus的el-dialog组件去呈现，类似这些需要弹窗统一做成组件放置于同模块的components下，便于管理
4.页面代码不得超过1000行，超出需拆分组件化
5.所有的网络请求，使用以下模板
src/api/user.ts:
export function getList(params: Record<any, any>) {
  return request("POST", "/getList", params)
}
src/views/user/index.vue:
import { getList } from "@/api/user.ts"
const isTableLoading = ref(false) //如果需要loading
const _getList = async () => {
  // isTableLoading.value = true //如果需要loading
  const res = await getList({
    id: "1"
  })
  // isTableLoading.value = false //如果需要loading
  if (res.code == 200) {
    //进行数据处理
  }
}
6.所有的公共工具方法放入src/utils/index.ts
7.style.scss只存放公共样式，页面样式在页面文件内编写
8.所有的模拟数据全部放入src/mock/
9.样式命名统一使用短横线命名
10.方法命名使用小驼峰命名，如果是页面网络请求方法，使用下划线+小驼峰命名，例：_getList
11.图片文件命名统一使用蛇形命名，图片全部统一放在src/assets/images/，命名需按模块正规合理，避免冲突
12.数据类型定义应分别放在同模块下的types文件夹内
13.普通使用pinia store,需中间加上Info,例：const userInfoStore = userStore()，const layoutInfoStore = layoutStore()
```