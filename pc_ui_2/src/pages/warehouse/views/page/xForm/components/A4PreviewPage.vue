/**
Created by  lanjian   on 2022/1/5  11:34
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<!--A4纸张-->
<template>
  <div
    v-if="ready"
    ref="A4page"
    :class="{'A4_page_grid':showGridVis, 'A4_page_preview': true}"
    :style="pagePropData?pagePropLocal:pageStyle"
  >
    <common-form-component
      v-for="(item, index) in componentArr"
      :key="index"
      :data="item"
    />
  </div>
</template>

<script>
import CommonFormComponent from './commonFormComponent.vue'
import bus from '../util/bus'
import { useXFormStore } from '@/store/xForm'
export default {
  name: 'A4PreviewPage',
  components: { CommonFormComponent },
  props: ['componentArr', 'infoData', 'pagePropData', 'showGridVis'], // infoData 为数据回填的详情 pagePropData为表单样式,传入的
  data() {
    return {
      // 提交的值 更加字段和值一一对应
      submitValue: [],
      ready: false,
      pagePropLocal: ''
    }
  },
  computed: {
    pageProp() {
      const store = useXFormStore()
      return store.pageProp
    },
    pageStyle: function() {
      return {
        ...this.pageProp.style,
        ...{ 'width': this.pageProp.style['width'] + 'mm', 'height': this.pageProp.style['height'] + 'mm',
          'border-width': this.pageProp.style['borderWidth'] + 'px'
        }
      }
    }
  },
  watch: {
    infoData() {
      // 处理数据回填
      this.handlerInfoData()
    }
  },
  created() {
    // 用事件暴露出去提交的内容
    bus.$on('submit_xForm', this.submit)
    bus.$on('valueChange', this.valueChange)
    // 处理数据回填
    this.handlerInfoData()
    // 处理样式
    this.initStyle()
    // 获取所有的主表字段来判断提交的类型
  },
  unmounted() {
    bus.$off('submit_xForm', this.submit)
    bus.$off('valueChange', this.valueChange)
  },
  mounted() {
  },
  methods: {
    // 数据回填
    handlerInfoData() {
      this.componentArr.forEach(item => {
        if (this.infoData) {
          if (item.other.field && this.infoData[item.other.field]) {
            item.other.fieldValue = this.infoData[item.other.field]
          }
        }
        // if (item.__config__) {
        //   if (item.__config__.defaultValue) {
        //     item.other.fieldValue = item.__config__.defaultValue
        //   }
        // } else {
        //   if (this.infoData) {
        //     if (item.other.field && this.infoData[item.other.field]) {
        //       item.other.fieldValue = this.infoData[item.other.field]
        //     }
        //   }
        // }
      })
      this.ready = true
    },
    initStyle() {
      if (this.pagePropData) {
        this.pagePropLocal = {
          ...this.pagePropData.style,
          ...{ 'width': this.pagePropData.style['width'] + 'mm', 'height': this.pagePropData.style['height'] + 'mm' }
        }
      }
    },
    submit() {
      // 提交 需要将没有变动的数据也提交，只要不是填的
      let arr = []
      this.componentArr.forEach(item => {
        if (item.other.field) {
          let index = this.submitValue.findIndex(itd => { return item.id === itd.id })
          if (index === -1) {
            arr.push({ id: item.id, field: item.other.field, fieldValue: item.other.fieldValue, name: item.other.name,
              required: item.other.required, placeholder2: item.other.placeholder2, fieldType: item.other.fieldType || 'string' })
          }
        }
      })
      arr = [...arr, ...this.submitValue]
      // 检测必填的字段是否都必填了
      let requiredCheck = arr.some(item => {
        if (item.required && !item.fieldValue) {
          ElMessage({
            message: item.placeholder2 || '必填项不能为空',
            type: 'warning'
          })
          return true
        } else if (item.fieldValue && item.fieldValue.length === 0) {
          ElMessage({
            message: item.placeholder2 || '必填项不能为空',
            type: 'warning'
          })
          return true
        } else {
          return false
        }
      })
      if (requiredCheck) {
        return
      }
      // 按主表类型的转换后返回
      arr.forEach(item => {
        try {
          // 根据fileType类型做处理
          switch (item.fieldType) {
            case 'integer':
              item.fieldValue = parseInt(item.fieldValue); break
            case 'float':
              item.fieldValue = parseFloat(item.fieldValue); break
            case 'boolean':
              item.fieldValue = item.fieldValue === 'true'; break
            default:
              // 如果是 item.fieldValue 字符串类型就不转换
              if (typeof item.fieldValue !== 'string') {
                item.fieldValue = JSON.stringify(item.fieldValue); break
              }
          }
        } catch (error) {
          console.error('转换类型失败', error, item)
        }
      })
      console.log('提交数据', arr)
      this.$emit('submit', arr)
    },

    valueChange({ id, field, fieldValue, name }) {
      let index = this.submitValue.findIndex(item => { return id === item.id })
      let tempObj = {}
      // 将必填 必填的提示语加入提交值
      if (id) {
        let index = this.componentArr.findIndex(itd => { return id === itd.id })
        let tmp = this.componentArr[index]
        tempObj = { required: tmp.other.required, placeholder2: tmp.other.placeholder2, fieldType: tmp.other.fieldType || 'string' }
      }
      if (index !== -1) {
        this.submitValue[index] = { id, field, fieldValue, name, ...tempObj }
      } else {
        this.submitValue.push({ id, field, fieldValue, name, ...tempObj })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .A4_page_preview {
    width: 210mm;
    height: 297mm;
    overflow: auto;
    background: #fff;
    position: relative;
    transform: scale(1);
    margin: 4px auto;
    /* box-shadow: 0 0 15px 0 rgb(0 0 0 / 10%); */
  }

  .A4_page_preview .common_form_container {
    cursor: default;
  }

  .A4_page_grid {
    background-image: linear-gradient(to right, #f0f0f0 1px, transparent 1px),
    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
    background-size: 5mm 5mm;
  }

</style>
