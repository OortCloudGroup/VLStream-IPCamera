/**
Created by  lanjian   on 2022/2/18  17:55
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <!--  <span class="line" :style="style" />-->
  <div :style="style" class="line_container">
    <svg
      :data-id="data.id"
      overflow="visible"
      :style="svgStyle"
      :height="svgHeight"
      :width="svgWidth"
    >
      <path :d="pathSvg" :stroke="stroke" :stroke-dasharray="strokeDasharray" :stroke-width="strokeWidth" fill="none" />
    </svg>
  </div>
</template>

<script>

export default {
  name: 'LineC',
  props: ['data', 'isEditor', 'width', 'height', 'path'],
  data() {
    return {
    }
  }, // 判断是否在编辑状态
  computed: {
    style: function() {
      return { ...this.data.style, ...{ 'border-bottom-width': this.data.style['border-bottom-width'] + 'px' },
        ...{ 'transform': 'rotate(' + this.data.style['transform'] + 'deg)', position: 'relative', width: this.width, height: this.height }
      }
    },
    stroke: function() {
      return this.data.style.stroke ? this.data.style.stroke : 'black'
    },
    strokeWidth: function() {
      return this.data.style['stroke-width'] ? this.data.style['stroke-width'] : 3
    },
    strokeDasharray: function() {
      return this.data.style['stroke-dasharray'] ? this.data.style['stroke-dasharray'] : ''
    },
    svgStyle: function() {
      return { left: 0 + 'px',
        top: 0 + 'px', position: 'absolute' }
    },
    svgWidth: function() {
      return Math.abs(this.data.width)
    },
    svgHeight: function() {
      return Math.abs(this.data.height)
    },
    pathSvg: function() {
      return this.path || this.data.other.path
    }
  }
}
</script>

<style scoped lang="scss">
  .line {
    width: 100%;
    height: 50%;
  }

  .line_opr {

  }

</style>
