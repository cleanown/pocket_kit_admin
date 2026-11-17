<script setup lang="ts">
import { computed, ref } from 'vue'
import FeedbackDetailDialog from './components/FeedbackDetailDialog.vue'
import { useAdminStore } from '@/store/admin'
import { formatDate } from '@/utils/index'
import { feedbackLabels as labels } from './config'
import type { Feedback } from './types'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 列表当前选择的状态筛选值。 */
const status = ref('all')
/** 列表搜索关键字。 */
const query = ref('')
/** 模块详情弹窗实例，通过公开方法展示选中记录。 */
const detailDialogRef = ref<InstanceType<typeof FeedbackDetailDialog>>()
/** 按当前搜索内容与筛选条件匹配的列表。 */
const filtered = computed(() =>
  store.data.feedback.filter(
    (f) =>
      (status.value === 'all' || f.status === status.value) &&
      `${f.title} ${f.content} ${f.member}`.includes(query.value.trim()),
  ),
)
/** 调用模块弹窗公开的打开方法。 */
function open(feedback: Feedback) {
  detailDialogRef.value?.open(feedback)
}
</script>

<template>
  <div>
    <div class="page-heading">
      <div>
        <div class="eyebrow">FEEDBACK</div>
        <h1>意见反馈<span class="heading-dot">.</span></h1>
        <p>倾听每个声音，让百宝箱再好用一点。</p>
      </div>
      <span class="feedback-summary"
        ><span
          class="iconfont icon-xiaoxi"
          style="font-size: 18px"
          aria-hidden="true"
        ></span
        >{{
          store.data.feedback.filter((f) => f.status === 'pending').length
        }}
        条反馈等待处理</span
      >
    </div>
    <section class="panel">
      <div class="list-tabs">
        <button
          v-for="tab in [
            { value: 'all', label: '全部反馈' },
            ...Object.entries(labels).map(([value, label]) => ({
              value,
              label,
            })),
          ]"
          :key="tab.value"
          :class="{ active: status === tab.value }"
          @click="status = tab.value"
        >
          {{ tab.label
          }}<span>{{
            store.data.feedback.filter(
              (f) => tab.value === 'all' || f.status === tab.value,
            ).length
          }}</span>
        </button>
      </div>
      <div class="filter-bar">
        <el-input
          v-model="query"
          class="search-input"
          clearable
          placeholder="搜索反馈内容或用户"
          aria-label="搜索反馈"
          ><template #prefix
            ><span
              class="iconfont icon-sousuofangda"
              style="font-size: 17px"
              aria-hidden="true"
            ></span></template></el-input
        ><span class="filter-spacer"></span
        ><span class="muted">共 {{ filtered.length }} 条反馈</span>
      </div>
      <div class="feedback-list">
        <article v-for="f in filtered" :key="f.id" class="feedback-item">
          <span class="feedback-type-icon" :class="{ issue: f.type === '问题' }"
            ><span
              :class="
                f.type === '问题' ? 'icon-xinxikongxin' : 'icon-moshubang'
              "
              class="iconfont"
              style="font-size: 22px"
              aria-hidden="true"
            ></span
          ></span>
          <div class="feedback-body">
            <div class="feedback-title">
              <h2>
                <button @click="open(f)">{{ f.title }}</button>
              </h2>
              <span class="status" :class="f.status"
                ><i></i>{{ labels[f.status] }}</span
              >
            </div>
            <p>{{ f.content }}</p>
            <div class="feedback-meta">
              <span>{{ f.member }}</span
              ><span>{{ f.type }}</span
              ><span>{{ formatDate(f.createdAt, true) }}</span
              ><span>{{ f.id }}</span>
            </div>
            <div v-if="f.reply" class="feedback-reply">
              <strong>处理记录</strong>{{ f.reply }}
            </div>
          </div>
          <button class="button small" @click="open(f)">
            {{ f.status === 'resolved' ? '查看记录' : '处理反馈'
            }}<span
              class="iconfont icon-xiayibu"
              style="font-size: 14px"
              aria-hidden="true"
            ></span>
          </button>
        </article>
        <el-empty v-if="!filtered.length" description="暂无匹配的反馈" />
      </div>
    </section>
    <p class="page-hint">
      <span
        class="iconfont icon-xinxikongxin"
        style="font-size: 15px"
        aria-hidden="true"
      ></span
      >处理记录仅供本地演示使用，保存后不会向用户发送消息。
    </p>
    <FeedbackDetailDialog ref="detailDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
.feedback-summary {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 15px;
  border: 1px solid #eee5d0;
  border-radius: 7px;
  background: #fbf7ed;
  color: #ba9e6b;
  font-size: 11px;
}
.feedback-item {
  display: flex;
  gap: 17px;
  padding: 27px 24px;
  border-top: 1px solid #f0f3ef;
  align-items: flex-start;
}
.feedback-type-icon {
  width: 41px;
  height: 41px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #eef5ed;
  color: #88a582;
  flex-shrink: 0;
}
.feedback-type-icon.issue {
  background: #faf1eb;
  color: #c8a17e;
}
.feedback-body {
  flex: 1;
  min-width: 0;
}
.feedback-title {
  display: flex;
  gap: 13px;
  align-items: center;
}
.feedback-title h2 {
  font-size: 13px;
  font-weight: 500;
}
.feedback-title h2 button {
  text-align: left;
}
.feedback-body > p {
  font-size: 12px;
  color: #9aa79d;
  margin-top: 10px;
  line-height: 1.9;
}
.feedback-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 10px;
  color: #b1bbb2;
  margin-top: 15px;
}
.feedback-meta > span:not(:last-child)::after {
  content: '·';
  margin-left: 15px;
}
.feedback-reply {
  font-size: 11px;
  color: #a1aea3;
  padding: 11px 14px;
  background: #f7f9f5;
  border-radius: 5px;
  margin-top: 17px;
}
.feedback-reply strong {
  font-weight: 500;
  color: #7c967f;
  margin-right: 13px;
}
.feedback-item > .button {
  margin-top: 4px;
}
@media (max-width: 1080px) {
  .feedback-item {
    gap: 12px;
    padding: 22px 20px;
  }
  .feedback-title {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }
  .feedback-type-icon {
    width: 32px;
    height: 32px;
  }
}
@media (max-width: 650px) {
  .feedback-summary {
    display: none;
  }
  .feedback-item {
    padding: 22px 16px;
    flex-wrap: wrap;
  }
  .feedback-body {
    flex-basis: calc(100% - 50px);
  }
  .feedback-item > .button {
    margin-left: 44px;
  }
  .feedback-title h2 {
    font-size: 12px;
  }
  .feedback-body > p {
    font-size: 11px;
  }
  .feedback-meta {
    gap: 8px;
    font-size: 9px;
  }
  .feedback-meta > span:not(:last-child)::after {
    margin-left: 8px;
  }
}
</style>
