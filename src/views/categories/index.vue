<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryEditDialog from './components/CategoryEditDialog.vue'
import { useAdminStore } from '@/store/admin'
import type { Category } from './types'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 列表搜索关键字。 */
const query = ref('')
/** 模块编辑弹窗实例，通过公开方法打开新增或编辑界面。 */
const editDialogRef = ref<InstanceType<typeof CategoryEditDialog>>()
/** 按筛选条件和排序值排列的分类列表。 */
const categories = computed(() =>
  [...store.data.categories]
    .filter((c) => `${c.name} ${c.description}`.includes(query.value.trim()))
    .sort((a, b) => a.sort - b.sort),
)
/** 统计指定分类当前包含的工具数量。 */
const count = (id: string) =>
  store.data.tools.filter((t) => t.categoryId === id).length
/** 调用模块弹窗公开的打开方法。 */
function open(category?: Category) {
  editDialogRef.value?.open(category)
}
/** 展示确认提示后删除当前记录，并更新本地操作日志。 */
async function remove(c: Category) {
  if (count(c.id)) {
    ElMessage.warning('请先将该分类下的工具移至其他分类，再删除分类')
    return
  }
  try {
    await ElMessageBox.confirm(`确认删除「${c.name}」分类？`, '删除分类', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    store.data.categories = store.data.categories.filter(
      (item) => item.id !== c.id,
    )
    store.log('删除分类', c.name)
    ElMessage.success('分类已删除')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div>
    <div class="page-heading">
      <div>
        <div class="eyebrow">CATEGORIES</div>
        <h1>分类管理<span class="heading-dot">.</span></h1>
        <p>有序整理，让好工具更容易被发现。</p>
      </div>
      <button class="button primary" @click="open()">
        <span
          class="iconfont icon-icon_tianjia"
          style="font-size: 17px"
          aria-hidden="true"
        ></span
        >新增分类
      </button>
    </div>
    <div class="section-toolbar">
      <span
        >全部分类 <b>{{ store.data.categories.length }}</b></span
      ><el-input
        v-model="query"
        clearable
        placeholder="搜索分类"
        aria-label="搜索分类"
        class="search-input"
        ><template #prefix
          ><span
            class="iconfont icon-sousuofangda"
            style="font-size: 17px"
            aria-hidden="true"
          ></span></template
      ></el-input>
    </div>
    <div class="category-grid">
      <article v-for="c in categories" :key="c.id" class="panel category-card">
        <div class="category-card-top">
          <span
            class="large-tool-icon"
            :style="{ color: c.color, background: c.color + '15' }"
            ><span
              :class="c.icon"
              class="iconfont"
              style="font-size: 27px"
              aria-hidden="true"
            ></span></span
          ><span class="sort-label">排序 {{ c.sort }}</span>
        </div>
        <h2>{{ c.name }}</h2>
        <p>{{ c.description || '还没有添加分类描述' }}</p>
        <div class="category-card-count">
          <strong>{{ count(c.id) }}</strong
          ><span>个工具</span
          ><router-link
            :to="`/tools?category=${c.id}`"
            class="icon-button"
            :aria-label="`查看${c.name}工具`"
            ><span
              class="iconfont icon-xiayibu"
              style="font-size: 18px"
              aria-hidden="true"
            ></span
          ></router-link>
        </div>
        <div class="category-card-footer">
          <button @click="open(c)">
            <span
              class="iconfont icon-bianji"
              style="font-size: 15px"
              aria-hidden="true"
            ></span
            >编辑分类</button
          ><button class="danger-text" @click="remove(c)">删除</button>
        </div>
      </article>
      <button class="add-category-card" @click="open()">
        <span
          ><span
            class="iconfont icon-icon_tianjia"
            style="font-size: 28px"
            aria-hidden="true"
          ></span></span
        ><strong>创建新分类</strong>
        <p>为新的灵感留一个位置</p>
      </button>
    </div>
    <el-empty
      v-if="query && !categories.length"
      description="未找到匹配的分类"
    />
    <p class="page-hint">
      <span
        class="iconfont icon-xinxikongxin"
        style="font-size: 15px"
        aria-hidden="true"
      ></span
      >分类按排序值从小到大显示。已有工具的分类需要先迁移工具后才能删除。
    </p>
    <CategoryEditDialog ref="editDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
.section-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 21px;
  gap: 15px;
  color: #7d9082;
  font-size: 12px;
}
.section-toolbar b {
  font-size: 10px;
  background: #e9f0e9;
  padding: 3px 7px;
  border-radius: 4px;
  margin-left: 7px;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}
.category-card {
  padding: 24px 24px 0;
}
.category-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 21px;
}
.large-tool-icon {
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}
.sort-label {
  font-size: 10px;
  color: #b1b9b2;
}
.category-card h2 {
  font-size: 17px;
  font-weight: 550;
}
.category-card > p {
  font-size: 11px;
  color: #9ca99e;
  margin-top: 7px;
  min-height: 36px;
}
.category-card-count {
  display: flex;
  align-items: baseline;
  gap: 7px;
  padding: 15px 0 21px;
}
.category-card-count strong {
  font-size: 28px;
  font-weight: 600;
}
.category-card-count > span {
  color: #a5b0a7;
  font-size: 10px;
}
.category-card-count a {
  margin-left: auto;
}
.category-card-footer {
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  font-size: 11px;
  color: #85a18b;
}
.category-card-footer button {
  display: flex;
  align-items: center;
  gap: 6px;
}
.add-category-card {
  border: 1px dashed #d9e4db;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 282px;
  color: #a2b6a5;
  background: #f8faf7;
}
.add-category-card:hover {
  border-color: #8eb29a;
  background: #f2f7f0;
}
.add-category-card > span {
  background: #edf3e9;
  border-radius: 50%;
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  margin-bottom: 15px;
}
.add-category-card strong {
  font-size: 13px;
  font-weight: 500;
}
.add-category-card p {
  font-size: 10px;
  margin-top: 7px;
  color: #acb8ac;
}
@media (max-width: 1280px) {
  .category-grid {
    gap: 17px;
  }
  .category-card {
    padding: 21px 20px 0;
  }
}
@media (max-width: 1080px) {
  .category-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 650px) {
  .category-grid {
    gap: 13px;
  }
  .category-card {
    padding: 17px 16px 0;
  }
  .category-card h2 {
    font-size: 15px;
  }
  .category-card > p {
    font-size: 10px;
    min-height: 40px;
  }
  .category-card-top {
    margin-bottom: 16px;
  }
  .sort-label {
    font-size: 8px;
  }
  .large-tool-icon {
    width: 39px;
    height: 39px;
    border-radius: 9px;
  }
  .category-card-count {
    padding: 12px 0 17px;
  }
  .category-card-count strong {
    font-size: 24px;
  }
  .category-card-count > span {
    font-size: 9px;
  }
  .category-card-footer {
    font-size: 10px;
  }
  .category-card-footer button {
    gap: 4px;
  }
  .add-category-card {
    min-height: 260px;
  }
  .add-category-card p {
    font-size: 9px;
  }
}
</style>
