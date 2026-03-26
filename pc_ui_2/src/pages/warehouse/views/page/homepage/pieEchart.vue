<template>
  <comm-echarts
    class="chartWH"
    :full-options="fullPtions"
  />
</template>
<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue'
import CommEcharts from '@/components/Echarts/commEcharts.vue'

const props = defineProps(['data', 'dataset'])
const fullPtions = ref({})
const optionData = {
  testOption() {
    const option = {
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
      dataset: {
        dimensions: props.dataset,
        source: props.data
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'], // 饼图的半径
          center: ['50%', '30%'], // 调整饼图位置
          avoidLabelOverlap: false,
          color: ['#4246FF', '#0CAF60', '#FFD023', '#FF8725', '#E3E3E3'],
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
          }
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
