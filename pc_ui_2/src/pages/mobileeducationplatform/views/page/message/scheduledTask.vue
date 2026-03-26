<template>
  <div class="scheduled-task">
    <!-- <div class="header">
      <h1>定时任务管理</h1>
    </div> -->
    <div class="search-bar">
      <div class="filter-item">
        <span class="filter-label">任务类名：</span>
        <el-input v-model="className" placeholder="任务类名" class="search-input" />
      </div>
      <div class="filter-item">
        <span class="filter-label">状态：</span>
        <el-select v-model="quartzStatus" placeholder="状态" class="search-input" style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="启动" value="0" />
          <el-option label="停止" value="1" />
        </el-select>
      </div>
      <div class="search-group">
        <el-button type="primary" @click="handleSearch">
          查询
        </el-button>
        <el-button @click="handleReset">
          重置
        </el-button>
        <el-button type="success" @click="handleAdd">
          + 新建任务
        </el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="className" label="任务类名" />
      <el-table-column prop="cronExpression" label="cron表达式" />
      <el-table-column prop="param" label="参数(触发任务服务IP)" />
      <el-table-column prop="descript" label="描述" />
      <el-table-column prop="quartzStatus" label="状态" :formatter="formatStatus" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button
            :type="scope.row.quartzStatus === '0' ? 'warning' : 'success'"
            size="small"
            @click="handleStartStop(scope.row)"
          >
            {{ scope.row.quartzStatus === '0' ? '停止' : '启动' }}
          </el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新建/编辑任务弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="任务类名" prop="className">
          <el-input v-model="form.className" placeholder="请输入任务类名" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" placeholder="* * * * * ?" />
        </el-form-item>
        <el-form-item label="参数(触发任务服务IP)">
          <el-input v-model="form.param" placeholder="例:127.0.0.1" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.descript" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.quartzStatus">
            <el-radio label="0">
              启动
            </el-radio>
            <el-radio label="1">
              停止
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSave">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createQuartz, updateQuartz, deleteQuartz, getQuartzById, getQuartzPage, startQuartz, stopQuartz } from '@/api/mobileeducationplatform/case'

const className = ref('')
const quartzStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const tableData = ref([])

const dialogVisible = ref(false)
const dialogTitle = ref('新建任务')
const formRef = ref()
const rules = {
  className: [
    { required: true, message: '请输入任务类名', trigger: 'blur' }
  ],
  cronExpression: [
    { required: true, message: '请输入cron表达式', trigger: 'blur' }
  ]
}
const form = ref({
  id: '',
  className: '',
  cronExpression: '',
  param: '',
  descript: '',
  quartzStatus: '0',
  status: true,
  delFlag: false
})

const handleSearch = () => {
  currentPage.value = 1
  fetchTaskList()
}

const handleReset = () => {
  className.value = ''
  quartzStatus.value = ''
  currentPage.value = 1
  fetchTaskList()
}

const handleAdd = () => {
  dialogTitle.value = '新建任务'
  form.value = {
    id: '',
    className: '',
    cronExpression: '',
    param: '',
    descript: '',
    quartzStatus: '0',
    status: true,
    delFlag: false
  }
  dialogVisible.value = true
}

const handleEdit = async(row) => {
  dialogTitle.value = '编辑任务'
  const res = await getQuartzById(row.id)
  if (res.code === 200) {
    form.value = { ...res.data }
    dialogVisible.value = true
  } else {
    ElMessage.error('获取任务详情失败')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const res = await deleteQuartz(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchTaskList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  })
}

const handleSave = async() => {
  if (!formRef.value) return

  await formRef.value.validate(async(valid) => {
    if (valid) {
      try {
        const api = form.value.id ? updateQuartz : createQuartz
        const res = await api(form.value)
        if (res.code === 200) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          fetchTaskList()
        } else {
          ElMessage.error(res.msg || '保存失败')
        }
      } catch (error) {
        ElMessage.error('操作失败')
      }
    } else {
      ElMessage.error('请填写必填项')
      return false
    }
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchTaskList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchTaskList()
}

const formatStatus = (row) => (row.quartzStatus === '0' ? '启动' : '停止')

const fetchTaskList = async() => {
  loading.value = true

  try {
    const params = {
      current: currentPage.value,
      size: pageSize.value,
      className: className.value || undefined,
      quartzStatus: quartzStatus.value || undefined
    }

    const res = await getQuartzPage(params)

    if (res.code === 200) {
      tableData.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取任务列表失败')
    }
  } catch (error) {
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

const handleStartStop = async(row) => {
  try {
    const api = row.quartzStatus === '0' ? stopQuartz : startQuartz
    const res = await api(row.id)
    if (res.code === 200) {
      ElMessage.success(row.quartzStatus === '0' ? '停止成功' : '启动成功')
      fetchTaskList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchTaskList()
})
</script>

<style scoped>
/* 参考case.vue样式，适当调整 */
.scheduled-task { padding: 20px; }
.header { margin-bottom: 20px; }
.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}
.filter-item {
  display: flex;
  align-items: center;
}
.filter-label {
  margin-right: 5px;
  white-space: nowrap;
  font-size: 14px;
}
.search-input { width: 200px; }
.search-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
