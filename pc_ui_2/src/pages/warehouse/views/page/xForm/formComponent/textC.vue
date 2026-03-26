/**
Created by  lanjian   on 2022/2/18  15:26
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="text_container">
    <span class="text" :style="style">{{ data.other.content?data.other.content: '文本' }}</span>
  </div>
</template>

<script>
export default {
  name: 'TextC',
  props: {
    data: {
      type: Object,
      required: true
    },
    isEditor: { // // 判断是否在编辑状态
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  // 计算属性来处理style中有单位的 px
  computed: {
    style: function() {
      return { ...this.data.style, ...{ 'font-size': this.data.style['font-size'] + 'px' },
        ...{ 'transform': 'rotate(' + this.data.style['transform'] + 'deg)' }
      }
    }
  },
  watch: {
    data() {
      // console.log('changet-----8', this.style)
    }
  },
  methods: {

  }

}
</script>

<style scoped>
  .text_container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    text-align: justify;
    pointer-events: none;
  }
  .text {
    width: 100%;
    font-size: 14px;
    color: #606266;
    white-space: break-spaces;
  }
</style>
