<template>
  <div class="tenant_Page">
    <div class="tenant_content">
      <!--新增-->
      <div class="exportBtnBox flexRowAC">
        <div class="exportBtn flexRowAC" @click="addNewField">
          新增
        </div>
        <div class="exportBtn  flexRowAC" @click="editField">
          编辑
        </div>
        <div class="exportBtn  flexRowAC" style="background-color: #e94b07;color:#fff;border: 0;" @click="deleteField">
          删除
        </div>
      </div>
      <!--table-->
      <div class="tableTenBox flexRowAC">
        <!--table-->
        <div class="tableTenIt">
          <el-table
            :data="tableData"
            style="width: 100%;height: 100%"
            :header-cell-style="{background:' #F8F8F9'}"
            :highlight-current-row="false"
            @select-all="selectCol"
            @select="selectCol"
          >
            <el-table-column type="selection" />
            <el-table-column
              label="序号"
              type="index"
              width="80"
            />
            <el-table-column
              align="center"
              prop="field"
              label="主列表名"
            >
              <template #default="scope">
                <span v-if="scope.row.field">{{ scope.row.field }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="列名描述"
              width="150"
            />
            <el-table-column
              align="center"
              prop="type"
              label="列类型"
              width="80"
            />
            <el-table-column
              align="center"
              prop="length"
              label="列长度"
              width="100"
            />
            <el-table-column
              align="center"
              prop="dictID"
              label="关联提示信息"
              width="150"
            />
            <el-table-column
              align="center"
              prop="dictName"
              label="提示名称"
              width="150"
            />
            <el-table-column
              align="center"
              prop="index"
              label="是否索引"
              width="100"
            >
              <template #default="scope">
                <span>{{ scope.row.index?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="uniqueIndex"
              label="是否唯一索引"
              width="130"
            >
              <template #default="scope">
                <span>{{ scope.row.uniqueIndex?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="primaryKey"
              label="是否主键"
            >
              <template #default="scope">
                <span>{{ scope.row.primaryKey?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="isuser"
              label="是否用户添加字段"
              width="180"
            >
              <template #default="scope">
                <span>{{ scope.row.isuser?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_created_at"
              label="是否取创建时间数值"
              width="180"
            >
              <template #default="scope">
                <span>{{ scope.row.is_created_at?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="is_updated_at"
              label="是否取更新时间数值"
              width="180"
            >
              <template #default="scope">
                <span>{{ scope.row.is_updated_at?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="datetimeFormat"
              width="180"
              label="时间格式化样式"
            />
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
      v-model="createOrEditVis"
      :title="currentField?'新增字段':'编辑字段'"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="createOrEditVis=false">
        <i class="el-dialog__close el-icon el-icon-close" style="color: #ffffff" />
      </button>
      <CreateOrEditFiled v-if="createOrEditVis" :field="currentField" @close="createdOrEditClose" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import CreateOrEditFiled from './createOrEditFiled.vue'
import { reducePromise } from '../xForm/util/reducePromise'
import { ckmtFieldDel, ckmtFieldlist } from '@/api/warehouse'

const count = ref<any>(0)
const page = ref<Number>(1)
const pagesize = ref<Number>(10)
const tableData = ref<any>([])
const selection = ref<any>([])

const createOrEditVis = ref<Boolean>(false)
const createdOrEditClose = () => {
  createOrEditVis.value = false
  getList()
}

// 新增
const addNewField = () => {
  createOrEditVis.value = true
}

const currentField = ref<string>('')
const editField = () => {
  if (selection.value.length === 0) {
    ElMessage({
      message: '请选择操作的项!',
      position: 'bottom-right',
      type: 'warning'
    })
    return
  }
  currentField.value = selection.value[0].field
  createOrEditVis.value = true
}

const deleteField = () => {
  if (selection.value.length === 0) {
    ElMessage({
      message: '请选择操作的项!',
      position: 'bottom-right',
      type: 'warning'
    })
    return
  }
  ElMessageBox.confirm('此操作将删除选择的字段项, 是否继续', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(async() => {
    confirmDelete()
  }).catch(() => {
  })
}

const confirmDelete = () => {
  let promiseArr = []
  selection.value.forEach(item => {
    promiseArr.push(fieldDelete(item.field))
  })
  reducePromise(promiseArr).then(res => {
    if (res.every(num => {
      return num === 200
    })) {
      ElMessage({
        message: '操作成功!',
        position: 'bottom-right',
        type: 'success'
      })
    }
    getList()
  })
}
const fieldDelete = (field) => {
  return () => {
    return new Promise(resolve => {
      const params = {
        accessToken: useUserStore().token,
        field: field
      }
      ckmtFieldDel(params).then(res => {
        resolve(res.code)
      })
    })
  }
}

const getList = async() => {
  const params = {
    accessToken: useUserStore().token,
    page: page.value,
    pagesize: pagesize.value
  }
  let res = await ckmtFieldlist(params)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.counts || 0
  }
}
// 选择行
const selectCol = (data) => {
  selection.value = data
}

const handleSizeChange = (val) => {
  pagesize.value = val
  getList()
}
const handleCurrentChange = (val) => {
  page.value = val
  getList()
}

onMounted(() => {
  getList()
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
    margin-top: 10px;
    margin-block: 5px;
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
