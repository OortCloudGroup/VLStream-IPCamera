<template>
  <div class="tenant_Page draHeaPB">
    <div class="tenant_content">
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--角色tree-->
        <div v-yResize class="police_aside_use">
          <div class="treeTitle">
            角色列表
          </div>
          <div class="tree_search_content flexRowAC">
            <el-input
              v-model="searchRoleName"
              placeholder="搜索角色"
              debounce="300"
              prefix-icon="search"
              @change="getSearchRole"
            />
          </div>
          <el-tree
            style="background: #fff;"
            :load="getRoleTreeUI"
            :data="treeData"
            lazy
            highlight-current
            node-key="ruuid"
            :default-expanded-keys="['','']"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="roleClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node flexRowAC">
                <img
                  v-if="data.role_photo"
                  style="width: 1rem;height:1rem;margin: 0 0.25rem;border-radius: 50%"
                  :src="data.role_photo"
                  alt=""
                />
                <img v-else style="width: 1rem;margin: 0 0.25rem" src="@/assets/img/dept_default.png" alt="" />
                <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                  <div :class="{ 'activeRole': data.ruuid === currentRoleCode, 'activeDept': data.ruuid === currentRoleCode }">
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
            <div v-if="currentRoleObj && currentRoleObj.name" class="depNameBox flexRowAC">
              <img v-if="currentRoleObj?.role_photo" class="depNameImg" :src="currentRoleObj?.role_photo" alt="" />
              <oort-svg-icon v-else class="depNameImg" name="dept" width="40" height="40" />
              <div class="depNameBox column flexRowAC">
                {{ currentRoleObj['name'] }}
                <div class="columnSpan flexRowAC">
                  <span class="depNameBox_T">共有{{ count }}个</span>
                </div>
              </div>
            </div>
            <!--搜索-->
            <div class="searchHeight_out flexRowAC">
              <search-height-box keyword="keyword" placeholder="请输入角色名称等关键词" :data="searchData" @handle="searchResetFn" />
              <export-excel-pdf />
            </div>
          </div>
          <TableSelf
            class="new_table"
            header-cell-class-name="header_tenant_cell"
            stripe
            :row-class-name="tableRowClassName"
            :data="tableData"
            current-row-key="ruuid"
            @selection-change="tableSelectChange"
          >
            <el-table-column type="selection" :width="clacPXToVW(55)" />
            <el-table-column prop="date" label="序号" :width="clacPXToVW(65)">
              <template #default="scope">
                {{ scope.$index + (page - 1) * pagesize + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="角色头像" :width="clacPXToVW(120)">
              <template #default="scope">
                <el-image
                  v-if="scope.row.role_photo"
                  class="depImg"
                  :src="scope.row.role_photo"
                  :preview-src-list="[scope.row.role_photo]"
                  :preview-teleported="true"
                />
                <oort-img v-else :src="scope.row?.role_photo" class="depImg" default-img="dept" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="角色名称" :width="clacPXToVW(200)" />
            <el-table-column prop="code" label="角色编号" :width="clacPXToVW(150)" />
            <el-table-column prop="type" label="角色类型" :width="clacPXToVW(120)">
              <template #default="scope">
                <span v-if="scope.row.type === '1'">系统角色</span>
                <span v-else-if="scope.row.type === '2'">自定义角色</span>
                <span v-else>{{ scope.row.type }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="oort_remark" label="角色描述" show-overflow-tooltip />
            <el-table-column label="状态" :width="clacPXToVW(100)">
              <template #default="scope">
                <span v-if="scope.row.oort_status===1" class="staBtns WX">启用</span>
                <span v-if="scope.row.oort_status===2" class="staBtns LKL">禁用</span>
              </template>
            </el-table-column>
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
        :set-type="1"
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
import { roleList } from '@/api/unifiedUsert/apaasAuth'
import TableSelf from '@/components/TableSelf.vue'
import { clacPXToVW } from '@/utils/index'
import visibleScopeDialog from './visibleScopeDialog.vue'
import visibleDeptDialog from './visibleDeptDialog.vue'
import AddressSetingDialog from '@/components/personHome/addressSetingDialog.vue'
import SearchHeightBox from '@/components/SearchHeightBox.vue'
import ExportExcelPdf from '@/components/exportExcelPdf.vue'

const store: any = useUserStore()
const searchRoleName = ref<any>('')
const treeData = ref<any>([])
const currentRoleCode = ref<any>('')
const currentRoleObj = ref<any>({
  name: '全部',
  ruuid: '',
  role_photo: ''
})
const defaultProps = {
  label: 'name',
  children: 'children',
  isLeaf: (_data) => {
    return true // 角色节点都是叶子节点
  }
}

interface Tree {
  name: string
  ruuid: any
  role_photo?: string
  leaf?: boolean
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

function searchResetFn(val, reset) {
  if (reset) page.value = 1
  form.keyword = val.keyword
  getList()
}

// 角色树列表（懒加载）
const getRoleTreeUI = (node: Node, resolve: (data: Tree[]) => void) => {
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    page: 1,
    pagesize: 999
  }
  if (node.level === 0) {
    // 第一级：返回"全部"节点
    return resolve([{
      name: '全部',
      ruuid: '',
      role_photo: ''
    }])
  } else {
    // 第二级：加载角色列表
    if (searchRoleName.value) {
      params['keyword'] = searchRoleName.value
    }
  }

  roleList(params).then((res: any) => {
    if (node.level === 0) {
      nextTick(() => {
        const nodeData: any = node.childNodes[0]
        nodeData.expanded = true
        nodeData.loadData()
      })
    }
    if (res.code === 200) {
      const roleListData = res.data.list || []
      resolve(roleListData)
    } else {
      resolve([])
    }
  })
}

const getSearchRole = (role?: any) => {
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    page: 1,
    pagesize: 999
  }
  if (searchRoleName.value) {
    params['keyword'] = searchRoleName.value
  } else {
    const rootRole = {
      name: '全部',
      ruuid: '',
      role_photo: ''
    }
    if (role && role.name) {
      Object.assign(rootRole, role)
    }
    treeData.value = [rootRole]
    roleClick(rootRole)
    return
  }
  roleList(params).then((res: any) => {
    if (res.code === 200) {
      getList()
      treeData.value = res.data.list || []
    }
  })
}

const roleClick = (data: any) => {
  currentRoleCode.value = data.ruuid
  currentRoleObj.value = data
  page.value = 1
  getList()
}

const getList = async() => {
  const params: any = {
    accessToken: store.userInfo?.accessToken,
    page: page.value,
    pagesize: pagesize.value
  }
  // 如果选中了某个角色（不是"全部"），添加 keyword 参数
  if (currentRoleCode.value && currentRoleObj.value?.name && currentRoleObj.value.name !== '全部') {
    params.keyword = currentRoleObj.value.name
  } else if (form.keyword) {
    // 如果搜索框有内容，使用搜索框的内容
    params.keyword = form.keyword
  }
  const res: any = await roleList(params)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.count || res.data.counts || 0
    // 如果选中了某个角色，更新当前角色对象信息
    if (currentRoleCode.value) {
      const selectedRole = tableData.value.find((item: any) => item.ruuid === currentRoleCode.value)
      if (selectedRole) {
        currentRoleObj.value = selectedRole
      }
    }
  }
}

const handleSizeChange = (val: number) => {
  pagesize.value = val
  getList()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  getList()
}

const tableRowClassName = ({ row }) => {
  if (row.ruuid === currentRoleCode.value) {
    return 'active-row'
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

onMounted(() => {
  // 初始化时显示全部角色
  getList()
})
</script>
<style>
.delete_row {
  text-decoration: line-through;
  color: #999;
}

.active-row {
  background-color: var(--el-color-primary-hb) !important;
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
