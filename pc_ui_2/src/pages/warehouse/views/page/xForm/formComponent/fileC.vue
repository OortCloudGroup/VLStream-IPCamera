/**
Created by  lanjian   on 2022/2/22  14:45
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <input type="file" :accept="data.other.accept" :multiple="data.other.accept" label="选择" class="inputC" />
</template>

<script>
export default {
  name: 'FileC',
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
  }
}
</script>

<style lang="scss" scoped>

  .inputC {
    font-size: 16px;
    color: #333333;
    width: 100%;
    background: #F7F7F7;
    border: #F7F7F7;
    outline-color: #666;
  }
</style>
