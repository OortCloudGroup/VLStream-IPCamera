<template>
  <div class="m_table">
    <div class="table-card-list-container">
      <div class="action-buttons">
        <div class="can-but" @click="getScanList">
          <img src="@/assets/img/table_manage/can.png" />扫描桌牌
        </div>
        <div class="can-but can-but-w" @click="startAllPic">
          <img src="@/assets/img/table_manage/refresh_gr.png" />批量刷新
        </div>
        <div class="can-but can-but-w" @click="resetDefault">
          <img src="@/assets/img/table_manage/reset.png" />恢复默认页
        </div>
      </div>
      <TableSelf
        ref="tableRef"
        class="new_table"
        :row-class-name="tableRowClassName"
        :data="tableData"
        current-row-key="name"
        @row-click="tableRowClick"
        @selection-change="tableSelectChange"
      >
        <el-table-column type="selection" :width="clacPXToVW(55)" />
        <el-table-column type="index" label="序号" :width="clacPXToVW(65)" />
        <el-table-column prop="name" label="桌牌编号" />
        <el-table-column prop="nickname" label="名称" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div :class="['status-circle', row.status === 1 ? 'green' : 'gray']" />
              <div v-if="row.status === 1" style="color: var(--el-color-primary);">
                在线
              </div>
              <div v-else-if="row.status === 2">
                在线
              </div>
              <div v-else>
                离线
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button
              class="opr_btn_table"
              type="primary"
              size="small"
              @click.stop.prevent="editCard(row)"
            >
              编辑
            </el-button>
            <el-button
              class="opr_btn_table"
              size="small"
              @click.stop.prevent="prviewCard(row)"
            >
              预览
            </el-button>
          </template>
        </el-table-column>
      </TableSelf>
      <div class="pagination-container">
        <el-pagination
          background
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagesize"
          layout="total, prev, pager, next, sizes"
          :total="count"
          class="justifyAlign"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <div class="middle-section">
      <!-- 中间名牌列表区 -->
      <NameplateList :card-data="nameplateList" :table-item="currentTableItem" @getCardList="getCardList" @send-data="receiveDataFromFirstChild" />
    </div>
    <div class="right-section">
      <div class="table_item">
        <span>模板预览</span>
      </div>
      <div class="text-editor" style="width: 100%;margin-top: 40px;">
        <RichTextEditor :received-data="receivedData" :table-item="currentTableItem" :tables="cTables" @getCardList="getCardList" />
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="添加设备" :width="clacPXToVW(680)" class="add_dialog">
      <el-form :model="form">
        <div class="addkk">
          <div class="addkk_text">
            桌牌编号
          </div>
          <el-input v-model="form.name" disabled class="addkk_text_input" autocomplete="off" />
        </div>
        <div class="addkk">
          <div class="addkk_text">
            名称
          </div>
          <el-input v-model="form.nickname" class="addkk_text_input" autocomplete="off" />
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="dialog-footer-btn" @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button class="dialog-footer-btn" type="primary" @click="confrimAddDevice">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogPreviewVisible" title="预览" :width="clacPXToVW(680)">
      <img style="width: 100%; height: 100%;" :src="getImageUrl()" class="preview_image" />
    </el-dialog>

    <!-- <el-drawer v-model="bookDrawerVis" title="添加下发任务" direction="rtl" size="60%">
      <TaskQuenue v-if="bookDrawerVis" />
    </el-drawer> -->
    <!-- <el-drawer v-model="backgroundSettings" title="背景设置" direction="rtl" size="72%">
      <Settings v-if="backgroundSettings" />
    </el-drawer> -->
  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from 'vue'
// import Settings from './components/Settings.vue'
import NameplateList from './components/NameplateList.vue'
import RichTextEditor from './components/RichTextEditor.vue'
import { gettablelist, tableImgList } from '@/api/tableService/index'
import { useUserStore } from '@/store/modules/user'
import { clacPXToVW } from '@/utils/index'
const store = useUserStore()

const tableData = ref([])
const nameplateList = ref([])

const form = ref({
  name: ''
})

import Config from '@/config/index'
const getImageUrl = () => {
  const baseUrl = Config.URL + Config.gateWay + 'oortcloud-table/' + 'table/imgShow/'
  const token = store.getStoreToken()
  const id = currentTableItem.value.image
  return `${baseUrl}${id}?token=${token}`
}

const dialogPreviewVisible = ref(false)
const prviewCard = (data) => {
  currentTableItem.value = data
  if (!currentTableItem.value.image) {
    ElMessage.warning('该桌牌未设置过模板或者模板已删除')
    return
  }
  dialogPreviewVisible.value = true
}

const getScanList = () => {
  tableData.value = []
  getList()
}

const count = ref(0)
const page = ref(1)
const pagesize = ref(10)
// 列表
const getList = () => {
  const params = {
    accessToken: store.getStoreToken(),
    page: page.value,
    pagesize: pagesize.value,
    status: 0

  }
  gettablelist(params).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.list || []
      count.value = res.data.count
      if (tableData.value.length > 0) {
        tableRowClick(tableData.value[0])
      }
    }
  })
}
// 名牌列表
const getCardList = (name) => {
  const params = {
    accessToken: store.getStoreToken(),
    page: 1,
    pagesize: 99
  }
  if (name) {
    params.keyword = name
  }
  tableImgList(params).then((res) => {
    if (res.code === 200) {
      nameplateList.value = res.data.list || []
    }
  })
}

const handleSizeChange = (val) => {
  pagesize.value = val
  getList()
}
const handleCurrentChange = (val) => {
  page.value = val
  getList()
}

// 行样式
const tableRowClassName = ({ row }) => {
  if (row.name === currentTableItem.value?.name) {
    return 'current-row'
  } else {
    return ''
  }
}

const currentTableItem = ref(null)
const tableRowClick = (row) => {
  currentTableItem.value = row
}

const cTables = ref([])
const tableSelectChange = (rows) => {
  cTables.value = rows
}

const dialogFormVisible = ref(false)
const editCard = (data) => {
  currentTableItem.value = data
  form.value.name = currentTableItem.value.name
  form.value.nickname = currentTableItem.value.nickname
  dialogFormVisible.value = true
}

import { tableSave } from '@/api/tableService/index'
import { ElMessage } from 'element-plus'
const confrimAddDevice = () => {
  if (!form.value.nickname) {
    ElMessage.error('请输入名称')
    return
  }
  const params = {
    accessToken: store.getStoreToken(),
    name: form.value.name,
    nickname: form.value.nickname
  }
  tableSave(params).then((res) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '操作成功'
      })
      dialogFormVisible.value = false
      getList()
    }
  })
}

const receivedData = ref(null)
const receiveDataFromFirstChild = (data) => {
  receivedData.value = data
}

import bus from '@/utils/bus.js'
const startAllPic = () => {
  bus.$emit('startAllPic')
}

const resetDefault = async() => {
  let defaultImg = []
  const params = {
    accessToken: store.getStoreToken(),
    is_default: 1,
    page: 1,
    pagesize: 99
  }
  let res = await tableImgList(params)
  if (res.code === 200) {
    defaultImg = res.data.list || []
    if (defaultImg.length === 0) {
      ElMessage.warning('请先设置默认模板')
    } else {
      bus.$emit('startAllPic', defaultImg)
    }
  }
}

onMounted(() => {
  getList()
  getCardList()
})

</script>

<style lang="scss" scoped>

.table-card-list-container {
  width: 680px;
}

.table_item {
  width: 100%;
  span {
    font-size: 18px;
  }
}

.action-buttons {
  display: flex;
  height: 64px;
  .can-but {
    margin-right: 12px;
    cursor: pointer;
    min-width: 132px;
    height: 48px;
    background: var(--el-color-primary);
    border-radius: 12px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 400;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0 16px;
    border: 1px solid rgba(236,239,242,1);
    img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }

  .can-but-w {
    background-color: #fff;
    color: #333;
  }

  .can-but:hover  {
    border:1px solid var(--el-color-primary);
  }
}

/* 状态圆形样式 */
.status-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* 绿色状态 */
.green {
  background-color: var(--el-color-primary);
  ;
}

/* 灰色状态 */
.gray {
  background-color: #CCCCCC;
}

.m_table {
  height: calc(100% - 40px);
  display: flex;
  padding: 20px;
}

:deep(.el-table__header th) {
  background-color: #f5f7fa;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

:deep(.is-active.number) {
  background-color: var(--el-color-primary-hb) !important;
  border-radius: 10px;
  color: var(--el-color-primary) !important;
}

:deep(.number) {
  background-color: #ffffff00!important;
}

:deep(.btn-prev) {
  background-color: #ffffff00!important;
}

:deep(.btn-next) {
  background-color: #ffffff00!important;
}

.leftrighr-section {
  width: 548px;

}

.middle-section {
  width: 268px;
  height: 100%;
  display: flex;
  justify-content: center;
}

.right-section {
  flex: 1;
  padding: 0 0 0 20px;

  .header {
    padding: 24px 0 24px;
    display: flex;
    align-items: center;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    color: #121828;
    line-height: 27px;
    font-weight: 400;

    img {
      width: 18px;
      height: 18px;
      margin-left: 8px;
    }
  }
}

.addkk {
  margin-top: 20px;
  .addkk_text {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    margin: 4px 0;
    color: #121828;
    letter-spacing: 0.2px;
    line-height: 24px;
    font-weight: 400;
  }
}

.el-input__wrapper {
  height: 56px !important;
}

:deep(.el-table__body tr.current-row) {
  background-image: linear-gradient(270deg, rgba(28,216,153,0.00) 00%, var(--el-color-primary) 200%);
}

:deep(.el-table__body tr.hover) {
  background-image: linear-gradient(270deg, rgba(28,216,153,0.00) 0%, var(--el-color-primary) 200%);
}

:deep(.el-table__body tr:hover>td.el-table__cell) {
  background: #ffffff00;
}

:deep(.el-table__row) {
  height:64px;
  cursor: pointer;
}

:deep(.add_dialog.el-dialog) {
  height: 420px;
  border-radius: 24px;
}

.dialog-footer-btn {
  width: 120px;
  height: 56px;
}

.addkk_text_input {
  height: 56px;
  font-size: 18px;
}

.preview_image {
  border: 1px solid var(--el-color-primary);
}

</style>
