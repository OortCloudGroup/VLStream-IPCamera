/**
Created by  lanjian   on 2022/2/22  11:22
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="container">
    <div class="input_label text" :style="{...fontStyle, ...labelAlgin}">
      <span v-if="data.other.required" style="color:red;">*</span>
      <span :style="labelStyle" style="padding: 0 4px">{{ data.other.content?data.other.content: '文本' }}</span>
    </div>
    <div class="radio_container" :style="style">
      <div v-for="(item, index) in data.other.options" :key="index" :style="alginStyle" class="template_class">
        <input
          :id="item.value"
          :ref="'checkbox'+index"
          :key="index + item.value"
          type="checkbox"
          :name="'radio'+data.id"
          :value="item.value"
          :disabled="data.other.disabled"
          class="cinput"
          @change="(e)=>valueChange(e, item)"
        />
        <label :key="index+item.label" :style="fontStyle" class="label_text" :for="item.value">{{ item.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'

export default {
  name: 'CheckboxC',
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
      checkedArr: []
    }
  },
  computed: {
    style: function() {
      return { ...this.data.style, ...{ 'font-size': this.data.style['font-size'] + 'px' },
        ...{ 'border-width': this.data.style['border-width'] + 'px' }}
    },
    fontStyle: function() {
      return { ...{ 'font-size': this.data.style['font-size'] + 'px' },
        ...{ 'font-style': this.data.style['font-style'] + 'px' },
        ...{ 'color': this.data.style['color'] },
        ...{ 'font-weight': this.data.style['font-weight'], 'background': this.data.style['background-color'] }}
    },
    alginStyle: function() {
      if (this.data.style.flexDirection === 'row') {
        return 'align-items: flex-start'
      } else {
        return 'align-items: center'
      }
    },

    labelStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px',
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'] }
    },
    labelAlgin: function() {
      return { 'justify-content': this.data.style['label-justify-content'], 'width': this.data.style['label-width'] + 'px' }
    }
  },
  mounted() {
    // 多选框的回填
    if (this.data.other.fieldValue) {
      try {
        // 判断是否数组还是字符串
        if (typeof this.data.other.fieldValue === 'string') {
          this.checkedArr = JSON.parse(this.data.other.fieldValue)
        } else {
          this.checkedArr = this.data.other.fieldValue
        }
        this.checkedArr.forEach(itd => {
          let index = this.data.other.options.findIndex(item => { return item.value === itd.value })
          if (index !== -1) {
            this.$refs['checkbox' + index][0].checked = true
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  },
  methods: {
    valueChange(e, data) {
      if (e.target.checked) {
        let index = this.data.other.options.findIndex(item => {
          return item.label === data.label
        })
        if (index !== -1) {
          this.checkedArr.push(this.data.other.options[index])
        }
      } else {
        let index = this.checkedArr.findIndex(item => {
          return item.label === data.label
        })
        if (index !== -1) {
          this.checkedArr.splice(index)
        }
      }
      bus.$emit('valueChange', {
        // 根据id 找到
        id: this.data.id,
        field: this.data.other.field,
        fieldValue: JSON.stringify(this.checkedArr),
        name: this.data.other.name })
    }
  }
}
</script>

<style lang="scss" scoped>

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
    }
    .radio_container  input{
      outline: none; /* 移除轮廓线 */
      box-shadow: none; /* 移除阴影 */
    }

    .radio_container  input:disabled{
      cursor: not-allowed!important;
      background-color: #ddd!important;
      opacity: 0.5;
    }

    .radio_container {
      flex: 1;
      display: flex;
      width: 100%;
      height: 100%;
      /* align-items: flex-start; */
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

    .label_text {
      margin: 0 4px;
      font-size: 14px;
      color: #606266;
    }

    .template_class {
      margin: 5px;
      display: flex;
      flex: 1;
      align-items: flex-start;
      flex-direction: row;
      justify-content: flex-start;
    }
    .cinput {
      width: 14px;
      height: 14px;
    }
    .label_text {
      flex: 1;
    }
</style>
