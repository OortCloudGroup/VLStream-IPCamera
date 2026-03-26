/**
Created by 唐林 on 2021/12/30  17:09
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="d_body">
    <div class="d_body_form">
      <el-form ref="info" label-position="left" label-width="120" :model="info">
        <el-form-item required label="列名" style="width: 93%">
          <el-input v-model="info.field" disabled placeholder="请输入 (字母开头的字母数字的10位字符串)" />
        </el-form-item>
        <el-form-item required label="列描述" style="width: 93%">
          <el-input v-model="info.name" placeholder="请输入 " />
        </el-form-item>
        <el-form-item label="列长度" style="width: 93%">
          <el-input v-model.number="info.length" placeholder="请输入" />
        </el-form-item>
        <el-form-item required label="列类型" style="width: 93%">
          <el-select v-model="info.type" placeholder="请选择" style="width: 100%">
            <el-option label="整数" value="integer" />
            <el-option label="字符串" value="text" />
            <el-option label="二进制" value="blob" />
            <el-option label="浮点数字" value="real" />
            <el-option label="时间" value="datetime" />
          </el-select>
        </el-form-item>
        <el-form-item label="提示名称" style="width: 93%">
          <el-input v-model="info.dictName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关联提示信息" class="form_item" style="width: 93%">
          <el-input v-model.number="info.dictID" placeholder="请输入" />
          <div class="tips">
            <span>提示：关联提示信息 生效于text类型</span>
          </div>
        </el-form-item>
        <el-form-item label="时间格式化样式" class="form_item" style="width: 93%">
          <el-input v-model.number="info.datetimeFormat" placeholder="请输入 例如：YYYY-MM-DD HH:mm:ss" />
          <div class="tips">
            <span>提示： 例如: YYYY-MM-DD HH:mm:ss时间格式化样式,生效于datetime类型 YY:年的简称  M:月的简称 D:日的简称 H:时的简称  m:分的简称  s:秒的简称</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
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
import { ckmtFieldAdd, ckmtFieldAll, ckmtFieldEdit, ckmtFieldInfo } from '@/api/warehouse'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
export default {
  name: 'CreateOrEditFiled',
  props: ['field'],
  data() {
    return {
      info: {
        field: '',
        name: '',
        length: 0,
        type: '',
        dictName: '',
        dictID: 0,
        datetimeFormat: ''
      },
      isEdit: false
    }
  },
  watch: {
    field() {
      this.init()
    }
  },

  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.field) {
        this.info.field = this.field
        this.isEdit = true
        this.getInfo()
      } else {
        // 获取一个字段
        this.getAllField()
      }
    },
    closeDialog() {
      this.$emit('close')
    },
    getAllField() {
      const params = {
        accessToken: useUserStore().token,
        status: 2
      }
      ckmtFieldAll(params).then(res => {
        if (res.code === 200) {
          if (res.data && res.data.list && res.data.list.length > 0) {
            this.info.field = res.data.list[0].field
          } else {
            ElMessageBox('当前无可用的字段，请联系管理员', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.$emit('close')
              }
            })
          }
        }
      })
    },
    getInfo() {
      const params = {
        accessToken: useUserStore().token,
        field: this.info.field
      }
      ckmtFieldInfo(params).then(res => {
        if (res.code === 200) {
          this.info = res.data
        }
      })
    },
    submit() {
      if (!this.info.field) {
        ElMessage({
          message: '请输入列名',
          position: 'bottom-right',
          type: 'warning'
        })
        return
      }
      if (!this.info.name) {
        ElMessage({
          message: '请输入列描述',
          position: 'bottom-right',
          type: 'warning'
        })
        return
      }
      if (!this.info.type) {
        ElMessage({
          message: '请选择列类型',
          position: 'bottom-right',
          type: 'warning'
        })
        return
      }
      const params = {
        accessToken: useUserStore().token,
        ...this.info
      }
      if (!this.isEdit) {
        ckmtFieldAdd(params).then(res => {
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
        params.id = this.id
        ckmtFieldEdit(params).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
    .d_body {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .d_body_form {
      height: calc(100% - 48px);
      width: 100%;
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
