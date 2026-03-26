<template>
  <div class="meetPage">
    <date-range-picker class="dateRBox" :list="highlightDays" @dateChange="dateChangeFn" />
    <div class="home_title">
      <el-button type="primary" icon="Plus" @click="addMeeting">
        新建会议
      </el-button>
      <el-date-picker
        v-if="false"
        v-model="searchDate"
        :disabled="activeName==='first'"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="(val)=>handleFn(val,'time')"
      />
    </div>
    <div class="meeting_body">
      <div class="meeting_body_left">
        <el-tabs v-model="activeName" class="demo-tabs meetTbabs" @tabClick="activeNameFn">
          <el-tab-pane label="正在开的会议" name="first">
            <MeetingList v-if="activeName==='first'" ref="meetRef" :act="isAct" :time="searchDate" :status="2" @handle="handle" />
          </el-tab-pane>
          <el-tab-pane label="待开会议" name="second">
            <MeetingList v-if="activeName==='second'" ref="meetRef" :act="isAct" :time="searchDate" :status="1" @handle="handle" />
          </el-tab-pane>
          <el-tab-pane label="历史会议" name="third">
            <MeetingList v-if="activeName==='third'" ref="meetRef" :act="isAct" :time="searchDate" :status="3" @handle="handle" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="itemId" class="meeting_body_right">
        <MeetingDetail :id="itemId" :act="isAct" @handle="handleFn" />
      </div>
    </div>
    <div v-if="!itemId" class="meeting_empty flexRowAC">
      <img src="@/assets/img/meeting_assistant/meeting_list_empty.png" />
      <span>目前没有会议</span>
      <span>工作再忙，也要记得喝水</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import MeetingList from './components/MeetingList.vue'
import MeetingDetail from './components/MeetingDetail.vue'
import { useRoute, useRouter } from 'vue-router'
import { dayjs } from 'element-plus'
import DateRangePicker from '@/pages/meetingMana/views/page/meetingMana/components/dateRangePicker.vue'
import { myConferenceList } from '@/api/meetingMana'

const router = useRouter()
const route = useRoute()
let newDateT = [dayjs(new Date()).format('YYYY-MM-DD 00:00:00'), dayjs(new Date()).format('YYYY-MM-DD 23:59:59')]
const searchDate = ref(newDateT)
const highlightDays = ref([])
const activeName = ref<any>('first')
const isAct = ref<any>(0)
let itemId = ref('')
let meetRef = ref<any>(null)

// 选择
const handle = (data) => {
  isAct.value = data.isAct || 0
  itemId.value = data.conference_uid || ''
}

// 正在开的会议
const activeNameFn = () => {
  nextTick(() => {
    itemId.value = ''
    isAct.value = 0
    // if (activeName.value === 'third') {
    //   searchDate.value = []
    // } else if (activeName.value === 'second') {
    //   searchDate.value = [...newDateT]
    //   searchDate.value[1] = dayjs(Date.now() + 24 * 60 * 60 * 1000 * 15).format('YYYY-MM-DD 00:00:00')
    // } else {
    //   searchDate.value = newDateT
    // }
  })
}

// 刷新
const handleFn = (val, time) => {
  isAct.value = 0
  itemId.value = ''
  if (time) meetRef.value.timeExp = val || []
  meetRef.value.getListFn()
}

// 显示
if (route.query.activeName) {
  let obj:any = route.query
  isAct.value = parseInt(obj.isAct) || 0
  activeName.value = obj.activeName || 'first'
}

// 会议日期高亮
const dataApiUrlFn = async() => {
  let data = {
    month: parseInt(searchDate.value[0].slice(5, 7)),
    year: parseInt(searchDate.value[0].slice(0, 4))
  }
  let res:any = await myConferenceList(data)
  if (res.code === 200) {
    highlightDays.value = res.data || []
  }
}

// 日期范围 高亮会议查询
const dateChangeFn = (val) => {
  let S = searchDate.value[0]
  let Y = S.slice(0, 4)
  let M = S.slice(5, 7)
  let E = searchDate.value[1]
  let Y1 = E.slice(0, 4)
  let M1 = E.slice(5, 7)
  // new
  let SN = val.start_dt
  let YN = SN.slice(0, 4)
  let MN = SN.slice(5, 7)
  let EN = val.end_dt
  let Y1N = EN.slice(0, 4)
  let M1N = EN.slice(5, 7)
  if (S !== SN || E !== EN) {
    searchDate.value = [val.start_dt, val.end_dt]
    if (parseInt(Y) !== parseInt(YN) || parseInt(M) !== parseInt(MN) || parseInt(Y1) !== parseInt(Y1N) || parseInt(M1) !== parseInt(M1N)) {
      dataApiUrlFn()
    }
  }
}

const addMeeting = () => {
  router.push('/newMeeting')
}

onMounted(() => {
  dataApiUrlFn()
})
</script>
<style lang="scss" scoped>
.meetPage {
  width: 100%;
  /* height: 100%; */
  padding: 20px;
  /* overflow: auto; */
}

.home_title {
  padding-top: 16px;
  height: 60px;
  width: 40%;
  display: flex;
  align-items: center;
  //justify-content: space-between;
  gap: 20px;
}

.meeting_body {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
}

.meeting_body_left {
  flex-shrink: 0;
  width: 360px;
}

.meeting_body_right {
  padding-top: 46px;
  flex: 1;
}

:deep(.el-tabs__nav-wrap:after) {
  display: none;
}

:deep(.demo-tabs) {
  .el-tabs__item {
    height: 32px;
    align-items: flex-start;
    font-size: 16px;
  }
}

.meeting_empty {
  flex-direction: column;
  width: 100%;
  justify-content: center;

  img {
    margin-top: 10px;
    width: 200px;
    height: auto;
  }

  span:nth-of-type(1) {
    font-size: 16px;
    color: #666;
    font-weight: bold;
    margin-top: 10px;
  }

  span:nth-of-type(2) {
    font-size: 14px;
    color: #999999;
    margin-top: 10px;
  }
}

.dateRBox{
  width: 980px;
}
</style>
