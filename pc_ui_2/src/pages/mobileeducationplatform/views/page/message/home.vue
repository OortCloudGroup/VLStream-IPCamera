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
          </el-icon>
          搜索
        </el-button>
        <el-button @click="resetFn">
          <el-icon class="searchImg">
            <RefreshRight />
          </el-icon>
          重置
        </el-button>
      </div>
    </div>
    <!-- 本月个人谈话统计-->
    <div class="content_topOut">
      <div class="srep">
        本月个人谈话统计
      </div>
      <div class="flexRowAC content_top">
        <div v-for="(item, i) in peopleArr" :key="i" class="userBox">
          <div class="userT">
            {{ item.label }}
          </div>
          <div class="userData flexRowAC">
            <div class="userDataC">
              <div class="userDataC_v">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 本月监区谈话统计-->
    <div class="content_topOut">
      <div class="srep">
        本月监区谈话统计
      </div>
      <div class="flexRowAC content_top">
        <div v-for="(item, i) in prisonArr" :key="i" class="userBox">
          <div class="userT">
            {{ item.label }}
          </div>
          <div class="userData flexRowAC">
            <div class="userDataC">
              <div class="userDataC_v">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--谈话状态统计-->
    <div class="content_center flexRowAC">
      <div class="statiBox">
        <div class="srep">
          谈话状态统计
        </div>
        <home-bar :dataset="datasetSstatus" unit="人" :data="statusList" />
      </div>
      <div class="tempBox statiBox">
        <div class="srep">
          谈话类别统计
        </div>
        <home-bar :dataset="talkTypes" unit="个" :data="typeList" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { format } from 'date-fns'
import { useUserStore } from '@/store/modules/user'
import HomeBar from '@/pages/mobileeducationplatform/views/page/message/components/homeBar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import { PersonalConversations, StatusStatistics, TypeStatistics, ConversationStatistics, deptList, getNumberOfUnfinishedTasks
} from '@/api/mobileeducationplatform/case'

const store: any = useUserStore()
const router = useRouter()
const peopleArr = ref<any>([])
const prisonArr = ref<any>([])
const datePickerTime = ref<any>([])
let statusList = ref<any>() // 谈话状态统计
let typeList = ref<any>() // 谈话类别统计
const talkTypes = ref<any>([])
const datasetSstatus = ref<any>([])
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
peopleArr.value = [
  { label: '谈话时长(分钟)', value: 0 },
  { label: '谈话次数（次）', value: 0 },
  { label: '平均时长(分钟）', value: 0 },
  { label: '谈话人数', value: 0 }
]
prisonArr.value = [
  { label: '谈话时长(分钟)', value: 0 },
  { label: '谈话次数（次）', value: 0 },
  { label: '平均时长(分钟）', value: 0 },
  { label: '谈话人数', value: 0 },
  { label: '应谈数（次）', value: 0 },
  { label: '待谈数（次）', value: 0 }
]

// 重置
function resetFn() {
  form.tenant_id = ''
  form.dept_id = store.userInfo.oort_depcode
  form.dept_name = store.userInfo.oort_depname
  datePickerTime.value = []
  applistFn()
}

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
        children: [], // Initialize empty children array
        hasChildren: true // Add flag to indicate this node can have children
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
    // Root level - return initial departments
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

// 谈话状态统计
const Statistics = async() => {
  let data = {
    policeNo: store.userInfo.oort_code,
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }

  let res: any = await StatusStatistics(data)
  if (res.code === 200) {
    datasetSstatus.value = ['待谈话', '谈话中', '已逾期', '已谈话']
    const valueArray = Object.values(res.data).filter(val => val !== null)

    statusList.value = valueArray
  }
}

// 谈话类别统计
const getType = async() => {
  let data = {
    policeNo: store.userInfo.oort_code,
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }

  let res: any = await TypeStatistics(data)
  if (res.code === 200) {
    talkTypes.value = res.data.map(item => item.value7)
    typeList.value = res.data.map(item => item.value1)
  }
}

// 本月监区谈话统计
const Conversation = async() => {
  let data = {
    policeNo: store.userInfo.oort_code,
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }

  let res: any = await ConversationStatistics(data)
  if (res.code === 200) {
    const num = parseFloat(res.data.value7)
    const result = num.toFixed(3)
    prisonArr.value[0].value = Math.floor(result)
    prisonArr.value[1].value = res.data.value8
    prisonArr.value[2].value = res.data.value9
    prisonArr.value[3].value = res.data.value10
    prisonArr.value[4].value = res.data.value11
    prisonArr.value[5].value = res.data.value12
  }
}

// applistFn
const applistFn = async() => {
  if (datePickerTime.value.length === 2) {
    const startDate = format(new Date(datePickerTime.value[0]), 'yyyy-MM-dd HH:mm:ss')
    const endDate = format(new Date(datePickerTime.value[1]), 'yyyy-MM-dd HH:mm:ss')
    form.start_date = startDate
    form.end_date = endDate
  } else {
    form.start_date = ''
    form.end_date = ''
  }

  let data = {
    policeNo: store.userInfo.oort_code,
    oortDepcode: form.dept_id || store.userInfo.oort_depcode,
    talkTime: form.start_date,
    talkTimeOver: form.end_date
  }
  let res: any = await PersonalConversations(data)
  if (res.code === 200) {
    peopleArr.value[0].value = Math.floor(res.data.value7)
    peopleArr.value[1].value = res.data.value8
    peopleArr.value[2].value = res.data.value9
    peopleArr.value[3].value = res.data.value10
  }
  Statistics()
  getType()
  Conversation()
  checkUnfinishedTasks()
}

// 新增方法
const checkUnfinishedTasks = async() => {
  const now = new Date()
  const day = now.getDate()
  if (day < 25) return // 25号以后才弹窗
  const params = {
    policeNo: store.userInfo.oort_code,
    oortDepcode: store.userInfo.oort_depcode
  }
  const res: any = await getNumberOfUnfinishedTasks(params)
  if (res.code === 200 && res.data && res.data.value1 > 0) {
    ElMessageBox({
      title: '提示',
      message: `${store.userInfo.oort_name}警官您本月还有 <span style="color:red;font-weight:bold;">${res.data.value1}</span> 个待谈话任务。`,
      dangerouslyUseHTMLString: true,
      showCancelButton: true,
      confirmButtonText: '去谈话',
      cancelButtonText: '暂不谈话',
      type: 'warning'
    }).then(() => {
      // 跳转到谈话页面
      router.push('/shouldTalk')
    })
  }
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

  .stati_title {
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #111827;

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
</style>
