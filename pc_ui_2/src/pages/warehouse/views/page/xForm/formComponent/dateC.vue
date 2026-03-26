/**
Created by  lanjian   on 2022/2/18  15:26
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="date_container">
    <div class="input_label text" :style="{...fontStyle, ...labelAlgin}">
      <span :style="labelStyle" style="padding: 0 4px">{{ data.other.content?data.other.content: '日期' }}</span>
    </div>
    <!--   为了方便样式这里使用一个div，点击唤起el-date-picker的显示-->
    <div class="input_container">
      <div class="text_container" :style="style" @click="showDatePicker">
        <span class="text" :style="fontStyle">
          {{ data.other.nowDate? dateFormat :'选择日期' }}
        </span>
      </div>
      <el-date-picker
        ref="elDatePicker"
        v-model="defaultDate"
        class="el_date_picker"
        style="width: 0;height: 0;overflow: hidden"
        type="date"
        @change="valueChange"
      />
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import bus from '../util/bus'
export default {
  name: 'DateC',
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
      defaultDate: ''
    }
  },
  // 计算属性来处理style中有单位的 px
  computed: {
    style: function() {
      return { ...this.data.style, ...{ 'font-size': this.data.style['font-size'] + 'px' },
        ...{ 'transform': 'rotate(' + this.data.style['transform'] + 'deg)' }
      }
    },
    fontStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px', 'font-weight': this.data.style['font-weight'],
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'], 'background': this.data.style['background-color'] }
    },
    labelStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px',
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'] }
    },
    labelAlgin: function() {
      return { 'justify-content': this.data.style['label-justify-content'], 'width': this.data.style['label-width'] + 'px' }
    },
    dateFormat: function() {
      if (this.defaultDate) {
        return format(new Date(this.defaultDate), this.data.other.valueFormat)
      } else {
        return format(new Date(this.data.other.nowDate), this.data.other.valueFormat)
      }
    }
  },
  watch: {
    // data() {
    //   console.log('date-----8---', this.data)
    // }
  },
  created() {
    // this.defaultDate = this.data.other.nowDate
  },
  mounted() {
    if (this.data.other.fieldValue) {
      this.defaultDate = this.data.other.fieldValue
    }
  },
  methods: {
    showDatePicker() {
      this.$refs.elDatePicker.focus()
    },
    valueChange() {
      bus.$emit('valueChange', {
        // 根据id 找到
        id: this.data.id,
        field: this.data.other.field,
        fieldValue: format(this.defaultDate, this.data.other.valueFormat),
        name: this.data.other.name })
    }
  }

}
</script>

<style scoped lang="scss">
  .el_date_picker {
    position: relative;
    z-index: 0;
  }
  .z_index_input {
    z-index: 99;
  }
  .input_label {
    display: flex;
    align-items: center;
    width: 80px;
  }
  .input_container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .text_container {
    width: 100%;
    height: 100%;
    display: flex;
    border: 1px solid rgba(215,218,226,1);
    border-radius: 4px;
    padding-left: 17px;
    box-sizing: border-box;
    background: #FFFFFF;
    align-items: center;
  }
  .date_container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    /* //position: relative;
    //align-items: center;
    // ::v-deep.el-input__inner{
    //  background: #FFFFFF;
    //  border: 1px solid rgba(220,223,230,1);
    //} */
  }
  .text {
    font-size: 14px;
    color: #C0C4CC;
    background: #fff;
  }
  .text_C {
    font-size: 14px;
    color: #C0C4CC;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
