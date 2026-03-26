/**
Created by  lanjian   on 2022/2/19  16:04
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
          :ref="'radio'+index"
          :key="index + item.value"
          type="radio"
          class="cinput"
          :name="'radio'+data.id"
          :disabled="data.other.disabled"
          :value="item.value"
          @change="valueChange(item)"
        />
        <label :key="index+item.label" :style="fontStyle" class="label_text" :for="item.value">{{ item.label }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'

export default {
  name: 'RadioC',
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
    fontStyle: function() {
      return { ...{ 'font-size': this.data.style['font-size'] + 'px' },
        ...{ 'font-style': this.data.style['font-style'] + 'px' },
        ...{ 'color': this.data.style['color'] },
        ...{ 'font-weight': this.data.style['font-weight'] }}
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
      return { 'justify-content': this.data.style['label-justify-content'], 'width': this.data.style['label-width'] + 'px',
        'background': this.data.style['background-color'] }
    }
  },
  created() {
  },
  mounted() {
    // 单选框的回填
    if (this.data.other.fieldValue) {
      let index = this.data.other.options.findIndex(item => { return item.value === this.data.other.fieldValue })
      if (index !== -1) {
        this.$refs['radio' + index][0].checked = true
      }
    }
  },
  methods: {
    valueChange(data) {
      bus.$emit('valueChange', {
        // 根据id 找到
        id: this.data.id,
        field: this.data.other.field || data.label,
        fieldValue: data.value,
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

  .radio_container {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-start;
    flex: 1;
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
