<template>
  <div class="home">
    <div class="content_top flexColumn">
      <div class="flexRowAC totalBox">
        <!-- 资产总数-->
        <div class="number_group flexRowAC">
          <div v-for="(item,i) in workList" :key="i" class="number_item flexColumn">
            <div class="flexRowAC number_item_header">
              <img class="number_item_headerImg" :src="item.icon" alt="" />
              <span>{{ item.n }}</span>
            </div>
            <div class="flexRowAC number_item_content">
              <div class="flexColumn number_item_content_text">
                <span>{{ item['n1'] }}</span>
                <!--                <div class="flexRowAC">-->
                <!--                  <span v-if="item.f==='up'">{{ item['n2'] }}</span>-->
                <!--                  <span class="green" v-else>{{ item['n2'] }}</span>-->
                <!--                  <span>较上周 </span>-->
                <!--                </div>-->
              </div>
              <img class="number_item_content_img" :src="item.img" />
            </div>
          </div>
        </div>
        <!--资产入库统计-->
        <div class="ware_stat_R flexColumn">
          <div class="echart_group_item_header flexRowAC">
            <span class="echart_group_item_header_title">资产出入库统计</span>
          </div>
          <div class="chart">
            <barEchart v-if="wareSObjEntry" :rate="45" :dataset="datasetWareS" :data="wareSObjEntry" />
          </div>
        </div>
      </div>
      <!--资产统计-->
      <div class="echart_group flexRowAC">
        <!--资产统计-->
        <div class="totalStaPie flexColumn">
          <div class="echart_group_item_header flexRowAC">
            <span class="echart_group_item_header_title">资产统计</span>
            <!--            <el-radio-group v-model="radio1">-->
            <!--              <el-radio-button label="按月" value="month"/>-->
            <!--              <el-radio-button label="按周" value="week"/>-->
            <!--            </el-radio-group>-->
          </div>
          <div class="chart">
            <pie-echart v-if="wareObj" :dataset="datasetWare" :data="wareObj" />
          </div>
        </div>
        <!--资产出入库统计-->
        <div class="echart_group_item flexColumn">
          <div class="echart_group_item_header flexRowAC">
            <span class="echart_group_item_header_title">资产出入库统计</span>
            <el-radio-group v-model="radio1" @change="radioClick">
              <el-radio-button label="按月" value="month" />
              <el-radio-button label="按周" value="week" />
            </el-radio-group>
          </div>
          <div class="e_content flexRowAC">
            <div class="today_content flexRowAC">
              <div class="to_L flexRowAC">
                <div
                  v-for="(item,i) in todayList"
                  :key="i"
                  class="to_LBox"
                  :class="{act:toLBoxAct===item.status}"
                  @click="toLBoxClick(item.status)"
                >
                  <div class="toL_n">
                    {{ item.n }}
                  </div>
                  <div class="toL_t">
                    {{ item['n1'] }}
                  </div>
                  <img src="@/assets/img/warehouse/triangle.png" class="toL_trian" alt="" />
                </div>
              </div>
            </div>
            <div class="chart">
              <barEchart v-if="wareSObj" :rate="radio1==='week'?0:45" :dataset="datasetWareS" :data="wareSObj" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BarEchart from './barEchart.vue'
import to1 from '@/assets/img/warehouse/to1.png'
import to2 from '@/assets/img/warehouse/to2.png'
import to3 from '@/assets/img/warehouse/to3.png'
import to4 from '@/assets/img/warehouse/to4.png'
import to5 from '@/assets/img/warehouse/to5.png'
import to6 from '@/assets/img/warehouse/to6.png'
import bar_eg1 from '@/assets/img/warehouse/total1.png'
import bar_eg2 from '@/assets/img/warehouse/total2.png'
import bar_eg3 from '@/assets/img/warehouse/total3.png'
import bar_eg4 from '@/assets/img/warehouse/total4.png'
import PieEchart from '@/pages/warehouse/views/page/homepage/pieEchart.vue'
import { ckmtOStatistics, ckmtOTimestatistics } from '@/api/warehouse'
import { useUserStore } from '@/store/modules/user'

const store: any = useUserStore()
const radio1 = ref<string>('week')
const toLBoxAct = ref<number>(1)
const workList = ref<any>()// 资产总数
workList.value = [
  { icon: to1, img: bar_eg1, n: '资产总数', n1: 0, n2: '+ 0.5%', f: 'up' },
  { icon: to2, img: bar_eg2, n: '资产闲置数', n1: 0, n2: '+ 0.5%', f: 'up' },
  { icon: to3, img: bar_eg3, n: '资产领用数', n1: 0, n2: '+ 0.5%', f: 'down' },
  { icon: to4, img: bar_eg3, n: '资产借用数', n1: 0, n2: '+ 0.5%', f: 'down' },
  { icon: to6, img: bar_eg4, n: '维修资产数', n1: 0, n2: '+ 0.5%', f: 'down' },
  { icon: to5, img: bar_eg3, n: '资产报废数', n1: 0, n2: '+ 0.5%', f: 'down' }
]
const todayList = ref<any>()// 资产出入库统计
todayList.value = [
  { n: '资产领用统计', n1: 0, n2: '23% (+10)', f: 'up', status: 1 },
  { n: '资产退库统计', n1: 0, n2: '5% (-15)', f: 'down', status: 2 },
  { n: '资产借用统计', n1: 0, n2: '5% (-15)', f: 'down', status: 3 },
  { n: '资产归还统计', n1: 0, n2: '12% (+16)', f: 'up', status: 4 }
]
let wareObj = ref<any>() // 资产统计
const datasetWare = ref<any>([
  { name: 'label', displayName: '数量' },
  { name: 'count', displayName: '数量' }
])
let wareSObj = ref<any>() // 资产统计
let wareSObjEntry = ref<any>() // 资产统计
const datasetWareS = ref<any>([
  { name: 'date', displayName: '日期' },
  { name: 'num', displayName: '数量' }
])

// 资产出入库统计
const toLBoxClick = (val) => {
  toLBoxAct.value = val
  timestatistics()
}

// 主页统计记录数据
const applistFn = () => {
  let data = {
    accessToken: store.userInfo.accessToken
  }
  ckmtOStatistics(data).then((res: any) => {
    if (res.code === 200) {
      res.data.map((item: any) => {
        if (item.status === 99) {
          workList.value[0].n1 = item.count
        }
        if (item.status === 0) {
          workList.value[1].n1 = item.count
        }
        // 领用
        if (item.status === 1) {
          workList.value[2].n1 = item.count
          todayList.value[0].n1 = item.count
        }
        // 退库
        if (item.status === 2) {
          todayList.value[1].n1 = item.count
        }
        // 借用
        if (item.status === 3) {
          workList.value[3].n1 = item.count
          todayList.value[2].n1 = item.count
        }
        // 归还
        if (item.status === 4) {
          todayList.value[3].n1 = item.count
        }
        if (item.status === 5) {
          workList.value[4].n1 = item.count
        }
        if (item.status === 8) {
          workList.value[5].n1 = item.count
        }
      })
      wareObj.value = res.data.filter(item => item.status !== 99)
    }
  })
}

// 统计 入库状态
const timestatistics1 = () => {
  let data = {
    accessToken: store.userInfo.accessToken,
    date_time: 'week',
    status: 0
  }
  ckmtOTimestatistics(data).then((res: any) => {
    if (res.code === 200) {
      wareSObjEntry.value = res.data
    }
  })
}

// 按周按月
const radioClick = () => {
  timestatistics()
}

// 统计
const timestatistics = () => {
  let data = {
    accessToken: store.userInfo.accessToken,
    date_time: radio1.value,
    status: toLBoxAct.value
  }
  ckmtOTimestatistics(data).then((res: any) => {
    if (res.code === 200) {
      wareSObj.value = res.data
    }
  })
}

onMounted(() => {
  applistFn()
  timestatistics()
  timestatistics1()
})
</script>

<style lang="scss" scoped>
.today_content {
  gap: 20px;
  height: calc(100% - 24px);

  .to_L {
    height: 100%;
    width: 150px;
    flex-direction: column;
    gap: 20px;
  }

  .to_R {
    flex: 1;
    height: 100%;
  }

  .toL_n {
    font-size: 14px;
    color: #939393;
  }

  .toL_t {
    padding-top: 12px;
    font-size: 32px;
    color: #111827;
    font-weight: bold;
  }
}

.to_LBox {
  flex: 1;
  width: 100%;
  background: #FAFAFA;
  border-radius: 8px;
  padding: 10px 12px;
  position: relative;
  border: 1px solid transparent;

  &.act {
    background: rgba(66, 70, 255, 0.12);
    border: 1px solid #4246FF;
    border-radius: 8px;

    .toL_trian {
      display: block;
    }
  }

  .toL_trian {
    display: none;
    width: 10px;
    height: 10px;
    position: absolute;
    top: calc(50% - 6px);
    right: -14px;
  }
}

span:first-child.green {
  color: #06C862 !important;
}

.table_cc :deep(.header_cell) {
  color: #333;
  background-color: #FAFAFA;
}

.home {
  height: 100%;
  overflow: auto;

  .content_top {
    margin-top: 20px;
    height: 420px;
    padding-bottom: 20px;
    gap: 20px;
  }

  .content_bottom {
    height: 556px;
    gap: 20px;
    align-items: flex-start;
  }

  .bgRadius {
    background: #FFFFFF;
    border-radius: 10px;
    padding: 20px;
  }
}

// 资产总数
.totalBox {
  gap: 20px;

  .number_group {
    flex-wrap: wrap;
    flex: 5;
    //width: 100%;
    //height: 165px;
    gap: 20px;
  }

  .number_item {
    width: calc(33% - 10px);
    height: 190px;
    background: #FFFFFF;
    border-radius: 8px;
  }

  .ware_stat_R {
    flex: 2;
    height: 100%;
    background-color: #fff;
    border-radius: 8px;
  }
}

// 资产总数title
.number_item_header {
  height: 50px;
  margin: 0 24px;
  gap: 8px;
  border-bottom: 1px solid rgba(238, 239, 242, 1);

  > span {
    font-size: 16px;
    color: #111827;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
  }

  .number_item_headerImg {
    width: 24px;
    height: 24px;
    background-size: cover;
  }
}

.number_item_content {
  flex: 1;
  margin: 0 24px;
  justify-content: space-between;
}

.number_item_content_text {
  span:nth-of-type(1) {
    font-size: 32px;
    color: #111827;
    letter-spacing: 0;
    line-height: 32px;
    font-weight: 700;
    margin: 8px 0px;
  }

  div {
    span:nth-of-type(1) {
      font-size: 14px;
      color: #FD6A6A;
      letter-spacing: 0;
      line-height: 22px;
    }

    span:nth-of-type(2) {
      margin: 0 6px;
      font-size: 14px;
      color: #718096;
      letter-spacing: 0;
      line-height: 22px;
    }
  }
}

.number_item_content_img {
  width: 100px;
}

//资产统计
.echart_group {
  gap: 20px;
  height: 554px;

  .totalStaPie {
    width: 347px;
    height: 554px;

    background: #FFFFFF;
    border-radius: 10px;
  }

  .echart_group_item {
    flex: 1;
    height: 554px;
    background: #FFFFFF;
    border-radius: 10px;
  }
}

.echart_group_item_header {
  height: 60px;
  margin: 0 24px;
  justify-content: space-between;

  &_title {
    font-size: 16px;
    color: #111827;
    letter-spacing: 0.3px;
    line-height: 24px;
    font-weight: 400;
  }
}

.e_content {
  flex: 1;
  margin: 8px 24px;
}

.e_c_g {
  gap: 10px;
  height: 100%;
}

.e_c_g_item {
  justify-content: center;
  flex: 1;
  width: 150px;
  background: #FAFAFA;
  border-radius: 8px;

  span {
    margin: 8px 4px;
  }

  span:nth-of-type(1) {
    font-size: 10px;
    color: #939393;
  }

  span:nth-of-type(2) {
    font-size: 18px;
    color: #111827;
  }

  span:nth-of-type(3) {
    font-size: 10px;
    color: #0CAF60;
  }
}

.chart {
  flex: 1;
  height: 100%;
}

.linchart {
  flex: 1;
  width: 100%;
}

.table_c {
  background: #FFFFFF;
  border-radius: 10px;
}

.table_c_header {
  height: 60px;
  margin: 0 24px;
}

.table_cc {
}

.paginationBox {
  margin: 0 24px;
  height: 50px;
  justify-content: flex-end;
}

.operateDe {
  cursor: pointer;
  color: #027AFF;
}

.reSucc {
  font-size: 12px;
  color: #5CD905;
  padding: 2px 4px;
  line-height: 14px;
  color: #81D557;
  background-color: #F6FFED;
  border: 1px solid #CBEEBA;
  border-radius: 4px;
}

.reSucc.reFail {
  color: #FF4949;
  background-color: rgba(255, 162, 162, .2);
  border: 1px solid rgba(255, 162, 162, 1);
}

.reSucc.reAppr {
  color: #FA8D00;
  background-color: rgba(255, 213, 145, .2);
  border: 1px solid rgba(255, 213, 145, 1);
}

</style>
