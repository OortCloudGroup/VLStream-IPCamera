/**
Created by  lanjian   on 2022/11/28  11:24
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<!--页面属性的设置-->
<template>
  <div>
    <div class="prop_content">
      <div class="prop">
        <div class="tabs">
          <div class="tabs_item" :class="{'tabs_item_active':activeTab ===1}" @click="tabClick(1)">
            <span>样式</span>
          </div>
          <div class="tabs_item" :class="{'tabs_item_active':activeTab ===2}" @click="tabClick(2)">
            <span>高级</span>
          </div>
        </div>
        <div v-if="activeTab === 1" class="prop_group">
          <div style="height: 20px" />
          <div class="prop_group_title">
            <span>大小属性</span>
          </div>
          <div class="prop_group_item">
            <div class="prop_group_item1">
              <span class="prop_group_item_title">高度</span>
              <div class="prop_group_item_content">
                <el-input-number v-model.number="style.height" controls-position="left" :min="50" :max="297" style="width: 100%" placeholder="请输入" />
                <span>mm</span>
              </div>
            </div>
            <div class="prop_group_item1">
              <span class="prop_group_item_title">宽度</span>
              <div class="prop_group_item_content">
                <el-input-number v-model="style.width" controls-position="left" :min="50" :max="210" style="width: 100%" placeholder="请输入" />
                <span>mm</span>
              </div>
            </div>
          </div>
          <div class="prop_group_title">
            <span>背景</span>
          </div>
          <div class="prop_group_item">
            <div class="prop_group_item1">
              <span class="prop_group_item_title"> 背景颜色 </span>
              <div class="prop_group_item_content">
                <el-color-picker v-model="style.backgroundColor" />
              </div>
            </div>
          </div>
          <div class="prop_group_title">
            <span>边框</span>
          </div>
          <div class="prop_group_item">
            <div class="prop_group_item1">
              <span class="prop_group_item_title">大小</span>
              <div class="prop_group_item_content">
                <el-input-number v-model="style.borderWidth" controls-position="right" />
              </div>
            </div>
            <div class="prop_group_item1">
              <span class="prop_group_item_title"> 颜色 </span>
              <div class="prop_group_item_content">
                <el-color-picker v-model="style.borderColor" />
              </div>
            </div>
          </div>
          <div class="prop_group_item">
            <div class="prop_group_item1">
              <span class="prop_group_item_title">样式</span>
              <div class="prop_group_item_content">
                <el-select v-model="style.borderStyle" :popper-append-to-body="false" placeholder="请选择">
                  <el-option label="实线" value="solid" />
                  <el-option label="圆点" value="dotted" />
                  <el-option label="虚线" value="dashed" />
                  <el-option label="双实线条" value="double" />
                </el-select>
              </div>
            </div>
            <div class="prop_group_item1" />
          </div>
        </div>
      </div>
    </div>
    <div class="dialog_bottom">
      <div class="dialog_bottom_btn">
        <div @click="confirmPropData(1)">
          <span>应用</span>
        </div>
        <div @click="closeDialog">
          <span>取消</span>
        </div>
        <div @click="confirmPropData(2)">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'
import { useXFormStore } from '@/store/xForm'
export default {
  name: 'PagePropDialog',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      style: {
        width: 210,
        height: 297,
        backgroundColor: '#fff',
        // backgroundSize: '',
        // backgroundRepeat: '',
        // backgroundImage: ''
        borderWidth: 1,
        borderColor: '#fff',
        borderStyle: 'solid'
      },
      activeTab: 1
      // upfileURL: Config.URL + 'oort/oortcloud-fastdfsservice/fastdfs/v1/uploadFile'
    }
  },
  watch: {
    data() {
      // 初始化style和组件相关的属性
      this.initProp()
    }
  },
  created() {
    bus.$on('updatePropData', this.updatePropData)
    // 初始化style和组件相关的属性
    this.initProp()
  },
  unmounted() {
    bus.$off('updatePropData', this.updatePropData)
  },
  methods: {
    tabClick(index) {
      this.activeTab = index
    },
    initProp() {
      if (this.data && this.data.style) {
        this.style = { ...this.style, ...this.data.style }
      }
    },
    updatePropData() {

    },
    closeDialog() {
      this.$emit('close')
    },
    confirmPropData(flag) {
      let copyData = { ...this.data }
      copyData.style = this.style
      useXFormStore().SET_PAGE_PROP(copyData)
      flag === 2 && this.$emit('close')
    }

  }
}
</script>

<style lang="scss">

  .prop_dialog {
    .el-dialog {
      margin-top: 10vh!important;
      background: #FFFFFF!important;
      box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.3);
      border-radius: 2px;
      height: 80vh;
    }

    .data_dialog .el-dialog {
      margin-top: 5vh!important;
      height: 90vh;
    }

    .el-dialog__header {
      background: #F7F7F7!important;
    }

    .el-dialog__title {
      font-size: 18px;
      color: #333333!important;
      letter-spacing: 0;
      font-weight: 600;
    }

    .el-dialog__close {
      font-size: 48px;
    }

    .el-dialog__headerbtn {
      top: 4px
    }

    .el-dialog__body {
      width: 100%;
      height: calc(100% - 0.48rem - 0.48rem);
    }
    .el-select-dropdown {
      background: #fff!important;
    }

    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background: #fff!important;
    }

    .el-select-dropdown__item .selected .hover {
      background: #f5f7fa!important;
      color: #606266!important;
    }
    .el-select-dropdown__item:hover {
      background: #f5f7fa!important;
      color: #606266!important;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

</style>

<style lang="scss" scoped>
  .prop_content {
    height: 600px;
    width: 97%;
    overflow: auto;
  }

  .dialog_bottom {
    margin: 0.08rem 0;
    height: 80px;
    width: 97%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    &_btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      div {
        cursor: pointer;
        margin: 0 16px;
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
      div:nth-of-type(1) {
        background: #fff;
        border-radius: 2px;
        border: 0.5px solid #5176B5;
        span {
          color:#5176B5;
        }
      }
      div:nth-of-type(2) {
        background: #DDE4F1;
        border-radius: 2px;
        span {
          color:#5176B5;
        }
      }
      div:nth-of-type(3) {
        background: #5176B5;
        border-radius: 2px;
        span {
          color:#fff;
        }
      }
    }
  }

  .prop {
    height: 100%;
    width: 100%;
  }

  .tabs {
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    &_item {
      width: 140px;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      span {
        font-size: 18px;
        color: #999;
      }
    }
    &_item_active {
      background-color: #f0f0f0;
      border-bottom: 2px solid #5176B5;
      span {
        color: #5176B5;
      }
    }
  }

  .prop_group {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 60px);
    &_title {
      height: 32px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #5176B5;
      line-height: 20px;
      font-weight: 600;
    }

    &_item {
      display: flex;
      flex-direction: row;
      height: 48px;
      align-items: center;
      // width: 80%;
      margin: 12px 0;
      &_title {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #333333;
        width:70px;
        margin-right: 32px;
        font-family: MicrosoftYaHeiSemibold;
        font-size: 14px;
        color: #333333;
        font-weight: 600;
      }
      &_content {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: row;
      }
    }

    &_item1 {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-color-picker{
      width: 200px;
      box-sizing: border-box;
       ::v-deep.el-color-picker__trigger{
        position: relative;
        width: 100%;
        padding-right: 34px;
      }
       ::v-deep.el-color-picker__icon{
        position: absolute;
        left: 91%;
      }
    }
    .el-input-number{
      width: 200px;
       ::v-deep.el-input-number__decrease, ::v-deep.el-input-number__increase{
        display: none;
      }
       ::v-deep.el-input__inner{
        font-size: 14px;
        text-align: left;
        // padding-right: 15px;
        background: #FAFAFA;
        border: 1px solid rgba(198,203,212,1);
        border-radius: 2px;
      }
       ::v-deep.el-input{
        position: relative;
        &::after{
          content: 'px';
          position: absolute;
          top: 50%;
          right: 8px;
          font-size: 14px;
          color: #C6CBD5;
          transform: translate(0,-56%);
        }
      }
    }
  }
</style>
