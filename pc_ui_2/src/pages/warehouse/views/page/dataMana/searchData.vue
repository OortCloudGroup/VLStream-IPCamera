/**
Created by 唐林 on 2021/12/30  17:09
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="d_body">
    <div v-if="ready" class="d_body_form">
      <a4-preview-page :info-data="infoData" :component-arr="componentArr" @submit="saveData" />
    </div>
    <el-empty v-else description="当前分类未设置搜索界面" />
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
import { ckmtClassifyInGet } from '@/api/warehouse'
import { useUserStore } from '@/store/modules/user'
import { useXFormStore } from '@/store/xForm'
import { ElMessage } from 'element-plus'

export default {
  name: 'SearchData',
  components: { A4PreviewPage },
  props: ['searchWords', 'ccid'],
  data() {
    return {
      cid: 0,
      componentArr: [],
      infoData: {}, // 数据详情
      ready: false
    }
  },
  watch: {
    searchWords() {
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
      await this.initInterface()
      // 回填查询结果
      this.infoData = {}
      if (this.searchWords) {
        this.searchWords.forEach(item => {
          this.infoData[item.field] = item.fieldValue
        })
      }
    },
    async initInterface() {
      const params = {
        accessToken: useUserStore().token,
        cid: parseInt(this.cid),
        type: 2
      }
      let res = await ckmtClassifyInGet(params)
      if (res.code === 200) {
        // 先获取之前保存的，如果为空则说明没设置过
        if (res.data.templet && res.data.templet.json) {
          this.componentArr = res.data.templet.json
          // 页面属性 数据添加 搜索时
          // 页面属性 数据添加 搜索时
          useXFormStore().SET_PAGE_PROP(
            res.data.templet.pageProp || { style: { width: 210, height: 297, backgroundColor: '#fff' }})
          this.ready = true
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
      let result = []
      data.forEach(item => {
        if (item.fieldValue) {
          result.push(item)
        }
      })
      this.$emit('close', result)
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
