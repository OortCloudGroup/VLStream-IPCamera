<template>
  <div class="classPage">
    <div class="classPageR">
      分类管理
    </div>
    <div class="tenant_Page">
      <div class="tenant_content">
        <!--table-->
        <div class="tableTenBox flexRowAC">
          <!--部门tree-->
          <div class="police_aside">
            <div class="tree_search_content flexRowAC">
              <el-input
                v-model="searchDeptName"
                style="width: 80%;"
                suffix-icon="el-icon-search"
                placeholder="搜索部门"
                debounce="300"
                @change="getSearchDept"
              />
            </div>
            <el-tree
              :data="treeData"
              node-key="id"
              :current-node-key="1"
              default-expand-all
              :highlight-current="true"
              :props="defaultProps"
              :expand-on-click-node="false"
              @node-click="deptClick"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-node flexRowAC">
                  <img
                    v-if="data['child']?.length||!node.parent.data.id"
                    style="width: 1rem;margin: 0 0.25rem"
                    src="@/assets/img/warehouse/table1.png"
                  />
                  <img v-else style="width: 1rem;margin: 0 0.25rem" src="@/assets/img/warehouse/table2.png" />
                  <el-tooltip :open-delay="500" class="item" effect="light" :content="node.label" placement="top">
                    <div class="treeLeBox flexRowAC">
                      {{ node.label }}
                      <div v-if="data.id ===cid" class="treeLeR flexRowAC">
                        <el-dropdown @command="(command)=>newClassify(command,node)">
                          <div class="blue">
                            新增
                          </div>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item class="blue" :command="1">
                                新增同级
                              </el-dropdown-item>
                              <el-dropdown-item class="blue" :command="2">
                                新增下级
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                        <div class="blue" @click="newClassify(3,node)">
                          编辑
                        </div>
                        <div class="red" @click="deleteClick(node)">
                          删除
                        </div>
                      </div>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-tree>
          </div>
          <!--table-->
          <div class="tableTenIt">
            <div class="tableTenItRadio">
              <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
                <el-radio-button :value="1">
                  分类
                </el-radio-button>
                <el-radio-button :value="2">
                  界面
                </el-radio-button>
                <!-- <el-radio-button :value="3">提示</el-radio-button>
                <el-radio-button :value="4">报表</el-radio-button> -->
              </el-radio-group>
            </div>
            <!--界面-->
            <class-mana-inter v-if="cid&&tabPosition===2" :cid="cid" />
            <!--新增-->
            <div v-if="tabPosition===1||tabPosition===3" class="exportBtnBox flexRowAC">
              <div class="exportBtn flexRowAC" @click="newEditClick('')">
                <img class="BtnImg" src="@/assets/img/message/new.png" alt="" />新增
              </div>
              <div class="exportBtn BtnD flexRowAC" @click="deleteClick('')">
                <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除
              </div>
              <div class="exportBtn Btn2 flexRowAC">
                <img class="BtnImg" src="@/assets/img/warehouse/move1.png" alt="" />上移
              </div>
              <div class="exportBtn Btn2 flexRowAC">
                <img class="BtnImg" src="@/assets/img/warehouse/move2.png" alt="" />下移
              </div>
            </div>
            <div v-if="tabPosition===4" class="exportBtnBox flexRowAC">
              <div class="exportBtn flexRowAC">
                <img class="BtnImg" src="@/assets/img/message/new.png" alt="" />新增
              </div>
              <div class="exportBtn BtnD flexRowAC">
                <img class="BtnImg" src="@/assets/img/message/delete.png" alt="" />删除
              </div>
              <div class="exportBtn Btn2 flexRowAC">
                <img class="BtnImg" src="@/assets/img/warehouse/move3.png" alt="" />设计
              </div>
              <div class="exportBtn Btn2 flexRowAC">
                <img class="BtnImg" src="@/assets/img/message/import1.png" alt="" />导入
              </div>
              <div class="exportBtn Btn2 flexRowAC">
                <img class="BtnImg" src="@/assets/img/message/export.png" alt="" />导出
              </div>
              <div class="exportBtn Btn2 flexRowAC">
                <img class="BtnImg" src="@/assets/img/warehouse/move4.png" alt="" />属性
              </div>
            </div>
            <!--分类列表-->
            <el-table
              v-if="tabPosition===1"
              :show-overflow-tooltip="true"
              header-cell-class-name="header_tenant_cell"
              stripe
              :data="classList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="date" label="序号">
                <template #default="scope">
                  {{ scope.$index + (page - 1) * pagesize + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="分类名" />
              <el-table-column prop="pid" label="级数">
                <template #default="scope">
                  <div v-if="scope.row.pid===0">
                    顶级
                  </div>
                  <div v-else>
                    {{ scope.row.pid }}级
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排列顺序" />
              <el-table-column prop="created_at" label="创建时间" />
              <el-table-column prop="operate" align="left" label="操作" width="80px">
                <template #default="scope">
                  <div class="operateBox blue flexRowAC" @click="newEditClick(scope.row)">
                    修改
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="tabPosition===3"
              :show-overflow-tooltip="true"
              header-cell-class-name="header_tenant_cell"
              stripe
              :data="tableData"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="date" label="序号">
                <template #default="scope">
                  {{ scope.$index + (page - 1) * pagesize + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="qrDescription" label="提示数据" />
              <el-table-column prop="qrTitle" label="描述" />
              <el-table-column prop="operate" align="right" label="操作">
                <template #default="scope">
                  <div class="operateBox flexRowAC" @click="newEditClick(scope.row)">
                    修改
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-if="tabPosition===4"
              :show-overflow-tooltip="true"
              header-cell-class-name="header_tenant_cell"
              stripe
              :data="tableData"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="date" label="序号">
                <template #default="scope">
                  {{ scope.$index + (page - 1) * pagesize + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="qrDescription" label="流水号" />
              <el-table-column prop="qrDescription" label="文件标题" />
              <el-table-column prop="qrTitle" label="责任人" />
              <el-table-column prop="qrTitle" label="编号" />
              <el-table-column prop="qrTitle" label="类型" />
              <el-table-column prop="qrTitle" label="新增时间" />
              <el-table-column prop="qrTitle" label="描述" />
              <el-table-column prop="operate" align="right" label="操作">
                <template #default="scope">
                  <div class="operateBox flexRowAC" @click="newEditClick(scope.row)">
                    修改
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="tabPosition!==2" class="paginationBox flexRowAC">
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
    </div>
    <el-dialog
      v-model="clminVisi"
      :title="idObjInfo?'编辑分类':'添加分类'"
      width="30%"
      :close-on-click-modal="false"
    >
      <class-mana-new v-if="classInfo" :item="classInfo" :obj="idObjInfo" @close="clminVisi=false" @handle="handleFn" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import ClassManaInter from '@/pages/warehouse/views/page/classMana/classManaInter.vue'
import { ckmtClassifyAll, ckmtClassifyDel, ckmtClassifylist } from '@/api/warehouse'
import ClassManaNew from '@/pages/warehouse/views/page/classMana/classManaNew.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useUserStore()
const tabPosition = ref<number>(1) // 分类
const searchDeptName = ref<any>('') // 搜索部门
const treeData = ref<any>([]) // 部门树date
const clminVisi = ref<Boolean>(false) // 添加分类
const classInfo = ref<any>('') // 添加分类
const idObjInfo = ref<any>('') // 编辑分类
// 配置选项
const defaultProps = {
  children: 'child',
  label: 'name'
}
const count = ref<any>(0)
const page = ref<Number>(1)
const pagesize = ref<Number>(10)
const tableData = ref<any>([])
const cid = ref<any>('') // 分类界面列表
const cidObj = ref<any>('') // 分类界面列表obj
const classList = ref<any>([]) // 分类列表
const multipleSelection = ref<any>([]) // table勾选

// 部门树列表
const getDeptTreeUI = () => {
  let data = {
    accessToken: store.userInfo.accessToken
  }
  ckmtClassifyAll(data).then((res) => {
    if (res.code === 200) {
      treeData.value = res.data
      cid.value = treeData.value[0].id
      cidObj.value = treeData.value[0]
      // 列表
      applistFn()
    }
  })
}

// 新增分类
const newClassify = (command: string | number | object, item: any) => {
  idObjInfo.value = ''
  if (command === 1) {
    classInfo.value = item.parent.data.id ? item.parent.data : { id: 0, name: '全部' }
  }
  if (command === 2) {
    classInfo.value = item.data
  }
  // 编辑分类
  if (command === 3) {
    idObjInfo.value = item.data
    classInfo.value = item.parent.data.id ? item.parent.data : { id: 0, name: '全部' }
  }
  clminVisi.value = true
}

// 删除分类
const deleteClick = (item: any) => {
  if (!item && multipleSelection.value.length !== 1) {
    return ElMessage.warning('选择一条数据')
  }
  if (!item && multipleSelection.value.length) {
    item = {}
    item['data'] = multipleSelection.value[0]
  }
  ElMessageBox.confirm('是否确定删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    let data = {
      accessToken: store.userInfo.accessToken,
      id: item.data.id
    }
    let res: any = await ckmtClassifyDel(data)
    if (res.code === 200) {
      // 列表 刷新
      getDeptTreeUI()
      ElMessage.success(res.msg)
    } else {
      ElMessage.warning(res.msg)
    }
  })
}

// 分类树选中
const deptClick = (data) => {
  cidObj.value = data
  page.value = 1
  cid.value = data.id
  // 列表
  applistFn()
}

// 批量选择
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

// 分类列表 新建修改
const newEditClick = (val: any) => {
  idObjInfo.value = ''
  if (val) {
    idObjInfo.value = val
    classInfo.value = cidObj.value
  } else {
    classInfo.value = cidObj.value
  }
  clminVisi.value = true
}

// handleFn
const handleFn = () => {
  getDeptTreeUI()
}

// 分类列表
const applistFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    pid: cid.value
  }
  ckmtClassifylist(data).then((res: any) => {
    if (res.code === 200) {
      classList.value = res.data.list
      count.value = res.data.count
    }
  })
}

// 部门树搜索
const getSearchDept = () => {
}

let handleSizeChange = (val: number) => {
  pagesize.value = val
  applistFn()
}
let handleCurrentChange = (val: number) => {
  page.value = val
  applistFn()
}

onMounted(() => {
  getDeptTreeUI()
})
</script>
<style lang="scss" scoped>

.classPage {
  height: 100%;

  .classPageR {
    font-size: 14px;
    line-height: 21px;
    color: rgba(0, 0, 0, 0.45);
    padding-bottom: 20px;
  }
}

.tenant_Page {
  background: #FFFFFF;
  border-radius: 10px 10px 0px 0px;
  height: calc(100% - 40px);
  width: 100%;
  overflow: auto;

  .tenant_content {
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    flex: 1;
  }

  .tableTenBox {
    width: 100%;
    flex: 1;
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
  width: 420px;
  flex-shrink: 0;
  padding: 20px;

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
    height: 38px;
    font-size: 14px;
    color: #333333;
  }

  :deep(.el-tree) {
    & > .el-tree-node.is-current.is-focusable > .el-tree-node__content {
      //background-color: rgba(26, 83, 255, .12);
      //el-tree-node is-expanded is-focusable
    }

    .el-tree-node__children > .el-tree-node.is-current.is-focusable {
      background-color: #E6F0FF;
    }
  }
}

// 部门树table
.tableTenIt {
  padding: 20px;
  flex: 1;

  .tableTenItRadio {
    text-align: center;
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

  &.BtnD {
    color: #F62E2E;
    background: #FFFFFF;
    border: 1px solid rgba(255, 183, 183, 1);
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

// 部门树列表新增
.custom-tree-node {
  height: 38px;
  font-size: 14px;
  color: #333333;
  width: 100%;
  //background-color: rgba(26, 83, 255, .12);

  .treeLeBox {
    flex: 1;
    justify-content: space-between;
  }

  .treeLeR {
    padding-right: 12px;
    gap: 12px;
  }
}

.operateBox {
  cursor: pointer;
}

.red {
  color: red;
}

.blue {
  color: #1A53FF;
}
</style>
