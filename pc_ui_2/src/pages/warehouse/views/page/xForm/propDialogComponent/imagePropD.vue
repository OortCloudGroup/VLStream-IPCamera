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
        <span>图片</span>
      </div>
      <div class="prop_group_item">
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 上传图片 </span>
          <div class="prop_group_item_content">
            <el-upload
              :show-file-list="false"
              :on-success="handSuccess"
              :action="upfileURL"
              :headers="headers"
              size="small"
            >
              <el-button size="small" type="primary">
                点击上传
              </el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </template>
            </el-upload>
          </div>
        </div>
        <div class="prop_group_item1">
          <span class="prop_group_item_title"> 图片地址 </span>
          <div class="prop_group_item_content long_input" style="width:100%;">
            <el-input v-model="other.src" style="margin-left:5px" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab ===2">
      <advance-info :field="other.field" @change="updateField" />
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'
import CommonPropc from './commonPropc.vue'
import CommonBasicInfo from './commonBasicInfo.vue'
import Config from '@/config/index'
import AdvanceInfo from './advanceInfo.vue'
import { useUserStore } from '@/store/modules/user'
export default {
  name: 'ImagePropD',
  components: { CommonBasicInfo, CommonPropc, AdvanceInfo },
  props: ['propData'],
  data() {
    return {
      other: {
        src: ''
      },
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      containerStyle: {},
      style: {
        backgroundColor: '#333',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundImage: ''
      },
      activeTab: 0,
      headers: {},
      upfileURL: Config.URL + Config.gateWay + 'oortcloud-fastdfsservice/fastdfs/v1/uploadFile'
    }
  },
  watch: {
    propData() {
      // 初始化style和组件相关的属性
      this.initProp()
    }
  },
  created() {
    this.headers = {
      ...Config.headers,
      accessToken: useUserStore().token
    }
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
      this.other.fieldType = data.type
      // 更新对应字段，修改显示label
      // this.other.content = data.name
    },
    handSuccess(res) {
      if (res.code === 200) {
        this.other.src = res.data.url
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
      this.other = { ...this.other, ...this.propData.other }
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

.long_input .el-input__inner{
    width: 200px;
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
      background: #FAFAFA;
      border: 1px solid rgba(198,203,212,1);
      border-radius: 2px;
    }
  }
}
</style>

