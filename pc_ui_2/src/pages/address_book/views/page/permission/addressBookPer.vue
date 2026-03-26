<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="tenant_Page draHeaPB">
    <div class="tenant_content">
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--部门tree-->
        <div v-yResize class="police_aside_use">
          <div class="treeTitle">
            组织架构
          </div>
          <div class="tree_search_content flexRowAC">
            <el-input
              v-model="searchDeptName"
              placeholder="搜索"
              debounce="300"
              prefix-icon="search"
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
                  v-if="data.oort_photo"
                  style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
                  :src="data.oort_photo"
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
              <search-height-box keyword="keyword" placeholder="请输入姓名拼音账号等关键词" :data="searchData" @handle="searchResetFn" />
              <export-excel-pdf />
            </div>
          </div>
          <TableSelf
            class="new_table"
            header-cell-class-name="header_tenant_cell"
            stripe
            :row-class-name="tableRowClassName"
            :data="tableData"
            current-row-key="oort_uuid"
            @selection-change="tableSelectChange"
          >
            <el-table-column type="selection" :width="clacPXToVW(55)" />
            <el-table-column prop="date" label="序号" :width="clacPXToVW(65)">
              <template #default="scope">
                {{ scope.$index + (page - 1) * pagesize + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="头像" :width="clacPXToVW(80)">
              <template #default="scope">
                <el-image
                  v-if="scope.row.oort_photo"
                  class="depImg"
                  :src="scope.row.oort_photo"
                  :preview-src-list="[scope.row.oort_photo]"
                  :preview-teleported="true"
                />
                <oort-img v-else :src="scope.row?.oort_photo" class="depImg" default-img="tx" />
              </template>
            </el-table-column>
            <el-table-column prop="oort_name" label="用户名" :width="clacPXToVW(120)" />
            <el-table-column label="登录账号" :width="clacPXToVW(120)" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.oort_loginid || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="岗位" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.oort_jobname || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="职位" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.oort_postname || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="所属组织" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.oort_depname || '-' }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" align="right" label="操作" :width="clacPXToVW(240)">
              <template #default="scope">
                <div v-if="!scope.row.deleted_at" class="operateAppBox flexRowAC">
                  <div class="new_table_svg_group" @click="authClick(scope.row)">
                    <oort-svg-icon width="20" height="20" name="table_authconfig" class="new_table_svg_group_svg" />
                    <span>权限配置</span>
                  </div>
                </div>
                <div class="operateAppBox flexRowAC">
                  <div class="new_table_svg_group" @click="openVisible(scope.row)">
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
      v-model="authVis"
      title="通讯录权限配置"
      class="txl_dia"
      :close-on-click-modal="false"
      top="5vh"
    >
      <contactAuthDialog v-if="authVis" :data="diaObj" @confirm="authVis=false" />
    </el-dialog>
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
        :set-type="0"
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
import { ref, reactive, nextTick, watch, onMounted } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useUserStore } from '@/store/modules/user'
import { useCounter } from '@/store/counter'
import { deptList } from '@/api/address_book'
import { columnUserList } from '@/api/sso_apaas'
import { dataToTime } from '@/utils/time'
import TableSelf from '@/components/TableSelf.vue'
import { clacPXToVW } from '@/utils/index'
import contactAuthDialog from './contactAuthDialog.vue'
import visibleScopeDialog from './visibleScopeDialog.vue'
import visibleDeptDialog from './visibleDeptDialog.vue'
import AddressSetingDialog from '@/components/personHome/addressSetingDialog.vue'

const store: any = useUserStore()
const storeC: any = useCounter()
const searchDeptName = ref<any>('') // 搜索部门
const treeData = ref<any>([]) // 部门树date
const currentDeptCode = ref<any>('') // 当前部门code
const pidObj = ref<any>({
  oort_dname: storeC.tenantData?.company_name || '全部',
  oort_dcode: ''
}) // 选中所属部门
// 配置选项
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
// 保存完整列表
const allUserList = ref<any[]>([])
const tableData = ref<any>([])
const diaObj = ref<any>('') // 权限编辑obj
const visibleRow = ref<any>(null)
const visibleScopeRef = ref<any | null>(null)
const datePickerTime = ref([])
const searchData = ref<any>([]) // 高级搜索框内容
searchData.value = [
]
const form = reactive({
  keyword: ''

})
interface Tree {
  oort_dname: string
  oort_dcode: any
  leaf?: boolean
}

// 搜索重置
function searchResetFn(val, reset) {
  if (reset) page.value = 1
  form.keyword = val.keyword
  getList()
}

// 部门树列表
const getDeptTreeUI = (node: Node, resolve: (data: Tree[]) => void) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 99,
    isdel: 1
  }
  if (node.level === 0) {
    return resolve([{
      oort_dname: storeC.tenantData?.company_name || '全部',
      oort_dcode: ''
    }])
  } else {
    data['pdeptcode'] = node.data.oort_dcode
  }

  deptList(data).then((res: any) => {
    if (node.level === 0) {
      nextTick(() => {
        let nodeData: any = node.childNodes[0]
        nodeData.expanded = true
        nodeData.loadData()
      })
    }
    if (res.code === 200) {
      // 组织树第一个
      if (node.level === 0) {
        pidObj.value = { ...pidObj.value, ...res.data.list[0] }
        getList()
      }
      resolve(res.data.list)
    }
  })
}

// 根据当前页和每页条数
const applyPagination = () => {
  const start = (page.value - 1) * pagesize.value
  const end = start + pagesize.value
  tableData.value = allUserList.value.slice(start, end)
}

// 用户列表
const getList = async() => {
  let data: any = {
    accessToken: store.userInfo.accessToken,
    deptcode: pidObj.value['oort_dcode'], // 部门编码 为空,返回没有关联部门的用户列表
    // isadmin: 2,
    ...form
  }
  // 如果是部门 不包含孙子部门
  // if (pidObj.value.dept_type !== 3) {
  //   data.all_child = true
  // }
  if (datePickerTime.value && datePickerTime.value?.length !== 0) {
    data['created_at'] = dataToTime(datePickerTime.value[0])
    data['created_to'] = dataToTime(datePickerTime.value[1])
    if (data['created_at'] === data['created_to']) {
      data['created_to'] = data['created_to'].replace('00:00:00', '23:59:59')
    }
    if (data['created_to'].includes('00:00:00')) {
      data['created_to'] = data['created_to'].replace('00:00:00', '23:59:59')
    }
  }
  let res: any = await columnUserList(data)
  if (res.code === 200) {
    const list = res.data?.list || []
    allUserList.value = list
    count.value = list.length || 0
    applyPagination()
  }
}

// 部门树选中
const deptClick = (data) => {
  currentDeptCode.value = data.oort_dcode
  pidObj.value = data
  page.value = 1
  getList()
}

// 部门树搜索
const getSearchDept = (dept) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 99
  }
  if (searchDeptName.value) {
    data['keyword'] = searchDeptName.value
  } else {
    let rootDept = {
      oort_dname: storeC.tenantData?.company_name || '全部',
      oort_dcode: ''
    }
    if (dept && dept.oort_dname) {
      rootDept = dept
    }
    treeData.value = [rootDept]
    deptClick(rootDept)
    return
  }
  deptList(data).then((res: any) => {
    if (res.code === 200) {
      getList()
      treeData.value = res.data.list
    }
  })
}

// 权限配置
const authVis = ref(false)
const authClick = (item) => {
  diaObj.value = item
  authVis.value = true
}
const visibleVis = ref(false)
const openVisible = (row) => {
  visibleRow.value = row
  visibleVis.value = true
}

let handleSizeChange = (val: number) => {
  pagesize.value = val
  // 仅调整前端分页，不重新请求接口
  applyPagination()
}
let handleCurrentChange = (val: number) => {
  page.value = val
  // 仅调整前端分页，不重新请求接口
  applyPagination()
}

watch(() => storeC.tenantData, (newVal) => {
  if (newVal && newVal.company_name) {
    let rootDept = {
      oort_dname: newVal.company_name,
      oort_dcode: '',
      children: []
    }
    getSearchDept(rootDept)
  }
})

// 行样式
const tableRowClassName = ({ row }) => {
  if (row.deleted_at) {
    return 'delete_row'
  } else {
    return ''
  }
}

const showMoreDelete = ref(false)
const tableSelectChange = (newSelection) => {
  showMoreDelete.value = newSelection.length > 0
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
  background-size: cover;
  border-radius: 50%;
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
