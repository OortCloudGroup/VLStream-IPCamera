/**
Created by  lanjian   on 2022/2/23  10:20
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div :style="style" class="rancglec" />
</template>

<script>
export default {
  name: 'RancgleC',
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
  computed: {
    style: function() {
      return { ...this.data.style, ...{ 'transform': 'rotate(' + this.data.style['transform'] + 'deg)',
        ...{ 'border-width': this.data.style['border-width'] + 'px' }}
      }
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.rancglec {
  width: 100%;
  height: 100%;
}
</style>
