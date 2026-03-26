/**
Created by  lanjian   on 2022/3/1  16:01
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div>
    <div class="prop_content">
      <component
        :is="currentPropDialogC"
        :key="copyData.id"
        :prop-data="copyData"
        @getPropsData="getPropsData"
      />
    </div>
    <div class="dialog_bottom">
      <div class="dialog_bottom_left">
        <el-checkbox v-model="resetOtherStyle">
          样式作用于所有的同类型组件
        </el-checkbox>
      </div>
      <div class="dialog_bottom_btn">
        <div @click="closeDialog">
          <span>取消</span>
        </div>
        <div @click="confirmPropData">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextPropD from '../propDialogComponent/textPropD.vue'
import CheckBoxPropD from '../propDialogComponent/checkBoxPropD.vue'
import FilePropD from '../propDialogComponent/filePropD.vue'
import ImagePropD from '../propDialogComponent/imagePropD.vue'
import LinePropD from '../propDialogComponent/linePropD.vue'
import RadioPropD from '../propDialogComponent/radioPropD.vue'
import RancglePropD from '../propDialogComponent/rancglePropD.vue'
import SelectPropD from '../propDialogComponent/selectPropD.vue'
import InputPropD from '../propDialogComponent/inputPropD.vue'
import DatePropD from '../propDialogComponent/datePropD.vue'
import UploadPropD from '../propDialogComponent/uploadPropD.vue'
import bus from '../util/bus'
import { kebabCase, camelCase } from 'loadsh'
import { shallowRef } from 'vue'
export default {
  name: 'PropDialog',
  components: {
    InputPropD,
    SelectPropD,
    RancglePropD,
    RadioPropD,
    LinePropD,
    ImagePropD,
    FilePropD,
    CheckBoxPropD,
    TextPropD,
    DatePropD,
    UploadPropD
  },
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentPropDialogC: null,
      copyData: {}, // 复制的data 以方便修改
      resetOtherStyle: false // 样式作用于所有的同类型组件
    }
  },
  watch: {
    data() {
      this.initPropDialog()
    }
  },
  created() {
    this.initPropDialog()
  },
  methods: {
    closeDialog() {
      this.$emit('close', { data: 0 })
    },
    // 确定修改的属性
    confirmPropData() {
      // 处理style为样式对象
      bus.$emit('updatePropData')
      this.closeDialog()
    },
    getPropsData(data) {
      // 需要将对象形式的样式对象转换成 - 的形式 ；例如： fontSize => font-size
      let newStyleObj = {}
      for (let key in data.style) {
        newStyleObj[kebabCase(key)] = data.style[key]
      }
      data.style = newStyleObj
      // 盒子样式
      let containerStyle = {}
      for (let key in data.containerStyle) {
        containerStyle[kebabCase(key)] = data.containerStyle[key]
      }
      data.containerStyle = containerStyle
      if (!this.resetOtherStyle) {
        this.$emit('close', { data: data })
      } else {
        this.$emit('close', { data: data,
          resetOtherStyle: this.resetOtherStyle, style: { style: newStyleObj, containerStyle: containerStyle }})
      }
    },
    initPropData() {
      this.copyData = JSON.parse(JSON.stringify(this.data))
      // 将style的短划线修改为驼峰命名的方式
      let newStyleObj = {}
      for (let key in this.data.style) {
        newStyleObj[camelCase(key)] = this.data.style[key]
      }
      this.copyData.style = newStyleObj
      // 将style的短划线修改为驼峰命名的方式
      let containerStyle = {}
      for (let key in this.data.containerStyle) {
        containerStyle[camelCase(key)] = this.data.containerStyle[key]
      }
      this.copyData.containerStyle = containerStyle
    },
    initPropDialog() {
      if (!this.data) {
        return
      }
      this.initPropData()
      switch (this.data.type) {
        case 'rancgle': this.currentPropDialogC = shallowRef(RancglePropD); break
        case 'text': this.currentPropDialogC = shallowRef(TextPropD); break
        case 'input': this.currentPropDialogC = shallowRef(InputPropD); break
        case 'line': this.currentPropDialogC = shallowRef(LinePropD); break
        case 'select': this.currentPropDialogC = shallowRef(SelectPropD); break
        case 'radio': this.currentPropDialogC = shallowRef(RadioPropD); break
        case 'checkbox': this.currentPropDialogC = shallowRef(CheckBoxPropD); break
        case 'file': this.currentPropDialogC = shallowRef(FilePropD); break
        case 'image':this.currentPropDialogC = shallowRef(ImagePropD); break
        case 'date': this.currentPropDialogC = shallowRef(DatePropD); break
        case 'upload': this.currentPropDialogC = shallowRef(UploadPropD); break
        default: break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
   ::v-deep .el-input-number__decrease {
      background: #fff;
      color: #333;
      font-weight: bold;
      i {
        color: #333;
      }
  }
   ::v-deep .el-input-number__increase {
    background: #fff;
    color: #333;
    font-weight: bold;
    i {
      color: #333;
    }
  }

   ::v-deep.el-checkbox__inner {
    background: #fff;
  }

   ::v-deep.el-checkbox__input.is-checked .el-checkbox__inner {
    background: #fff;
  }

  .prop_content {
    flex: 1;
    min-height: 600px;
    width: 97%;
    overflow: auto;
    overflow-x: hidden;
  }

  .dialog_bottom {
      margin: 10px 0;
      height: 68px;
      width: 97%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &_btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        div {
          cursor: pointer;
          // margin: 0 16px;
          width: 170px;
          height: 48px;
          background: #DDE4F1;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            font-size: 16px;
            color: #5176B5 ;
          }
        }
        div:nth-of-type(2) {
          background: #5176B5;
          border-radius: 2px;
          span {
            color:#fff;
          }
        }
      }
      &_left{
        display: flex;
        align-items: center;
      }
    }
</style>
