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

const props = defineProps(['data', 'dataset'])
const fullPtions = ref({})
const optionData = {
  testOption() {
    const option = {
      grid: {
        left: '4%',
        right: '10%',
        top: '10%',
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
        show: true,
        type: 'value'
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false// 不展示坐标轴
        },
        axisTick: {
          show: false// 不展示刻度
        },
        splitLine: {
          show: false // 不显示分割线
        }
        // data: ['课程学习二维码', '微投票二维码', '注册二维码', '网址二维码', '登录二维码', '云课堂二维码']
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
            color: function(params) {
              let colorList = [
                '#0CAF60',
                '#FFD023',
                '#0062FF',
                '#FF8635',
                '#6C44D9',
                '#4DBEBD'
              ]
              let colorItem = colorList[params.dataIndex]
              return colorItem
            }
          },
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
