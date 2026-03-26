/**
Created by  lanjian   on 2022/3/2  10:52
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="prop">
    <div class="tabs">
      <div class="tabs_item" :class="{'tabs_item_active':activeTab ===0}" @click="tabClick(0)">
        <span>基础</span>
      </div>
      <div class="tabs_item" :class="{'tabs_item_active':activeTab ===1}" @click="tabClick(1)">
        <span>样式</span>
      </div>
      <div class="tabs_item" :class="{'tabs_item_active':activeTab ===2}" @click="tabClick(2)">
        <span>高级</span>
      </div>
    </div>
    <div v-if="activeTab === 0" class="prop_group">
      <div style="height: 20px" />
      <common-basic-info :data="propData" />
      <div class="prop_group_title">
        <span>文本内容</span>
      </div>
      <div class="prop_group_item">
        <span class="prop_group_item_title">文本</span>
        <div class="prop_group_item_content">
          <el-input v-model="other.content" placeholder="请输入内容" />
        </div>
      </div>
    </div>
    <div v-if="activeTab === 1" class="prop_group">
      <div style="height: 20px" />
      <!--    通用位置属性-->
      <common-propc
        :data="position"
        :container-style="containerStyle"
        @change="updatePosition"
      />
      <div class="prop_group_title">
        <span>文字样式</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">文本样式</span>
          <div class="prop_group_item_content">
            <el-select
              v-model="style.fontStyle"
              :popper-append-to-body="false"
              class="select_dddd"

              placeholder="请选择"
            >
              <el-option label="正常" value="normal" />
              <el-option label="斜体" value="italic" />
            </el-select>
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title">文本修饰</span>
          <div class="prop_group_item_content">
            <el-select v-model="style.textDecorationLine" :popper-append-to-body="false" placeholder="请选择" style="margin-right:5px">
              <el-option label="无" value="" />
              <el-option label="下划线" value="underline" />
              <el-option label="删除线" value="line-through" />
            </el-select>
            <el-color-picker v-model="style.textDecorationColor" />
          </div>
        </div>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 字号 </span>
          <div class="prop_group_item_content">
            <el-input-number v-model="style.fontSize" controls-position="right" />
            <!--          <el-input v-model="style.fontSize"  />-->
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 文本颜色 </span>
          <div class="prop_group_item_content">
            <el-color-picker v-model="style.color" style="width: 100%" />
          </div>
        </div>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">字体粗细</span>
          <div class="prop_group_item_content">
            <el-select v-model="style.fontWeight" :popper-append-to-body="false" placeholder="请选择">
              <el-option label="100" :value="100" />
              <el-option label="200" :value="200" />
              <el-option label="300" :value="300" />
              <el-option label="400" :value="400" />
              <el-option label="500" :value="500" />
              <el-option label="600" :value="600" />
              <el-option label="700" :value="700" />
            </el-select>
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title">对齐方式</span>
          <div class="prop_group_item_content">
            <el-select v-model="style.textAlign" :popper-append-to-body="false" placeholder="请选择">
              <el-option label="左对齐" value="left" />
              <el-option label="居中对齐" value="center" />
              <el-option label="右对齐" value="right" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="prop_group_title">
        <span>旋转</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">角度</span>
          <div class="prop_group_item_content">
            <el-input-number v-model="style.transform" controls-position="right" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 2" class="prop_group">
      <div style="height: 20px" />
      <advance-info :field="other.field" @change="updateField" />
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'
import CommonPropc from './commonPropc.vue'
import CommonBasicInfo from './commonBasicInfo.vue'
import AdvanceInfo from './advanceInfo.vue'

export default {
  name: 'TextPropD',
  components: { AdvanceInfo, CommonBasicInfo, CommonPropc },
  props: ['propData'],
  data() {
    return {
      other: {
        content: ''
      },
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      containerStyle: {},
      style: {
        color: '#333',
        fontSize: 14,
        fontStyle: 'normal',
        textDecorationColor: '#333',
        textDecorationLine: '',
        fontWeight: 400,
        transform: 0,
        textAlign: 'left'
      },
      activeTab: 0
    }
  },
  watch: {
    propData() {
      // 初始化style和组件相关的属性
      this.initProp()
    }
  },
  created() {
    bus.$on('updatePropData', this.updatePropData)
    // console.log('注册了事件')
    // 初始化style和组件相关的属性
    this.initProp()
  },
  unmounted() {
    bus.$off('updatePropData', this.updatePropData)
    // console.log('销毁了事件')
  },
  methods: {
    tabClick(index) {
      this.activeTab = index
    },
    updateField(data) {
      this.other.field = data.field
      this.other.fieldType = data.type
      // 更新对应字段，修改显示label
      this.other.content = data.name
    },
    updatePosition(data) {
      this.position = data.position
      this.containerStyle = data.containerStyle
    },
    initProp() {
      this.other = this.propData.other
      // 避免覆盖undefined 覆盖原有的默认值
      this.style = { ...this.style, ...this.propData.style }
      console.log(this.style.fontSize)
      this.position = {
        left: this.propData.left,
        top: this.propData.top,
        width: this.propData.width,
        height: this.propData.height
      }
      this.containerStyle = { ...this.containerStyle, ...this.propData.containerStyle }
    },
    updatePropData() {
      // 合并传入的和修改的
      this.$emit('getPropsData', { ...this.propData, ...this.position, ...{ style: this.style }, ...{ containerStyle: this.containerStyle }, ...{ other: this.other }})
    }
  }
}
</script>

<style lang="scss">

  .prop_group {
    .el-input__inner  {
      background: #fefeff;
      font-size: 18px;
      color: #333333;
    }
  }

</style>

<style lang="scss" scoped>

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
      // height: 32px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #5176B5;
      line-height: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    &_item {
      display: flex;
      flex-direction: row;
      height: 48px;
      align-items: center;
      // width: 80%;
      // margin: 12px 0;
      margin-bottom: 20px;
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
    .el-select,.el-input{
      width: 200px;
       ::v-deep.el-input__inner{
        font-size: 14px;
        text-align: left;
        // padding-right: 15px;
        background: #FAFAFA;
        border: 1px solid rgba(198,203,212,1);
        border-radius: 2px;
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
