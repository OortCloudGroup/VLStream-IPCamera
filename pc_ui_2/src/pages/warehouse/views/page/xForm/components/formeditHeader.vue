/**
Created by  lanjian   on 2021/12/28  18:32
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="f_header">
    <div class="f_header_logo">
      <img src="@/assets/img/formEdit/logo.png" />
    </div>

    <div class="f_header_item">
      <el-tooltip content="保存" placement="bottom">
        <img src="@/assets/img/formEdit/save.png" @click="saveForm()" />
      </el-tooltip>
      <!-- <el-tooltip content="导出JSON" placement="bottom" >
        <img src="@/assets/img/formEdit/download.png" @click="showJSON()"/>
      </el-tooltip> -->
      <span />
      <el-tooltip content="左对齐" placement="bottom">
        <img src="@/assets/img/formEdit/textleft.png" @click="alginOprFunc('left')" />
      </el-tooltip>
      <el-tooltip content="居中" placement="bottom">
        <img src="@/assets/img/formEdit/textcenter.png" @click="alginOprFunc('center')" />
      </el-tooltip>
      <el-tooltip content="右对齐" placement="bottom">
        <img src="@/assets/img/formEdit/textright.png" @click="alginOprFunc('right')" />
      </el-tooltip>
      <el-tooltip content="顶部对齐" placement="bottom">
        <img src="@/assets/img/formEdit/textaligntop.png" @click="alginOprFunc('top')" />
      </el-tooltip>
      <el-tooltip content="垂直居中" placement="bottom">
        <img src="@/assets/img/formEdit/textaligncenter.png" @click="alginOprFunc('verticalCenter')" />
      </el-tooltip>
      <el-tooltip content="底部对齐" placement="bottom">
        <img src="@/assets/img/formEdit/textalignbottom.png" @click="alginOprFunc('bottom')" />
      </el-tooltip>
      <span />
      <el-tooltip content="等高" placement="bottom">
        <img src="@/assets/img/formEdit/equlheight.png" @click="alginOprFunc('equalHeight')" />
      </el-tooltip>
      <el-tooltip content="等宽" placement="bottom">
        <img src="@/assets/img/formEdit/equlwidth.png" @click="alginOprFunc('equalWidth')" />
      </el-tooltip>
      <el-tooltip content="网格" placement="bottom">
        <img src="@/assets/img/formEdit/grid.png" @click="showGrid()" />
      </el-tooltip>
      <!--      <el-tooltip content="重新排列" placement="bottom">-->
      <!--        <img src="@/assets/img/formEdit/rerank.png">-->
      <!--      </el-tooltip>-->
      <span />
      <el-tooltip content="复制" placement="bottom">
        <img src="@/assets/img/formEdit/copy.png" @click="alginOprFunc('copy')" />
      </el-tooltip>
      <el-tooltip content="粘贴" placement="bottom">
        <img src="@/assets/img/formEdit/paste.png" @click="alginOprFunc('paste')" />
      </el-tooltip>
      <el-tooltip content="删除" placement="bottom">
        <img src="@/assets/img/formEdit/delete.png" @click="alginOprFunc('delete')" />
      </el-tooltip>
      <span />
      <el-tooltip content="预览" placement="bottom">
        <img src="@/assets/img/formEdit/preview.png" @click="previewForm" />
      </el-tooltip>
      <el-tooltip content="选择模版" placement="bottom">
        <img src="@/assets/img/formEdit/seleteTemplate.png" @click="selectTemplate" />
      </el-tooltip>
      <el-tooltip content="退出" placement="bottom">
        <img src="@/assets/img/formEdit/exit.png" @click="exitDesgin" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'

export default {
  name: 'FormeditHeader',
  methods: {
    alginOprFunc(opr) {
      bus.$emit('alginOprFunc', opr)
    },
    previewForm() {
      bus.$emit('previewForm')
    },
    selectTemplate() {
      bus.$emit('templateShow')
    },
    saveForm() {
      bus.$emit('saveForm')
    },
    // showJSON() {
    //   bus.$emit('showJSON')
    // },
    exitDesgin() {
      bus.$emit('exitXForm')
    },
    showGrid() {
      bus.$emit('showGrid')
    }
  }
}
</script>

<style lang="scss" scoped>

   ::v-deep.el-dialog {
    background: none;
  }

  .f_header {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .f_header_logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin:0 32px;
    img {
      height:42px;
    }
    span {
      margin: 0 8px;
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
    }
  }

  .f_header_item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 64px;
    img {
      cursor: pointer;
      margin:0 8px;
      width: 24px;
      height: 24px;
    }
    span {
      margin:0 24px;
      width: 1px;
      height: 20px;
      background:  #fff;
    }
  }

</style>
