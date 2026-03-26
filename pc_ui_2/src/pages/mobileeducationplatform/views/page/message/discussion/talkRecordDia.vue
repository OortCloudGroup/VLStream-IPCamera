<template>
  <div class="details-dialog-content">
    <el-table :data="talkRecords" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column label="罪犯姓名" align="center">
        <template #default="{ row }">
          <div class="prisoner-info">
            {{ row.prisonerName }}<br />
            <span class="code">{{ row.prisonerCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="谈话民警" align="center">
        <template #default="{ row }">
          <div class="police-info">
            {{ row.policeName }}<br />
            <span class="code">{{ row.policeCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="talkTypeName" label="谈话类别" align="center" />
      <el-table-column prop="theme" label="谈话主题" align="center" />
      <el-table-column prop="formattedTalkTime" label="谈话时间" align="center">
        <template #default="{ row }">
          {{ row.formattedTalkTime }} 至 {{ row.formattedTalkTimeOver }}
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="谈话时长（分钟）" align="center" />
      <el-table-column prop="prisonerTypeName" label="罪犯类型" align="center" />
      <el-table-column prop="statusDescription" label="状态" align="center">
        <template #default="{ row }">
          <span :class="getStatusClass(row.status)">{{ row.statusDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="viewTalkDetail(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="detailsPagination.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="detailsPagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="detailsPagination.total"
        @size-change="handleDetailsPageSizeChange"
        @current-change="handleDetailsPageChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPrisonerNoMemconList } from '@/api/mobileeducationplatform/case'
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentPrisonerNo: {
    type: String,
    default: ''
  },
  dateRange: {
    type: Array,
    default: () => []
  }
})

const getStatusClass = (status) => {
  const classes = {
    1: 'status-pending', // 待谈话 - 黄色
    2: 'status-ongoing', // 谈话中 - 绿色
    3: 'status-overdue', // 已逾期 - 灰色
    4: 'status-completed' // 已谈话 - 淡蓝色
  }
  return classes[status] || ''
}

const talkRecords = ref([])
const detailsPagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

async function fetchTalkRecords() {
  try {
    // 将日期格式调整以符合后端要求 (yyyy-MM-dd HH:mm:ss)
    const formatDate = (date) => {
      if (!date) return null
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    const params = {
      prisonerCode: props.currentPrisonerNo,
      current: detailsPagination.value.currentPage,
      size: detailsPagination.value.pageSize,
      talkTime: formatDate(props.dateRange?.[0]),
      talkTimeOver: formatDate(props.dateRange?.[1])
    }
    const response = await getPrisonerNoMemconList(params)
    if (response.code === 200) {
      talkRecords.value = response.data.records
      detailsPagination.value.total = response.data.total
    } else {
      ElMessage.error('获取谈话记录失败!')
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('获取谈话记录失败!')
  }
}
const handleDetailsPageSizeChange = (val) => {
  detailsPagination.value.pageSize = val
  fetchTalkRecords()
}
const handleDetailsPageChange = (val) => {
  detailsPagination.value.currentPage = val
  fetchTalkRecords()
}

const emit = defineEmits(['viewTalkDetail'])
const viewTalkDetail = (row) => {
  emit('viewTalkDetail', row)
}

onMounted(() => {
  fetchTalkRecords()
})

</script>
<style scoped lang="scss">

.details-dialog-content {
  padding: 20px;

  .prisoner-info,
  .police-info {
    text-align: center;

    .code {
      color: #1890ff;
      font-size: 12px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.status-pending {
    color: #E6A23C; // 黄色
  }

  .status-ongoing {
    color: #67C23A; // 绿色
  }

  .status-overdue {
    color: #909399; // 灰色
  }

  .status-completed {
    color: #409EFF; // 淡蓝色
  }

</style>
