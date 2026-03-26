<template>
  <div class="book_room">
    <div class="work_index_body">
      <div class="date_list">
        <div
          v-for="(item,index) in recentWeekArr"
          :key="index"
          class="date_list_item"
          :class="{'date_list_item_active': activeIndex === index }"
          @click="activeWeekItem(index, item)"
        >
          <span>{{ item.name }}</span>
          <span>{{ item['week'] }}</span>
        </div>
      </div>
      <div class="room_list_right_place placeBox">
        <div class="place_title">
          会议室：
        </div>
        <div v-for="(item,index) in roomList" :key="index" class="place_item">
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="roomTipBox flexRowAC">
        <div class="flexRowAC t">
          <img class="i y" src="@/assets/img/meeting_assistant/room_deactive.png" />已预定
        </div>
        <div class="flexRowAC t">
          <img class="i f" src="@/assets/img/meeting_assistant/room_deactive.png" />默认
        </div>
        <div class="flexRowAC t">
          <img class="i a" src="@/assets/img/meeting_assistant/room_active.png" />选中
        </div>
        <div class="flexRowAC t">
          <img class="i b" src="@/assets/img/meeting_assistant/room_deactive.png" />不可预定
        </div>
      </div>
      <div class="room_list">
        <div class="room_list_left">
          <div v-for="(item,index) in timeArr" :key="index" class="room_list_left_item">
            <span>{{ item }}</span>
          </div>
        </div>
        <div ref="container" class="room_list_right">
          <div v-for="(item,index) in timeArr" :key="index" class="room_time_list">
            <div class="room_list_right_place">
              <div
                v-for="(itd,ind) in roomList"
                :key="ind"
                class="place_item room_item"
                :class="reserveRoomFn(index,itd)"
                @click="activeRoomItem(index, itd)"
              >
                <img
                  v-if="activePosArr.includes(index + '--' + itd['room_uid'])"
                  src="@/assets/img/meeting_assistant/room_active.png"
                />
                <img v-else src="@/assets/img/meeting_assistant/room_deactive.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentActiveRoom" class="b_des">
        <div class="b_des_left">
          <span class="sp_d"><span class="spT">{{ currentActiveRoom.name }}</span> {{
            currentActiveRoom['yearTemp']
          }}</span>
          <span class="sp">{{ timeArr[currentActiveRoom.start] }}~{{
            endTransFn(timeArr[currentActiveRoom.end])
          }}</span>
        </div>
        <div class="b_des_mid">
          <div class="b_des_mid_item">
            <span>会议室地址：</span>
            <span>{{ currentActiveRoom.address }}</span>
          </div>
          <div class="b_des_mid_item">
            <span>容纳人数：</span>
            <span>{{ currentActiveRoom['capacity'] }}人</span>
          </div>
          <div class="b_des_mid_item">
            <span>会议室设备列表：</span>
            <span>{{ currentActiveRoom['equipment'] }}</span>
          </div>
        </div>
        <div class="b_des_right">
          <img src="@/assets/img/meeting_assistant/finish.png" @click="bookRoomConfirm" />
        </div>
      </div>
      <div v-else class="b_des">
        <span class="empty_text">请选择会议室</span>
      </div>
    </div>
    <el-dialog
      v-model="dVisi"
      title="新建会议室"
      width="600px"
      :close-on-click-modal="false"
    >
      <built-meetroom v-if="dVisi" :item="itemObj" @close="dVisi=false" @handle="init" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BuiltMeetroom from '@/pages/meetingMana/views/page/meetingMana/components/builtMeetroom.vue'
import { conferenceroomList, reserveList } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'

const store: any = useUserStore()
const props = defineProps(['list', 'time', 'curr', 'conference_uid'])
const emits = defineEmits(['closeSave', 'handleSave'])
const activeIndex = ref(0)
const container = ref(null)
const recentWeekArr = ref<any>([])
const roomList = ref<any>([])
const timeArr = ref<any>(props.time || []) // 时间24:00
const activePosTime = ref<any>([]) // 时间选中
const RA = ref<any>([]) // 被预定会议室
const activePos = ref<any>([]) // 当前选中
const activePosArr = ref<any>(props.list || []) // 选中会议室
const activeSelList = ref<any>([]) // 选中会议室 obj
const currentActiveRoom = ref<any>(null)
const today = new Date() // 今天
let year = `${new Date().getFullYear()}` // 年
let yearTemp = ref('')
let dVisi = ref(false)
let itemObj = ref(false) // 新建会议室
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)

// 会议室
const init = async() => {
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  recentWeekArr.value = []
  for (let i = 0; i < 16; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    let D = date.getDate()
    let D_ = D > 9 ? D : `0${D}`
    let M = date.getMonth()
    let M_ = M > 9 ? `${M + 1}` : `0${M + 1}`
    const dayName = i === 0 ? '今天' : `${M_}-${D_}`
    const weekDay = daysOfWeek[date.getDay()]
    recentWeekArr.value.push({ name: dayName, week: weekDay })
  }
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value
  }
  let res: any = await conferenceroomList(data)
  if (res.code === 200) {
    roomList.value = res.data.list || []
    count.value = res.data.count
    if (props.curr?.yearTemp) {
      recentWeekArr.value.forEach((item, index) => {
        if (item.name === props.curr?.yearTemp.slice(-5)) {
          activeIndex.value = index
        }
      })
      yearTemp.value = props.curr?.yearTemp
    }
    // 回显会议室连续时间段状态
    activePosTime.value = []
    activePosArr.value = []
    activeSelList.value = []
    if (props.list && props.list.length > 0) {
      // 解析所有时间点和room_uid
      let timeRoomArr = props.list.map(item => {
        let [timeStr, roomUid] = item.split('--')
        return { time: parseInt(timeStr), room_uid: roomUid }
      })
      // 按room_uid分组
      let roomMap: Record<string, number[]> = {}
      timeRoomArr.forEach(({ time, room_uid }) => {
        if (!roomMap[room_uid]) roomMap[room_uid] = []
        roomMap[room_uid].push(time)
      })
      // 只处理第一个room_uid（通常只会有一个会议室被选中）
      let firstRoomUid = Object.keys(roomMap)[0]
      let times = roomMap[firstRoomUid] || []
      if (times.length > 0) {
        // 找到最小和最大时间点，回显为连续区间
        let minTime = Math.min(...times)
        let maxTime = Math.max(...times)
        let room = roomList.value.find(item => item.room_uid === firstRoomUid)
        let yearTempVal = yearTemp.value
        for (let t = minTime; t <= maxTime; t++) {
          activePosTime.value.push(t)
          let posKey = t + '--' + firstRoomUid
          activePosArr.value.push(posKey)
          activeSelList.value.push({
            time: t,
            yearTemp: yearTempVal,
            ...room
          })
        }
      }
    }
    activeFn()
    reserveListFn()
  }
}

// 被预定的
const reserveListFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    start_dt: `${year}-${recentWeekArr.value[activeIndex.value]?.name} 00:00:00`,
    end_dt: `${year}-${recentWeekArr.value[activeIndex.value]?.name} 23:59:59`,
    page: page.value,
    pagesize: pagesize.value
  }
  yearTemp.value = `${year}-${recentWeekArr.value[activeIndex.value]?.name}`
  if (recentWeekArr.value[activeIndex.value]?.name === '今天') {
    let D = today.getDate()
    let D_ = D > 9 ? D : `0${D}`
    let M = today.getMonth()
    let M_ = M > 9 ? `${M + 1}` : `0${M + 1}`
    data.start_dt = `${year}-${M_}-${D_} 00:00:00`
    data.end_dt = `${year}-${M_}-${D_} 23:59:59`
    yearTemp.value = `${year}-${M_}-${D_}`
  }
  let res: any = await reserveList(data)
  if (res.code === 200) {
    let D = res.data.list || []
    let RAT: any = []
    if (D.length) {
      D.forEach(item => {
        if (item.conferenceList) {
          item.conferenceList.forEach(tt => {
            if (tt.conference_uid !== props?.conference_uid) {
              RAT.push(timeArr.value.indexOf(tt.time) + '--' + item?.conferenceRoom.room_uid)
            }
          })
        }
        if (RAT && RAT.length) {
          RA.value = RAT || []
        } else {
          RA.value = []
        }
      })
    }
  }
}

const activeWeekItem = (index, item) => {
  activeIndex.value = index
  // 清空
  currentActiveRoom.value = null
  activePos.value = []
  activePosArr.value = []
  activeSelList.value = []
  activePosTime.value = []
  if (currentActiveRoom.value) {
    currentActiveRoom.value['yearTemp'] = yearTemp.value
    if (item !== '今天') currentActiveRoom.value['yearTemp'] = `${year}-${item.name}`
  }
  reserveListFn()
}

// 时间 :59
const endTransFn = (val) => {
  // let n = parseInt(val) - 1
  // let v = n > 9 ? `${n}:59` : n ? `0${n}:59` : '23:59'
  let n = parseInt(val)
  let v = n > 9 ? `${n}:00` : n ? `0${n}:00` : '23:59'
  return v
}

// 选择会议室
const activeRoomItem = (index, item) => {
  let S = timeArr.value[index].slice(0, 2)
  let N = new Date().toLocaleTimeString().slice(0, 2)
  let F = parseInt(S) > parseInt(N)
  if (activeIndex.value === 0 && !F) {
    return
  }

  // 如果当前已选的会议室和点击的会议室不同，则清空所有选择
  if (
    activeSelList.value.length &&
    activeSelList.value[0].room_uid !== item.room_uid
  ) {
    currentActiveRoom.value = null
    activePos.value = []
    activePosArr.value = []
    activeSelList.value = []
    activePosTime.value = []
  }

  // 如果当前没有选中任何时间点，直接选中当前时间点
  if (activeSelList.value.length === 0) {
    // 检查是否已被预定
    let posKey = index + '--' + item?.room_uid
    if (RA.value.includes(posKey)) {
      ElMessage.warning('该会议室已经被预定')
      return
    }
    activePos.value = posKey
    activePosTime.value = [index]
    activePosArr.value = [posKey]
    activeSelList.value = [{
      time: index,
      ...item
    }]
  } else {
    // 只允许选择同一会议室的连续时间段
    // 取已选的最小和最大时间点
    let minTime = Math.min(...activePosTime.value)
    let maxTime = Math.max(...activePosTime.value)

    // 如果点击的时间点已被选中，则清空所有选择
    if (activePosTime.value.includes(index)) {
      currentActiveRoom.value = null
      activePos.value = []
      activePosArr.value = []
      activeSelList.value = []
      activePosTime.value = []
      return
    }

    // 新增：如果点击的时间点和已选的时间点之间全部未被预定，则选中区间
    let posKey = index + '--' + item?.room_uid
    let newMin = Math.min(minTime, index)
    let newMax = Math.max(maxTime, index)
    let canSelectRange = true
    let newActivePosTime:any = []
    let newActivePosArr:any = []
    let newActiveSelList:any = []

    for (let i = newMin; i <= newMax; i++) {
      let key = i + '--' + item?.room_uid
      if (RA.value.includes(key)) {
        canSelectRange = false
        break
      }
      newActivePosTime.push(i)
      newActivePosArr.push(key)
      newActiveSelList.push({
        time: i,
        ...item
      })
    }

    if (canSelectRange) {
      activePos.value = posKey
      activePosTime.value = newActivePosTime
      activePosArr.value = newActivePosArr
      activeSelList.value = newActiveSelList
      // 排序
      activePosTime.value.sort((a, b) => a - b)
      activeSelList.value.sort((a, b) => parseInt(a.time) - parseInt(b.time))
    } else {
      // 如果不是连续的时间点，或者区间内有被预定的，则重置为只选当前时间点
      if (RA.value.includes(posKey)) {
        ElMessage.warning('该会议室已经被预定')
        return
      }
      activePos.value = posKey
      activePosTime.value = [index]
      activePosArr.value = [posKey]
      activeSelList.value = [{
        time: index,
        ...item
      }]
    }
  }
  activeFn()
}

// 展示
const activeFn = () => {
  if (activeSelList.value.length) {
    currentActiveRoom.value = activeSelList.value[0]
    currentActiveRoom.value['yearTemp'] = yearTemp.value
    currentActiveRoom.value['start'] = activeSelList.value[0].time
    currentActiveRoom.value['end'] = activeSelList.value.slice(-1)[0].time + 1
  }
}

// 预定 样式
function reserveRoomFn(index, itd) {
  let S = timeArr.value[index].slice(0, 2)
  let N = new Date().toLocaleTimeString().slice(0, 2)
  let F = parseInt(S) > parseInt(N)
  let str = ''
  let U = index + '--' + itd['room_uid']
  if (activePosArr.value.includes(U)) str += 'active_room,'
  if (activePos.value === (U)) str += 'active_room,'
  if (RA.value.includes(U)) str += 'reserve_room,'
  if (activeIndex.value === 0 && !F) str += 'dateG,'
  return str.split(',').join(' ')
}

const bookRoomConfirm = () => {
  if (!currentActiveRoom.value) {
    ElMessage.warning('请选择会议室')
    return
  } else {
    emits('handleSave', { activePosArr: activePosArr.value, activeSelList: activeSelList.value })
  }
}

onMounted(() => {
  init()
})

defineExpose({ activePosArr, activeSelList })
</script>

<style lang="scss" scoped>
.work_index_body {
  height: calc(100vh - 90px);
  width: 100%;
  overflow: auto;
  position: relative;
  background-color: #fff;
  padding-top: 8px;
}

.date_list {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 4px;
  height: 60px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E8E8E8;
}

.date_list_item {
  flex-shrink: 0;
  cursor: pointer;
  width: 60px;
  height: 48px;
  display: flex;
  padding: 4px 2px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span:nth-of-type(1) {
    font-size: 14px;
    color: #999;
    margin-bottom: 2px;
  }

  span:nth-of-type(2) {
    font-size: 12px;
    color: #999;
  }
}

.date_list_item_active {
  background-color: var(--el-color-primary);
  border-radius: 2px;

  span:nth-of-type(1) {
    font-size: 16px;
  }

  span {
    color: #fff !important;
  }
}

.room_list {
  display: flex;
  flex-direction: row;
  height: calc(100% - 60px - 86px - 32px - 30px);
  overflow: auto;
}

// 时间
.room_list_left {
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px 2px;
  //margin-top: 24px;

  &_item {
    min-height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    span {
      font-size: 12px;
      color: #666;
    }
  }
}

.placeBox{
  // padding-left: 60px;
  height: 48px;

  .place_item{
    height: 48px;
    >span{
      font-size: 14px;
      color: #333;
    }
  }
  .place_item:hover {
    cursor: inherit;
    background-color: transparent;
  }

  .place_title{
    width: 60px;
    text-align: right;
    font-size: 14px;
    color: #333;
    margin-bottom: 2px;
    line-height: 48px;
  }
}

.room_list_right {
  flex: 1;
  overflow-x: scroll;
  height: calc(24 * 48px + 30px);
  display: flex;
  flex-direction: column;
}

.room_list_right_place {
  display: flex;
  flex-direction: row;
}

.place_item:hover {
  background-color: #e9f3ff ;
}

.place_item {
  cursor: pointer;
  width: 120px;
  min-width: 120px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 12px;
    color: #666;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.room_time_list {
  display: flex;
  flex-direction: column;
}

.room_item {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
    height: auto;
  }
}

.active_room {
  background-color: #e9f3ff !important;
}

.place_item.reserve_room {
  background-color: #FA9902 !important;

  &:hover {
    background-color: transparent;
  }
}

.place_item.dateG {
  background-color: #f5f7fa !important;

  &:hover {
    background-color: transparent;
  }
}

.b_des {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 56px;
  padding-top: 10px;
  position: relative;

  &_left {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 8px;

    .sp_d {
      font-size: 12px;
      color: #999;
    }

    span.spT {
      font-size: 18px;
      color: #333333;
    }

    .sp {
      margin-top: 6px;
      font-size: 20px;
      color: #FA9902;
    }
  }

  &_mid {
    flex: 1;
    display: flex;
    flex-direction: column;

    &_item {
      display: flex;
      flex-direction: row;
      align-items: center;

      span:nth-of-type(1) {
        min-width: 80px;
        font-size: 12px;
        color: #999;
        margin-right: 4px;
      }

      span:nth-of-type(2) {
        font-size: 12px;
        color: #333;
      }

    }
  }

  .b_des_right {
    position: absolute;
    right: 100px;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 45px;
      height: 45px;
    }
  }
}

.empty_text {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 20px;
  margin: 0 auto;
}

.roomTipBox {
  height: 30px;
  font-size: 14px;
  gap: 20px;

  .t {
    gap: 4px;
  }

  .y {
    background-color: #FA9902;
  }

  .f {
    background-color: #fff;
  }

  .a {
    background-color: #e9f3ff;
  }

  .b {
    background-color: #f5f7fa;
  }

  .i {
    width: 24px;
    height: 24px;
    padding: 2px;
    border-radius: 4px;
  }
}
</style>
