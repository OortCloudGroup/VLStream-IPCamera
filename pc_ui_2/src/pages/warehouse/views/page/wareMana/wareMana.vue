<template>
  <div class="tenant_Page">
    <el-tabs v-model="activeName" class="tenanat-tabs" @tab-click="handleClick">
      <el-tab-pane label="入库" :name="1" />
      <el-tab-pane label="领用/退库" :name="2" />
      <el-tab-pane label="借用/归还" :name="3" />
      <el-tab-pane label="维修" :name="4" />
      <el-tab-pane label="处置报废" :name="5" />
    </el-tabs>
    <div class="tenant_content">
      <!--搜索-->
      <div class="searchBox flexRowAC">
        <div class="serchItem">
          <el-input v-model="form.d1" class="wh-input" placeholder="名称" />
        </div>
        <div v-if="activeName===1" class="serchItem">
          <el-input v-model="form.d1" class="wh-input" placeholder="编号" />
        </div>
        <div v-else class="serchItem">
          <el-input v-model="form.d1" class="wh-input" :placeholder="actInputTitle+'人'" />
        </div>
        <div class="serchItem">
          <el-input v-model="form.d1" class="wh-input" placeholder="类别" />
        </div>
        <div v-if="activeName===1" class="serchItem">
          <el-select v-model="form.status" placeholder="状态">
            <el-option v-for="(item,i) in optionArr" :key="i" :label="item.label" :value="item.val" />
          </el-select>
        </div>
        <div v-else class="serchItem">
          <el-input v-model="form.d1" class="wh-input" :placeholder="actInputTitle+'时间'" />
        </div>
        <div class="serchItem">
          <el-button type="primary" @click="applistFn">
            <img class="searchImg" src="@/assets/img/search.png" alt="" />搜索
          </el-button>
          <el-button @click="resetFn">
            <img class="searchImg" src="@/assets/img/message/reset.png" alt="" />重置
          </el-button>
        </div>
      </div>
      <!--新增-->
      <div class="exportBtnBox flexRowAC">
        <div class="exportBtn flexRowAC" @click="newEditClick()">
          <img class="BtnImg" src="@/assets/img/message/new.png" alt="" />新建
        </div>
        <div v-if="activeName===1||activeName===5" class="flexRowAC">
          <el-dropdown @command="(c)=>operateClick(c,'')">
            <div class="exportBtn Btn2 flexRowAC">
              <img class="BtnImg" src="@/assets/img/warehouse/ope1.png" alt="" />
              操作
            </div>
            <template #dropdown>
              <el-dropdown-menu class="waraDropMenu">
                <el-dropdown-item :command="1" class="blue">
                  领用
                </el-dropdown-item>
                <el-dropdown-item :command="2" class="blue">
                  借用
                </el-dropdown-item>
                <el-dropdown-item :command="3" class="blue">
                  维修登记
                </el-dropdown-item>
                <el-dropdown-item :command="4" class="blue">
                  处置报废
                </el-dropdown-item>
                <el-dropdown-item :command="5" class="red">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="exportBtn Btn2 flexRowAC">
          <img class="BtnImg" src="@/assets/img/message/export.png" alt="" />导出
        </div>
      </div>
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--部门tree-->
        <div class="police_aside">
          <el-tree
            :data="treeData"
            node-key="id"
            default-expand-all
            :highlight-current="true"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="deptClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flexRowAC">
                <img
                  v-if="data['child']?.length"
                  style="width: 1rem;margin: 0 0.25rem"
                  src="@/assets/img/warehouse/table1.png"
                />
                <img v-else style="width: 1rem;margin: 0 0.25rem" src="@/assets/img/warehouse/table2.png" />
                <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                  <div class="treeLeBox flexRowAC">
                    {{ node.label }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-tree>
        </div>
        <!--table-->
        <div class="tableTenIt">
          <div v-if="activeName===2" class="tableTenItRadio">
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px" @change="tabPoClick">
              <el-radio-button :value="1">
                领用
              </el-radio-button>
              <el-radio-button :value="2">
                退库
              </el-radio-button>
            </el-radio-group>
          </div>
          <div v-if="activeName===3" class="tableTenItRadio">
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px" @change="tabPoClick">
              <el-radio-button :value="3">
                借用
              </el-radio-button>
              <el-radio-button :value="4">
                归还
              </el-radio-button>
            </el-radio-group>
          </div>
          <!--入库-->
          <el-table
            v-if="activeName===1"
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            stripe
            :data="tableDataEntry"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="wg01" width="300px" label="名称" />
            <el-table-column prop="record_id" width="220px" label="编号" />
            <el-table-column prop="wg03" label="图片" />
            <el-table-column prop="wg06" label="备注" />
            <el-table-column prop="record_status" label="状态">
              <template #default="scope">
                <div v-if="scope.row.record_status===1" class="reSta s1 flexRowAC">
                  <span class="dot" />领用
                </div>
                <div v-else-if="scope.row.record_status===3" class="reSta s3 flexRowAC">
                  <span class="dot" />借用
                </div>
                <div v-else-if="scope.row.record_status===5" class="reSta s5 flexRowAC">
                  <span class="dot" />维修
                </div>
                <div v-else-if="scope.row.record_status===8" class="reSta s8 flexRowAC">
                  <span class="dot" />报废
                </div>
                <div v-else class="reSta flexRowAC">
                  <span class="dot" />闲置
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="wg06" label="类别" />
            <el-table-column prop="wg04" label="金额" />
            <el-table-column prop="wg07" width="220px" label="入库时间" />
            <el-table-column prop="" label="入库人" />
            <el-table-column prop="" label="报废时间" />
            <el-table-column width="100px" fixed="right" align="right" label="操作">
              <template #default="scope">
                <div class="opBox flexRowAC">
                  <div class="operateBox flexRowAC" @click="operateClick('edit',scope.row)">
                    编辑
                  </div>
                  <el-dropdown @command="(c)=>operateClick(c,scope.row)">
                    <div class="operateBox flexRowAC">
                      更多
                    </div>
                    <template #dropdown>
                      <el-dropdown-menu class="waraDropMenu">
                        <el-dropdown-item :command="1" class="blue">
                          领用
                        </el-dropdown-item>
                        <el-dropdown-item :command="2" class="blue">
                          借用
                        </el-dropdown-item>
                        <el-dropdown-item :command="3" class="blue">
                          维修登记
                        </el-dropdown-item>
                        <el-dropdown-item :command="4" class="blue">
                          处置报废
                        </el-dropdown-item>
                        <el-dropdown-item :command="5" class="red">
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--领用-->
          <el-table
            v-if="activeName===2"
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            stripe
            :data="tableData"
          >
            <el-table-column prop="wg01" label="名称" />
            <el-table-column prop="num" label="数量" />
            <el-table-column prop="cname" label="类别" />
            <el-table-column prop="wg03" label="图片" />
            <template v-if="tabPosition===1">
              <el-table-column prop="username" label="领用人" />
              <el-table-column prop="number" label="领用单号" />
              <el-table-column prop="remarks" label="领用备注" />
              <el-table-column prop="created_at" width="220px" label="领用时间">
                <template #default="scope">
                  {{ timestampToTime(scope.row.created_at) }}
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column prop="username" label="退库人" />
              <el-table-column prop="number" label="退库单号" />
              <el-table-column prop="remarks" label="退库备注" />
              <el-table-column prop="created_at" width="220px" label="退库时间">
                <template #default="scope">
                  {{ timestampToTime(scope.row.created_at) }}
                </template>
              </el-table-column>
            </template>
          </el-table>
          <!--借用-->
          <el-table
            v-if="activeName===3"
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            stripe
            :data="tableData"
          >
            <el-table-column prop="wg01" label="名称" />
            <el-table-column prop="num" label="数量" />
            <el-table-column prop="cname" label="类别" />
            <el-table-column prop="wg03" label="图片" />
            <template v-if="tabPosition===3">
              <el-table-column prop="username" label="借用人" />
              <el-table-column prop="number" label="借用单号" />
              <el-table-column prop="remarks" label="借用备注" />
              <el-table-column prop="created_at" width="220px" label="借用时间">
                <template #default="scope">
                  {{ timestampToTime(scope.row.created_at) }}
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column prop="username" label="归还人" />
              <el-table-column prop="number" label="归还单号" />
              <el-table-column prop="remarks" label="归还备注" />
              <el-table-column prop="created_at" width="220px" label="归还时间">
                <template #default="scope">
                  {{ timestampToTime(scope.row.created_at) }}
                </template>
              </el-table-column>
            </template>
          </el-table>
          <!--维修-->
          <el-table
            v-if="activeName===4"
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            stripe
            :data="tableData"
          >
            <el-table-column prop="wg01" label="名称" />
            <el-table-column prop="num" label="数量" />
            <el-table-column prop="cname" label="类别" />
            <el-table-column prop="wg03" label="图片" />
            <el-table-column prop="username" label="报修人" />
            <el-table-column prop="number" label="报修单号" />
            <el-table-column prop="remarks" label="维修原因" />
            <el-table-column prop="status_text" label="状态" />
            <el-table-column prop="created_at" width="220px" label="报修时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
          <!--处置报废-->
          <el-table
            v-if="activeName===5"
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            stripe
            :data="tableData"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="wg01" label="名称" />
            <el-table-column prop="num" label="数量" />
            <el-table-column prop="cname" label="类别" />
            <el-table-column prop="wg03" label="图片" />
            <el-table-column prop="wg07" width="220px" label="报废时间" />
            <el-table-column prop="status_text" label="状态" />
            <el-table-column prop="username" label="处置人" />
            <el-table-column prop="number" label="处置单号" />
            <el-table-column prop="remarks" label="处置原因" />
            <el-table-column prop="created_at" width="220px" label="处置时间">
              <template #default="scope">
                {{ timestampToTime(scope.row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationBox flexRowAC">
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
      </div>
    </div>
    <el-dialog
      v-model="wareVisi"
      :title="wareVisiTitle"
      width="40%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <ware-mana-new
        :item="dropItem"
        :title="actInputTitle"
        :status="tabPosition"
        @close="wareVisi=false"
        @handle="applistUseFn"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { timestampToTime } from '@/utils/time'
import WareManaNew from './wareManaNew.vue'
import { ckmtClassifyAll, ckmtDataList, ckmtOperationList } from '@/api/warehouse'
import { ElMessage } from 'element-plus'

const store: any = useUserStore()
const tabPosition = ref<number>(1) // 分类_领用
const activeName = ref<number>(1) // 入库tabs
const actInputTitle = ref<any>('领用')
const wareVisi = ref<boolean>(false)
const wareVisiTitle = ref<any>('新增资产')
const treeData = ref<any>([]) // 部门树date
const cid = ref<any>('') // 分类树id
const dropItem = ref<any>('') // dropdown领用
// 配置选项
const defaultProps = {
  children: 'child',
  label: 'name'
}
const optionArr = [
  { label: '入库/正常', val: 0 },
  { label: '领用', val: 1 },
  { label: '退库', val: 2 },
  { label: '借用', val: 3 },
  { label: '归还', val: 4 },
  { label: '维修', val: 5 },
  { label: '维修完成', val: 6 },
  { label: '待报废', val: 7 },
  { label: '报废', val: 8 }
]
const count = ref<any>(0)
const page = ref<Number>(1)
const pagesize = ref<Number>(10)
const tableData = ref<any>([])
const tableDataEntry = ref<any>([])
const multipleSelection = ref<any>([]) // table勾选
const form = reactive({
  d1: '',
  status: ''
})

// tabsClick
const handleClick = () => {
  nextTick(() => {
    if (activeName.value === 2) {
      tabPosition.value = 1
      actInputTitle.value = '领用'
    }
    if (activeName.value === 3) {
      tabPosition.value = 3
      actInputTitle.value = '借用'
    }
    if (activeName.value === 4) {
      tabPosition.value = 5
      actInputTitle.value = '维修'
    }
    if (activeName.value === 5) {
      tabPosition.value = 8
      actInputTitle.value = '处置报废'
    }
    dropItem.value = ''
    // 数据列表_领用
    applistUseFn()
  })
}

// 部门树列表
const getDeptTreeUI = () => {
  let data = {
    accessToken: store.userInfo.accessToken
  }
  ckmtClassifyAll(data).then((res: any) => {
    if (res.code === 200) {
      treeData.value = res.data
      cid.value = treeData.value[0].id
      // 列表
      applistFn()
    }
  })
}

// 新增
const newEditClick = () => {
  if (activeName.value === 1) {
    wareVisiTitle.value = '新增资产'
  } else {
    wareVisiTitle.value = '新增' + actInputTitle.value + '单'
    wareVisi.value = true
  }
}

// 批量选择
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

// 更多
const operateClick = (command: string | number | object, item: any) => {
  if (!item && multipleSelection.value.length !== 1) {
    return ElMessage.warning('选择一条数据')
  }
  if (!item && multipleSelection.value.length) {
    item = multipleSelection.value[0]
  }
  if (command === 5) {
    return
  }
  if (command === 1) {
    tabPosition.value = 1
    actInputTitle.value = '领用'
  }
  if (command === 2) {
    tabPosition.value = 3
    actInputTitle.value = '借用'
  }
  if (command === 3) {
    tabPosition.value = 5
    actInputTitle.value = '维修'
  }
  if (command === 4) {
    tabPosition.value = 8
    actInputTitle.value = '处置报废'
  }
  wareVisiTitle.value = '新增' + actInputTitle.value + '单'
  dropItem.value = item
  wareVisi.value = true
}

// 数据列表
const applistFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    cid: cid.value
  }
  ckmtDataList(data).then((res:any) => {
    if (res.code === 200) {
      tableDataEntry.value = res.data.list
      count.value = res.data.count
    }
  })
}

// 数据列表_领用
const applistUseFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    fields: [{
      'condition': '=',
      'field': 'status',
      'value': String(tabPosition.value)
    }, {
      'condition': '=',
      'field': 'cid',
      'value': String(cid.value)
    }],
    page: page.value,
    pagesize: pagesize.value,
    cid: cid.value
  }
  ckmtOperationList(data).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.list
      count.value = res.data.count
    }
  })
}

// 领用tabs
const tabPoClick = () => {
  if (tabPosition.value === 2) {
    actInputTitle.value = '退库'
  }
  if (tabPosition.value === 4) {
    actInputTitle.value = '归还'
  }
  applistUseFn()
}

// 重置
function resetFn() {
  page.value = 1
  form.d1 = ''
}

// 分类树选中
const deptClick = (data) => {
  page.value = 1
  cid.value = data.id
  // 列表
  if (activeName.value === 1) {
    applistFn()
  } else {
    applistUseFn()
  }
}

let handleSizeChange = (val) => {
  pagesize.value = val
  applistFn()
  applistUseFn()
}
let handleCurrentChange = (val) => {
  page.value = val
  applistFn()
  applistUseFn()
}

onMounted(() => {
  getDeptTreeUI()
})
</script>
<style>
.waraDropMenu.el-dropdown-menu {
  .red.el-dropdown-menu__item {
    color: red;
  }

  .blue.el-dropdown-menu__item {
    color: #1A53FF;
  }
}
</style>
<style lang="scss" scoped>
.tenant_Page {
  background: #FFFFFF;
  border-radius: 10px 10px 0px 0px;
  height: 100%;
  width: 100%;
  overflow: auto;

  .tenant_content {
    width: 100%;
    flex: 1;
  }

  .tableTenBox {
    width: 100%;
    flex: 1;
  }
}

// tabs
:deep(.tenanat-tabs) {
  padding: 0 20px;

  .el-tabs__item {
    color: #999999;
  }

  .el-tabs__item.is-active {
    color: var(--el-color-primary);
  }
}

:deep(.tableTenBox) {
  align-items: flex-start;
  border-top: 1px solid #E8E8E8;

  .header_tenant_cell {
    background: #F8F8F9;
  }
}

// 部门树
.police_aside {
  width: 300px;
  height: 100%;
  padding: 20px 0 0 20px;
  flex-shrink: 0;

  .tree_search_content {
    padding: 2px 0;
    margin-top: 1rem;
    margin-block: 0.5rem;
    justify-content: center;
    box-sizing: border-box;

    .el-input__inner {
      background: #F7F7F7;
      border: none;
    }
  }

  :deep(.el-tree-node__content) {
    --el-tree-node-hover-bg-color: var(--el-menu-hover-bg-color);
    height: 38px;
    font-size: 14px;
    color: #333333;
  }
}

// 部门树table
.tableTenIt {
  padding: 20px;
  flex: 1;
  width: 100vh;

  .el-table {
    width: 100%;
    background: #FCFCFC;
  }

  .tableTenItRadio {
    text-align: center;
  }

  .opBox {
    gap: 20px;
  }
}

// 搜索框
.searchBox {
  gap: 20px;
  padding: 24px 20px;

  flex-wrap: wrap;

  .serchItem {
    width: 240px;
    height: 36px;
    border-radius: 4px;
  }

  .serchItem.siRange {
    width: 350px;
  }

}

.exportBtnBox {
  gap: 12px;
  padding: 0 20px 20px;
}

// 新增
.exportBtn {
  cursor: pointer;
  justify-content: center;
  padding: 0 12px;
  height: 32px;
  background: var(--el-color-primary);
  border-radius: 5px;
  border: 1px solid var(--el-color-primary);
  font-size: 14px;
  color: #FFFFFF;
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.04);

  &.Btn2 {
    background: #FFFFFF;
    color: #333333;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  .BtnImg {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    background-size: cover;
  }
}

// tabs
:deep(.el-tabs__header) {
  padding-top: 20px;

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__item.is-top {
    font-size: 16px;
    font-weight: 700;
  }
}

.paginationBox {
  justify-content: center;
  height: 100px;
}

// table 状态
.tableTenIt {
  .reSta {
    gap: 6px;
    color: #1A53FF;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1A53FF;
  }

  .s5 {
    color: #FFD023;

    .dot {
      background-color: #FFD023;
    }
  }

  .s8 {
    color: #999;

    .dot {
      background-color: #999;
    }
  }

  .s3 {
    color: #52C41A;

    .dot {
      background-color: #52C41A;
    }
  }

  .s1 {
    color: #FF911A;

    .dot {
      background-color: #FF911A;
    }
  }
}
</style>
