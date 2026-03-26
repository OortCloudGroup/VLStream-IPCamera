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
    id="barEcharts"
    class="chartWH"
    :full-options="fullPtions"
  />
</template>
<script lang='ts' setup>
import CommEcharts from '@/components/Echarts/commEcharts.vue'
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary')
// const props = defineProps(['data', 'dataset', 'unit'])
// 定义 props
const props = defineProps({
  dataset: {
    type: Array,
    required: true
  },
  unit: {
    type: String,
    default: '次'
  },
  data: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['click'])
const fullPtions = ref({})
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
        bottom: '15%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      dataZoom: [{
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: props.dataset && props.dataset.length > 5 ? Math.ceil(5 / props.dataset.length * 100) : 100,
        height: 10,
        bottom: '2%',
        borderColor: 'transparent',
        backgroundColor: '#f5f5f5',
        fillerColor: 'rgba(24, 144, 255, 0.2)',
        handleStyle: {
          color: primaryColor
        }
      }, {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: props.dataset && props.dataset.length > 5 ? Math.ceil(5 / props.dataset.length * 100) : 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: false
      }],
      xAxis: {
        type: 'category',
        axisLine: {
          show: false// 不展示坐标轴
        },
        axisTick: {
          show: false// 不展示刻度
        },
        splitLine: {
          show: false // 不显示分割线
        },
        data: props.dataset
      },
      yAxis: {
        show: true,
        // 最小值设置
        // splitNumber: 1,
        type: 'value'
      },
      dataset: {
        dimensions: props.dataset,
        source: props.data
      },
      series: [
        {
          type: 'bar',
          position: 'right',
          barWidth: '20%',
          itemStyle: {
            color: primaryColor
          },
          data: props.data || [0, 0, 0, 0],
          label: {
            show: true,
            position: 'right',
            itemStyle: { // 数值样式
              color: '#111827', // 字体颜色
              fontSize: 12// 字体大小
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

watch(() => props.dataset, () => {
  fullPtions.value = optionData.testOption()
})
watch(() => props.data, () => {
  fullPtions.value = optionData.testOption()
})
watch(() => props.unit, () => {
  fullPtions.value = optionData.testOption()
})

onMounted(() => {
  fullPtions.value = optionData.testOption()
  // 为图表添加点击事件监听器
  const chart = document.getElementById('barEcharts')
  if (chart) {
    const echartsInstance = echarts.getInstanceByDom(chart)
    if (echartsInstance) {
      echartsInstance.on('click', handleChartClick)
    }
  }
})
</script>
<style lang='scss' scoped>
.chartWH {
  width: 100%;
  height: 100%;
}
</style>
