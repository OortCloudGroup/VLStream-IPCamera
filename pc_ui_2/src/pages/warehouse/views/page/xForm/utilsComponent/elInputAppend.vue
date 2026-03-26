/**
Created by  lanjian   on 2022/3/3  11:48
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <el-input-number
    v-model.number="fontSize"
    style="width: 100%"
    controls-position="right"
    placeholder="请输入"
    :min="1"
    :max="50"
    @input="emitValueC"
  />
</template>

<script>
export default {
  name: 'ElInputAppend',
  props: {
    value: {
      type: String
    },
    append: {
      type: String
    }
  },

  data() {
    return {
      fontSize: ''
    }
  },
  methods: {
    emitValueC() {
      this.$emit('input', this.fontSize + '' + this.append)
    }
  }

}
</script>

<style scoped>

</style>
