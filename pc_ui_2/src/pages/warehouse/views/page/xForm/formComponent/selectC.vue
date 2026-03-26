/**
Created by  lanjian   on 2022/2/19  15:39
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="container">
    <div class="input_label text" :style="{...fontStyle, ...labelAlgin}">
      <span :style="labelStyle" style="padding: 0 4px">{{ data.other.content?data.other.content: '文本' }}</span>
    </div>
    <div class="selecte_container">
      <select ref="input" :style="style" class="select" @change="valueChange">
        <option v-if="data.other.isShowDefault" value="">
          {{ data.other.placeholder?data.other.placeholder:'请选择' }}
        </option>
        <option
          v-for="(item, index) in data.other.options"
          :key="index"
          :value="item.value"
        >
          {{ item.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'

export default {
  name: 'SelectC',
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
    return {
    }
  },
  computed: {
    style: function() {
      return { ...this.data.style, ...{ 'font-size': this.data.style['font-size'] + 'px' },
        ...{ 'border-width': this.data.style['border-width'] + 'px' }}
    },
    labelStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px',
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'] }
    },
    fontStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px', 'font-weight': this.data.style['font-weight'],
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'], 'background': this.data.style['background-color'] }
    },
    labelAlgin: function() {
      return { 'justify-content': this.data.style['label-justify-content'], 'width': this.data.style['label-width'] + 'px' }
    }
  },
  methods: {
    valueChange() {
      console.log('select-提交的值---', this.$refs.input.value)
      bus.$emit('valueChange', {
        // 根据id 找到
        id: this.data.id,
        field: this.data.other.field,
        fieldValue: this.$refs.input.value,
        name: this.data.other.name })
    }
  }
}
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .selecte_container {
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1;
  }
  .input_label {
    display: flex;
    align-items: center;
    width: 80px;
  }

  .text {
    font-size: 14px;
    color: #C0C4CC;
    background: #fff;
  }

  .select {
    width: 100%;
    font-size: 14px;
    color: #C0C4CC;
    padding-left: 16px;
    box-sizing: border-box;
    border: 1px solid rgba(220,223,230,1);
    border-radius: 4px;
  }
</style>
