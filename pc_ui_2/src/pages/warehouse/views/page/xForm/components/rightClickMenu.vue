/**
Created by  lanjian   on 2022/3/1  10:50
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <ul
    v-show="value"
    id="menu"
    class="menu"
    :style="'left: '+ left +'px;top: '+top+'px;'"
  >
    <div class="menu__group">
      <li v-if="isInComp" class="menu_item" @mousedown="onMouseDown('copy')">
        <span>复制</span>
      </li>
      <li v-if="!isInComp && isCanPaste" class="menu_item" @mousedown="onMouseDown('paste')">
        <span>粘贴</span>
      </li>
      <li class="menu_item" @mousedown="onMouseDown('prop')">
        <span>属性</span>
      </li>
      <li v-if="isInComp" class="menu_item" @mousedown="onMouseDown('delete')">
        <span style="color: red">删除</span>
      </li>
      <li v-if="isInComp" class="menu_item" @mousedown="onMouseDown('upLevel')">
        <span>上移一层</span>
      </li>
      <li v-if="isInComp" class="menu_item" @mousedown="onMouseDown('downLevel')">
        <span>下移一层</span>
      </li>
    </div>
  </ul>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    isInComp: {
      type: Boolean,
      default: false
    },
    isCanPaste: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    onMouseDown(key) {
      this.$emit('menuTick', key)
      // this.$emit('closeMenu', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu {
    position: absolute;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    z-index: 9999;
    min-width: 60px;
  }

  .menu_item {
    width: 100%;
    height: 32px;
    margin: 0px auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: row;
    &:first-of-type {
      margin-top: 0;
    }
    &:hover {
      background: #f0f0f0;
    }
    span {
      margin:0 16px;
      font-size: 12px;
      line-height: 20px;
      color: #333333;
    }
  }

  .menu__group {
    width: 100%;
    padding-top: 6px;
    padding-bottom: 6px;
    border-bottom: 1px solid #eeeeee;
    &:last-of-type {
      border-bottom: none;
    }
  }
  ul {
    padding: 0px!important;
  }

  li:hover {
    background-color: #1790ff;
  }

  li {
    font-size: 15px;
    list-style: none;
  }
</style>
