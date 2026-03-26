<template>
  <div class="dictionary-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="字典类型">
        <el-select v-model="searchForm.categoryType" placeholder="请选择字典类型" clearable @change="handleTypeChange">
          <el-option
            v-for="item in parentOptions"
            :key="item.categoryType"
            :label="item.categoryName"
            :value="item.categoryType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型名称">
        <el-input v-model="searchForm.categoryName" placeholder="请输入类型名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          查询
        </el-button>
        <el-button @click="resetSearch">
          重置
        </el-button>
        <el-button type="primary" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="categoryName" label="类型名称" align="center" />
        <el-table-column prop="categoryType" label="类型编码" align="center" />
        <el-table-column prop="sortOrder" label="排序" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" width="280" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="650px"
      :close-on-click-modal="false"
      destroy-on-close
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="150px" class="dialog-form">
        <el-form-item label="字典类型" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择字典类型" :disabled="!!form.id" clearable>
            <el-option
              v-for="item in parentOptions"
              :key="item.categoryType"
              :label="item.categoryName"
              :value="item.categoryType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="类型编码" prop="categoryType">
          <el-input v-model="form.categoryType" placeholder="请输入类型编码,未输入则系统自动生成" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  addDictionary,
  updateDictionary,
  deleteDictionary,
  getDictionaryPage,
  getParentDictionaries
} from '@/api/mobileeducationplatform/case'

// 表单数据
const searchForm = reactive({
  categoryName: '',
  categoryType: '',
  customCategoryType: ''
})

const form = reactive({
  id: '',
  categoryName: '',
  categoryType: '',
  parentId: '',
  sortOrder: undefined
})

// 表格数据
const tableData = ref([])
const parentOptions = ref([])

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 对话框控制
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()

// 表单验证规则
const rules = {
  categoryName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
}

// 初始化数据
onMounted(async() => {
  await loadParentOptions()
  await loadTableData()
})

// 加载父级选项
const loadParentOptions = async() => {
  try {
    const response = await getParentDictionaries()
    if (response.code === 200) {
      parentOptions.value = response.data
      if (parentOptions.value.length > 0) {
        searchForm.categoryType = parentOptions.value[0].categoryType
      }
    }
  } catch (error) {
    ElMessage.error('加载字段类型失败')
  }
}

// 加载表格数据
const loadTableData = async() => {
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      categoryName: searchForm.categoryName || undefined,
      categoryType: searchForm.categoryType || searchForm.customCategoryType || undefined
    }
    const response = await getDictionaryPage(params)
    if (response.code === 200) {
      tableData.value = response.data.records
      pagination.total = response.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

// 处理类型变更
const handleTypeChange = () => {
  loadTableData()
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  loadTableData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.categoryName = ''
  searchForm.categoryType = ''
  searchForm.customCategoryType = ''
  handleSearch()
}

// 处理新增
const handleAdd = () => {
  dialogTitle.value = '新增字典'
  form.id = ''
  form.categoryName = ''
  form.categoryType = ''
  form.parentId = ''
  form.sortOrder = undefined
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑字典'
  Object.assign(form, {
    ...row,
    parentId: row.parentId,
    sortOrder: row.sortOrder
  })
  dialogVisible.value = true
}

// 监听对话框关闭
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 处理删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除字典?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    try {
      const response = await deleteDictionary(row.id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadTableData()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 处理页码变更
const handlePageChange = (page: number) => {
  pagination.current = page
  loadTableData()
}

// 处理每页条数变更
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadTableData()
}

// 处理表单提交
const handleSubmit = async() => {
  if (!formRef.value) return
  await formRef.value.validate(async(valid) => {
    if (valid) {
      try {
        const submitData = {
          ...form,
          parentId: form.parentId || undefined
        }
        const api = form.id ? updateDictionary : addDictionary
        const response = await api(submitData)
        if (response.code === 200) {
          ElMessage.success(form.id ? '更新成功' : '添加成功')
          dialogVisible.value = false
          if (!form.id && !form.parentId) {
            await loadParentOptions()
          }
          loadTableData()
        }
      } catch (error) {
        ElMessage.error(form.id ? '更新失败' : '添加失败')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.dictionary-container {
    padding: 20px;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .search-form {
        margin-bottom: 20px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 4px;

        :deep(.el-form-item) {
            margin-bottom: 0;
            margin-right: 20px;

            .el-input,
            .el-select {
                width: 220px;
            }
        }

        .el-button {
            margin-left: 10px;
        }
    }

    .table-container {
        padding: 0 20px;

        :deep(.el-table) {
            border-radius: 4px;

            th {
                background-color: #f5f7fa;
                color: #606266;
                font-weight: 500;
                padding: 12px 0;
            }

            td {
                padding: 12px 0;
            }
        }

        .el-button {
            margin: 0 5px;
        }
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }
}

:deep(.el-dialog) {
    border-radius: 8px;

    .el-dialog__header {
        padding: 20px;
        margin: 0;
        border-bottom: 1px solid #dcdfe6;

        .el-dialog__title {
            font-size: 18px;
            font-weight: 500;
            color: #303133;
        }
    }

    .el-dialog__body {
        padding: 30px 20px;
    }

    .dialog-form {
        .el-form-item {
            margin-bottom: 22px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .el-input,
        .el-select,
        :deep(.el-input-number) {
            width: 100%;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding-top: 10px;
    }
}
</style>
