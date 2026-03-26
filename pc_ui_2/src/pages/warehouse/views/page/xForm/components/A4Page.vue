/**
Created by  lanjian   on 2022/1/5  11:34
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<!--A4纸张-->
<template>
  <div
    ref="A4page"
    :class="{'A4_page_grid':showGridVis, 'A4_page': true}"
    :style="{'transform': 'scale('+scale / 100+')', ...pageStyle}"
    @contextmenu.prevent.stop="openMenu"
    @mousedown="mouseDown"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
  >
    <template v-for="(item, index) in componentArr">
      <common-form-component
        v-if="item.type !== 'line'"
        :key="index + item.id"
        :data="item"
        :active-id-arr="currentActiveArr"
        :class="{'common_form_active': activeAlignIndex[index]}"
        :is-editor="true"
      />
      <other-common-form-component
        v-else
        :key="index + item.id"
        :data="item"
        :active-id-arr="currentActiveArr"
        :class="{'common_form_active': activeAlignIndex[index]}"
        :is-editor="true"
      />
    </template>

    <!--    选择框-->
    <div ref="select_box" class="select_box" />
    <!--    对其框线 竖线-->
    <div ref="alginLine" class="algin_line" />
    <!--    对其框线横线线-->
    <div ref="alginLineHor" class="algin_line_h" />
    <right-click-menu
      :value="rightClickMenuVisible"
      :left="mouseLeft"
      :top="mouseTop"
      :is-in-comp="isInComp"
      :is-can-paste="!!copyObj"
      @menuTick="onMenuEvent"
    />

    <el-dialog
      v-model="dialogPropVisible"
      title="属性"
      class="prop_dialog"
      width="45%"
      draggable
      append-to-body
    >
      <prop-dialog
        v-if="dialogPropVisible"
        :data="currentCompP"
        @close="closeDialog"
      />
    </el-dialog>

    <el-dialog
      v-model="dialogPageVisible"
      title="页面属性"
      class="prop_dialog"
      width="40%"
      draggable
      append-to-body
    >
      <page-prop-dialog
        :data="pageProp"
        @close="dialogPageVisible=false"
      />
    </el-dialog>
  </div>
</template>

<script>
import bus from '../util/bus'
import CommonFormComponent from './commonFormComponent.vue'
import RightClickMenu from './rightClickMenu.vue'
import PropDialog from './PropDialog.vue'
import { generateUUID } from '../util/formUtils'
import PagePropDialog from './pagePropDialog.vue'
import OtherCommonFormComponent from './otherCommonFormComponent.vue'
import { useXFormStore } from '@/store/xForm'
export default {
  name: 'A4Page',
  components: { OtherCommonFormComponent, PagePropDialog, PropDialog, RightClickMenu, CommonFormComponent },
  props: ['scale', 'showGridVis'],
  data() {
    return {
      pLeft: 0,
      pTop: 0,
      pWidth: 0,
      pHeight: 0,
      componentArr: [],
      currentActiveC: '',
      selectBoxActive: false,
      orginMouseDown: { x: 0, y: 0 },
      currentActiveArr: [], // 激活的数组
      rightClickMenuVisible: false,
      mouseLeft: 0,
      mouseTop: 0,
      copyObj: null,
      isInComp: false, // 是否在组件中右键
      dialogPropVisible: false,
      currentCompP: null, // 当前右键点击属性的弹框
      mouseDownStatus: false,
      activeAlignIndex: [], // 对齐的时候显示
      ctrlStatus: false,
      A4pageScrollTop: 0,
      dialogPageVisible: false,
      a4pageEl: null,
      intervalD: null
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
    componentArr(data) {
      bus.$emit('getNewsArr', data)
    }
  },
  created() {
    bus.$on('createComponent', this.createComponent)
    bus.$on('activeComponentType', this.activeType)
    bus.$on('updateComponentData', this.updateCD)
    bus.$on('alginOprFunc', this.alginOpr)
    bus.$on('refreshPage', this.refreshPage)
    bus.$on('showProp', this.showProp)
  },
  mounted() {
    // 修复多次跳转后 $refs的值丢失，暂时这样处理
    this.a4pageEl = this.$refs.A4page
    this.calcOffset()
    // 自动保存
    this.autoSave()
    // 重缓存中恢复
    this.restoreLocal()
    //
    document.onkeyup = this.keyUp
    document.onkeydown = this.keydown
  },
  // / 销毁
  unmounted() {
    document.onkeyup = null // 解除事件监听
    document.onkeydown = null
    bus.$off('createComponent', this.createComponent)
    bus.$off('activeComponentType', this.activeType)
    bus.$off('updateComponentData', this.updateCD)
    bus.$off('alginOprFunc', this.alginOpr)
    bus.$off('refreshPage', this.refreshPage)
    bus.$off('showProp', this.showProp)
    if (this.intervalD) {
      window.clearInterval(this.intervalD)
    }
  },
  methods: {
    // 显示当前控件的属性对话
    showProp({ data }) {
      this.isInComp = true
      this.activeType({ data })
      this.propComponent()
    },
    keydown(e) {
      // 当有弹框时禁止
      if (this.dialogPropVisible || this.dialogPageVisible) {
        return
      }
      let key = e.key.toLowerCase()
      if (key === 'control') {
        this.ctrlStatus = true
      }
      // 箭头键上下作用移动
      if (key.startsWith('arrow')) {
        // 移动的灵敏度
        let lmd = 1
        this.currentActiveArr.forEach(id => {
          let index = this.componentArr.findIndex(item => { return item.id === id })
          if (index !== -1) {
            let obj = this.componentArr[index]
            switch (key) {
              case 'arrowup': obj.top = obj.top - lmd; break
              case 'arrowdown': obj.top = obj.top + lmd; break
              case 'arrowleft': obj.left = obj.left - lmd; break
              case 'arrowright': obj.left = obj.left + lmd; break
              default: break
            }
            bus.$emit('updateComponentPS', obj.id)
          }
        })
      }
      // 复制
      if (key === 'c' && this.ctrlStatus) {
        this.copyComponent()
      }
      // 粘贴
      if (key === 'v' && this.ctrlStatus) {
        this.pasteComponent(false)
      }
    },
    keyUp(e) {
      let key = e.key.toLowerCase()
      if (key === 'backspace' || key === 'delete') {
        // 当弹框打开时，不继续往下执行
        if (this.dialogPropVisible || this.dialogPageVisible) {
          return false
        }
        this.deleteComponent()
      }
      if (key === 'control') {
        this.ctrlStatus = false
      }
    },
    refreshPage() {
      this.componentArr = []
      this.currentActiveC = null
      this.currentActiveArr = []
      this.restoreLocal()
    },
    restoreLocal() {
      let str = window.localStorage.getItem('formCArr')
      if (str) {
        this.componentArr = JSON.parse(str)
        // this.componentArr.forEach(item=>{
        //   item.__vModel__ = item.id
        //   item.__config__ = {}
        // })
      }
    },
    autoSave() {
      this.intervalD = setInterval(() => {
        let str = JSON.stringify(this.componentArr)
        // console.log("this.componentArr", this.componentArr.length)
        window.localStorage.setItem('formCArr', str)
      }, 1500)
    },
    // resetOtherStyle 样式同时作用于其他组件
    closeDialog({ data, resetOtherStyle, style }) {
      // console.log('修改属性后的data', data, resetOtherStyle, style)
      // data 不为空，则确定修改属性
      if (data) {
        if (resetOtherStyle) {
          // 同时修改其他样式
          let currentType = ''
          let index = this.componentArr.findIndex(item => { return item.id === data.id })
          if (index !== -1) {
            currentType = this.componentArr[index].type
            // this.$set(this.componentArr, index, data)
          }
          this.componentArr.forEach((item, index) => {
            if (item.id === data.id) {
              this.componentArr[index] = data
            } else {
              if (this.componentArr[index].type === currentType) {
                // console.log(index)
                this.componentArr[index] = { ...this.componentArr[index], ...style }
              }
            }
          })
        } else {
          // let index = this.componentArr.findIndex(item => { return item.id === this.currentActiveC })
          let index = this.componentArr.findIndex(item => { return item.id === data.id })
          if (index !== -1) {
            this.componentArr[index] = data
            // this.$set(this.componentArr, index, data)
          }
        }
      }
      this.mouseDownStatus = false
      this.dialogPropVisible = false
    },
    copyComponent() {
      let index = this.componentArr.findIndex(item => { return item.id === this.currentActiveC })
      if (index !== -1) {
        // 拷贝
        this.copyObj = { ...this.componentArr[index] }
        // this.copyObj = JSON.parse(JSON.stringify(this.componentArr[index]))
      }
    },
    pasteComponent(isMouseClick = false) {
      if (this.copyObj) {
        // 产生唯一值
        let uniqueID = this.copyObj.type + generateUUID()
        this.copyObj.id = uniqueID
        // 区分是鼠标右键还是左键的点击
        if (isMouseClick) {
          this.copyObj.left = this.mouseLeft
          this.copyObj.top = this.mouseTop
        } else {
          this.copyObj.left = this.copyObj.left + 10
          this.copyObj.top = this.copyObj.top + 10
        }
        // 当前激活的唯一值
        this.currentActiveC = uniqueID
        this.currentActiveArr = [uniqueID]
        this.componentArr.push({ __vModel__: uniqueID, id: uniqueID, __config__: {}, ...this.copyObj })
        // bus.$emit('updateComponentPS')
      }
    },
    propComponent() {
      if (this.isInComp) {
        let index = this.componentArr.findIndex((item) => { return item.id === this.currentActiveC })
        if (index !== -1) {
          this.currentCompP = this.componentArr[index]
          console.log('当前选中的属性-', this.currentCompP)
        }
        this.dialogPropVisible = true
      } else {
        // 页面属性
        this.dialogPageVisible = true
      }
      console.log('dialogPropVisible', this.dialogPropVisible)
      console.log('dialogPageVisible', this.dialogPageVisible)
    },
    deleteComponent() {
      this.currentActiveArr.forEach(itt => {
        let index = this.componentArr.findIndex((item) => { return item.id === itt })
        if (index !== -1) {
          this.componentArr.splice(index, 1)
        }
      })

      // let index = this.componentArr.findIndex((item) => { return item.id === this.currentActiveC })
      // if (index !== -1) {
      //   this.componentArr.splice(index, 1)
      // }
    },
    upLevelComp() {
      let index = this.componentArr.findIndex((item) => { return item.id === this.currentActiveC })
      if (index !== -1) {
        this.componentArr[index].containerStyle.zIndex++
      }
    },
    downLevelComp() {
      let index = this.componentArr.findIndex((item) => { return item.id === this.currentActiveC })
      if (index !== -1) {
        this.componentArr[index].containerStyle.zIndex--
      }
    },

    openMenu(e) {
      let activeId = e.target.getAttribute('data-id')
      // 计算偏移，有可能滑动了画布
      this.calcOffset()
      this.mouseLeft = e.clientX - this.pLeft
      this.mouseTop = e.clientY - this.pTop + this.A4pageScrollTop
      if (activeId) {
        this.currentActiveArr = [activeId]
        this.currentActiveC = activeId
        this.isInComp = true
      } else {
        this.isInComp = false
      }
      this.rightClickMenuVisible = true
    },
    onMenuEvent(opr) {
      switch (opr) {
        case 'copy': this.copyComponent(); break
        case 'paste': this.pasteComponent(true); break
        case 'prop': this.propComponent(); break
        case 'delete': this.deleteComponent(); break
        case 'upLevel': this.upLevelComp(); break
        case 'downLevel': this.downLevelComp(); break
        default: break
      }
      this.rightClickMenuVisible = false
    },
    alginOpr(opr) {
      if (this.componentArr.length === 0) return
      switch (opr) {
        case 'left': this.leftComponent(); break
        case 'center': this.centerComponent(); break
        case 'right': this.rightComponent(); break
        case 'top': this.topComponent(); break
        case 'verticalCenter': this.alginCenterComponent(); break
        case 'equalHeight': this.equalHeight(); break
        case 'bottom': this.bottomComponent(); break
        case 'equalWidth': this.equalWidth(); break
        case 'copy': this.copyComponent(); break
        case 'paste': this.pasteComponent(false); break
        case 'delete': this.deleteComponent(); break
        default: break
      }
      bus.$emit('updateComponentPS')
    },
    // 等高
    equalHeight() {
      // 找到最高的 以它为基准
      let maxHeight = this.componentArr[0].height
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (maxHeight < item.height) {
            maxHeight = item.height
          }
        }
      })
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.height = maxHeight
        }
      })
    },
    // 等宽
    equalWidth() {
      // 找到最宽的 以它为基准
      let maxWidth = this.componentArr[0].width
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (maxWidth < item.width) {
            maxWidth = item.width
          }
        }
      })
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.width = maxWidth
        }
      })
    },
    // 左对齐组件
    leftComponent() {
      // 找到最左的那个组件以它为基准
      let minLeft = this.componentArr[0].left
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (minLeft > item.left) {
            minLeft = item.left
          }
        }
      })
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.left = minLeft
        }
      })
    },
    centerComponent() {
      // 找到最左的那个组件的left
      let minLeft = this.componentArr[0].left
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (minLeft > item.left) {
            minLeft = item.left
          }
        }
      })
      // 找到最右边的那个组件 right
      let maxRight = this.componentArr[0].left + this.componentArr[0].width
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (maxRight < item.left + item.width) {
            maxRight = item.left + item.width
          }
        }
      })
      // 计算居中的长度
      let middleLeft = minLeft + (maxRight - minLeft) / 2
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.left = middleLeft - (item.width / 2)
        }
      })
    },
    // 右边对齐组件
    rightComponent() {
      // 找到最右边的那个组件以它为基准
      let maxRight = this.componentArr[0].left + this.componentArr[0].width
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (maxRight < item.left + item.width) {
            maxRight = item.left + item.width
          }
        }
      })
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.left = maxRight - item.width
        }
      })
    },
    // 上对齐组件
    topComponent() {
      // 找到最左的那个组件以它为基准
      let minTop = this.componentArr[0].top
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (minTop > item.top) {
            minTop = item.top
          }
        }
      })
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.top = minTop
        }
      })
    },
    alginCenterComponent() {
      let minTop = this.componentArr[0].top
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (minTop > item.top) {
            minTop = item.top
          }
        }
      })
      // 找到最右边的那个组件以它为基准
      let maxBottom = this.componentArr[0].top + this.componentArr[0].height
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (maxBottom < item.top + item.height) {
            maxBottom = item.top + item.height
          }
        }
      })
      // 计算居中的长度
      let middleTop = minTop + (maxBottom - minTop) / 2
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.top = middleTop - (item.height / 2)
        }
      })
    },
    // 顶部对齐组件
    bottomComponent() {
      // 找到最右边的那个组件以它为基准
      let maxBottom = this.componentArr[0].top + this.componentArr[0].height
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          if (maxBottom < item.top + item.height) {
            maxBottom = item.top + item.height
          }
        }
      })
      this.componentArr.forEach(item => {
        if (this.currentActiveArr.includes(item.id)) {
          item.top = maxBottom - item.height
        }
      })
    },
    updateCD(data) {
      // 更新到数组中
      let index = this.componentArr.findIndex(({ id }) => { return id === data.id })
      if (index === -1) return
      this.componentArr[index] = { ...this.componentArr[index], ...data }
    },
    activeType({ data, e }) {
      // 判断是否按住 ctrl 多选
      if (this.ctrlStatus) {
        if (!this.currentActiveArr.includes(data)) {
          this.currentActiveArr.push(data)
        }
      } else {
        this.currentActiveArr = [data]
      }
      this.currentActiveC = data
      // 鼠标按下
      if (e) {
        this.mouseDown(e)
      }
    },
    // 点击纸张 取消激活
    removeActive() {
      this.currentActiveC = ''
      this.currentActiveArr = []
    },
    removeselectBox() {
      this.$refs.select_box.style.display = 'none'
      // console.log(this.currentActiveArr)
    },
    mouseUp() {
      this.mouseDownStatus = false
      // 是否右键的释放, 右键的释放
      if (this.rightClickMenuVisible) {
        return
      }
      if (this.selectBoxActive) {
        this.selectBoxActive = false
        this.removeselectBox()
      } else {
        // 触发鼠标释放， 在拖拉的组件中，
        // 可能因为滑动的过快，鼠标释放在组件外，使得拖拽的组件上无法监听到
        // bus.$emit('mouseUp', e)
        if (!this.ctrlStatus) {
          // this.removeActive()
        }
      }
      this.removeAlignDisplay()
    },
    mouseDown(e) {
      this.mouseDownStatus = true
      // 是否右键的释放, 右键的释放
      if (this.rightClickMenuVisible) {
        this.rightClickMenuVisible = false
        return
      }
      // 判断类型
      // console.log(e.target.className)
      // 点击的画布空白处
      if (e.target.className.includes && e.target.className.includes('A4_page')) {
        // 激活数组 清空
        this.currentActiveArr = []
        this.selectBoxActive = true
        // 记录一开始点击的点
        this.orginMouseDown = { x: e.clientX, y: e.clientY }
      }
    },
    mouseMove(e) {
      if (!this.mouseDownStatus) {
        return
      }
      // 是否右键的释放, 右键的释放
      if (this.rightClickMenuVisible) {
        return
      }
      if (this.selectBoxActive) {
        this.selectBoxChanage(e)
      } else {
        // 鼠标拖动组件移动计算 对齐准线
        this.alignLineFunc(e)
      }
    },
    // 鼠标点击拖动选择框
    selectBoxChanage(e) {
      this.calcOffset()
      // 取绝对值
      let boxWidth = Math.abs(e.clientX - this.orginMouseDown.x)
      let boxHeight = Math.abs(e.clientY - this.orginMouseDown.y)
      let a4pageX = this.pLeft
      let a4pageY = this.pTop
      let boxLeft = e.clientX - a4pageX
      if (this.orginMouseDown.x < e.clientX) {
        boxLeft = this.orginMouseDown.x - a4pageX
      }
      let boxTop = e.clientY - a4pageY
      if (this.orginMouseDown.y < e.clientY) {
        boxTop = this.orginMouseDown.y - a4pageY
      }
      // 修复画布滚动的bug
      boxTop += this.A4pageScrollTop
      // 设置box的大小和位置
      this.$refs.select_box.style.display = 'block'
      this.$refs.select_box.style.left = boxLeft + 'px'
      this.$refs.select_box.style.top = boxTop + 'px'
      this.$refs.select_box.style.width = boxWidth + 'px'
      this.$refs.select_box.style.height = boxHeight + 'px'
      // 动态判断激活的组件
      this.activeOrDeactiveCompone(boxLeft, boxTop, boxWidth, boxHeight)
    },
    activeOrDeactiveCompone(boxLeft, boxTop, boxWidth, boxHeight) {
      this.componentArr.forEach(item => {
        if (boxLeft + boxWidth < item.left || boxLeft > item.left + item.width ||
          boxTop + boxHeight < item.top || boxTop > item.top + item.height) {
          // 不相交 就需要把激活的id 去除
          let index = this.currentActiveArr.findIndex((id) => { return id === item.id })
          if (index !== -1) {
            this.currentActiveArr.splice(index, 1)
          }
        } else {
          // 相交 将id 加入激活的数组中， 还要判断释放存在
          if (!this.currentActiveArr.includes(item.id)) {
            this.currentActiveArr.push(item.id)
          }
        }
      })
    },

    createComponent({ position, data }) {
      // 每次创建组件时候，重新计算下画布的偏移
      this.calcOffset()
      // 这里要注意 加入数组的是一个新的值,必须深度克隆
      data = JSON.parse(JSON.stringify(data))
      // 判断是否在范围之内
      if (this.pLeft < position.clientX && this.pTop < position.clientY &&
        (this.pLeft + this.pWidth) > position.clientX &&
        (this.pTop + this.pHeight) > position.clientY) {
        position.clientX = position.clientX - this.pLeft
        position.clientY = position.clientY - this.pTop
        // 产生唯一值
        let uniqueID = data.type + generateUUID()
        // 当前激活的唯一值
        this.currentActiveC = uniqueID
        this.currentActiveArr = [uniqueID]
        let positionObj = {
          clientX: position.clientX,
          clientY: position.clientY + this.A4pageScrollTop
        }
        this.componentArr.push({ __vModel__: uniqueID, id: uniqueID, __config__: {}, ...positionObj, ...data })
      } else {
        console.log('不在范围内')
      }
    },
    // 计算页面的偏移
    calcOffset() {
      // console.log(this.$refs)
      this.pLeft = Math.round(this.a4pageEl.getBoundingClientRect().left)
      this.pTop = Math.round(this.a4pageEl.getBoundingClientRect().top)
      this.pWidth = Math.round(this.a4pageEl.getBoundingClientRect().width)
      this.pHeight = Math.round(this.a4pageEl.getBoundingClientRect().height)
      // 组件在画布的大小偏移 加上画布的滚动
      this.A4pageScrollTop = Math.round(this.a4pageEl.scrollTop)
      // console.log(this.pLeft, this.pTop, this.a4pageEl.scrollTop)
    },
    // 对齐线的功能
    alignLineFunc() {
      // 控制自动吸附的距离
      let range = 5
      // 不支持拖动多个
      if (this.currentActiveC) {
        let cComp = null
        this.componentArr.forEach(item => {
          if (item.id === this.currentActiveC) {
            cComp = item
          }
        })
        let haveFind = false
        for (let i = 0; i < this.componentArr.length; i++) {
          let item = this.componentArr[i]
          if (item.id !== this.currentActiveC) {
            // console.log(item.id, cComp.left, item.left)
            // 这里注意下顺序 ，优先左对齐 ， 因为只设置了一条横线和竖线 当两个组件都对齐时，显示左对齐线。 顶部同理
            if (Math.abs(cComp.left - item.left) < range) { // 左侧
              // 设置对齐线条位置
              this.$refs.alginLine.style.display = 'block'
              this.$refs.alginLine.style.left = item.left + 'px'
              haveFind = true
            } else if (Math.abs((cComp.left + cComp.width / 2) - (item.left + item.width / 2)) < range) { // 中间
              // 设置对齐线条位置
              this.$refs.alginLine.style.display = 'block'
              this.$refs.alginLine.style.left = (item.left + item.width / 2) + 'px'
              haveFind = true
            } else if (Math.abs((cComp.left + cComp.width) - (item.left + item.width)) < range) { // 右侧
              // 设置对齐线条位置
              this.$refs.alginLine.style.display = 'block'
              this.$refs.alginLine.style.left = (item.left + item.width) + 'px'
              haveFind = true
            }
            // 这里注意下顺序 ，优先顶部
            if (Math.abs(cComp.top - item.top) < range) {
              // 设置对齐线条位置
              this.$refs.alginLineHor.style.display = 'block'
              this.$refs.alginLineHor.style.top = item.top + 'px'
              haveFind = true
            } else if (Math.abs((cComp.top + cComp.height / 2) - (item.top + item.height / 2)) < range) { // 中间
              // 设置对齐线条位置
              this.$refs.alginLineHor.style.display = 'block'
              this.$refs.alginLineHor.style.top = (item.top + item.height / 2) + 'px'
              haveFind = true
            } else if (Math.abs((cComp.top + cComp.height) - (item.top + item.height)) < range) { // 右侧
              // 设置对齐线条位置
              this.$refs.alginLineHor.style.display = 'block'
              this.$refs.alginLineHor.style.top = (item.top + item.height) + 'px'
              haveFind = true
            }
            if (!haveFind) {
              this.removeAlignDisplay()
            }
          }
        }

        // 找到需要激活的数组
        let activeAlignIndex = []
        for (let i = 0; i < this.componentArr.length; i++) {
          let item = this.componentArr[i]
          if (Math.abs(cComp.left - item.left) < range) {
            activeAlignIndex.push(true)
          } else if (Math.abs((cComp.left + cComp.width / 2) - (item.left + item.width / 2)) < range) { // 中间
            activeAlignIndex.push(true)
          } else if (Math.abs((cComp.left + cComp.width) - (item.left + item.width)) < range) { // 右侧
            activeAlignIndex.push(true)
          } else if (Math.abs(cComp.top - item.top) < range) {
            activeAlignIndex.push(true)
          } else if (Math.abs((cComp.top + cComp.height / 2) - (item.top + item.height / 2)) < range) { // 中间
            activeAlignIndex.push(true)
          } else if (Math.abs((cComp.top + cComp.height) - (item.top + item.height)) < range) { // 右侧
            activeAlignIndex.push(true)
          } else {
            activeAlignIndex.push(false)
          }
        }
        this.activeAlignIndex = activeAlignIndex
      }
    },
    removeAlignDisplay() {
      this.activeAlignIndex = []
      this.$refs.alginLine.style.display = 'none'
      this.$refs.alginLineHor.style.display = 'none'
    }
  }
}
</script>

<style lang="scss">

  .A4_page {

    .el-dialog {
      display: flex;
      flex-direction: column;
      margin-top: 5vh!important;
      background: #FFFFFF!important;
      box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.3);
      border-radius: 2px;
      height: 80vh;
      padding:0%!important;
    }

    .data_dialog .el-dialog {
      margin-top: 5vh!important;
      height: 90vh;
    }

    .el-dialog__header {
      padding: 16px 20px;
      background: #F7F7F7!important;
    }

    .el-dialog__title {
      font-size: 18px;
      color: #333333!important;
      letter-spacing: 0;
      font-weight: 600;
    }

    .el-dialog__close {
      font-size: 34px;
      &::before{
        font-size: 34px;
      }
    }

    .el-dialog__headerbtn {
      top: 12px;
      font-size: 16px;
    }

    .el-dialog__body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 30px 20px 0;
    }

   .el-select-dropdown {
      background: #fff!important;
    }

    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
      background: #fff!important;
    }

    .el-select-dropdown__item .selected .hover {
      background: #f5f7fa!important;
      color: #606266!important;
    }
    .el-select-dropdown__item:hover {
      background: #f5f7fa!important;
      color: #606266!important;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

</style>

<style lang="scss" scoped>
  .A4_page {
    width: 210mm;
    height: 297mm;
    overflow: visible;
    background: #fff;
    position: relative;
    transform: scale(1);
    margin: 0.1rem auto;
    cursor: crosshair;
    box-shadow: 0 0 15px 0 rgb(0 0 0 / 10%);
  }

  .A4_page_grid {
    background-image: linear-gradient(to right, #f2f2f2 1px, transparent 1px),
    linear-gradient(to bottom, #f2f2f2 1px, transparent 1px);
    background-size: 5mm 5mm;
  }

  .select_box {
    position: absolute;
    border: 1px dashed blue;
    left: 0px;
    top: 0px;
    width: 0px;
    height: 0px;
    z-index: 9999;
    display: none;
  }

  .algin_line {
    position: absolute;
    border: 0.5px dashed #9f9fe3;
    left: 0px;
    top: 0px;
    width: 0px;
    z-index: 9999;
    height: 100%;
    display: none;
  }

  .algin_line_h {
    position: absolute;
    border: 0.5px dashed #9f9fe3;
    left: 0px;
    top: 0px;
    width: 100%;
    z-index: 9999;
    height: 0;
    display: none;
  }

  .common_form_active {
    border: 0.5px solid #999;
  }
</style>
