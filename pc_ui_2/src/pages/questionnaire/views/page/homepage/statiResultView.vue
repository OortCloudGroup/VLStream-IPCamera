<template>
  <div class="graphic_page">
    <div class="showTop flexRowAC">
      <div class="view_title">
        回收趋势
      </div>
      <statice-echart />
    </div>
    <div class="showTop bo1 flexRowAC">
      <div class="showBo1">
        <div class="view_title">
          常用设备
        </div>
        <statice-echart-pie />
      </div>
      <div class="showBo1">
        <div class="view_title">
          常用系统
        </div>
        <statice-echart-pie />
      </div>
      <div class="showBo1">
        <div class="view_title">
          渠道来源
        </div>
        <statice-echart-pie />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { ref } from 'vue'
import StaticeEchart from './staticeEchart.vue'
import StaticeEchartPie from '@/pages/questionnaire/views/page/homepage/staticeEchartPie.vue'

</script>
<style lang="scss" scoped>
.graphic_page {
  height: 100%;
  width: 100%;
}
.view_title{
  position: absolute;
  left: 20px;
  top: 20px;
  color: rgba(61,61,61,1);
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 0px;
  text-align: left;
}
.showTop {
  background-color: #fff;
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
  border-radius: 20px;
  gap: 20px;
  position: relative;
}

.showTop.bo1 {
  background-color: #f7f7f7;
}

.showBo1 {
  background-color: #fff;
  border-radius: 20px;
  flex: 1;
  height: 100%;
  position: relative;
}
</style>
