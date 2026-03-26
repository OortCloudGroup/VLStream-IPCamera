<template>
  <div class="tenant_Page draHeaPB">
    <div class="tenant_content">
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--部门tree-->
        <div v-yResize class="police_aside">
          <div class="treeTitle">
            组织架构
          </div>
          <div class="tree_search_content flexRowAC">
            <el-input
              v-model="searchDeptName"
              suffix-icon="el-icon-search"
              placeholder="搜索"
              debounce="300"
              @change="getSearchDept"
            />
          </div>
          <el-tree
            style="background: #fff;"
            :load="getDeptTreeUI"
            :data="treeData"
            lazy
            highlight-current
            node-key="oort_dcode"
            :default-expanded-keys="['','99']"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="deptClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flexRowAC">
                <img
                  v-if="data.oort_dept_photo"
                  style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
                  :src="data.oort_dept_photo"
                />
                <img v-else style="width: 1rem;margin: 0 0.25rem" src="@/assets/img/dept_default.png" />
                <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                  <div :class="{'delete_text': data.oort_status === 9, 'activeDept': data.oort_dcode === currentDeptCode}">
                    {{ node.label }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-tree>
        </div>
        <!--table-->
        <div class="tableTenItU">
          <div class="depNameBox_out flexRowAC">
            <div v-if="pidObj" class="depNameBox flexRowAC">
              <img v-if="pidObj?.oort_dept_photo" class="depNameImg" :src="pidObj?.oort_dept_photo" alt="" />
              <oort-svg-icon v-else class="depNameImg" name="dept" width="40" height="40" />
              <div class="depNameBox column flexRowAC">
                {{ pidObj['oort_dname'] }}
                <div class="columnSpan flexRowAC">
                  <span v-if="pidObj.dept_type" class="depNameBox_T">
                    <span v-if="pidObj.dept_type===1" class="type_span" style="background-color: #61b96f;">集团</span>
                    <span v-if="pidObj.dept_type===2" class="type_span" style="background-color: #8581dc;">公司</span>
                    <span v-if="pidObj.dept_type===3" class="type_span" style="background-color: #ada70f;">部门</span>
                    <span v-if="pidObj.dept_type===4" class="type_span" style="background-color: #ec770e;">项目</span>
                  </span>
                  <span class="depNameBox_T">共有{{ count }}个</span>
                </div>
              </div>
            </div>
            <!--搜索-->
            <div class="searchHeight_out flexRowAC">
              <search-height-box keyword="keyword" placeholder="请输入部门名称等关键词" :data="searchData" @handle="searchResetFn" />
              <export-excel-pdf />
            </div>
          </div>
          <TableSelf
            class="new_table"
            header-cell-class-name="header_tenant_cell"
            stripe
            :row-class-name="tableRowClassName"
            :data="tableData"
            current-row-key="oort_dcode"
            @selection-change="tableSelectChange"
          >
            <el-table-column type="selection" :width="clacPXToVW(55)" />
            <el-table-column prop="date" label="序号" :width="clacPXToVW(65)">
              <template #default="scope">
                {{ scope.$index + (page - 1) * pagesize + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="组织logo" :width="clacPXToVW(120)">
              <template #default="scope">
                <el-image
                  v-if="scope.row.oort_dept_photo"
                  class="depImg"
                  :src="scope.row.oort_dept_photo"
                  :preview-src-list="[scope.row.oort_dept_photo]"
                  :preview-teleported="true"
                />
                <oort-img v-else :src="scope.row?.oort_dept_photo" class="depImg" default-img="dept" />
              </template>
            </el-table-column>
            <el-table-column :width="clacPXToVW(200)" label="上级组织" show-overflow-tooltip>
              <template #default="scope">
                {{ storeC.tenantData?.company_name || '全部' }}{{ scope.row.dept_name_path }}
              </template>
            </el-table-column>
            <el-table-column prop="oort_dname" label="组织名称" />
            <el-table-column prop="dept_code" label="组织编码" />
            <el-table-column label="组织类型">
              <template #default="scope">
                <span v-if="scope.row.dept_type===1" class="type_span" style="background-color: #61b96f;">集团</span>
                <span v-if="scope.row.dept_type===2" class="type_span" style="background-color: #8581dc;">公司</span>
                <span v-if="scope.row.dept_type===3" class="type_span" style="background-color: #ada70f;">部门</span>
                <span v-if="scope.row.dept_type===4" class="type_span" style="background-color: #ec770e;">项目</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" />
            <el-table-column fixed="right" align="right" label="操作" :width="clacPXToVW(150)">
              <template #default="scope">
                <div class="operateAppBox flexRowAC">
                  <div class="new_table_svg_group" @click="openAuthDialog(scope.row)">
                    <oort-svg-icon width="20" height="20" name="visible" class="new_table_svg_group_svg" />
                    <span>可见权限</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </TableSelf>
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
      v-model="visibleVis"
      title="可见权限详情"
      class="txl_visible_dia"
      :close-on-click-modal="false"
      width="55%"
      top="6vh"
    >
      <visibleScopeDialog
        v-if="visibleVis"
        ref="visibleScopeRef"
        :data="visibleRow"
        :set-type="2"
        @close="visibleVis = false"
      />
    </el-dialog>
    <el-dialog
      v-if="visibleScopeRef"
      v-model="visibleScopeRef.userSelectDialogVisible"
      :title="visibleScopeRef.userSelectDialogTitle"
      width="50%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <address-seting-dialog
        :mode="3"
        :is-single="false"
        :user-list="visibleScopeRef.selectedUserListForDialog"
        :dept-list="[]"
        @saveChoose="visibleScopeRef.handleUserSelectSave"
        @close="visibleScopeRef.handleUserSelectClose"
      />
    </el-dialog>
    <el-dialog
      v-if="visibleScopeRef"
      v-model="visibleScopeRef.deptDialogVisible"
      :title="visibleScopeRef.deptDialogTitle"
      width="70%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <visibleDeptDialog
        :selected-dept-ids="visibleScopeRef.selectedDeptIdsForDialog"
        :selected-dept-list="visibleScopeRef.selectedDeptListForDialog"
        @confirm="visibleScopeRef.handleDeptDialogConfirm"
        @cancel="visibleScopeRef.handleDeptDialogCancel"
      />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useUserStore } from '@/store/modules/user'
import { useCounter } from '@/store/counter'
import { deptList } from '@/api/address_book'
import TableSelf from '@/components/TableSelf.vue'
import { clacPXToVW } from '@/utils/index'
import visibleScopeDialog from './visibleScopeDialog.vue'
import visibleDeptDialog from './visibleDeptDialog.vue'
import AddressSetingDialog from '@/components/personHome/addressSetingDialog.vue'
import SearchHeightBox from '@/components/SearchHeightBox.vue'
import ExportExcelPdf from '@/components/exportExcelPdf.vue'

const store: any = useUserStore()
const storeC: any = useCounter()
const searchDeptName = ref<any>('')
const treeData = ref<any>([])
const currentDeptCode = ref<any>('')
const pidObj = ref<any>({
  oort_dname: storeC.tenantData?.company_name || '全部',
  oort_dcode: ''
})
const defaultProps = {
  label: 'oort_dname',
  children: 'children',
  isLeaf: (data) => {
    return (data['hadchild'] === 0)
  }
}
const count = ref<any>(0)
const page = ref<number>(1)
const pagesize = ref<number>(10)
const tableData = ref<any>([])
const visibleRow = ref<any>(null)
const visibleScopeRef = ref<any | null>(null)
const visibleVis = ref(false)
const searchData = ref<any>([])
searchData.value = []
const form = reactive({
  keyword: ''
})

interface Tree {
  oort_dname: string
  oort_dcode: any
  leaf?: boolean
}

function searchResetFn(val, reset) {
  if (reset) page.value = 1
  form.keyword = val.keyword
  getList()
}

const getDeptTreeUI = (node: Node, resolve: (data: Tree[]) => void) => {
  const params: any = {
    accessToken: store.userInfo.accessToken,
    tenant_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
    page: 1,
    pagesize: 99
  }
  if (node.level === 0) {
    return resolve([{
      oort_dname: storeC.tenantData?.company_name || '全部',
      oort_dcode: ''
    }])
  } else {
    params['pdeptcode'] = node.data.oort_dcode
  }

  deptList(params).then((res: any) => {
    if (node.level === 0) {
      nextTick(() => {
        const nodeData: any = node.childNodes[0]
        nodeData.expanded = true
        nodeData.loadData()
      })
    }
    if (res.code === 200) {
      resolve(res.data.list)
    }
  })
}

const getSearchDept = (dept?: any) => {
  const params: any = {
    accessToken: store.userInfo.accessToken,
    tenant_id: 'oortoort-aabb-ccdd-eeff-eb29bb427381',
    page: 1,
    pagesize: 99
  }
  if (searchDeptName.value) {
    params['keyword'] = searchDeptName.value
  } else {
    const rootDept = {
      oort_dname: storeC.tenantData?.company_name || '全部',
      oort_dcode: ''
    }
    if (dept && dept.oort_dname) {
      Object.assign(rootDept, dept)
    }
    treeData.value = [rootDept]
    currentDeptCode.value = rootDept.oort_dcode
    pidObj.value = rootDept
    return
  }
  deptList(params).then((res: any) => {
    if (res.code === 200) {
      treeData.value = res.data.list
    }
  })
}

const deptClick = (data: any) => {
  currentDeptCode.value = data.oort_dcode
  pidObj.value = data
  page.value = 1
  getList()
}

const getList = async() => {
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    isdel: 1
  }
  if (pidObj.value?.oort_dcode) {
    params.pdeptcode = pidObj.value.oort_dcode
  }
  if (form.keyword) {
    params.keyword = form.keyword
  }
  const res: any = await deptList(params)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.count || res.data.counts || 0
  }
}

const tableRowClassName = ({ row }) => {
  if (row.oort_status === 9 || (row.oort_status !== 1 && row.oort_status !== undefined)) {
    return 'delete_text'
  }
  return ''
}

const tableSelectChange = (_val: any) => {
  // 处理选中变化
}

const openAuthDialog = (row: any) => {
  visibleRow.value = row
  visibleVis.value = true
}

const handleSizeChange = (val: number) => {
  pagesize.value = val
  getList()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getList()
}

onMounted(() => {
  getList()
})
</script>
<style>
.delete_row {
  text-decoration: line-through;
  color: #999;
}
</style>

<style lang="scss" scoped>
.tenant_Page {
  /* height: 100%; */
  width: 100%;
  border-radius: 8px;
  background: #f0f2f5;

  .tenant_content {
    width: 100%;
    border-radius: 8px;
  }

  .tableTenBox {
    padding: 20px;
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0 0;
    flex: 1;
    background: #fff;
  }
}

// tabs
:deep(.tenanat-tabs) {
  padding: 0 20px;

  .el-tabs__item {
    color: #999;
  }

  .el-tabs__item.is-active {
    color: var(--el-color-primary);
  }
}

:deep(.tableTenBox) {
  align-items: flex-start;

  .header_tenant_cell {
    background: #F8F8F9;
  }
}

.police_aside_use {
  width: 300px;
  min-height: calc(100vh - 80px);
  padding-right: 20px;
  flex-shrink: 0;
  height: 100%;
  overflow: auto;

  .tree_search_content {
    justify-content: center;
    padding-bottom: 10px;

    .el-input__inner {
      background: #fff;
      border: none;
    }
  }

  :deep(.el-tree-node__content) {
    --el-tree-node-hover-bg-color: var(--el-menu-hover-bg-color);

    height: 38px;
    font-size: 14px;
    color: #333;
  }

  // 树选中
  :deep(.el-tree-node){
    .el-tree-node.is-current.is-focusable>.el-tree-node__content{
      background-color: var(--el-color-primary-hb);
      color: var(--el-color-primary);
    }
  }
}

// 部门树table
.tableTenItU {
  flex: 1;
  height: 100%;
  overflow: auto;

  :deep(.el-table) {
    .el-table__header .el-table__cell .cell {
      background: #F8F8F9;
      font-size: 14px;
      color: #515A6E;
      line-height: 24px;
      font-weight: 700;
    }

    th.el-table-fixed-column--right {
      background-color: #F8F8F9;
    }
  }
}

.exportBtnBox {
  gap: 12px;
  padding: 0;
  padding-left: 8px;
  margin-top: 10px;
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
  color: #FFF;
  box-shadow: 0 2px 0 0 rgb(0 0 0 / 4%);
}

// tabs
:deep(.el-tabs__header) {
  padding-top: 10px;

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

// 添加应用
.operateAppBox {
  justify-content: flex-end;
  gap: 2px;

  .appBtn {
    line-height: 22px;
    cursor: pointer;
    padding: 6px 12px;
    border: 0.5px solid rgb(220 223 230 / 100%);
    border-radius: 2px;
  }
}

.DEL{
  color: red;
}

.depImg{
  width: 34px;
  height: 34px;
}

// 部门树标题
.treeTitle {
  color: var(--el-color-primary);
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 4px;

  &::before {
    content: '';
    width: 3px;
    height: 18px;
    background-color: var(--el-color-primary);
  }
}

// 状态
.staBtns {
  padding: 3px 7px;
  font-size: 14px;
  line-height: 14px;
  border-radius: 4px;
  position: relative;
  padding-left: 12px;

  &::before {
    content: "";
    display: flex;
    position: absolute;
    top: 6px;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: gray;
  }

  &.WX {
    color: #52C41A;

    &::before {
      background: #52C41A;
    }
  }

  &.LKL {
    color: #FF8823;

    &::before {
      background: #FF8823;
    }
  }

  &.ZFB {
    color: #1A53FF;

    &::before {
      background: #1A53FF;
    }
  }

  &.red {
    color: red;

    &::before {
      background: red;
    }
  }
}

.post_job_span {
  /* background-color: var(--el-menu-hover-bg-color);
  color: var(--el-color-primary); */
  margin: 0 4px 4px 0;
}

.type_span {
  background-color: #61b96f;
  color: #fff!important;
  padding: 3px 6px;
  font-size: 10px;
  border-radius: 4px;
}

.depNameBox_T {
  display: flex;
  margin-top: 4px;
}

// 部门状态样式
.delete_text {
  text-decoration: line-through;
  color: #999;
}

.dept-disabled {
  color: #999;
  text-decoration: line-through;
}

.dept-pending {
  color: #ffa500;
  text-decoration: line-through;
}

.dept-invalid {
  color: #999;
  text-decoration: line-through;
}
.txl_dia{
  width: 880px;
}
.txl_visible_dia{
  width: 820px;
}
</style>
