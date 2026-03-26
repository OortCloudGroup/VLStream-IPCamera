<template>
  <div class="task_quenue">
    <div class="task_quenue_header">
      <div>
        <el-select
          v-model="addr"
          label="网关"
          placeholder="选择网关"
          class="select_addre"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.addr"
            :value="item.addr"
          />
        </el-select>
        <el-button type="info" :icon="Refresh" @click="startSearch(1)">
          重置搜索
        </el-button>
        <el-button type="primary" :icon="Connection" @click="startSearch(2)">
          开启搜索
        </el-button>
        <el-button type="primary" :icon="CircleClose" @click="startSearch(3)">
          关闭搜索
        </el-button>
        <el-button type="primary" :icon="Tickets" @click="startSearch(4)">
          获取搜索结果
        </el-button>
        <span class="task_quenue_header_status">{{ searchText }}</span>
      </div>

      <el-button type="primary" :icon="RefreshLeft" @click="clearQueueClick()">
        清空下发任务
      </el-button>
    </div>
    <div class="task_quenue_body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" :width="clacPXToVW(80)" />
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="panel" label="设备类型" />
        <el-table-column prop="size" label="设备显示分辨率" :width="clacPXToVW(200)" />
        <el-table-column fixed="right" align="right" label="操作" :width="clacPXToVW(240)">
          <template #default="scope">
            <el-button type="primary" link @click="startQueue(scope.row)">
              开始下发
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
      v-model="configDrawerVis"
      title="添加下发任务"
      direction="rtl"
      size="60%"
    >
      <TaskConfig v-if="configDrawerVis" :addr="addr" :name="currentName" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { clacPXToVW } from '@/utils/index'
import TaskConfig from './TaskConfig.vue'
import { getDeviceByGateway, getGetWaysDevice, clearQueue } from '@/api/tableService/index'
import {
  RefreshLeft,
  Connection,
  CircleClose,
  Tickets,
  Refresh
} from '@element-plus/icons-vue'
const store = useUserStore()

const addr = ref('')
const options = ref([])
const getOptions = async() => {
  const params = {
    accessToken: store.getStoreToken()
  }
  let res = await getGetWaysDevice(params)
  if (res.code === 200) {
    options.value = res.data.list || []
    if (res.data.list.length > 0) {
      addr.value = res.data.list[0].addr
      startSearch(4)
    }
  }
}

const tableData = ref([])
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)
const searchText = ref('')

const startSearch = async(mod = 1) => {
  if (!addr.value) {
    ElMessage({
      message: '请选择网关',
      type: 'warning'
    })
    return
  }
  const params = {
    accessToken: store.getStoreToken(),
    addr: addr.value,
    page: page.value,
    pagesize: pagesize.value
  }
  params.mod = parseInt(mod)
  searchText.value = mod === 1 ? '初始化搜索...' : mod === 2 ? '开启搜索...' : mod === 3 ? '关闭搜索' : ''
  let res = await getDeviceByGateway(params)
  if (res.code === 200) {
    if (mod === 4) {
      tableData.value = res?.data?.list || []
      count.value = res?.data?.count || 0
    }
  }
}

const currentName = ref('')
const configDrawerVis = ref(false)
const startQueue = async(data) => {
  currentName.value = data.name
  configDrawerVis.value = true
}

const clearQueueClick = async() => {
  if (!addr.value) {
    ElMessage({
      message: '请选择网关设备',
      type: 'warning'
    })
    return
  }
  const params = {
    accessToken: store.getStoreToken(),
    addr: addr.value
  }
  let res = await clearQueue(params)
  if (res.code === 200) {
    ElMessage({
      message: '清除成功',
      type: 'success'
    })
  }
}

onMounted(() => {
  getOptions()
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
    justify-content: space-between;
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
