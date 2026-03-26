/**
Created by  lanjian   on 2022/2/18  15:26
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="container">
    <div class="input_label text" :style="{...fontStyle, ...labelAlgin}">
      <span v-if="data.other.required" style="color:red;">*</span>
      <span :style="labelStyle" style="padding: 0 4px">{{ data.other.content?data.other.content: '文本' }}</span>
    </div>
    <div class="input_container">
      <form enctype="multipart/form-data">
        <input
          v-if="data.other.type === 1"
          ref="input"
          :style="style"
          :placeholder="data.other.placeholder?data.other.placeholder:'请输入'"
          class="inputC"
          type="file"
          name="file"
          :accept="data.other.accept?data.other.accept:'image/*'"
          :disabled="data.other.disabled"
          @input="valueChange"
        />
      </form>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'
import { request } from '@/utils/service'
import { useUserStore } from '@/store/modules/user'
import config from '@/config/index'

export default {
  name: 'UploadC',
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
    labelStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px',
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'] }
    },
    fontStyle: function() {
      return { 'font-size': this.data.style['font-size'] + 'px', 'font-weight': this.data.style['font-weight'],
        'font-style': this.data.style['font-style'], 'color': this.data.style['color'], 'background': this.data.style['background-color'] }
    },
    labelAlgin: function() {
      return { 'justify-content': this.data.style['label-justify-content'], 'width': this.data.style['label-width'] + 'px' }
    }
  },
  mounted() {
    if (this.data.other.fieldValue) {
      // this.$refs.input.value = this.data.other.fieldValue
    }
  },
  methods: {
    valueChange(e) {
      const resultFile = e.target.files // input 获取的文件列表
      // 判断上传的文件大小是否超过500k
      if (resultFile[0].size > 500 * 1024) {
        ElMessage({
          message: '上传文件大小不能超过500k',
          type: 'warning'
        })
        return
      }
      // const aBlob = new Blob([resultFile[0]], { type: this.data.other.accept ? this.data.other.accept : 'image/*' }) // 指定转换成blob的类型
      // console.log(aBlob)

      let formData = new FormData()
      formData.append('accessToken', useUserStore().token)
      formData.append('img_file', resultFile[0])
      // http上传图片
      request({
        url: config.URL + config.gateWay + 'oortcloud-warehouse' + '/api/v1/files.upload',
        // url: config.URL + '/api/v1/files.upload',
        method: 'POST',
        data: formData
      }).then(res => {
        if (res.code === 200) {
          bus.$emit('valueChange', {
            // 根据id 找到
            id: this.data.id,
            field: this.data.other.field,
            fieldValue: res.data.pic_id || res.data,
            name: this.data.other.name })
        }
      })
      // const reader = new FileReader() // 3 新建 FileReader 对象,用于操作文件
      // // console.log(`reader`, reader)
      // reader.onload = (ev) => {
      //   const base64Url = ev.target.result // 5 base64内容
      //   bus.$emit('valueChange', {
      //   // 根据id 找到
      //     id: this.data.id,
      //     field: this.data.other.field,
      //     fieldValue: base64Url,
      //     name: this.data.other.name })
      // }
      // reader.readAsDataURL(aBlob) // 4 将文件转换成指定类型的数据
    }
  }
}
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .input_container {
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1;
  }

  .input_container  input{
    outline: none; /* 移除轮廓线 */
    box-shadow: none; /* 移除阴影 */
  }

  .input_container  input:disabled{
    cursor: not-allowed!important;
    background-color: #ddd!important;
    opacity: 0.5;
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

  .inputC {
    font-size: 14px;
    color: #C0C4CC;
    width: 100%;
    /* background: #F7F7F7; */
    /* border: #F7F7F7; */
    /* outline-color: #666; */
    background: #FFFFFF;
    border: 1px solid rgba(215,218,226,1);
    border-radius: 4px;
    padding-left: 17px;
    box-sizing: border-box;
  }

</style>
