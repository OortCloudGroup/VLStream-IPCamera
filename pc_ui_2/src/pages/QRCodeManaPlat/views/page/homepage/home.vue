<template>
  <div class="home homeBg">
    <!-- 总二维码数-->
    <div class="content_top flexRowAC">
      <div v-for="(item,i) in userArr" :key="i" class="userBox">
        <div class="userT">
          {{ item.label }}
        </div>
        <div class="userData flexRowAC">
          <div class="userDataC">
            <div class="userDataC_v">
              {{ item.value }}
            </div>
          </div>
          <img class="userDataImg" :src="item.img" alt="" />
        </div>
      </div>
    </div>
    <!--二维码扫码前6统计-->
    <div class="content_center flexRowAC">
      <div class="statiBox">
        <div class="stati_title flexRowAC">
          二维码扫码前6统计
          <div class="tmwBox flexRowAC">
            <div :class="{tmw_i:tmw}" class="tmwBox_i" @click="getTopSixScanData_Fn(true)">
              按月
            </div>
            <div :class="{tmw_i:!tmw}" class="tmwBox_i" @click="getTopSixScanData_Fn(false)">
              按周
            </div>
          </div>
        </div>
        <home-bar v-if="scanObj" :dataset="datasetScan" :data="scanObj" />
      </div>
      <div class="status statiBox">
        <div class="stati_title flexRowAC">
          二维码扫码占比
          <div class="tmwBox flexRowAC">
            <div :class="{tmw_i:tmw1}" class="tmwBox_i" @click="getQrScanPercent_Fn(true)">
              按月
            </div>
            <div :class="{tmw_i:!tmw1}" class="tmwBox_i" @click="getQrScanPercent_Fn(false)">
              按周
            </div>
          </div>
        </div>
        <status-echart v-if="perObj" :dataset="datasetPer" :data="perObj" />
      </div>
      <div class="tempBox statiBox">
        <div class="stati_title flexRowAC">
          类型扫码前6统计
          <div class="tmwBox flexRowAC">
            <div :class="{tmw_i:tmw2}" class="tmwBox_i" @click="getTopSixScanTypeData_Fn(true)">
              按月
            </div>
            <div :class="{tmw_i:!tmw2}" class="tmwBox_i" @click="getTopSixScanTypeData_Fn(false)">
              按周
            </div>
          </div>
        </div>
        <home-bar v-if="typeObj" :dataset="datasetType" :data="typeObj" />
      </div>
    </div>
    <!--消息实时发送-->
    <div class="content_bottom">
      <div class="static bgRadius">
        <div class="staticTitle">
          今日扫码数统计
        </div>
        <div class="flexRowAC messEcahrtBox">
          <div class="echartBox" style="height: calc(100% - 50px); width: 100%;">
            <statice-echart v-if="todayObj" :dataset="datasetToday" :data="todayObj" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HomeBar from './homeBar.vue'
import StatusEchart from './statusEchart.vue'
import StaticeEchart from './staticeEchart.vue'
import h1 from '@/assets/img/QRCodeManaPlat/h1.png'
import h2 from '@/assets/img/QRCodeManaPlat/h2.png'
import h3 from '@/assets/img/QRCodeManaPlat/h3.png'
import {
  getDisplayData,
  getQrScanPercent1,
  getTodayScanData,
  getTopSixScanData,
  getTopSixScanTypeData
} from '@/api/QRcode'
import { getLastMonthDate, getLastWeekDate } from '@/utils/weeks'

// 二维码扫码前6统计
let scanObj = ref<any>()
const datasetScan = ref<any>([
  'qrCodeName',
  { name: 'count', displayName: '扫码数' }
])
let perObj = ref<any>()
const datasetPer = ref<any>([
  { name: 'qrCodeName', displayName: '扫码数' },
  'percent'
])
let typeObj = ref<any>()
const datasetType = ref<any>([
  'qrCodeTypeName',
  { name: 'count', displayName: '扫码数' }
])
let todayObj = ref<any>()
const datasetToday = ref<any>([
  { name: 'hourBucket', displayName: '扫码数' },
  { name: 'allQrCodeCount', displayName: '扫码数' }
])
const tmw = ref<boolean>(true) // 按周
const tmw1 = ref<boolean>(true) // 按周
const tmw2 = ref<boolean>(true) // 按周
let monthS = ref<any>(getLastMonthDate()[0])
let weekS = ref<any>(getLastWeekDate()[0])
let dayE = ref<any>(getLastWeekDate()[1])
// 总下发用户
const userArr = ref<any>([])
userArr.value = [
  { label: '总二维码数', value: '0', img: h1 },
  { label: '总扫码数', value: '0', img: h2 },
  { label: '昨日扫码数', value: '0', img: h2 },
  { label: '近7天扫码数', value: '0', img: h2 },
  { label: '总类型数', value: '0', img: h3 }
]

// 总二维码数
const getDisplayData_Fn = async() => {
  let res: any = await getDisplayData()
  if (res.code === 200) {
    userArr.value[0].value = res.data.allQrCodeCount
    userArr.value[1].value = res.data.allScanCount
    userArr.value[2].value = res.data.yesterdayScanCount
    userArr.value[3].value = res.data.nearlySevenDayScanCount
    userArr.value[4].value = res.data.qrCodeTypeCount
  }
}

// 二维码扫码前6统计
const getTopSixScanData_Fn = async(val: boolean) => {
  tmw.value = val
  let data = {
    startTime: weekS.value + ' 00:00:00',
    endTime: dayE.value + ' 23:59:59'
  }
  if (val) {
    data.startTime = monthS.value + ' 00:00:00'
  } else {
    data.startTime = weekS.value + ' 00:00:00'
  }
  let res: any = await getTopSixScanData(data)
  if (res.code === 200) {
    scanObj.value = res.data
  }
}

// 二维码扫码占比统计
const getQrScanPercent_Fn = async(val: boolean) => {
  tmw1.value = val
  let data = {
    startTime: weekS.value + ' 00:00:00',
    endTime: dayE.value + ' 23:59:59'
  }
  if (val) {
    data.startTime = monthS.value + ' 00:00:00'
  } else {
    data.startTime = weekS.value + ' 00:00:00'
  }
  let res: any = await getQrScanPercent1(data)
  if (res.code === 200) {
    perObj.value = res.data
  }
}
// 类型扫码前6统计
const getTopSixScanTypeData_Fn = async(val: boolean) => {
  tmw2.value = val
  let data = {
    startTime: weekS.value + ' 00:00:00',
    endTime: dayE.value + ' 23:59:59'
  }
  if (val) {
    data.startTime = monthS.value + ' 00:00:00'
  } else {
    data.startTime = weekS.value + ' 00:00:00'
  }
  let res: any = await getTopSixScanTypeData(data)
  if (res.code === 200) {
    let tempArr = []
    res.data.forEach(element => {
      if (element.qrCodeTypeName && element.qrCodeTypeName.includes(',')) {
        element.qrCodeTypeName = element.qrCodeTypeName.split(',')[0]
        tempArr.push(element)
      } else if (element.qrCodeTypeName) {
        tempArr.push(element)
      }
    })
    typeObj.value = tempArr
  }
}
// 今日扫码数统计，以小时分组
const getTodayScanData_Fn = async() => {
  let res: any = await getTodayScanData()
  if (res.code === 200) {
    res.data.forEach(element => {
      element.hourBucket += '时'
    })
    todayObj.value = res.data
  }
}

onMounted(() => {
  getDisplayData_Fn()
  getTopSixScanData_Fn(false)
  getQrScanPercent_Fn(false)
  getTopSixScanTypeData_Fn(false)
  getTodayScanData_Fn()
})
</script>
<style scoped lang="scss">
.homeBg{
  background: #F0F2F5;
}

.messEcahrtBox {
  height: 100%;
  align-items: flex-start;

  .echartBox {
    flex: 1;
  }
}

.statiBox {
  flex: 1;
  height: 400px;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;

  .stati_title {
    justify-content: space-between;
    font-size: 16px;
    color: #111827;
  }
}

.userBox {
  width: 25%;
  padding: 14px 16px;
  background-color: #fff;
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

  .userDataImg {
    width: 53px;
    height: 40px;
    background-size: cover;
  }
}

.tmwBox {
  padding: 2px 3px;
  background: #F9FAFB;
  border-radius: 4px;

  .tmwBox_i {
    cursor: pointer;
    padding: 2px 12px;
    font-size: 10px;
    color: #939393;
  }

  .tmw_i {
    color: var(--el-color-primary);
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px rgba(17, 24, 39, 0.04);
    border-radius: 4px;
  }
}

.home {
  height: 100%;

  .content_top {
    padding-bottom: 20px;
    gap: 20px;
  }

  .content_center {
    padding-bottom: 20px;
    gap: 20px;
  }

  .content_bottom {
    height: 352px;
    gap: 20px;
  }

  .bgRadius {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 24px;
  }
}

.static {
  width: 100%;
  height: 100%;

  .staticTitle {
    font-size: 16px;
    color: #111827;
  }
}
</style>
