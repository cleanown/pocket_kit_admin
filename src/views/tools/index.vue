<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ToolEditDialog from './components/ToolEditDialog.vue'
import { useAdminStore } from '@/store/admin'
import type { Tool } from './types'
import { toCsv, formatDate, downloadFile, formatNumber } from '@/utils/index'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 当前路由，用于读取查询条件和页面信息。 */
const route = useRoute()
/** 路由实例，用于页面跳转及同步查询参数。 */
const router = useRouter()
/** 列表搜索关键字。 */
const query = ref('')
/** 当前选择的分类筛选标识。 */
const category = ref('')
/** 列表当前选择的状态筛选值。 */
const status = ref('all')
/** 列表当前页码，每页展示八条记录。 */
const page = ref(1)
/** 当前操作选中的记录。 */
const selected = ref<Tool[]>([])
/** 工具使用次数的排序方向，空值使用原始顺序。 */
const sortOrder = ref('')
/** 模块编辑弹窗实例，通过公开方法打开新增或编辑界面。 */
const editDialogRef = ref<InstanceType<typeof ToolEditDialog>>()
/** 清空工具搜索、分类、状态和排序条件。 */
function resetFilters() {
  query.value = ''
  category.value = ''
  status.value = 'all'
  sortOrder.value = ''
}
/** 按当前搜索内容与筛选条件匹配的列表。 */
const filtered = computed(() =>
  store.data.tools.filter(
    (t) =>
      (!query.value ||
        `${t.name} ${t.slug} ${t.description}`
          .toLowerCase()
          .includes(query.value.trim().toLowerCase())) &&
      (!category.value || t.categoryId === category.value) &&
      (status.value === 'all' || t.status === status.value),
  ),
)
/** 按照使用次数排序规则整理后的工具列表。 */
const sorted = computed(() =>
  sortOrder.value
    ? [...filtered.value].sort((a, b) =>
        sortOrder.value === 'ascending' ? a.uses - b.uses : b.uses - a.uses,
      )
    : filtered.value,
)
/** 当前页需要展示的工具记录。 */
const paginated = computed(() =>
  sorted.value.slice((page.value - 1) * 8, page.value * 8),
)
/** 同步依赖状态变化，更新列表页码或持久保存本地数据。 */
watch([query, category, status, sortOrder], () => {
  page.value = 1
})
/** 同步依赖状态变化，更新列表页码或持久保存本地数据。 */
watch(
  () => filtered.value.length,
  (count) => {
    page.value = Math.min(page.value, Math.max(1, Math.ceil(count / 8)))
  },
)
/** 调用模块弹窗公开的打开方法。 */
function open(tool?: Tool) {
  editDialogRef.value?.open(tool)
}
/** 读取路由搜索、分类及新增编辑参数，组件挂载后打开对应弹窗。 */
function applyRouteQuery() {
  /** 当前路由中的查询参数。 */
  const params = route.query
  query.value = typeof params.q === 'string' ? params.q : ''
  category.value = typeof params.category === 'string' ? params.category : ''
  if (params.create) open()
  if (params.edit) {
    /** 当前路由或编辑标识对应的工具记录。 */
    const tool = store.data.tools.find((item) => item.id === params.edit)
    if (tool) open(tool)
  }
}
/** 同步依赖状态变化，更新列表页码或持久保存本地数据。 */
watch(() => route.query, applyRouteQuery)
/** 组件挂载完成后执行初始化逻辑。 */
onMounted(applyRouteQuery)
/** 展示确认提示后删除当前记录，并更新本地操作日志。 */
async function remove(tool: Tool) {
  try {
    await ElMessageBox.confirm(
      `确认删除「${tool.name}」？删除后无法撤销。`,
      '删除工具',
      {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
      },
    )
    store.data.tools = store.data.tools.filter((t) => t.id !== tool.id)
    store.log('删除工具', tool.name)
    ElMessage.success('工具已删除')
  } catch {
    /* cancelled */
  }
}
/** 确认后将选中工具批量下架，并记录操作动态。 */
async function batchOffline() {
  if (!selected.value.length) return
  try {
    await ElMessageBox.confirm(
      `将选中的 ${selected.value.length} 个工具全部下架？`,
      '批量下架',
      { confirmButtonText: '确认下架', cancelButtonText: '取消' },
    )
    selected.value.forEach((t) => {
      t.status = 'offline'
      t.updatedAt = new Date().toISOString()
    })
    store.log('批量下架工具', `${selected.value.length} 个工具`)
    ElMessage.success('已批量下架')
  } catch {
    /* cancelled */
  }
}
/** 切换工具上架状态，并记录本地操作动态。 */
function toggle(tool: Tool) {
  tool.status = tool.status === 'published' ? 'offline' : 'published'
  tool.updatedAt = new Date().toISOString()
  store.log(tool.status === 'published' ? '上架工具' : '下架工具', tool.name)
  ElMessage.success('状态已更新')
}
/** 将当前筛选结果导出为工具列表 CSV 文件。 */
function exportTools() {
  downloadFile(
    'PocketKit-工具列表.csv',
    toCsv([
      ['工具名称', '工具标识', '分类', '描述', '状态', '使用次数'],
      ...filtered.value.map((t) => [
        t.name,
        t.slug,
        store.categoryName(t.categoryId),
        t.description,
        { published: '已上架', draft: '草稿', offline: '已下架' }[t.status],
        t.uses,
      ]),
    ]),
    'text/csv;charset=utf-8',
  )
  ElMessage.success(`已导出 ${filtered.value.length} 个工具`)
}
/** 在工具弹窗开始关闭时移除编辑参数，避免关闭动画干扰后续跳转。 */
function closeDialog() {
  if (route.path === '/tools' && (route.query.create || route.query.edit)) {
    /** 提取需要移除的新增编辑参数，并保留其余查询条件。 */
    const { create: _create, edit: _edit, ...rest } = route.query
    router.replace({ query: rest })
  }
}
</script>

<template>
  <div>
    <div class="page-heading">
      <div>
        <div class="eyebrow">TOOL LIBRARY</div>
        <h1>工具管理<span class="heading-dot">.</span></h1>
        <p>让每个实用工具，都有自己的位置。</p>
      </div>
      <div class="heading-actions">
        <button class="button" @click="exportTools">
          <span
            class="iconfont icon-yunduanxiazai"
            style="font-size: 17px"
            aria-hidden="true"
          ></span
          >导出列表</button
        ><button class="button primary" @click="open()">
          <span
            class="iconfont icon-icon_tianjia"
            style="font-size: 17px"
            aria-hidden="true"
          ></span
          >添加工具
        </button>
      </div>
    </div>
    <section class="panel">
      <div class="list-tabs">
        <button
          v-for="tab in [
            { value: 'all', label: '全部工具' },
            { value: 'published', label: '已上架' },
            { value: 'draft', label: '草稿' },
            { value: 'offline', label: '已下架' },
          ]"
          :key="tab.value"
          :class="{ active: status === tab.value }"
          @click="status = tab.value"
        >
          {{ tab.label
          }}<span>{{
            store.data.tools.filter(
              (t) => tab.value === 'all' || t.status === tab.value,
            ).length
          }}</span>
        </button>
      </div>
      <div class="filter-bar">
        <el-input
          v-model="query"
          placeholder="搜索工具名称、标识或描述"
          clearable
          class="search-input"
          aria-label="搜索工具名称、标识或描述"
          ><template #prefix
            ><span
              class="iconfont icon-sousuofangda"
              style="font-size: 17px"
              aria-hidden="true"
            ></span></template></el-input
        ><el-select
          v-model="category"
          placeholder="全部分类"
          clearable
          aria-label="筛选分类"
          class="category-select"
          ><el-option
            v-for="c in store.data.categories"
            :key="c.id"
            :label="c.name"
            :value="c.id" /></el-select
        ><el-select
          v-model="sortOrder"
          aria-label="工具排序"
          class="category-select"
          ><el-option label="默认排序" value="" /><el-option
            label="使用次数从高到低"
            value="descending" /><el-option
            label="使用次数从低到高"
            value="ascending" /></el-select
        ><span class="filter-spacer"></span
        ><span class="muted">共 {{ filtered.length }} 个工具</span>
      </div>
      <div v-if="selected.length" class="selection-bar">
        已选择 {{ selected.length }} 个工具
        <button class="text-link" @click="batchOffline">批量下架</button>
      </div>
      <el-table
        :data="paginated"
        row-key="id"
        @selection-change="selected = $event"
        ><el-table-column type="selection" width="48" /><el-table-column
          label="工具名称"
          min-width="235"
          ><template #default="{ row }"
            ><div class="tool-cell">
              <span
                class="tool-icon"
                :style="{ background: row.color + '15', color: row.color }"
                ><span
                  :class="row.icon"
                  class="iconfont"
                  aria-hidden="true"
                ></span></span
              ><span
                ><strong
                  >{{ row.name
                  }}<span v-if="row.featured" class="featured-label"
                    >推荐</span
                  ></strong
                ><small>{{ row.slug }}</small></span
              >
            </div></template
          ></el-table-column
        ><el-table-column label="所属分类" min-width="110"
          ><template #default="{ row }"
            ><span class="category-tag">{{
              store.categoryName(row.categoryId)
            }}</span></template
          ></el-table-column
        ><el-table-column label="状态" width="105"
          ><template #default="{ row }"
            ><span class="status" :class="row.status"
              ><i></i
              >{{
                { published: '已上架', draft: '草稿', offline: '已下架' }[
                  row.status as Tool['status']
                ]
              }}</span
            ></template
          ></el-table-column
        ><el-table-column label="使用次数" min-width="110" prop="uses"
          ><template #default="{ row }"
            ><span class="tabular">{{ formatNumber(row.uses) }}</span></template
          ></el-table-column
        ><el-table-column label="更新时间" min-width="120"
          ><template #default="{ row }">{{
            formatDate(row.updatedAt)
          }}</template></el-table-column
        ><el-table-column label="操作" width="188" fixed="right"
          ><template #default="{ row }"
            ><div class="row-actions">
              <button @click="open(row)">编辑</button
              ><button @click="toggle(row)">
                {{ row.status === 'published' ? '下架' : '上架' }}</button
              ><el-dropdown trigger="click"
                ><button
                  class="more-button"
                  :aria-label="`${row.name}更多操作`"
                >
                  •••</button
                ><template #dropdown
                  ><el-dropdown-menu
                    ><el-dropdown-item @click="remove(row)"
                      >删除工具</el-dropdown-item
                    ></el-dropdown-menu
                  ></template
                ></el-dropdown
              >
            </div></template
          ></el-table-column
        ><template #empty
          ><el-empty
            description="没有找到工具，试试其他筛选条件"
            :image-size="90"
            ><button class="button" @click="resetFilters">
              清除筛选
            </button></el-empty
          ></template
        ></el-table
      >
      <div class="table-footer">
        <span>共 {{ filtered.length }} 条记录 · 每页 8 条</span
        ><el-pagination
          v-model:current-page="page"
          :page-size="8"
          :total="filtered.length"
          layout="prev, pager, next"
          background
        />
      </div>
    </section>
    <p class="page-hint">
      <span
        class="iconfont icon-xinxikongxin"
        style="font-size: 15px"
        aria-hidden="true"
      ></span
      >当前为本地演示。上架、推荐等操作只更新管理数据，尚未同步至客户端。
    </p>
    <ToolEditDialog ref="editDialogRef" @close="closeDialog" />
  </div>
</template>

<style lang="scss" scoped>
.selection-bar {
  padding: 10px 24px;
  background: #f1f7f2;
  color: #6a8c72;
  display: flex;
  gap: 20px;
  font-size: 11px;
}
.featured-label {
  display: inline-block;
  background: #faf3e5;
  color: #b9a06d;
  border-radius: 3px;
  padding: 0 4px;
  margin-left: 7px;
  font-size: 8px;
  font-weight: 400;
  vertical-align: middle;
}
.more-button {
  letter-spacing: 2px;
  color: #a0ada2 !important;
}
</style>
