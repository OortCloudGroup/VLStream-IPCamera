<template>
  <div class="tenant_Page">
    <div class="tenant_content">
      <!--新增-->
      <div class="exportBtnBox flexRowAC">
        <div class="exportBtn flexRowAC" @click="addData()">
          <img class="BtnImg" src="@/assets/img/message/new.png" alt="" />录入数据
        </div>
        <div class="exportBtn  flexRowAC" @click="searchData">
          <img class="BtnImg" src="@/assets/img/search.png" alt="" />搜索数据
        </div>
      </div>
      <div class="exportBtnBox flexRowAC">
        <div v-if="searchArr.length > 0" class="search_body">
          <span>当前查询条件:</span>
          <el-tag
            v-for="(item,index) in searchArr"
            :key="item.name"
            closable
            type="warning"
            style="margin:0 0.5rem;"
            @close="removeSearchKey(index)"
          >
            {{ item.name }}:{{ item.fieldValue }}
          </el-tag>
          <!--        <div v-for="(item,index) in searchArr" :key="index" class="search_body_item">-->
          <!--          <span>{{ item.name }}:</span>-->
          <!--          <span>{{ item.fieldValue }}</span>-->
          <!--        </div>-->
          <el-button style="margin: 0 0.04rem" size="mini" @click="cancelSearch">
            取消
          </el-button>
          <el-button v-if="condition" style="margin: 0 0.04rem" type="primary" size="mini" @click="gotoSearch(false)">
            模糊查询
          </el-button>
          <el-button v-else style="margin: 0 0.04rem" type="primary" size="mini" @click="gotoSearch(true)">
            精确查询
          </el-button>
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
        <div v-if="showBrowerInter" class="tableTenIt">
          <el-table
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            :data="tableData"
            @sortChange="sortChange"
          >
            <el-table-column
              v-for="(item,index) in browserFieldList"
              :key="item.field+index"
              :min-width="item.width"
              sortable="custom"
              align="center"
              :prop="item.field"
              :label="item.name"
            >
              <template #default="scope">
                <template v-if="item.showType === 1">
                  <img style="width: 24px;height: 24px;" :src="config.URL + config.gateWay + 'oortcloud-warehouse' + '/api/v1/files.show?pic_id=' + scope.row[item.field]" />
                </template>
                <span v-else>{{ scope.row[item.field] }}</span>
              </template>
            </el-table-column>
            <el-table-column width="160px" fixed="right" align="center" label="操作">
              <template #default="scope">
                <div class="opBox flexRowAC">
                  <div class="operateBox flexRowAC" style="color: var(--el-color-primary);cursor: pointer;" @click="editData(scope.row)">
                    编辑
                  </div>
                  <div class="operateBox flexRowAC" style="color: var(--el-color-primary);cursor: pointer;" @click="dataDetail(scope.row)">
                    详情
                  </div>
                  <div class="operateBox flexRowAC" style="color: red;cursor: pointer;" @click="deleteData(scope.row)">
                    删除
                  </div>
                </div>
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
        <div v-else class="tableTenIt">
          <el-empty description="该分类未设置浏览界面" />
        </div>
      </div>
    </div>
    <el-dialog
      v-model="entryDataVis"
      :title="entryDataTitle"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <EntryData v-if="entryDataVis" :data="currentRow" :ccid="cid" @close="entryDataClose" />
    </el-dialog>
    <el-dialog
      v-model="dataDetailVis"
      :title="entryDataTitle"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <DataDetail v-if="dataDetailVis" :data="currentRow" :ccid="cid" @close="dataDetailVis=false" />
    </el-dialog>
    <el-dialog
      v-model="searchDataVis"
      title="搜索"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <SearchData v-if="searchDataVis" :ccid="cid" @close="searchDataClose" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ckmtClassifyInGet, ckmtDataList, ckmtClassifyAll, ckmtDataDel } from '@/api/warehouse'
import { ElMessage } from 'element-plus'
import EntryData from './entryData.vue'
import SearchData from './searchData.vue'
import DataDetail from './dataDetail.vue'
import config from '@/config/index'

const store = useUserStore()
const entryDataVis = ref<boolean>(false)
const entryDataTitle = ref<any>('录入数据')
const treeData = ref<any>([]) // 部门树date
const cid = ref<any>('') // 分类树id
// 配置选项
const defaultProps = {
  children: 'child',
  label: 'name'
}
const count = ref<any>(0)
const page = ref<Number>(1)
const pagesize = ref<Number>(10)
const tableData = ref<any>([])

// 部门树列表
const getDeptTreeUI = async() => {
  let data = {
    accessToken: store.userInfo.accessToken
  }
  let res = await ckmtClassifyAll(data)
  if (res.code === 200) {
    treeData.value = res.data
    cid.value = treeData.value[0].id
    await getInterface()
    // 列表
    await getList()
  }
}

const entryDataClose = () => {
  entryDataVis.value = false
  getList()
}

// 新增
const addData = () => {
  currentRow.value = null
  entryDataVis.value = true
}

const currentRow = ref<any>(null)
const editData = (data) => {
  currentRow.value = data
  entryDataVis.value = true
  entryDataTitle.value = '编辑数据'
}

const dataDetailVis = ref<boolean>(false)
const dataDetail = (data) => {
  currentRow.value = data
  dataDetailVis.value = true
  entryDataTitle.value = '数据详情'
}

const deleteData = (data) => {
  ElMessageBox.confirm('是否删除该条数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(async() => {
    const params = {
      accessToken: useUserStore().token,
      record_id: data.record_id
    }
    let res = await ckmtDataDel(params)
    if (res.code === 200) {
      ElMessage({
        message: '操作成功!',
        position: 'bottom-right',
        type: 'success'
      })
      getList()
    }
  }).catch(() => {
  })
}

// 搜索数据
const searchDataVis = ref<boolean>(false)
const searchArr = ref<any>([])
const searchData = async() => {
  searchDataVis.value = true
}

const searchDataClose = (data) => {
  searchDataVis.value = false
  if (data) {
    searchArr.value = data
  }
  getList()
}

const removeSearchKey = (index) => {
  searchArr.value.splice(index, 1)
  gotoSearch()
}

const cancelSearch = () => {
  searchArr.value = []
  gotoSearch()
}

const condition = ref<boolean>(false)
const gotoSearch = (flag) => {
  condition.value = !!flag
  getList()
}

// 排序
const orderArr = ref<any>([])
const sortChange = (orderObject) => {
  // order 不为空时 排序 element 不支持多个选中
  if (orderObject.order) {
    let obj = {}
    if (orderObject.order === 'ascending') {
      obj.order = 'asc'
    }
    if (orderObject.order === 'ascending') {
      obj.order = 'desc'
    }
    obj.field = orderObject.prop
    orderArr.value = [obj]
  } else {
    orderArr.value = []
  }
  getList()
}

// 数据列表
const getList = async() => {
  let params = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    cid: cid.value
  }
  if (orderArr.value.length > 0) {
    params.orders = orderArr.value
  }
  if (searchArr.value.length > 0) {
    let tempArr = []
    searchArr.value.forEach(it => {
      tempArr.push({ field: it.field, value: it.fieldValue, condition: condition.value ? '=' : 'like' })
    })
    params.fields = tempArr
  }
  ckmtDataList(params).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data.list || []
      count.value = res.data.count || 0
    }
  })
}

// 分类树选中
const deptClick = (data) => {
  page.value = 1
  cid.value = data.id
  // 列表
  getInterface()
  getList()
}

let handleSizeChange = (val) => {
  pagesize.value = val
  getList()
}
let handleCurrentChange = (val) => {
  page.value = val
  getList()
}

// 是否显示表格
const showBrowerInter = ref<boolean>(false)
const browserFieldList = ref<any>([])
const getInterface = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    cid: cid.value,
    type: 1
  }
  ckmtClassifyInGet(data).then((res) => {
    if (res.code === 200) {
      if (res.data.templet && res.data.templet.json) {
        showBrowerInter.value = true
        browserFieldList.value = (res.data.templet.json || []).filter(item => { return item.isShow })
      } else {
        showBrowerInter.value = false
      }
    }
  })
}

onMounted(() => {
  getDeptTreeUI()
})
</script>

<style lang="scss">

.tenant_Page {
  .el-dialog {
    margin-top: 4vh!important;
  }
}

</style>

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
  padding: 10px 20px;
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
