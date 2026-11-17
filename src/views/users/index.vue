<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminStore } from '@/store/admin'
import type { Member } from './types'
import UserAvatar from './components/UserAvatar.vue'
import UserDetailDialog from './components/UserDetailDialog.vue'
import { toCsv, formatDate, downloadFile } from '@/utils/index'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 列表搜索关键字。 */
const query = ref('')
/** 列表当前选择的状态筛选值。 */
const status = ref('')
/** 当前选择的用户注册来源筛选值。 */
const platform = ref('')
/** 列表当前页码，每页展示八条记录。 */
const page = ref(1)
/** 模块详情弹窗实例，通过公开方法展示选中记录。 */
const detailDialogRef = ref<InstanceType<typeof UserDetailDialog>>()
/** 将选中用户交给模块详情弹窗展示。 */
function showDetail(member: Member) {
  detailDialogRef.value?.open(member)
}
/** 按当前搜索内容与筛选条件匹配的列表。 */
const filtered = computed(() =>
  store.data.members.filter(
    (m) =>
      (!query.value ||
        `${m.name} ${m.email} ${m.id}`
          .toLowerCase()
          .includes(query.value.trim().toLowerCase())) &&
      (!status.value || status.value === m.status) &&
      (!platform.value || platform.value === m.platform),
  ),
)
/** 同步依赖状态变化，更新列表页码或持久保存本地数据。 */
watch([query, status, platform], () => {
  page.value = 1
})
/** 确认所需操作后切换本地记录的启用或发布状态。 */
async function toggle(member: Member) {
  try {
    await ElMessageBox.confirm(
      `确认${member.status === 'active' ? '停用' : '启用'}「${member.name}」的演示账号？`,
      '修改用户状态',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' },
    )
    member.status = member.status === 'active' ? 'disabled' : 'active'
    store.log(
      '修改用户状态',
      `${member.name} · ${member.status === 'active' ? '已启用' : '已停用'}`,
    )
    ElMessage.success('用户状态已更新')
  } catch {
    /* cancelled */
  }
}
/** 将当前筛选结果导出为用户列表 CSV 文件。 */
function exportUsers() {
  downloadFile(
    'PocketKit-用户列表.csv',
    toCsv([
      ['用户ID', '昵称', '邮箱', '来源', '状态', '注册时间'],
      ...filtered.value.map((m) => [
        m.id,
        m.name,
        m.email,
        m.platform,
        m.status === 'active' ? '正常' : '已停用',
        formatDate(m.joinedAt),
      ]),
    ]),
    'text/csv;charset=utf-8',
  )
  ElMessage.success(`已导出 ${filtered.value.length} 个用户`)
}
</script>

<template>
  <div>
    <div class="page-heading">
      <div>
        <div class="eyebrow">COMMUNITY</div>
        <h1>用户管理<span class="heading-dot">.</span></h1>
        <p>每一次使用背后，都是一个真实的需求。</p>
      </div>
      <button class="button" @click="exportUsers">
        <span
          class="iconfont icon-yunduanxiazai"
          style="font-size: 17px"
          aria-hidden="true"
        ></span
        >导出列表
      </button>
    </div>
    <div class="mini-stats">
      <div>
        <span class="stat-icon mint"
          ><span
            class="iconfont icon-zuzhiqunzu"
            aria-hidden="true"
          ></span></span
        ><span
          >全部用户<strong>{{ store.data.members.length }}</strong></span
        >
      </div>
      <div>
        <span class="stat-icon blue"
          ><span class="iconfont icon-duigou" aria-hidden="true"></span></span
        ><span
          >正常账号<strong>{{
            store.data.members.filter((m) => m.status === 'active').length
          }}</strong></span
        >
      </div>
      <div>
        <span class="stat-icon orange"
          ><span
            class="iconfont icon-renwujincheng"
            aria-hidden="true"
          ></span></span
        ><span
          >已停用<strong>{{
            store.data.members.filter((m) => m.status === 'disabled').length
          }}</strong></span
        >
      </div>
    </div>
    <section class="panel">
      <div class="filter-bar">
        <el-input
          v-model="query"
          clearable
          class="search-input"
          placeholder="搜索昵称、邮箱或用户 ID"
          aria-label="搜索用户"
          ><template #prefix
            ><span
              class="iconfont icon-sousuofangda"
              style="font-size: 17px"
              aria-hidden="true"
            ></span></template></el-input
        ><el-select
          v-model="platform"
          clearable
          placeholder="全部来源"
          aria-label="筛选用户来源"
          class="category-select"
          ><el-option
            v-for="p in ['Flutter', 'UniApp', 'Web']"
            :key="p"
            :label="p"
            :value="p" /></el-select
        ><el-select
          v-model="status"
          clearable
          placeholder="全部状态"
          aria-label="筛选用户状态"
          class="category-select"
          ><el-option label="正常" value="active" /><el-option
            label="已停用"
            value="disabled"
        /></el-select>
      </div>
      <el-table :data="filtered.slice((page - 1) * 8, page * 8)"
        ><el-table-column label="用户" min-width="240"
          ><template #default="{ row }"
            ><div class="tool-cell">
              <UserAvatar :name="row.name" :platform="row.platform" /><span
                ><strong>{{ row.name }}</strong
                ><small>{{ row.email }}</small></span
              >
            </div></template
          ></el-table-column
        ><el-table-column
          prop="id"
          label="用户 ID"
          min-width="110" /><el-table-column label="注册来源" min-width="110"
          ><template #default="{ row }"
            ><span class="category-tag">{{ row.platform }}</span></template
          ></el-table-column
        ><el-table-column label="状态" min-width="100"
          ><template #default="{ row }"
            ><span
              class="status"
              :class="row.status === 'active' ? 'published' : 'offline'"
              ><i></i>{{ row.status === 'active' ? '正常' : '已停用' }}</span
            ></template
          ></el-table-column
        ><el-table-column label="注册时间" min-width="125"
          ><template #default="{ row }">{{
            formatDate(row.joinedAt)
          }}</template></el-table-column
        ><el-table-column label="操作" width="160" fixed="right"
          ><template #default="{ row }"
            ><div class="row-actions">
              <button @click="showDetail(row)">详情</button
              ><button
                :class="{ 'danger-text': row.status === 'active' }"
                @click="toggle(row)"
              >
                {{ row.status === 'active' ? '停用' : '启用' }}
              </button>
            </div></template
          ></el-table-column
        ><template #empty
          ><el-empty
            description="未找到匹配的用户"
            :image-size="90" /></template
      ></el-table>
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
      >用户为演示账号，邮箱使用 example.com。账号状态尚未连接服务端权限控制。
    </p>
    <UserDetailDialog ref="detailDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 21px;
  margin-bottom: 24px;
}
.mini-stats > div {
  padding: 22px 25px;
  border-radius: 9px;
  border: 1px solid #e8ede8;
  background: white;
  display: flex;
  gap: 17px;
  align-items: center;
}
.mini-stats .stat-icon {
  width: 43px;
  height: 43px;
}
.mini-stats > div > span:last-child {
  font-size: 11px;
  color: #98a49a;
}
.mini-stats strong {
  display: block;
  font-size: 26px;
  color: #3d5744;
  font-weight: 600;
  line-height: 1.4;
}
@media (max-width: 650px) {
  .mini-stats {
    gap: 10px;
  }
  .mini-stats > div {
    padding: 16px 12px;
    gap: 9px;
  }
  .mini-stats .stat-icon {
    display: none;
  }
  .mini-stats > div > span:last-child {
    font-size: 10px;
  }
  .mini-stats strong {
    font-size: 24px;
  }
}
</style>
