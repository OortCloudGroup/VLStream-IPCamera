<template>
  <comm-echarts
    id="statusEcharts"
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
      legend: {
        orient: 'vertical',
        bottom: '20%',
        right: '2%',
        textStyle: { // 图例文字的样式
          color: '#000',
          fontSize: 12
        }
      },
      tooltip: {
        trigger: 'item'
      },
      // dataset: {
      //   dimensions: props.dataset,
      //   source: props.data
      // },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'], // 饼图的半径
          center: ['30%', '50%'], // 调整饼图位置
          avoidLabelOverlap: false,
          color: ['#0CAF60', '#0062FF', '#FFD023', '#FF8725', '#713FDE', '#49BEBD', '#64737F'],
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
          data: [
            { value: 1048, name: '云课堂二维码' },
            { value: 580, name: '登录二维码' },
            { value: 735, name: '网址二维码' },
            { value: 1048, name: '注册二维码' },
            { value: 735, name: '微投票二维码' },
            { value: 1048, name: '课程学习二维码' },
            { value: 735, name: '其他' }
          ]
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
