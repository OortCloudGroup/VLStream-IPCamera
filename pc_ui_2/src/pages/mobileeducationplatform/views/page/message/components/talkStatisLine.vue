<!--
 *@Created by: 兰舰
 * Email: gglanjian@qq.com
 * Phone: 16620805419
 * @Date: 2024-11-15 11:45:51
 * @Last Modified by:  兰舰
 * @Copyright aPaaS-front-team. All rights reserved.
!-->
<template>
  <comm-echarts
    :id="chartId"
    class="chartWH"
    :full-options="fullPtions"
    @click="handleChartClick"
  />
</template>
<script lang='ts' setup>
import CommEcharts from '@/components/Echarts/commEcharts.vue'
import { onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'

let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary')
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  dataset: {
    type: Array,
    required: true
  },
  unit: {
    type: String,
    default: '次'
  },
  chartId: {
    type: String,
    default: 'talkStatisLine'
  }
})
const emit = defineEmits(['click'])
const fullPtions = ref({})
const chartInstance = ref<echarts.ECharts | null>(null)

const optionData = {
  testOption() {
    const option = {
      title: {
        text: `单位(${props.unit || '次'})`,
        left: '8%',
        top: '4%',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        data: props.dataset || []
      },
      yAxis: {
        show: true,
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: props.data || [],
          smooth: true,
          symbol: 'emptyCircle',
          itemStyle: {
            color: primaryColor
          },
          label: {
            show: true,
            position: 'right',
            itemStyle: {
              color: '#111827',
              fontSize: 12
            },
            color: '#718096',
            fontFamily: 'TencentSans'
          }
        }
      ]
    }
    return option
  }
}

// 添加点击事件处理程序
const handleChartClick = (params: any) => {
  emit('click', {
    value: params.value,
    name: params.name,
    dataIndex: params.dataIndex
  })
}

// 初始化图表
const initChart = () => {
  const chart = document.getElementById(props.chartId)
  if (chart) {
    if (!chartInstance.value) {
      chartInstance.value = echarts.init(chart)
      chartInstance.value.on('click', handleChartClick)
    }
    // 确保数据存在再设置选项
    if (props.data && props.dataset) {
      chartInstance.value.setOption(optionData.testOption())
    }
  }
}

// 更新图表
const updateChart = () => {
  if (chartInstance.value && props.data && props.dataset) {
    chartInstance.value.setOption(optionData.testOption())
  }
}

// 监听数据变化
watch([() => props.data, () => props.dataset, () => props.unit], () => {
  if (props.data && props.dataset) {
    fullPtions.value = optionData.testOption()
    nextTick(() => {
      updateChart()
    })
  }
}, { deep: true })

onMounted(() => {
  if (props.data && props.dataset) {
    fullPtions.value = optionData.testOption()
    nextTick(() => {
      initChart()
    })
  }
})

// 组件卸载时销毁图表实例
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})
</script>
<style lang='scss' scoped>
.chartWH {
  width: 100%;
  height: 100%;
}
</style>
