<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <div class="home bgfff">
    <div class="searchBox flexRowAC">
      <div class="serchItem">
        <el-tree-select
          v-model="form.dept_name"
          :data="departmentOptions"
          :props="{
            label: 'label',
            value: 'name',
            children: 'children'
          }"
          placeholder="请选择组织"
          style="width: 100%"
          check-strictly
          lazy
          :load="loadChildren"
          @change="handleDepartmentChange"
        />
      </div>
      <div class="serchItem siRange">
        <div class="datePicker">
          <el-date-picker
            v-model="datePickerTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </div>
      </div>
      <div class="serchItem">
        <el-button type="primary" @click="applistFn">
          <el-icon class="searchImg">
            <Search />
          </el-icon>搜索
        </el-button>
        <el-button @click="resetFn">
          <el-icon class="searchImg">
            <RefreshRight />
          </el-icon>重置
        </el-button>
      </div>
    </div>
    <!--应谈话统计-->
    <div class="content_center flexRowAC">
      <div class="statiBox">
        <div class="srep">
          应谈话统计
        </div>
        <talk-statis-line :dataset="datasetSa" :data="a" chart-id="required-talk-stats" @click="handleChartClick" />
      </div>
      <div class="tempBox statiBox">
        <div class="srep">
          已谈话统计
        </div>
        <talk-statis-line
          :dataset="datasetHave"
          :data="Havetalked"
          chart-id="completed-talk-stats"
          @click="theClickEventHasBeenDiscussed"
        />
      </div>
    </div>
    <!--罪犯谈话覆盖率统计-->
    <div class="content_center flexRowAC">
      <div class="statiBox">
        <div class="srep">
          罪犯谈话覆盖率统计
        </div>
        <talk-statis-line :dataset="datasetCover" unit="%" :data="Cover" />
      </div>
      <div class="tempBox statiBox">
        <div class="srep">
          谈话及时率统计
        </div>
        <talk-statis-line :dataset="datasetTime" unit="%" :data="timeRate" />
      </div>
    </div>
    <!--重点犯谈话统计    -->
    <div class="content_center flexRowAC">
      <div class="statiBox">
        <div class="srep">
          重点犯谈话统计
        </div>
        <talk-statis-line :dataset="datasetRetalk" :data="Retalk" @click="handleKeyCriminalStatsClick" />
      </div>
      <div class="tempBox statiBox">
        <div class="srep">
          部门谈话统计
        </div>
        <home-bar :dataset="datasetDepartment" :data="DepartmentTalk" @click="handleDepartmentStatsClick" />
      </div>
    </div>

    <!--应谈话统计详情弹窗 -->
    <el-dialog v-model="monthlyStatsDialogVisible" title="应谈话统计详情" width="60%" :before-close="handleMonthlyStatsClose">
      <div class="monthly-stats-content">
        <el-table :data="monthlyStatsData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="policeName" label="姓名">
            <template #default="{ row }">
              <div class="policeName-info" style="text-align: center;">
                {{ row.policeName }}<br />
                <span class="code">{{ row.policeNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="requiredTalks" label="应谈次数" />
          <el-table-column prop="oortDepname" label="所属监区" />
          <el-table-column prop="oortDepcode" label="所属监区编码" />
        </el-table>
        <!-- 添加分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="monthlyStatsPagination.current"
            v-model:page-size="monthlyStatsPagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="monthlyStatsPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleMonthlyStatsSizeChange"
            @current-change="handleMonthlyStatsCurrentChange"
          />
        </div>
      </div>
    </el-dialog>

    <!--已谈话统计详情弹窗 -->
    <el-dialog v-model="talkedStatsDialogVisible" title="已谈话统计详情" width="60%" :before-close="handleTalkedStatsClose">
      <div class="monthly-stats-content">
        <el-table :data="talkedStatsData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="policeName" label="姓名">
            <template #default="{ row }">
              <div class="policeName-info" style="text-align: center;">
                {{ row.policeName }}<br />
                <span class="code">{{ row.policeNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="completedTalks" label="已谈次数" />
          <el-table-column prop="oortDepname" label="已谈罪犯所属监区" />
          <el-table-column prop="oortDepcode" label="已谈罪犯所属监区编码" />
        </el-table>
        <!-- 添加分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="talkedStatsPagination.current"
            v-model:page-size="talkedStatsPagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="talkedStatsPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleTalkedStatsSizeChange"
            @current-change="handleTalkedStatsCurrentChange"
          />
        </div>
      </div>
    </el-dialog>

    <!--重点犯谈话统计详情弹窗 -->
    <el-dialog
      v-model="keyCriminalStatsDialogVisible"
      title="重点犯谈话统计详情"
      width="60%"
      :before-close="handleKeyCriminalStatsClose"
    >
      <div class="monthly-stats-content">
        <el-table :data="keyCriminalStatsData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="prisonerName" label="罪犯姓名">
            <template #default="{ row }">
              <div class="policeName-info" style="text-align: center;">
                {{ row.prisonerName }}<br />
                <span class="code">{{ row.prisonerNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="completedTalks" label="已谈次数" />
          <el-table-column prop="oortDepname" label="谈话所属监区" />
          <el-table-column prop="oortDepcode" label="谈话所属监区编码" />
        </el-table>
        <!-- 添加分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="keyCriminalStatsPagination.current"
            v-model:page-size="keyCriminalStatsPagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="keyCriminalStatsPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleKeyCriminalStatsSizeChange"
            @current-change="handleKeyCriminalStatsCurrentChange"
          />
        </div>
      </div>
    </el-dialog>

    <!--部门谈话统计详情弹窗 -->
    <el-dialog
      v-model="departmentStatsDialogVisible"
      title="部门谈话统计详情"
      width="60%"
      :before-close="handleDepartmentStatsClose"
    >
      <div class="monthly-stats-content">
        <el-table :data="departmentStatsData" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="policeName" label="姓名">
            <template #default="{ row }">
              <div class="policeName-info" style="text-align: center;">
                {{ row.policeName }}<br />
                <span class="code">{{ row.policeNo }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="completedTalks" label="已谈次数" />
        </el-table>
        <!-- 添加分页组件 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="departmentStatsPagination.current"
            v-model:page-size="departmentStatsPagination.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="departmentStatsPagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleDepartmentStatsSizeChange"
            @current-change="handleDepartmentStatsCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { format } from 'date-fns'
import { useUserStore } from '@/store/modules/user'
import HomeBar from '@/pages/mobileeducationplatform/views/page/message/components/homeBar.vue'
import TalkStatisLine from '@/pages/mobileeducationplatform/views/page/message/components/talkStatisLine.vue'
import { deptList } from '@/api/unifiedUsert'
import { ResponseStatistics, getConversationStatistics, FCriminalConversations, getConversationResponseRateStatistics, PointsOfConversationStatistics, MentalConversationStatistics, conversationResponseStatisticsList, getConversationStatisticsList, getKeyPointsOfConversationStatisticsList, getDepartMentalConversationStatisticsList } from '@/api/mobileeducationplatform/case'
import { ElMessage } from 'element-plus'

const store: any = useUserStore()
const datePickerTime = ref<any>([])
let a = ref<any>() // 应谈话统计
let Havetalked = ref<any>() // 已谈话统计
let Cover = ref<any>() // 罪犯谈话覆盖率统计
let timeRate = ref<any>() // 谈话及时率统计
let Retalk = ref<any>() // 重点犯谈话统计
let DepartmentTalk = ref<any>() // 部门谈话统计
let datasetDepartment = ref<any>() // 部门谈话统计X轴
let datasetSa = ref<any>([]) // 应谈话统计X轴
let datasetHave = ref<any>([]) // 已谈话统计X轴
let datasetCover = ref<any>([]) // 罪犯谈话覆盖率统计X轴
let datasetTime = ref<any>([]) // 谈话及时率统计X轴
let datasetRetalk = ref<any>([]) // 重点犯谈话统计X轴
const departmentOptions = ref<any>([])

const form = reactive({
  tenant_id: '',
  dept_id: store.userInfo.oort_depcode,
  dept_name: store.userInfo.oort_depname,
  start_date: '',
  end_date: ''
})
const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
datePickerTime.value = [firstDay, lastDay]

const clickedData = ref({
  name: '',
  value: null
})

// 为月度统计对话框添加新的引用项
const monthlyStatsDialogVisible = ref(false)
const monthlyStatsData = ref([])

// 为已谈统计数据对话框添加新的引用项
const talkedStatsDialogVisible = ref(false)
const talkedStatsData = ref([])

// 在其他引用之后添加分页引用
const monthlyStatsPagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const talkedStatsPagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 为"重点犯罪统计数据"对话框添加新的引用项
const keyCriminalStatsDialogVisible = ref(false)
const keyCriminalStatsData = ref([])
const keyCriminalStatsPagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 为部门谈话统计数据对话框添加新的引用项
const departmentStatsDialogVisible = ref(false)
const departmentStatsData = ref([])
const departmentStatsPagination = ref({
  current: 1,
  size: 10,
  total: 0
})

// 获取部门选项
async function fetchDepartmentOptions() {
  try {
    const params = {
      accessToken: store.token || '',
      oort_pdcode: store.userInfo?.oort_depcode || '',
      page: 1,
      pagesize: 100,
      isdel: 1
    }

    const response = await deptList(params)
    if (response && response.code === 200 && response.data) {
      departmentOptions.value = response.data.list.map(item => ({
        label: item.oort_dname,
        value: item.oort_dcode,
        code: item.oort_dcode,
        name: item.oort_dname,
        children: [], // 初始化空的子节点数组
        hasChildren: true // 添加标志表示该节点可以有子节点
      }))
    } else {
      ElMessage.error('获取部门列表失败!')
      departmentOptions.value = []
    }
  } catch (err) {
    ElMessage.error('获取部门列表失败!')
    departmentOptions.value = []
  }
}

// 加载子部门
async function loadChildren(node, resolve) {
  if (node.level === 0) {
    // 根级别 - 返回初始部门
    resolve(departmentOptions.value)
  } else {
    try {
      const params = {
        accessToken: store.token || '',
        oort_pdcode: node.data.code,
        page: 1,
        pagesize: 100,
        isdel: 1
      }
      const response = await deptList(params)
      if (response && response.code === 200 && response.data) {
        const children = response.data.list.map(item => ({
          label: item.oort_dname,
          value: item.oort_dcode,
          code: item.oort_dcode,
          name: item.oort_dname,
          children: [],
          hasChildren: true
        }))
        resolve(children)
      } else {
        resolve([])
      }
    } catch (err) {
      ElMessage.error('获取子部门列表失败!')
      resolve([])
    }
  }
}

// 处理部门选择变化
function handleDepartmentChange(value) {
  // 递归查找选中的部门
  const findDepartment = (departments, targetName) => {
    for (const dept of departments) {
      if (dept.name === targetName) {
        return dept
      }
      if (dept.children && dept.children.length > 0) {
        const found = findDepartment(dept.children, targetName)
        if (found) return found
      }
    }
    return null
  }

  const selectedDept = findDepartment(departmentOptions.value, value)
  if (selectedDept) {
    form.dept_id = selectedDept.code
    form.dept_name = selectedDept.label
  }
}

// 重置
function resetFn() {
  form.tenant_id = ''
  form.dept_id = store.userInfo.oort_depcode
  form.dept_name = store.userInfo.oort_depname
  datePickerTime.value = []
  applistFn()
}

// 应谈话统计
const getResponseStatistics = async() => {
  let data = {
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await ResponseStatistics(data)
  if (res.code === 200) {
    datasetSa.value = res.data.map(item => item.value7)
    a.value = res.data.map(item => item.value1)
  }
}

// 已谈话统计
const getConversation = async() => {
  let data = {
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await getConversationStatistics(data)
  if (res.code === 200) {
    datasetHave.value = res.data.map(item => item.value7)
    Havetalked.value = res.data.map(item => item.value1)
  }
}

// 罪犯谈话覆盖率统计
const getStatistics = async() => {
  let data = {
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await FCriminalConversations(data)
  if (res.code === 200) {
    datasetCover.value = res.data.map(item => item.value7)
    Cover.value = res.data.map(item => item.value8)
  }
}

// 谈话及时率统计
const ResponseRateStatistics = async() => {
  let data = {
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await getConversationResponseRateStatistics(data)
  if (res.code === 200) {
    datasetTime.value = res.data.map(item => item.value7)
    timeRate.value = res.data.map(item => item.value8)
  }
}

// 重点犯谈话统计
const Conversation = async() => {
  let data = {
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await PointsOfConversationStatistics(data)
  if (res.code === 200) {
    datasetRetalk.value = res.data.map(item => item.value7)
    Retalk.value = res.data.map(item => item.value1)
  }
}

// 部门谈话统计
const DepartMental = async() => {
  let data = {
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await MentalConversationStatistics(data)
  if (res.code === 200) {
    // 构建完整的图表数据结构，类似ECharts的数据结构
    const chartData = res.data.map(item => {
      return {
        value: item.value1,
        name: item.value7,
        code: item.value8, // 直接存储value8
        raw: { // 存储原始数据
          value1: item.value1,
          value7: item.value7,
          value8: item.value8,
          ...item // 包含所有原始数据
        }
      }
    })
    DepartmentTalk.value = chartData
    datasetDepartment.value = res.data.map(item => item.value7)
  }
}

// 搜索功能
const applistFn = () => {
  if (datePickerTime.value.length === 2) {
    const startDate = new Date(datePickerTime.value[0])
    const endDate = new Date(datePickerTime.value[1])
    form.start_date = format(startDate, 'yyyy-MM-dd HH:mm:ss')
    form.end_date = format(endDate, 'yyyy-MM-dd HH:mm:ss')
  } else {
    form.start_date = ''
    form.end_date = ''
  }
  getResponseStatistics()
  getConversation()
  getStatistics()
  ResponseRateStatistics()
  Conversation()
  DepartMental()
}

// 应谈点击处理函数以包含分页
const handleChartClick = async(data: any) => {
  if (data.name) {
    clickedData.value = data
    // 从点击的数据中解析出日期信息
    const [year, month] = data.name.split('-')

    // 设置创建开始和结束时间
    const startTime = format(new Date(parseInt(year), parseInt(month) - 1, 1), 'yyyy-MM-dd HH:mm:ss')
    const endTime = format(new Date(parseInt(year), parseInt(month), 0, 23, 59, 59), 'yyyy-MM-dd HH:mm:ss')

    try {
      const params = {
        current: monthlyStatsPagination.value.current,
        size: monthlyStatsPagination.value.size,
        oortDepcode: form.dept_id || store.userInfo.oort_depcode,
        status: 1,
        talkTime: startTime,
        talkTimeOver: endTime
      }

      const response = await conversationResponseStatisticsList(params)
      if (response.code === 200) {
        monthlyStatsData.value = response.data.records
        monthlyStatsPagination.value.total = response.data.total
        monthlyStatsDialogVisible.value = true
      } else {
        ElMessage.error('获取应谈详情列表失败!')
      }
    } catch (error) {
      ElMessage.error('获取应谈详情列表失败!')
    }
  }
}

// 已谈话点击事件处理函数以包含分页
const theClickEventHasBeenDiscussed = async(data: any) => {
  if (data.name) {
    clickedData.value = data
    // 从点击的数据中解析出日期信息
    const [year, month] = data.name.split('-')
    // 设置创建开始和结束时间
    const startTime = format(new Date(parseInt(year), parseInt(month) - 1, 1), 'yyyy-MM-dd HH:mm:ss')
    const endTime = format(new Date(parseInt(year), parseInt(month), 0, 23, 59, 59), 'yyyy-MM-dd HH:mm:ss')
    try {
      const params = {
        current: talkedStatsPagination.value.current,
        size: talkedStatsPagination.value.size,
        oortDepcode: form.dept_id || store.userInfo.oort_depcode,
        status: 4, // 状态为4，表示已谈话
        talkTime: startTime,
        talkTimeOver: endTime
      }
      const response = await getConversationStatisticsList(params)
      if (response.code === 200) {
        talkedStatsData.value = response.data.records
        talkedStatsPagination.value.total = response.data.total
        talkedStatsDialogVisible.value = true
      } else {
        ElMessage.error('获取已谈详情列表失败!')
      }
    } catch (error) {
      ElMessage.error('获取已谈详情列表失败!')
    }
  }
}

// 添加分页处理函数
const handleMonthlyStatsSizeChange = (val: number) => {
  monthlyStatsPagination.value.size = val
  handleChartClick(clickedData.value)
}

const handleMonthlyStatsCurrentChange = (val: number) => {
  monthlyStatsPagination.value.current = val
  handleChartClick(clickedData.value)
}

const handleTalkedStatsSizeChange = (val: number) => {
  talkedStatsPagination.value.size = val
  theClickEventHasBeenDiscussed(clickedData.value)
}

const handleTalkedStatsCurrentChange = (val: number) => {
  talkedStatsPagination.value.current = val
  theClickEventHasBeenDiscussed(clickedData.value)
}

const handleKeyCriminalStatsSizeChange = (val: number) => {
  keyCriminalStatsPagination.value.size = val
  handleKeyCriminalStatsClick(clickedData.value)
}

const handleKeyCriminalStatsCurrentChange = (val: number) => {
  keyCriminalStatsPagination.value.current = val
  handleKeyCriminalStatsClick(clickedData.value)
}

// 重点犯谈话统计点击事件处理函数
const handleKeyCriminalStatsClick = async(data: any) => {
  if (data.name) {
    clickedData.value = data
    const [year, month] = data.name.split('-')
    const startTime = format(new Date(parseInt(year), parseInt(month) - 1, 1), 'yyyy-MM-dd HH:mm:ss')
    const endTime = format(new Date(parseInt(year), parseInt(month), 0, 23, 59, 59), 'yyyy-MM-dd HH:mm:ss')
    try {
      const params = {
        current: keyCriminalStatsPagination.value.current,
        size: keyCriminalStatsPagination.value.size,
        oortDepcode: form.dept_id || store.userInfo.oort_depcode,
        status: 4, // 修改状态为4，表示已谈话
        talkTime: startTime,
        talkTimeOver: endTime
      }
      const response = await getKeyPointsOfConversationStatisticsList(params)
      if (response.code === 200) {
        keyCriminalStatsData.value = response.data.records
        keyCriminalStatsPagination.value.total = response.data.total
        keyCriminalStatsDialogVisible.value = true
      } else {
        ElMessage.error('获取重点犯谈话详情列表失败!')
      }
    } catch (error) {
      ElMessage.error('获取重点犯谈话详情列表失败!')
    }
  }
}

// 修改关闭重点犯谈话统计详情弹窗处理函数以重置分页
const handleKeyCriminalStatsClose = () => {
  keyCriminalStatsDialogVisible.value = false
  keyCriminalStatsData.value = []
  keyCriminalStatsPagination.value.current = 1
  clickedData.value = { name: '', value: null }
}

// 修改关闭   应谈话统计详情弹窗处理函数以重置分页
const handleMonthlyStatsClose = () => {
  monthlyStatsDialogVisible.value = false
  monthlyStatsData.value = []
  monthlyStatsPagination.value.current = 1
  clickedData.value = { name: '', value: null }
}

// 修改关闭  已谈话统计详情弹窗  处理函数以重置分页
const handleTalkedStatsClose = () => {
  talkedStatsDialogVisible.value = false
  talkedStatsData.value = []
  talkedStatsPagination.value.current = 1
  clickedData.value = { name: '', value: null }
}

// 部门谈话统计点击事件处理函数
const handleDepartmentStatsClick = async(data: any) => {
  if (data.name) {
    clickedData.value = data
    // 从DepartmentTalk.value中查找匹配的数据
    const matchedData = DepartmentTalk.value.find(item => item.name === data.name)
    // 获取value8
    const value8 = matchedData?.code || matchedData?.raw?.value8
    try {
      // 获取选中时间范围为参数
      const params = {
        current: departmentStatsPagination.value.current,
        size: departmentStatsPagination.value.size,
        oortDepcode: value8 || '', // 使用获取到的value8
        status: 4, // 状态为4，表示已谈话
        talkTime: form.start_date,
        talkTimeOver: form.end_date
      }
      const response = await getDepartMentalConversationStatisticsList(params)
      if (response.code === 200) {
        departmentStatsData.value = response.data.records
        departmentStatsPagination.value.total = response.data.total
        departmentStatsDialogVisible.value = true
      } else {
        ElMessage.error('获取部门谈话详情列表失败!')
      }
    } catch (error) {
      ElMessage.error('获取部门谈话详情列表失败!')
    }
  }
}

// 部门谈话统计分页处理函数
const handleDepartmentStatsSizeChange = (val: number) => {
  departmentStatsPagination.value.size = val
  handleDepartmentStatsClick(clickedData.value)
}

const handleDepartmentStatsCurrentChange = (val: number) => {
  departmentStatsPagination.value.current = val
  handleDepartmentStatsClick(clickedData.value)
}

// 修改关闭部门谈话统计详情弹窗处理函数以重置分页
const handleDepartmentStatsClose = () => {
  departmentStatsDialogVisible.value = false
  departmentStatsData.value = []
  departmentStatsPagination.value.current = 1
  clickedData.value = { name: '', value: null }
}

onMounted(() => {
  applistFn()
  fetchDepartmentOptions() // 获取部门树
})
</script>
<style lang="scss" scoped>
.home.bgfff {
  background-color: #F0F2F5;
}

.statiBox {
  flex: 1;
  height: 400px;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;

  .srep {
    font-size: 16px;
    color: #718096;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    &:before {
      content: '';
      width: 3px;
      height: 18px;
      background-color: var(--el-color-primary);
      border-radius: 2px;
    }
  }
}

.userBox {
  width: 25%;
  padding: 14px 16px;
  background-color: #F7F7F7;
  border-radius: 16px;

  .userT {
    font-size: 14px;
    color: #718096;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 239, 242, 1);
  }

  .userData {
    justify-content: space-between;
  }

  .userDataC {
    padding: 20px 16px 6px;
  }

  .userDataC_v {
    font-size: 24px;
    color: #111827;
    padding-bottom: 8px;
    font-weight: 700;
  }
}

.home {
  /* height: 100%;
  overflow: auto; */

  .content_top {
    padding-top: 20px;
    gap: 20px;

    &Out {
      background-color: #fff;
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 20px;
    }
  }

  .content_center {
    padding-bottom: 20px;
    gap: 20px;
  }

  .srep {
    display: flex;
    align-items: center;
    gap: 8px;

    &:before {
      content: '';
      width: 3px;
      height: 18px;
      background-color: var(--el-color-primary);
    }

    span {
      color: #33333360;
      font-size: 14px;
    }
  }
}

// 搜索
.searchBox {
  gap: 20px;
  padding: 8px 0 20px;

  flex-wrap: wrap;

  .serchItem {
    width: 200px;
    height: 36px;
    border-radius: 4px;
  }

  .serchItem.siRange {
    width: 350px;
  }

  .searchImg {
    margin-right: 4px;
  }

  :deep(.el-button.el-button--primary) {
    background: var(--el-color-primary);
    border: none;
  }
}

.dialog-content {
  p {
    margin: 10px 0;
    font-size: 14px;

    strong {
      margin-right: 10px;
      color: #606266;
    }
  }
}

.monthly-stats-content {
  padding: 20px;

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .policeName-info {
    text-align: center;

    .code {
      color: #1890ff;
      font-size: 12px;
    }
  }
}

:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;

  .el-dialog__header {
    padding: 16px 24px;
    margin: 0;
    border-bottom: 1px solid #EBEEF5;

    .el-dialog__title {
      font-size: 16px;
      color: #333;
      position: relative;
      padding-left: 12px;
      font-weight: 600;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 18px;
        background-color: var(--el-color-primary);
        border-radius: 2px;
      }
    }
  }
}

:deep(.el-table) {
  .el-table__cell {
    text-align: center !important;
  }

  .cell {
    text-align: center !important;
  }

  th {
    background-color: #F5F7FA;
    color: #606266;
    font-weight: 600;
    text-align: center !important;
  }

  td {
    text-align: center !important;
  }
}

:deep(.el-table-column) {
  .cell {
    text-align: center !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
}

:deep(.el-table__header) {
  th {
    text-align: center !important;

    .cell {
      text-align: center !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
  }
}

:deep(.el-table__body) {
  td {
    text-align: center !important;

    .cell {
      text-align: center !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }
  }
}

.policeName-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;

  .code {
    margin-top: 4px;
    font-size: 12px;
  }
}

// 编码颜色
.code {
  color: #1890ff;
}

// 添加状态样式
.status-pending {
  color: #E6A23C; // 黄色
  display: inline-block;
  text-align: center;
  width: 100%;
}

.status-ongoing {
  color: #67C23A; // 绿色
  display: inline-block;
  text-align: center;
  width: 100%;
}

.status-overdue {
  color: #909399; // 灰色
  display: inline-block;
  text-align: center;
  width: 100%;
}

.status-completed {
  color: #409EFF; // 淡蓝色
  display: inline-block;
  text-align: center;
  width: 100%;
}

// Add department style in the style section
.department {
  color: #666;
  font-size: 13px;
}

:deep(.el-table__body .el-table-column--index .cell),
:deep(.el-table__header .el-table-column--index .cell) {
  text-align: center !important;
  justify-content: center !important;
  align-items: center !important;
  display: flex !important;
}

.tempBox {
  margin-left: 24px;
}

.content_center {
  margin-bottom: 24px;
}

.content_topOut {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;

  .srep {
    font-size: 16px;
    color: #718096;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    &:before {
      content: '';
      width: 3px;
      height: 18px;
      background-color: var(--el-color-primary);
      border-radius: 2px;
    }
  }

  .content_top {
    .userBox {
      flex: 1;
      height: 120px;
      padding: 24px;
      background-color: #f8f9fa;
      border-radius: 16px;
      margin-right: 24px;

      &:last-child {
        margin-right: 0;
      }

      .userT {
        font-size: 14px;
        color: #718096;
        margin-bottom: 16px;
      }

      .userData {
        .userDataC {
          .userDataC_v {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
          }
        }
      }
    }
  }
}
</style>
