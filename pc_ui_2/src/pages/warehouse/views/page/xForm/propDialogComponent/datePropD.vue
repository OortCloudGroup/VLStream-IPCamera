/**
Created by  lanjian   on 2022/3/2  11:42
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
        <span>文本样式</span>
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
          <span class="prop_group_item_title"> 颜色 </span>
          <div class="prop_group_item_content">
            <el-color-picker v-model="style.color" />
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
          <span class="prop_group_item_title">文本样式</span>
          <div class="prop_group_item_content">
            <el-select v-model="style.fontStyle" placeholder="请选择">
              <el-option label="正常" value="normal" />
              <el-option label="斜体" value="italic" />
            </el-select>
          </div>
        </div>
      </div>

      <div class="prop_group_title">
        <span>输入框线条</span>
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
              <el-option label="无" value="none" />
              <el-option label="圆点" value="dotted" />
              <el-option label="虚线" value="dashed" />
              <el-option label="实线" value="dotted" />
              <el-option label="双实现" value="double" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="prop_group_title">
        <span>输入框</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 框背景色 </span>
          <div class="prop_group_item_content">
            <el-color-picker v-model="style.backgroundColor" />
          </div>
        </div>
      </div>
      <div class="prop_group_title">
        <span>label设置</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">label宽度</span>
          <div class="prop_group_item_content">
            <el-input-number v-model="style.labelWidth" controls-position="right" />
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title">对齐</span>
          <div class="prop_group_item_content">
            <el-select v-model="style.labelJustifyContent" :popper-append-to-body="false" placeholder="请选择">
              <el-option label="左对齐" value="left" />
              <el-option label="居中" value="center" />
              <el-option label="右对齐" value="right" />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 2" class="prop_group">
      <advance-info :field="other.field" @change="updateField" />
      <div class="prop_group_title">
        <span>label设置</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">label文本</span>
          <div class="prop_group_item_content">
            <el-input v-model="other.content" placeholder="请输入内容" />
          </div>
        </div>
      </div>
      <div class="prop_group_title">
        <span>日期设置</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 初始值 </span>
          <div class="prop_group_item_content">
            <el-date-picker
              v-model="other.nowDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </div>
        </div>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 最大值 </span>
          <div class="prop_group_item_content">
            <el-date-picker
              v-model="other.max"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 最小值 </span>
          <div class="prop_group_item_content">
            <el-date-picker
              v-model="other.min"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </div>
        </div>
      </div>
      <!--      <div class="prop_group_title">-->
      <!--        <span>显示格式</span>-->
      <!--      </div>-->
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">显示类型</span>
          <div class="prop_group_item_content">
            <el-select v-model="other.dateType" :popper-append-to-body="false" placeholder="请选择">
              <el-option label="日" value="date" />
              <el-option label="周" value="week" />
              <el-option label="月" value="month" />
              <el-option label="年" value="year" />
            </el-select>
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title">显示格式</span>
          <div class="prop_group_item_content">
            <el-select v-model="other.valueFormat" :popper-append-to-body="false" placeholder="请选择">
              <el-option label="yyyy-MM-dd" value="yyyy-MM-dd" />
              <el-option label="yyyy/MM/dd" value="yyyy/MM/dd" />
              <el-option label="MM-dd" value="MM-dd" />
              <el-option label="MM/dd" value="MM/dd" />
              <el-option label="yyyy-MM" value="yyyy-MM" />
              <el-option label="yyyy/MM" value="yyyy/MM" />
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'
import CommonPropc from './commonPropc.vue'
import CommonBasicInfo from './commonBasicInfo.vue'
import { format } from 'date-fns'
import AdvanceInfo from './advanceInfo.vue'
export default {
  name: 'DatePropD',
  components: { AdvanceInfo, CommonBasicInfo, CommonPropc },
  props: ['propData'],
  data() {
    return {
      other: {
        content: '',
        placeholder: '请选择日期',
        isShowDefault: true,
        options: [],
        valueFormat: 'yyyy-MM-dd',
        dateType: 'date',
        min: '1990-01-01',
        max: '2024-01-01',
        nowDate: format(new Date(), 'yyyy-MM-dd')
      },
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      containerStyle: {},
      style: {
        labelWidth: 80,
        labelJustifyContent: 'left',
        backgroundColor: '',
        borderWidth: 2,
        borderColor: '',
        borderStyle: '',
        color: '',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 300
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
    // 初始化style和组件相关的属性
    this.initProp()
  },
  unmounted() {
    bus.$off('updatePropData', this.updatePropData)
  },
  methods: {
    updateField(data) {
      this.other.field = data.field
      // 更新对应字段，修改显示label
      this.other.content = data.name
    },
    addOptions() {
      this.other.options.push({ label: '', value: '' })
    },
    removeOptions(index) {
      this.other.options.splice(index, 1)
    },
    tabClick(index) {
      this.activeTab = index
    },
    updatePosition(data) {
      this.position = data.position
      this.containerStyle = data.containerStyle
    },
    initProp() {
      this.other = { ...this.other, ... this.propData.other }
      // 避免覆盖undefined 覆盖原有的默认值
      this.style = { ...this.style, ...this.propData.style }
      this.position = {
        left: this.propData.left,
        top: this.propData.top,
        width: this.propData.width,
        height: this.propData.height
      }
      this.containerStyle = { ...this.containerStyle, ...this.propData.containerStyle }
    },
    updatePropData() {
      // console.log(this.other)
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
}

.add_class {
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    cursor: pointer;
    font-size: 16px;
    color: #5176B5;
  }
}

.remove_class {
  height: 48px;
  width: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 18px;
  span {
    cursor: pointer;
    font-size: 16px;
    color: #5176B5;
  }
}

.el-color-picker{
  width: 200px;
  box-sizing: border-box;
   ::v-deep.el-color-picker__trigger{
    position: relative;
    width: 100%;
    padding-right: 34px;
  }
   ::v-deep.el-icon-close{
    position: absolute;
    left: 111%;
  }
   ::v-deep.el-color-picker__icon{
    position: absolute;
    left: 91%;
  }
}
.content_deg{
   ::v-deep.el-input{
    &::after{
      content: '度'!important;
    }
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

</style>

