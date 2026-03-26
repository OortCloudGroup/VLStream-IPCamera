<template>
  <comm-echarts
    id="lineEcharts"
    class="chartWH"
    :full-options="fullPtions"
  />
</template>
<script lang='ts' setup>
import CommEcharts from '@/components/Echarts/commEcharts.vue'
import { onMounted, ref, watch } from 'vue'

const props = defineProps(['data', 'dataset'])
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
        color: ['#0CAF60'],
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        data: ['2时', '4时', '6时', '8时', '10时', '12时', '14时', '16时', '18时', '20时', '22时', '24时']
      },
      yAxis: {
        // 最小值设置
        splitNumber: 1,
        type: 'value'
      },
      // dataset: {
      //   dimensions: props.dataset,
      //   source: props.data
      // },
      series: [
        {
          type: 'line',
          data: [150, 230, 224, 218, 135, 147, 260, 230, 224, 218, 135, 147],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          itemStyle: {
            color: '#0CAF60'
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
<style lang='scss' scoped>
.chartWH {
  width: 100%;
  height: 100%;
}
</style>
