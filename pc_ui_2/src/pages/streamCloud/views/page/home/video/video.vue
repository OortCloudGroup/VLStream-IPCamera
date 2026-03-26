<template>
  <div class="tenant_Page">
    <el-tabs v-model="activeName" class="tenanat-tabs" @tab-click="handleClick">
      <el-tab-pane label="租户管理" name="first" />
    </el-tabs>
    <div class="tenant_content">
      <!--搜索-->
      <div class="searchBox flexRowAC">
        <div class="serchItem">
          <el-input v-model="form.d1" class="wh-input" placeholder="租户名称" />
        </div>
        <div class="serchItem">
          <el-input v-model="form.d1" class="wh-input" placeholder="联系人姓名" />
        </div>
        <div class="serchItem">
          <el-input v-model="form.d1" class="wh-input" placeholder="联系人手机号" />
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
        <div class="exportBtn flexRowAC" @click="addTenClick">
          <img class="BtnImg" src="@/assets/img/message/new.png" alt="" />新增租户
        </div>
      </div>
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--部门tree-->
        <div class="police_aside">
          <div class="tree_search_content flexRowAC">
            <el-input
              v-model="searchDeptName"
              style="width: 80%;"
              suffix-icon="el-icon-search"
              placeholder="搜索"
              debounce="300"
              @change="getSearchDept"
            />
          </div>
          <el-tree
            :load="getDeptTreeUI"
            :data="treeData"
            lazy
            node-key="oort_dcode"
            :default-expanded-keys="['',99]"
            :props="defaultProps"
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
        <div class="tableTenIt">
          <el-table
            :show-overflow-tooltip="true"
            header-cell-class-name="header_tenant_cell"
            stripe
            :data="tableData"
          >
            <el-table-column prop="date" label="序号">
              <template #default="scope">
                {{ scope.$index + (page - 1) * pagesize + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="qrTitle" label="租户ID" />
            <el-table-column prop="qrDescription" label="租户名称" />
            <el-table-column prop="qrDescription" width="220px" label="单位名称" />
            <el-table-column prop="qrDescription" width="120px" label="管理员账号" />
            <el-table-column width="220px" label="使用期限">
              <template #default="scope">
                <span class="riskBtns riskWX ">{{ scope.row.qrTypeName }}</span>
              </template>
            </el-table-column>
            <el-table-column width="260px" label="应用功能">
              <template #default="scope">
                <span class="riskBtns riskWX ">{{ scope.row.qrTypeName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" width="240px" label="创建时间" />
            <el-table-column prop="operate" width="240px" fixed="right" align="right" label="操作">
              <template #default="scope">
                <div class="operateAppBox flexRowAC">
                  <div class="appBtn">
                    编辑
                  </div>
                  <div class="appBtn" @click="addAppClick(scope.row)">
                    添加应用
                  </div>
                  <div class="appBtn">
                    更多
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
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useUserStore } from '@/store/modules/user'
// import { deptList } from '@/api/unifiedUsert'
import { useRouter } from 'vue-router'

const router = useRouter()
const store: any = useUserStore()
const activeName = ref('first')
const searchDeptName = ref<any>('') // 搜索部门
const treeData = ref<any>([]) // 部门树date
const currentDeptCode = ref<any>('') // 当前部门code
// 配置选项
const defaultProps = {
  label: 'oort_dname',
  children: 'children',
  isLeaf: (data) => {
    return (data['hadchild'] === 0)
  }
}
const count = ref<any>(0)
const page = ref<Number>(1)
const pagesize = ref<Number>(10)
const tableData = ref<any>([{ id: 1 }])
const form = reactive({
  d1: '',
  d2: ''
})

interface Tree {
  oort_dname: string
  oort_dcode: any
  leaf?: boolean
}

// tabsClick
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

// 部门树列表
const getDeptTreeUI = (node: Node, resolve: (data: Tree[]) => void) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value
  }
  if (node.level === 0) {
    return resolve([{
      oort_dname: '全部',
      oort_dcode: ''
    }])
  } else {
    data['oort_pdcode'] = node.data.oort_dcode
  }
  // deptList(data).then((res: any) => {
  //   if (node.level === 0) {
  nextTick(() => {
    //       let nodeData: any = node.childNodes[0]
    //       nodeData.expanded = true
    //       nodeData.loadData()
  })
  // }
  //   if (res.code === 200) {
  //     resolve(res.data.list)
  //   }
  // })
}

// applistFn
const applistFn = async() => {
}

// 重置
function resetFn() {
  page.value = 1
  form.d1 = ''
}

// 新增
const addTenClick = () => {
  router.push('/tenantNew')
}

// 部门树选中
const deptClick = (data) => {
  currentDeptCode.value = data.oort_dcode
  page.value = 1
  applistFn()
}

// 部门树搜索
const getSearchDept = () => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 99
  }
  if (searchDeptName.value) {
    data['keyword'] = searchDeptName.value
  } else {
    let rootDept = {
      oort_dname: '全部',
      oort_dcode: ''
    }
    treeData.value = [rootDept]
    deptClick(rootDept)
    return
  }
  // deptList(data).then((res: any) => {
  //   if (res.code === 200) {
  //     applistFn()
  //     treeData.value = res.data.list
  //   }
  // })
}

// 添加应用
const addAppClick = (item: any) => {
  router.push({
    path: '/tenantAddapp',
    query: {
      id: item.id
    }
  })
}

let handleSizeChange = (val: number) => {
  pagesize.value = val
  applistFn()
}
let handleCurrentChange = (val: number) => {
  page.value = val
  applistFn()
}
</script>
<style lang="scss" scoped>
.tenant_Page {
  height: 100%;
  width: 100%;
  overflow: auto;

  .tenanat-tabs {
    padding: 0 20px;
  }

  .tenant_content {
    width: 100%;
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
    //background: #F8F8F9;
  }

  .el-table.is-scrolling-none th.el-table-fixed-column--left, .el-table.is-scrolling-none th.el-table-fixed-column--right,.el-table.is-scrolling-right th.el-table-fixed-column--right {
    background: #F8F8F9;
  }
}

// 部门树
.police_aside {
  width: 300px;
  padding: 20px;
  flex-shrink: 0;

  .tree_search_content {
    justify-content: center;
    padding-bottom: 10px;

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
  padding-left: 0;
  flex: 1;
  width: 100vh;
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

  .searchImg {
    width: 14px;
    height: 14px;
    background-size: cover;
    margin-right: 8px;
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

// 添加应用
.operateAppBox {
  gap: 12px;

  .appBtn {
    cursor: pointer;
    padding: 6px 12px;
    border: 0.5px solid rgba(220, 223, 230, 1);
    border-radius: 2px;
  }
}
</style>
