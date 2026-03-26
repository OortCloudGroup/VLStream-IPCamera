/**
Created by  lanjian   on 2024/3/30  17:25
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <comm-echarts
    class="chartWH"
    :full-options="fullPtions"
  />
</template>
<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue'
import CommEcharts from '@/components/Echarts/commEcharts.vue'

const props = defineProps(['data', 'dataset', 'rate'])
const fullPtions = ref({})
const optionData = {
  testOption() {
    const option = {
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
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
      dataset: {
        dimensions: props.dataset,
        source: props.data
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0, // 显示所有标签
          rotate: props.rate // 旋转标签，避免重叠
        }
        // data: ['一', '二', '三', '四', '五', '六', '日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          // data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barWidth: 22,
          itemStyle: {
            color: '#4246FF'
          }
        }
      ]
    }
    return option
  }
}
watch(() => props.data, () => {
  fullPtions.value = optionData.testOption()
})
onMounted(() => {
  fullPtions.value = optionData.testOption()
})
</script>

<style lang="scss" scoped>
.chartWH {
  width: 100%;
  height: 100%;
}
</style>
