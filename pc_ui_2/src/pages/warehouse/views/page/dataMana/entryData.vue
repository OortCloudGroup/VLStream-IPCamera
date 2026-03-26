/**
Created by lanjian on 2021/12/30  17:09
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="d_body">
    <div v-if="ready" class="d_body_form">
      <a4-preview-page :info-data="infoData" :component-arr="componentArr" @submit="saveData" />
    </div>
    <el-empty v-else description="当前分类未设置录入界面" />
    <div class="d_body_bottom">
      <el-button @click="closeDialog">
        取消
      </el-button>
      <el-button type="primary" @click="submit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import A4PreviewPage from '../xForm/components/A4PreviewPage.vue'
import bus from '../xForm/util/bus'
import { ckmtClassifyInGet, ckmtDataAdd, ckmtDataEdit, ckmtDataInfo } from '@/api/warehouse'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { useXFormStore } from '@/store/xForm'
export default {
  name: 'EntryData',
  components: { A4PreviewPage },
  props: ['data', 'ccid'],
  data() {
    return {
      cid: 0,
      record_id: '0', // id 为 ''时,为新增
      componentArr: [],
      infoData: {}, // 数据详情
      ready: false
    }
  },
  watch: {
    data() {
      this.init()
    },
    ccid() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    async init() {
      this.ready = false
      this.cid = parseInt(this.ccid)
      if (this.data) {
        this.record_id = this.data.record_id
      }
      await this.initInterface()
      if (this.record_id !== '0') {
        await this.getDataInfo()
      }
      this.ready = true
    },
    async getDataInfo() {
      const params = {
        accessToken: useUserStore().token,
        record_id: this.record_id
      }
      let res = await ckmtDataInfo(params)
      if (res.code === 200) {
        this.infoData = res.data
      }
    },
    async initInterface() {
      const params = {
        accessToken: useUserStore().token,
        cid: parseInt(this.cid),
        type: 3
      }
      let res = await ckmtClassifyInGet(params)
      if (res.code === 200) {
        // 先获取之前保存的，如果为空则说明没设置过
        if (res.data.templet && res.data.templet.json) {
          this.componentArr = res.data.templet.json
          // 页面属性 数据添加 搜索时
          useXFormStore().SET_PAGE_PROP(
            res.data.templet.pageProp || { style: { width: 210, height: 297, backgroundColor: '#fff' }})
        } else {
          this.ready = false
        }
      } else {
        ElMessage({
          message: res.msg,
          position: 'bottom-right',
          type: 'error'
        })
      }
    },
    saveData(data) {
      if (this.record_id === '0') {
        const params = {
          accessToken: useUserStore().token,
          cid: parseInt(this.cid)
        }
        let submitData = {}
        data.forEach(item => {
          submitData[item.field] = item.fieldValue
        })
        params.data = submitData
        ckmtDataAdd(params).then(res => {
          if (res.code === 200) {
            ElMessage({
              message: '操作成功!',
              position: 'bottom-right',
              type: 'success'
            })
            this.$emit('close')
          } else {
            ElMessage({
              message: res.msg,
              position: 'bottom-right',
              type: 'error'
            })
          }
        })
      } else {
        const params = {
          accessToken: useUserStore().token,
          cid: parseInt(this.cid),
          record_id: this.record_id
        }
        let submitData = {}
        data.forEach(item => {
          submitData[item.field] = item.fieldValue
        })
        params.data = submitData
        ckmtDataEdit(params).then(res => {
          if (res.code === 200) {
            ElMessage({
              message: '操作成功!',
              position: 'bottom-right',
              type: 'success'
            })
            this.$emit('close')
          } else {
            ElMessage({
              message: res.msg,
              position: 'bottom-right',
              type: 'error'
            })
          }
        })
      }
    },
    submit() {
      bus.$emit('submit_xForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.d_body {
  width: 100%;
  height: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.d_body_form {
  height: calc(100% - 48px);
  width: 100%;
  overflow: auto;
}

.d_body_bottom {
  width: 93%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
}
.tips {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  span{
    text-align: left;
  }
}
</style>
