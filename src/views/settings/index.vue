<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SettingsEditDialog from './components/SettingsEditDialog.vue'
import { useAdminStore } from '@/store/admin'
import { downloadFile } from '@/utils/index'
/** 管理端共享状态，提供本地业务数据与操作记录。 */
const store = useAdminStore()
/** 模块编辑弹窗实例，通过公开方法打开新增或编辑界面。 */
const editDialogRef = ref<InstanceType<typeof SettingsEditDialog>>()
/** 调用模块弹窗公开的打开方法。 */
function open() {
  editDialogRef.value?.open()
}
/** 将当前本地管理数据导出为 JSON 备份文件。 */
function exportData() {
  downloadFile(
    `PocketKit-备份-${new Date().toLocaleDateString('sv-SE')}.json`,
    JSON.stringify(store.data, null, 2),
  )
  ElMessage.success('备份已导出')
}
/** 恢复初始演示数据；页面入口在执行前展示确认提示。 */
async function reset() {
  try {
    await ElMessageBox.confirm(
      '此操作会清除当前浏览器中的全部修改，并恢复初始演示数据。建议先导出备份。',
      '重置演示数据',
      {
        confirmButtonText: '确认重置',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
    store.reset()
    ElMessage.success('已恢复初始演示数据')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div>
    <div class="page-heading">
      <div>
        <div class="eyebrow">PREFERENCES</div>
        <h1>系统设置<span class="heading-dot">.</span></h1>
        <p>按你的方式，管理这个小小的工具世界。</p>
      </div>
      <button class="button primary" @click="open">
        <span
          class="iconfont icon-bianji"
          style="font-size: 17px"
          aria-hidden="true"
        ></span
        >编辑设置
      </button>
    </div>
    <div class="settings-grid">
      <div>
        <section class="panel settings-panel">
          <div class="panel-heading">
            <div>
              <h2>基本信息</h2>
              <p>百宝箱的名称、介绍和联系方式</p>
            </div>
            <span
              class="iconfont icon-icon_shezhi muted"
              aria-hidden="true"
            ></span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>应用名称</dt>
              <dd>{{ store.data.settings.name }}</dd>
            </div>
            <div>
              <dt>应用介绍</dt>
              <dd>{{ store.data.settings.description }}</dd>
            </div>
            <div>
              <dt>联系邮箱</dt>
              <dd>{{ store.data.settings.email || '未填写' }}</dd>
            </div>
          </dl>
        </section>
        <section class="panel settings-panel">
          <div class="panel-heading">
            <div>
              <h2>运行偏好</h2>
              <p>预留的客户端开关，仅保存演示配置</p>
            </div>
          </div>
          <div class="setting-row">
            <div>
              <strong>开放用户注册</strong>
              <p>允许新用户注册百宝箱账号</p>
            </div>
            <span class="category-tag">{{
              store.data.settings.registration ? '已开放' : '已关闭'
            }}</span>
          </div>
          <div class="setting-row">
            <div>
              <strong>维护模式</strong>
              <p>开启后客户端将展示维护提示</p>
            </div>
            <span class="category-tag">{{
              store.data.settings.maintenance ? '已开启' : '已关闭'
            }}</span>
          </div>
          <div class="inline-note">
            <span
              class="iconfont icon-xinxikongxin"
              style="font-size: 16px"
              aria-hidden="true"
            ></span
            >尚无服务端配置接口，以上开关暂不影响客户端运行。
          </div>
        </section>
      </div>
      <aside>
        <section class="panel settings-panel about-panel">
          <span class="brand-mark"
            ><span
              class="iconfont icon-gongnengdingyi"
              style="font-size: 27px"
              aria-hidden="true"
            ></span
          ></span>
          <h2>Pocket Kit Admin</h2>
          <p>百宝箱管理工作台</p>
          <span class="category-tag">v1.0.0 · 本地演示</span>
          <dl class="detail-list">
            <div>
              <dt>前端框架</dt>
              <dd>Vue 3 + TypeScript</dd>
            </div>
            <div>
              <dt>界面组件</dt>
              <dd>Element Plus</dd>
            </div>
            <div>
              <dt>数据存储</dt>
              <dd>当前浏览器</dd>
            </div>
            <div>
              <dt>服务端接口</dt>
              <dd>尚未接入</dd>
            </div>
          </dl>
        </section>
        <section class="panel settings-panel data-panel">
          <h2>演示数据管理</h2>
          <p>导出当前内容留作备份，或恢复初始演示状态。</p>
          <button class="button full-width" @click="exportData">
            <span
              class="iconfont icon-yunduanxiazai"
              style="font-size: 16px"
              aria-hidden="true"
            ></span
            >导出 JSON 备份</button
          ><button class="button full-width danger-text" @click="reset">
            重置演示数据
          </button>
        </section>
      </aside>
    </div>
    <SettingsEditDialog ref="editDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
.settings-panel .detail-list dd {
  max-width: 70%;
  overflow-wrap: anywhere;
  text-align: right;
}
.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
  gap: 24px;
}
.settings-panel {
  margin-bottom: 24px;
  padding: 24px;
}
.settings-panel .panel-heading {
  padding: 0 0 25px;
}
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 19px 0;
  border-top: 1px solid #eff3ec;
}
.setting-row strong {
  font-size: 12px;
  font-weight: 500;
}
.setting-row p {
  font-size: 10px;
  color: #a8b3a8;
  margin-top: 4px;
}
.inline-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 10px;
  color: #9aab99;
  padding: 13px;
  background: #f5f8f2;
  border-radius: 6px;
  margin-top: 9px;
}
.about-panel .brand-mark {
  margin-bottom: 17px;
}
.about-panel h2 {
  font-size: 18px;
}
.about-panel > p {
  margin: 4px 0 13px;
  color: #a8b3a7;
  font-size: 11px;
}
.about-panel .detail-list {
  margin-top: 20px;
}
.about-panel .detail-list > div:last-child {
  border: 0;
  padding-bottom: 0;
}
.data-panel p {
  color: #a4afa1;
  font-size: 11px;
  margin: 10px 0 20px;
}
.data-panel .button {
  margin-top: 10px;
}
@media (max-width: 1080px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .settings-grid > aside {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
@media (max-width: 650px) {
  .settings-grid {
    gap: 0;
  }
  .settings-grid > aside {
    display: block;
  }
  .settings-panel {
    padding: 21px;
    margin-bottom: 17px;
  }
}
</style>
