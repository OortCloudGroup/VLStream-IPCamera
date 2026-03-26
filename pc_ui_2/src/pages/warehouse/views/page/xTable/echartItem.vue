<template>
  <div class="number_item flexColumn chart_item">
    <div class="chart_item_header">
      <span>{{ data.title }}</span>
    </div>
    <comm-echarts
      v-if="options"
      class="chartWH"
      :full-options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import CommEcharts from '@/components/Echarts/commEcharts.vue'
import { useUserStore } from '@/store/modules/user'
import { ckmtDataList } from '@/api/warehouse'

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  cid: {
    type: String,
    default: ''
  }
})

// 监听props.data的field 和 countType的变化
watch(() => [props.data.xField, props.data.yField, props.data.chartType], () => {
  if (props.data.yField && props.data.yField && props.data.chartType) {
    getList()
  }
})

const store = useUserStore()

const options = ref(null)

// 数据列表
const getList = async() => {
  let params = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 999,
    cid: props.cid
  }
  if (props.data.xField && props.data.yField) {
    params.show_field = [props.data.xField, props.data.yField]
  }
  ckmtDataList(params).then((res) => {
    if (res.code === 200) {
      let tempArr = (res.data.list || [])
      let xData = []
      let yData = []
      tempArr.forEach(item => {
        if (item[props.data.xField]) {
          xData.push(item[props.data.xField])
        }
        if (item[props.data.yField]) {
          yData.push(item[props.data.yField])
        }
      })
      console.log('xData-yData-', xData, yData)
      handlerXYData(xData, yData)
    }
  })
}

const handlerXYData = (xData, yData) => {
// xData 是一个x轴数， yData 是一个y轴 是数值， 合并xData相同的项目，并把相同项对应位置的yData的值相加，最终xData和yData一一对应

  // 将yData的值转换数值类型
  yData = yData.map(item => {
    return isNaN(Number(item)) ? 0 : Number(item)
  })

  let xDataMap = new Map()
  xData.forEach((item, index) => {
    if (xDataMap.has(item)) {
      xDataMap.set(item, xDataMap.get(item) + yData[index])
    } else {
      xDataMap.set(item, yData[index])
    }
  })
  console.log('xDataMap-', xDataMap)
  let cType = 'bar'
  if (props.data.chartType === 1) {
    cType = 'bar'
    options.value = {
      grid: {
        left: '5%',
        right: '10%',
        top: '10%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        color: ['#4246FF', '#FFD023'],
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0, // 显示所有标签
          rotate: 45 // 旋转标签，避免重叠
        },
        data: Array.from(xDataMap.keys())
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: Array.from(xDataMap.values()),
          type: cType,
          barWidth: 22,
          itemStyle: {
            color: '#4246FF'
          }
        }
      ]
    }
  }
  if (props.data.chartType === 2) {
    cType = 'line'
    options.value = {
      grid: {
        left: '5%',
        right: '10%',
        top: '10%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        color: ['#4246FF', '#FFD023'],
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0, // 显示所有标签
          rotate: 45 // 旋转标签，避免重叠
        },
        data: Array.from(xDataMap.keys())
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: Array.from(xDataMap.values()),
          type: cType,
          barWidth: 22,
          itemStyle: {
            color: '#4246FF'
          }
        }
      ]
    }
  }
  if (props.data.chartType === 3) {
    let pieData = []
    // 将 xDataMap转换未  { value: , name:  }的数组
    pieData = Array.from(xDataMap.entries()).map(([name, value]) => ({
      value,
      name
    }))
    console.log('pieData-', pieData)
    options.value = {
      legend: {
        orient: 'vertical',
        bottom: '2%',
        left: '10%',
        textStyle: { // 图例文字的样式
          color: '#000',
          fontSize: 12
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'], // 饼图的半径
          center: ['50%', '30%'], // 调整饼图位置
          avoidLabelOverlap: false,
          color: ['#4246FF', '#0CAF60', '#FFD023', '#FF8725', '#E3E3E3', '#4246FF', '#0CAF60', '#FFD023', '#FF8725', '#E3E3E3', '#4246FF', '#0CAF60', '#FFD023', '#FF8725', '#E3E3E3'],
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData
          // data: [
          //   { value: 1048, name: '闲置' },
          //   { value: 580, name: '借用' },
          //   { value: 735, name: '领用' },
          //   { value: 1048, name: '维修' },
          //   { value: 735, name: '报废' }
          // ]
        }
      ]
    }
  }

  console.log('options', options.value)
}
onMounted(() => {
  if (props.data.yField && props.data.yField) {
    getList()
  }
})

</script>

<style scoped>

  .chart_item {
    position: relative;
  }

  .chart_item_header {
    height: 48px;
    display: flex;
    align-items: center;
    span {
      margin: 0 16px;
      font-size: 16px;
      color: #111827;
      letter-spacing: 0;
      font-weight: 400;
    }
  }

.chartWH {
  width: 100%;
  height: 100%;
}

.number_item {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
}

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

</style>

