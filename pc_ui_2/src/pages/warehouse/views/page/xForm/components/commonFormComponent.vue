/**
Created by  lanjian   on 2022/1/5  15:37
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div
    ref="CFC"
    class="common_form_container"
    :style="containerStyle"
    :class="{'common_form_active': isActiveBox && isShowOverlay}"
    @mousedown.stop="containerMousedown"
    @click="componetClick"
  >
    <template v-for="(item,index) in points" :key="index">
      <div
        v-if="isActiveBox && isShowOverlay"
        :class="'control_point point_' + item"
      />
    </template>

    <!--    使用一个div来填满整个空间，在绘制时候，防止点点击到内部组件 -->
    <div v-if="isShowOverlay" class="overlay_c" :data-id="data.id" />
    <!--    动态组件根据选择的对象-->
    <component
      :is="currentComponent"
      :data="data"
      :is-editor="isEditor"
    />
  </div>
</template>

<script>
import bus from '../util/bus'
import TextC from '../formComponent/textC.vue'
import InputC from '../formComponent/inputC.vue'
import LineC from '../formComponent/lineC.vue'
import SelectC from '../formComponent/selectC.vue'
import RadioC from '../formComponent/radioC.vue'
import CheckboxC from '../formComponent/checkboxC.vue'
import FileC from '../formComponent/fileC.vue'
import RancgleC from '../formComponent/rancgleC.vue'
import ImageC from '../formComponent/imageC.vue'
import DateC from '../formComponent/dateC.vue'
import UploadC from '../formComponent/uploadC.vue'
import { kebabCase } from 'loadsh'
import { shallowRef } from 'vue'
export default {
  name: 'CommonFormComponent',
  components: { ImageC, RancgleC, FileC, CheckboxC, RadioC, SelectC, LineC, InputC, TextC, DateC, UploadC },
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
      points: ['e', 'w', 's', 'n', 'ne', 'nw', 'se', 'sw'],
      mouseXStart: 0,
      mouseYStart: 0,
      mousePointType: '',
      currentComponent: null,
      isActiveBox: false,
      correctionNum: 2 // 边界距离
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
    isShowOverlay: function() {
      return this.isEditor && this.data.type !== 'line'
    }
  },
  watch: {
    activeIdArr() {
      this.isActiveBox = this.activeIdArr.includes(this.data.id)
    },
    data() {
      this.initPostionAndSize()
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
      this.left = this.data.clientX - Math.round(this.$refs.CFC.getBoundingClientRect().width / 2)
      this.top = this.data.clientY - Math.round(this.$refs.CFC.getBoundingClientRect().height / 2)
      // 第一次拖拉进来 更新下位置
      this.mouseUp()
    } else {
      this.left = this.data.left
      this.top = this.data.top
    }
  },
  methods: {
    initCurrentC() {
      this.isActiveBox = this.activeIdArr.includes(this.data.id)
      switch (this.data.type) {
        case 'rancgle': this.currentComponent = shallowRef(RancgleC); break
        case 'text': this.currentComponent = shallowRef(TextC); break
        case 'input': this.currentComponent = shallowRef(InputC); break
        case 'line': this.currentComponent = shallowRef(LineC); break
        case 'select': this.currentComponent = shallowRef(SelectC); break
        case 'radio': this.currentComponent = shallowRef(RadioC); break
        case 'checkbox': this.currentComponent = shallowRef(CheckboxC); break
        case 'file': this.currentComponent = shallowRef(FileC); break
        case 'image':this.currentComponent = shallowRef(ImageC); break
        case 'date':this.currentComponent = shallowRef(DateC); break
        case 'upload':this.currentComponent = shallowRef(UploadC); break
        default: break
      }
      // 初始组件的大小
      this.width = this.data.width
      this.height = this.data.height
    },
    initPostionAndSize(id) {
      if (id) {
        if (id === this.data.id) {
          this.left = this.data.left
          this.top = this.data.top
          this.width = this.data.width
          this.height = this.data.height
        }
      } else {
        this.left = this.data.left
        this.top = this.data.top
        this.width = this.data.width
        this.height = this.data.height
      }
    },
    componetClick() {
      if (this.isEditor) {
        bus.$emit('activeComponentType', { data: this.data.id })
      }
    },
    containerMousedown(e) {
      if (this.isEditor) {
        bus.$emit('activeComponentType', { data: this.data.id, e })
        let isContainerMouseDown = true
        this.mouseDown(e)
        document.onmousemove = e => {
          if (!isContainerMouseDown) return
          this.mouseMove(e)
        }
        document.onmouseup = e => {
          isContainerMouseDown = false
          this.mouseUp(e)
        }
      }
    },
    mouseMove(e) {
      if (!this.isActiveBox) {
        return
      }
      // 左右大小变化
      switch (this.mousePointType) {
        // 右
        case 'e':
          this.width += e.clientX - this.mouseXStart
          this.mouseXStart = e.clientX
          break
          // 左
        case 'w':
          this.width += this.mouseXStart - e.clientX
          this.left += e.clientX - this.mouseXStart
          this.mouseXStart = e.clientX
          break
          // 下
        case 's':
          this.height += e.clientY - this.mouseYStart
          this.mouseYStart = e.clientY
          break
          // 上
        case 'n':
          this.height += this.mouseYStart - e.clientY
          this.top += e.clientY - this.mouseYStart
          this.mouseYStart = e.clientY
          break
          // 右上
        case 'ne':
          this.width += e.clientX - this.mouseXStart
          this.mouseXStart = e.clientX
          this.height += this.mouseYStart - e.clientY
          this.top += e.clientY - this.mouseYStart
          this.mouseYStart = e.clientY
          break
          // 左上
        case 'nw':
          this.width += this.mouseXStart - e.clientX
          this.left += e.clientX - this.mouseXStart
          this.mouseXStart = e.clientX
          this.height += this.mouseYStart - e.clientY
          this.top += e.clientY - this.mouseYStart
          this.mouseYStart = e.clientY
          break
          // 右下
        case 'se':
          this.width += e.clientX - this.mouseXStart
          this.mouseXStart = e.clientX
          this.height += e.clientY - this.mouseYStart
          this.mouseYStart = e.clientY
          break
          // 右上
        case 'sw':
          this.width += this.mouseXStart - e.clientX
          this.left += e.clientX - this.mouseXStart
          this.mouseXStart = e.clientX
          this.height += e.clientY - this.mouseYStart
          this.mouseYStart = e.clientY
          break
        default:
          break
      }
      if (!this.mousePointType) {
        this.left += (e.clientX - this.mouseXStart)
        this.top += (e.clientY - this.mouseYStart)
        this.mouseXStart = e.clientX
        this.mouseYStart = e.clientY
        let { inBound, left, top } = this.checkLimitBound()
        if (!inBound && left) {
          this.left = left
        }
        if (!inBound && top) {
          this.top = top
        }
        // 更新位置，大小数据 (移动组件或者改变组件大小结束后触发) 这里频繁的调用，待优化
        this.isActiveBox && bus.$emit('updateComponentData', { id: this.data.id,
          width: this.width, height: this.height, top: this.top, left: this.left })
      }
      // 按着ctrl移动，这复制
      // if (this.ctrlStatus) {
      //   let tempObj = {}
      //   // 下移动或者右边移动超过2px 就复制
      //   if(e.clientX - this.orginMouseDown.x > 2 || e.clientY - this.orginMouseDown.y > 2) {
      //     // this.ctrlStatus = false

      //   }
      // }
    },
    // 检测组件是否在画布里面
    checkLimitBound() {
      if (!this.$refs.CFC) return { inBound: true }
      let pageLeft = Math.round(this.$refs.CFC.parentElement.getBoundingClientRect().left)
      let pageTop = Math.round(this.$refs.CFC.parentElement.getBoundingClientRect().top)
      let pageRight = Math.round(this.$refs.CFC.parentElement.getBoundingClientRect().right)
      let pageBottom = Math.round(this.$refs.CFC.parentElement.getBoundingClientRect().bottom)
      let compLeft = Math.round(this.$refs.CFC.getBoundingClientRect().left)
      let compTop = Math.round(this.$refs.CFC.getBoundingClientRect().top)
      let compRight = Math.round(this.$refs.CFC.getBoundingClientRect().right)
      let compBottom = Math.round(this.$refs.CFC.getBoundingClientRect().bottom)

      // console.log("---5%%%55-----",pageLeft, pageTop, pageRight, compTop, compRight)

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
          tempObj.left = Math.round(this.$refs.CFC.parentElement.getBoundingClientRect().width - this.$refs.CFC.getBoundingClientRect().width - this.correctionNum)
        }
        if (pageBottom <= compBottom) {
          tempObj.top = Math.round(this.$refs.CFC.parentElement.getBoundingClientRect().height - this.$refs.CFC.getBoundingClientRect().height - this.correctionNum)
        }
        return tempObj
      }
    },
    mouseDown(e) {
      this.mouseXStart = e.clientX
      this.mouseYStart = e.clientY
      if (e.target.className && e.target.className.includes && e.target.className.includes('control_point')) {
        let classArr = e.target.className.split(' ')
        let type = classArr[classArr.length - 1].slice(6)
        this.mousePointType = type
      } else {
        this.mousePointType = false
      }
    },
    mouseUp(e) {
      this.mousePointType = ''
      // 更新位置，大小数据 (移动组件或者改变组件大小结束后触发)
      this.isActiveBox && bus.$emit('updateComponentData', { id: this.data.id,
        width: this.width, height: this.height, top: this.top, left: this.left })
      // 记录移动后的位置
      if (e) {
        this.mouseXStart = e.clientX
        this.mouseYStart = e.clientY
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .common_form_container {
    position: absolute;
    background: #f4f2f2;
    cursor: move;
    user-select: none;
    z-index: 1;
    display: flex;
  }
  .common_form_active {
    border: 1px solid #999;
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
    background: #03a9f4;
    border: 1px solid #c0c5cf;
    box-shadow: 0 0 2px 0 rgba(86, 90, 98, .2);
    border-radius: 3px;
    padding: 3px;
    margin-top: -4px !important;
    margin-left: -4px !important;
    user-select: none;   // 注意禁止鼠标选中控制点元素，不然拖拽事件可能会因此被中断

  }
  .control_point.point_e{
    cursor: ew-resize;
    left: 100%;
    top: 50%;
    margin-left: 1px
  }
  .control_point.point_n{
    cursor: ns-resize;
    left: 50%;
    margin-top: -1px
  }
  .control_point.point_s{
    cursor: ns-resize;
    left: 50%;
    top: 100%;
    margin-top: 1px
  }
  .control_point.point_w{
    cursor: ew-resize;
    top: 50%;
    left: 0;
    margin-left: -1px
  }
  .control_point.point_ne {
    cursor: nesw-resize;
    left: 100%;
    margin-top: -1px;
    margin-left: 1px
  }
  .control_point.point_nw {
    cursor: nwse-resize;
    margin-left: -1px;
    margin-top: -1px
  }
  .control_point.point_se {
    cursor: nwse-resize;
    left: 100%;
    top: 100%;
    margin-left: 1px;
    margin-top: 1px
  }
  .control_point.point_sw {
    cursor: nesw-resize;
    top: 100%;
    margin-left: -1px;
    margin-top: 1px
  }

  .draggingDive {
    display: none;
  }

</style>
