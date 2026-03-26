<template>
  <div class="graphic_page">
    <div class="showRe">
      <el-checkbox v-model="checked1" label="显示有效问卷统计结果" />
    </div>
    <div class="graBox">
      <div class="gra_title">
        01.选择你所在的位置（单选）
      </div>
      <div class="gra_desc">
        填写率：100% <span>填写量：18</span>
      </div>
      <div class="gra_result flexRowAC">
        <div v-for="(item,i) in resultArr" :key="i" class="w480Bar flexRowAC">
          <div class="w480Bar_w" :style="'width:'+item.w" />
          <div class="w480Bar_cont flexRowAC" :class="{wcolor:parseInt(item.w)<10}">
            {{ item.t }}
            <span>{{ item.n }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="graBox">
      <div class="gra_title">
        02.你认为不错的地方推荐（填空题）
      </div>
      <div class="gra_desc">
        填写率：100% <span>填写量：18</span>
      </div>
    </div>
    <div class="graBox">
      <div class="gra_title">
        03.请为本次活动评分（单选）
      </div>
      <div class="gra_desc">
        填写率：100% <span>填写量：18</span>
      </div>
      <div class="gra_result flexRowAC">
        <div v-for="(item,i) in resultArr" :key="i" class="w480Bar flexRowAC">
          <div class="w480Bar_w" :style="'width:'+item.w" />
          <div class="w480Bar_cont flexRowAC" :class="{wcolor:parseInt(item.w)<10}">
            {{ item.t }}
            <span>{{ item.n }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="graBox">
      <div class="gra_title">
        04.请选择出发时间（日期）
      </div>
      <div class="gra_desc">
        填写率：100% <span>填写量：18</span>
      </div>
      <div class="gra_echart">
        <statice-echart />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import StaticeEchart from './staticeEchart.vue'

const checked1 = ref(true)
let resultArr = ref<any>([])
resultArr.value = [
  { t: '北京', w: '72%', n: '13（72%）' },
  { t: '北京', w: '21%', n: '3（21%）' },
  { t: '北京', w: '11%', n: '3（11%）' },
  { t: '北京', w: '8%', n: '2（8%）' },
  { t: '北京', w: '0%', n: '0（0%）' }
]
</script>
<style lang="scss" scoped>
.graphic_page {
  height: 100%;
  width: 100%;

  .showRe {
    padding-bottom: 20px;
  }
}

.graBox {
  padding-bottom: 50px;

  .gra_title {
    color: rgba(26, 26, 26, 1);
    font-size: 24px;
    text-align: left;
    padding-bottom: 16px;
  }

  .gra_desc {
    color: rgba(113, 128, 150, 1);
    font-size: 16px;
    text-align: left;

    > span {
      padding-left: 30px;
    }
  }

  .gra_result {
    padding-top: 16px;
    gap: 12px;
    align-items: flex-start;
    flex-direction: column;
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
    text-align: right;
  }
}

.w480Bar {
  height: 38px;
  width: 480px;
  border-radius: 4px;
  background-color: #f7f7f7;
  position: relative;

  .w480Bar_w {
    position: absolute;
    height: 38px;
    z-index: 1;
    left: 0;
    top: 0;
    background-color: var(--el-color-primary);
  }

  .w480Bar_cont {
    position: absolute;
    z-index: 2;
    left: 0;
    top: 0;
    padding: 12px;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    color: #fff;

    &.wcolor {
      color: #666;
    }

    > span {
      color: #666;
    }

  }
}
</style>
