<template>
  <div class="task_quenue">
    <div class="task_quenue_header">
      <el-button type="primary" :icon="Link" @click="createNewPng()">
        新建下发图片
      </el-button>
      <span class="statuText">{{ loadingText }}</span>
    </div>
    <div
      v-loading="loading"
      class="task_quenue_body"
    >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" :width="clacPXToVW(80)" />
        <el-table-column prop="Name" label="图片">
          <template #default="scope">
            <self-preview :name="scope.row.Name" />
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" :width="clacPXToVW(240)">
          <template #default="scope">
            <el-button type="danger" link @click="deletePic(scope.row.Name)">
              删除
            </el-button>
            <el-button type="primary" link @click="startPic(scope.row)">
              下发
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageinger">
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
    <el-drawer
      v-model="createPngDrawerVis"
      append-to-body
      title="新建下发图片"
      direction="rtl"
      size="72%"
    >
      <CreatePng v-if="createPngDrawerVis" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { clacPXToVW } from '@/utils/index'
import { imgDelete, imgList, getQueueStatus, addQueue } from '@/api/tableService/index_door'
import SelfPreview from './SelfPreview.vue'
import CreatePng from './CreatePng.vue'
const store = useUserStore()

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  addr: {
    type: String,
    default: ''
  }
})

const tableData = ref([])
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)

const getList = async() => {
  const params = {
    accessToken: store.getStoreToken(),
    page: page.value,
    pagesize: pagesize.value
  }
  let res = await imgList(params)
  if (res.code === 200) {
    tableData.value = res?.data?.list || []
    count.value = res?.data?.count || 0
  }
}

const deletePic = (name) => {
  // 确定是否删除
  ElMessageBox.confirm(
    '确定移除该图片',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: '提示'
    }
  )
    .then(async() => {
      const params = {
        accessToken: store.getStoreToken(),
        name: name
      }
      let res = await imgDelete(params)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
      }
    })
    .catch(() => {
    })
}

const startPic = async(data) => {
  const params = {
    accessToken: store.getStoreToken(),
    name: props.name,
    addr: props.addr,
    path: data.Name,
    same: true
  }
  loading.value = true
  let res = await addQueue(params)
  if (res.code === 200) {
    startGetStatus()
  }
}
const loading = ref(false)
const loadingText = ref('')
const startGetStatus = async() => {
  const params = {
    accessToken: store.getStoreToken(),
    name: props.name
  }
  loadingText.value = '开始下发中...'
  let res = await getQueueStatus(params)
  if (res.code === 200) {
    if (res.data.state === 'waiting') {
      loadingText.value = '等待下发中...'
    }
    if (res.data.state === 'scan') {
      loadingText.value = '正在搜索设备...'
    }
    if (res.data.state === 'refresh') {
      loadingText.value = '正在下发,进度：' + res.data.ratio
    }
    if (res.data.state === 'success' || res.data.state === 'fail') {
      loading.value = false
      if (res.data.state === 'success') {
        ElMessage.success('下发完成')
        loadingText.value = ''
      } else {
        ElMessage.success('下发失败')
      }
    } else {
      setTimeout(() => {
        startGetStatus()
      }, 500)
    }
  }
}

const createPngDrawerVis = ref(false)
const createNewPng = () => {
  createPngDrawerVis.value = true
}

onMounted(() => {
  getList()
})

</script>

<style scoped lang="scss">

.task_quenue {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
}

.task_quenue_header {
    height: 60px;
    display: flex;
    align-items: center;
}

.statuText {
  width: 200px;
  text-align: center;
  font-size: 14px;
  color: var(--el-color-primary);
}

.select_addre {
  width: 200px;
  margin-right: 8px;
}

.pageinger {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task_quenue_header_status {
  margin-left: 20px;
  color: var(--el-color-primary);
}

</style>
