<template>
  <div class="cmds_Page">
    <div class="flexRowAC cmds_s_box">
      <div class="sb_item flexRowAC">
        昨日
        <div class="sb_i_t">
          {{ scanData.yesterdayCount }}
        </div>
      </div>
      <div class="sb_item flexRowAC">
        今日
        <div class="sb_i_t">
          {{ scanData.todayCount }}
        </div>
      </div>
      <div class="sb_item flexRowAC">
        近7日
        <div class="sb_i_t">
          {{ scanData.nearlySevenDayCount }}
        </div>
      </div>
      <div class="sb_item flexRowAC">
        总扫码数
        <div class="sb_i_t">
          {{ scanData.allCount }}
        </div>
      </div>
    </div>
    <div class="cmds_date_box flexRowAC">
      <div class="d_d">
        日期范围：
      </div>
      <div v-for="(item,i) in ddArr" :key="i" class="d_d_btn" :class="{act:ddAct===i}" @click="ddBtnClick(i)">
        {{
          item
        }}
      </div>
    </div>
    <div class="cmds_chat">
      <statice-echart-bar v-if="todayObj" :dataset="datasetToday" :data="todayObj" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { scanStatisticsCount, scanStatisticsCountByDate } from '@/api/QRcode'
import StaticeEchartBar from '../homepage/staticeEchartBar.vue'
import { format, subDays } from 'date-fns'

const props = defineProps(['itemObj'])
let ddArr = ref<any>(['昨日', '今日', '近7日', '近30日'])
let ddAct = ref<number>(0)
// 扫描数量统计
let scanData = ref({
  yesterdayCount: 0,
  todayCount: 0,
  nearlySevenDayCount: 0,
  allCount: 0
})
let todayObj = ref() // 统计某个日期范围内二维码
const datasetToday = ref<any>([
  { name: 'date', displayName: '日期' },
  { name: 'count', displayName: '扫描数量' }
])

// 日期范围
const ddBtnClick = async(index: number) => {
  ddAct.value = index
  switch (index) {
    case 0:
      startDate.value = format(yesterday, 'yyyy-MM-dd 00:00:00')
      endDate.value = format(new Date(), 'yyyy-MM-dd 00:00:00')
      break
    case 1:
      startDate.value = format(new Date(), 'yyyy-MM-dd 00:00:00')
      endDate.value = format(new Date(), 'yyyy-MM-dd 23:59:59')
      break
    case 2:
      startDate.value = format(sevenDay, 'yyyy-MM-dd 00:00:00')
      endDate.value = format(new Date(), 'yyyy-MM-dd 00:00:00')
      break
    case 3:
      startDate.value = format(Thr30Day, 'yyyy-MM-dd 00:00:00')
      endDate.value = format(new Date(), 'yyyy-MM-dd 00:00:00')
      break
  }
  scanStatisticsCount_Fn()
}

// 二维码被扫描数量统计
const getTodayScanData_Fn = async() => {
  let data = props.itemObj.id
  let res: any = await scanStatisticsCountByDate(data)
  if (res.code === 200) {
    scanData.value = res.data
  }
}
const today = new Date()
const yesterday = subDays(today, 1)
const sevenDay = subDays(today, 7)
const Thr30Day = subDays(today, 30)
const startDate = ref<String>(format(yesterday, 'yyyy-MM-dd 00:00:00'))
const endDate = ref<String>(format(yesterday, 'yyyy-MM-dd 23:59:59'))
// 统计某个日期范围内二维码每一天被扫描数量统计
const scanStatisticsCount_Fn = async() => {
  let data = props.itemObj.id

  subDays(today, 1)
  let data1 = {
    startDate: startDate.value,
    endDate: endDate.value
  }
  let res: any = await scanStatisticsCount(data, data1)
  if (res.code === 200) {
    todayObj.value = res.data
  }
}

onMounted(() => {
  getTodayScanData_Fn()
  scanStatisticsCount_Fn()
})
</script>
<style lang='scss' scoped>
.cmds_s_box {
  background: #F7F7F7;
  border-radius: 8px;

  .sb_item {
    font-size: 14px;
    color: #B5BBCB;
    padding: 24px 0;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .sb_i_t {
    font-size: 24px;
    color: #333333;
  }
}

.cmds_date_box {
  padding-top: 24px;
  gap: 12px;

  .d_d {
    font-size: 14px;
    color: #666666;
  }

  .d_d_btn {
    cursor: pointer;
    padding: 4px 12px;
    background-color: #F7F7F7;
    border: 1px solid #F7F7F7;
    border-radius: 4px;
  }

  .d_d_btn.act {
    background: rgba(12, 175, 96, 0.12);
    border: 1px solid var(--el-color-primary);
    border-radius: 4px;
    color: var(--el-color-primary);
  }
}

.cmds_chat {
  height: 352px;
}
</style>
