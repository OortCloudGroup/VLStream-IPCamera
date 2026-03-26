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
    </div>
    <div v-if="activeTab === 2" class="prop_group">
      <div style="height: 20px" />
      <div class="prop_group_title">
        <span>上传地址</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">上传地址</span>
          <div class="prop_group_item_content">
            <el-input v-model="other.uploadUrl" placeholder="请输入文件上传地址" />
          </div>
        </div>
      </div>
      <div class="prop_group_title">
        <span>上传选项</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title">文件限制</span>
          <div class="prop_group_item_content">
            <el-input v-model="other.accept" placeholder="文件上传限制 例如： .apk  表示只能上传文件结尾apk，空为全部" />
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 是否多选 </span>
          <div class="prop_group_item_content">
            <el-checkbox v-model="other.multiple">
              多选
            </el-checkbox>
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
export default {
  name: 'FilePropD',
  components: { CommonBasicInfo, CommonPropc },
  props: ['propData'],
  data() {
    return {
      other: {
        multiple: false,
        accept: '',
        uploadUrl: 'Config.URL + \'oort/oortcloud-fastdfsservice/fastdfs/v1/uploadFile\''
      },
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      containerStyle: {},
      style: {
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
    handSuccess(res) {
      if (res.code === 200) {
        this.style.backgroundImage = 'url(' + res.data.url + ')'
      } else {
        this.$notify({
          message: '上传失败!',
          position: 'bottom-right',
          type: 'error'
        })
      }
    },
    tabClick(index) {
      this.activeTab = index
    },
    updatePosition(data) {
      this.position = data.position
      this.containerStyle = data.containerStyle
    },
    initProp() {
      this.other = this.propData.other
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
    font-size: 16px;
    color: #5176B5;
    line-height: 20px;
    display: flex;
    align-items: center;
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
      width:70px;
      font-weight: 600;
      font-size: 14px;
      color: #333333;
      margin-right: 32px;
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
}
</style>

