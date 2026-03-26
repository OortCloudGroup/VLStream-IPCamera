/**
Created by  lanjian   on 2022/2/18  15:26
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="container">
    <div class="input_label text" :style="{...fontStyle, ...labelAlgin}">
      <span v-if="data.other.required" style="color:red;">*</span>
      <span :style="labelStyle" style="padding: 0 4px">{{ data.other.content?data.other.content: '文本' }}</span>
    </div>
    <div class="input_container">
      <input
        v-if="data.other.type === 1"
        ref="input"
        :value="data.other.fieldValue"
        :style="style"
        :placeholder="data.other.placeholder?data.other.placeholder:'请输入'"
        class="inputC"
        :disabled="data.other.disabled"
        @input="valueChange"
      />
      <textarea
        v-else
        ref="input"
        :placeholder="data.other.placeholder?data.other.placeholder:'请输入'"
        :style="style"
        :value="data.other.fieldValue"
        class="inputC"
        :disabled="data.other.disabled"
        @input="valueChange"
      />
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'

export default {
  name: 'InputC',
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
  mounted() {
    if (this.data.other.fieldValue) {
      this.$refs.input.value = this.data.other.fieldValue
    }
  },
  methods: {
    valueChange() {
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

  .input_container {
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1;
  }

  .input_container  input{
    outline: none; /* 移除轮廓线 */
    box-shadow: none; /* 移除阴影 */
  }

  .input_container  input:disabled{
    cursor: not-allowed!important;
    background-color: #ddd!important;
    opacity: 0.5;
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

  .inputC {
    font-size: 14px;
    color: #C0C4CC;
    width: 100%;
    /* background: #F7F7F7; */
    /* border: #F7F7F7; */
    /* outline-color: #666; */
    background: #FFFFFF;
    border: 1px solid rgba(215,218,226,1);
    border-radius: 4px;
    padding-left: 17px;
    box-sizing: border-box;
  }

</style>
