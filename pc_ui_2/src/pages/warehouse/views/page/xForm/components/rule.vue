/**
Created by  lanjian   on 2022/1/5  10:09
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div ref="rules" class="form_rules">
    <div class="form_horizontal" :style="'left:'+ left + 'px;width:'+ width +'px;'">
      <svg height="100%" width="100%">
        <path :d="path" stroke="#333" stroke-width="0.8" fill="none" />
        <text x="0" y="22" fill="#666" style="font-size: 10px">0</text>
        <text v-for="item in 100" :key="item" :x="item*5*5 -2" y="22" fill="#666" style="font-size: 10px">{{ Math.ceil(item * 5 *1.4) }}</text>
      </svg>
    </div>
    <div class="form_vertical" :style="'left:'+ (left - 50) +'px;top:'+ top + 'px;height:'+ height +'px;'">
      <svg height="100%" width="100%">
        <path :d="path2" stroke="#333" stroke-width="0.8" fill="none" />
        <text x="16" y="8" fill="#666" style="font-size: 10px">0</text>
        <text v-for="item in 100" :key="item" x="16" :y="item*5*5 + 4" fill="#666" style="font-size: 10px">{{ Math.ceil(item * 5 *1.4) }}</text>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rule',
  props: ['scale'],
  data() {
    return {
      path: '',
      path2: '',
      left: 0,
      top: 0,
      width: 0,
      height: 0
    }
  },
  watch: {
    scale() {
      this.calcPosition()
    }
  },
  created() {
    this.getPath()
  },
  mounted() {
    this.calcPosition()
  },
  methods: {
    getPath() {
      let p = ''
      let split = 0
      for (let i = 0; i < 1000; i++) {
        let x = (i * 5 + 1)
        split = i % 5 === 0 ? split = i % 10 === 0 ? ' 12 ' : ' 8 ' : ' 5 '
        p += 'M' + x + ' 0 L' + x + split
      }
      this.path = p
      let p2 = ''
      for (let i = 0; i < 1000; i++) {
        let x = (i * 5 + 1)
        split = i % 5 === 0 ? split = i % 10 === 0 ? '12 ' : '8 ' : '5 '
        p2 += 'M0 ' + x + ' L' + split + x + ' '
      }
      this.path2 = p2
    },
    calcPosition() {
      // 获取当前画布的位置
      let a4pageEl = document.getElementsByClassName('A4_page')[0]
      if (!a4pageEl) return
      this.left = a4pageEl.getBoundingClientRect().left - this.$refs.rules.getBoundingClientRect().left
      this.top = a4pageEl.getBoundingClientRect().top - this.$refs.rules.getBoundingClientRect().top
      this.width = a4pageEl.getBoundingClientRect().width
      this.height = a4pageEl.getBoundingClientRect().height
    }
  }
}
</script>

<style lang="scss" scoped>

  .form_rules {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
    overflow: hidden;
  }
  .form_horizontal {
    width: 100%;
    height: 32px;
    background: #F7F7F7;
    position: absolute;
    left: 16px;
    top: 0;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .form_vertical {
    width: 50px;
    height: 100%;
    background: #F7F7F7;
    position: absolute;
    left: 0px;
    top: 16px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

</style>
