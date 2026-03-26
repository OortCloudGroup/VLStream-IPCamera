/**
Created by  lanjian   on 2023/3/10  9:45
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div
    ref="CFC"
    class="common_form_container"
    :style="containerStyle"
    :class="{common_form_active_other:isActiveBox}"
    @mousedown.stop="containerMousedown"
    @click.stop="componetClick"
  >
    <div v-if="isEditor" :class="{'active_pointer':isActiveBox}" class="handler first" :style="firstPosition" />
    <!--    <div v-if="isEditor" class="handler second" :style="secondPosition" />-->
    <div v-if="isEditor" :class="{'active_pointer':isActiveBox}" class="handler third" :style="thirdPosition" />
    <!--    动态组件根据选择的对象-->
    <component
      :is="currentComponent"
      :data="data"
      :width="width"
      :height="height"
      :is-editor="isEditor"
      :path="path"
    />
  </div>
</template>

<script>
import LineC from '../formComponent/lineC.vue'
import { kebabCase } from 'loadsh'
import bus from '../util/bus'
import { getLineElementPath } from '../util/formUtils'
export default {
  name: 'OtherCommonFormComponent',
  components: { LineC },
  props: {
    data: {
      type: Object,
      default: null
    },
    activeIdArr: {
      type: Array,
      default: function() { return [] }
    },
    isEditor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      width: 20,
      height: 20,
      mouseXStart: 0,
      mouseYStart: 0,
      mousePointType: '',
      currentComponent: null,
      isActiveBox: false,
      correctionNum: 5, // 边界距离
      firstLeft: 0,
      firstTop: 0,
      thirdLeft: 20,
      thirdTop: 20,
      originFirstLeft: 0,
      originFirstTop: 0,
      originThirdLeft: 0,
      originThirdTop: 0,
      path: ''
    }
  },
  computed: {
    // 计算属性，改变组件外部容器的样式
    containerStyle: function() {
      let newStyleObj = {}
      if (this.data.containerStyle) {
        for (let key in this.data.containerStyle) {
          newStyleObj[kebabCase(key)] = this.data.containerStyle[key]
        }
      }
      newStyleObj.left = this.left + 'px'
      newStyleObj.top = this.top + 'px'
      newStyleObj.width = this.width + 'px'
      newStyleObj.height = this.height + 'px'
      return newStyleObj
    },
    firstPosition: function() {
      return { 'left': this.firstLeft + 'px', 'top': this.firstTop + 'px', position: 'fixed' }
    },
    thirdPosition: function() {
      return { 'left': this.thirdLeft + 'px', 'top': this.thirdTop + 'px', position: 'fixed' }
    }
  },
  watch: {
    activeIdArr() {
      this.isActiveBox = this.activeIdArr.includes(this.data.id)
    },
    watch: {
      data() {
        this.initPostionAndSize()
      }
    }
  },
  created() {
    this.initCurrentC()
    if (this.isEditor) {
      bus.$on('updateComponentPS', this.initPostionAndSize)
    }
  },
  mounted() {
    if (!this.data.left) {
      this.left = this.data.clientX - this.$refs.CFC.getBoundingClientRect().width / 2
      this.top = this.data.clientY - this.$refs.CFC.getBoundingClientRect().height / 2
      // 第一次拖拉进来 更新下位置
      this.mouseUp()
    } else {
      this.left = this.data.left
      this.top = this.data.top
    }
    this.initCurrentC()
  },
  methods: {
    initCurrentC() {
      this.isActiveBox = this.activeIdArr.includes(this.data.id)
      switch (this.data.type) {
        case 'line': this.currentComponent = LineC; break
        default: break
      }
      // 初始组件的大小
      this.width = this.data.width
      this.height = this.data.height

      // 开始的位置
      if (this.data.other.reverse) {
        this.firstLeft = this.left + this.width
        this.firstTop = this.top
        this.originFirstLeft = this.left + this.width
        this.originFirstTop = this.top
        this.thirdLeft = this.left
        this.thirdTop = this.top + this.height
        this.originThirdLeft = this.thirdLeft
        this.originThirdTop = this.thirdTop
      } else {
        this.firstLeft = this.left
        this.firstTop = this.top
        this.originFirstLeft = this.left
        this.originFirstTop = this.top
        this.thirdLeft = this.left + this.width
        this.thirdTop = this.top + this.height
        this.originThirdLeft = this.thirdLeft
        this.originThirdTop = this.thirdTop
      }
      if (this.data.other && this.data.other.path) {
        this.path = this.data.other.path
      } else {
        this.genratePath()
      }
    },
    initPostionAndSize() {
      this.left = this.data.left
      this.top = this.data.top
      this.width = this.data.width
      this.height = this.data.height
    },
    componetClick() {
      if (this.isEditor) {
        bus.$emit('activeComponentType', { data: this.data.id })
      }
    },
    containerMousedown(e) {
      if (this.isEditor) {
        bus.$emit('activeComponentType', { data: this.data.id, e })
      }
      let isContainerMouseDown = true
      this.mouseDown(e)
      document.onmousemove = e => {
        if (!isContainerMouseDown) return
        this.mouseMove(e)
      }
      document.onmouseup = e => {
        if (!isContainerMouseDown) return
        this.mouseUp(e)
        isContainerMouseDown = false
      }
    },
    mouseMove(e) {
      if (!this.isActiveBox) {
        return
      }
      // 左右大小变化
      switch (this.mousePointType) {
        // 右
        case 'first':
          this.firstLeft = this.originFirstLeft + e.clientX - this.mouseXStart
          this.firstTop = this.originFirstTop + e.clientY - this.mouseYStart
          break
        case 'third':
          this.thirdLeft = this.originThirdLeft + e.clientX - this.mouseXStart
          this.thirdTop = this.originThirdTop + e.clientY - this.mouseYStart
          break
        default:
          break
      }
      if (this.mousePointType) {
        this.width = Math.max(20, Math.abs(this.firstLeft - this.thirdLeft))
        this.height = Math.max(20, Math.abs(this.firstTop - this.thirdTop))
        this.left = Math.min(this.firstLeft, this.thirdLeft)
        this.top = Math.min(this.firstTop, this.thirdTop)
      }
      if (!this.mousePointType) {
        this.left += (e.clientX - this.mouseXStart)
        this.top += (e.clientY - this.mouseYStart)
        this.firstLeft += (e.clientX - this.mouseXStart)
        this.firstTop += (e.clientY - this.mouseYStart)
        this.thirdLeft += (e.clientX - this.mouseXStart)
        this.thirdTop += (e.clientY - this.mouseYStart)

        this.mouseXStart = e.clientX
        this.mouseYStart = e.clientY
        let { inBound, left, top } = this.checkLimitBound()
        if (!inBound && left) {
          this.left = left
        }
        if (!inBound && top) {
          this.top = top
        }
      }
      this.genratePath()
    },
    mouseDown(e) {
      this.mouseXStart = e.clientX
      this.mouseYStart = e.clientY
      if (e.target.className && e.target.className.includes && (e.target.className + '').includes('handler')) {
        let classArr = e.target.className.split(' ')
        classArr.pop()
        this.mousePointType = classArr.pop()
      } else {
        this.mousePointType = ''
      }
    },
    mouseUp(e) {
      this.mousePointType = ''
      // 更新位置，大小数据 (移动组件或者改变组件大小结束后触发)

      // 保存 左对角线
      let reverse = (this.firstLeft > this.thirdLeft && this.firstTop < this.thirdTop) ||
        (this.firstLeft < this.thirdLeft && this.firstTop > this.thirdTop)

      this.isActiveBox && bus.$emit('updateComponentData', { id: this.data.id,
        width: this.width, height: this.height, top: this.top, left: this.left,
        other: { ...this.data.other, ...{ path: this.path, reverse: reverse }}
      })
      // 记录移动后的位置
      if (e) {
        this.mouseXStart = e.clientX
        this.mouseYStart = e.clientY

        this.originFirstLeft = this.firstLeft
        this.originFirstTop = this.firstTop

        this.originThirdLeft = this.thirdLeft
        this.originThirdTop = this.thirdTop
      }
    },
    // 生成path
    genratePath() {
      let pathArr = {
        start: [0, 0], // 开始的x y
        mid: [0, 0], // 开始的x y
        end: [this.width, this.height] // 结束点
      }
      let reverse = (this.firstLeft > this.thirdLeft && this.firstTop < this.thirdTop) ||
        (this.firstLeft < this.thirdLeft && this.firstTop > this.thirdTop)
      if (reverse) {
        pathArr = {
          start: [this.width, 0], // 开始的x y
          mid: [0, 0], // 开始的x y
          end: [0, this.height] // 结束点
        }
      }
      // 如果上下点相等
      if (Math.abs(this.firstLeft - this.thirdLeft) <= 10) {
        pathArr = {
          start: [0, 0], // 开始的x y
          mid: [0, 0], // 开始的x y
          end: [0, this.height] // 结束点
        }
      }
      // 如果上下点相等
      if (Math.abs(this.firstTop - this.thirdTop) <= 10) {
        pathArr = {
          start: [0, 0], // 开始的x y
          mid: [0, 0], // 开始的x y
          end: [this.width, 0] // 结束点
        }
      }
      // console.log('结束点---', width || this.width, height || this.height)
      this.path = getLineElementPath(pathArr, false)
    },

    // 检测组件是否在画布里面
    checkLimitBound() {
      if (!this.$refs.CFC) return { inBound: true }
      let pageLeft = this.$refs.CFC.parentElement.getBoundingClientRect().left
      let pageTop = this.$refs.CFC.parentElement.getBoundingClientRect().top
      let pageRight = this.$refs.CFC.parentElement.getBoundingClientRect().right
      let pageBottom = this.$refs.CFC.parentElement.getBoundingClientRect().bottom
      let compLeft = this.$refs.CFC.getBoundingClientRect().left
      let compTop = this.$refs.CFC.getBoundingClientRect().top
      let compRight = this.$refs.CFC.getBoundingClientRect().right
      let compBottom = this.$refs.CFC.getBoundingClientRect().bottom

      if (pageLeft < compLeft && pageTop < compTop && pageRight > compRight && pageBottom > compBottom) {
        return { inBound: true }
      } else {
        // 返回具体是那一条边界越界了， 设置越界为固定值
        let tempObj = {
          inBound: false,
          left: undefined,
          top: undefined
        }
        if (pageLeft >= compLeft) {
          tempObj.left = pageLeft - compLeft + this.correctionNum
        }
        if (pageTop >= compTop) {
          tempObj.top = pageTop - compTop + this.correctionNum
        }
        if (pageRight <= compRight) {
          tempObj.left = this.$refs.CFC.parentElement.getBoundingClientRect().width - this.$refs.CFC.getBoundingClientRect().width - this.correctionNum
        }
        if (pageBottom <= compBottom) {
          tempObj.top = this.$refs.CFC.parentElement.getBoundingClientRect().height - this.$refs.CFC.getBoundingClientRect().height - this.correctionNum
        }
        return tempObj
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .common_form_container {
    position: absolute;
    cursor: move;
    user-select: none;
    z-index: 1;
    display: flex;
    border: 0px solid #999;
  }
  .common_form_active_other {
    border: 0.1px dashed #faf8d6;
  }

  .overlay_c {
    width: 100%;
    height: 100%;
    cursor: move;
    user-select: none;
    position: absolute;
    left: 0;
    top: 0;
  }

  .control_point{
    position: absolute;
    box-sizing: border-box;
    display: inline-block;
    background: #fff;
    border: 1px solid #c0c5cf;
    box-shadow: 0 0 2px 0 rgba(86, 90, 98, .2);
    border-radius: 3px;
    padding: 3px;
    margin-top: -4px !important;
    margin-left: -4px !important;
    user-select: none;   // 注意禁止鼠标选中控制点元素，不然拖拽事件可能会因此被中断
  }
  .draggingDive {
    display: none;
  }

  .active_pointer {
    display: flex!important;
  }

  .handler {
    display: none;
    position: absolute;
    width: 16px;
    height: 16px;
    left: 0;
    top: 0;
    margin: -8px 0 0 -8px;
    border: 1px solid #d14424;
    background-color: #fff;
    border-radius: 1px;
    cursor: pointer;
  }

</style>
