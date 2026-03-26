<template>
  <div class="homePage">
    <div class="nav_status flexRowAC">
      <router-link to="/home" class="nav_title">
        问卷列表
      </router-link>
      <div class="nav_title lth">
        /&nbsp;&nbsp;
        <span>统计结果</span>
      </div>
    </div>
    <el-tabs v-model="activeName" class="tenanat-tabs">
      <el-tab-pane label="数据概览" name="h1" />
      <el-tab-pane label="数据详情" name="h2" />
      <el-tab-pane label="统计图表" name="h3" />
    </el-tabs>
    <div class="homeTitle flexRowAC">
      员工满意度问卷调查
      <div class="flexRowAC homeTitleR">
        <div class="flexRowAC homeTitleRT">
          18
          <div class="homeTitleRT1">
            回收量
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeName==='h1'" class="graphicBox">
      <stati-result-view />
    </div>
    <div v-if="activeName==='h2'" class="graphicBox">
      <stati-result-data class="graphicItem" />
    </div>
    <div v-if="activeName==='h3'" class="graphicBox">
      <stati-result-graphic class="graphicItem" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import StatiResultGraphic from './statiResultGraphic.vue'
import StatiResultData from '@/pages/questionnaire/views/page/homepage/statiResultData.vue'
import StatiResultView from '@/pages/questionnaire/views/page/homepage/statiResultView.vue'

const activeName = ref('h1')
</script>
<style lang="scss" scoped>
.homeTitle {
  justify-content: space-between;
  color: #3D3D3D;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  padding: 20px;

  .homeTitleR {
    .homeTitleRT {
      flex-direction: column;
    }

    .homeTitleRT1 {

    }
  }

}

.homePage {
  height: 100%;
  width: 100%;
  border-radius: 8px 8px 0px 0px;
  background: #F7F7F7;
  overflow: auto;

  .tenant_content {
    width: 100%;
    height: calc(100% - 76px);
    overflow: auto;
  }

  .tableTenBox {
    padding: 20px;
    width: 100%;
    //height: calc(100% - 116px);
    flex: 1;
    background: #fff;
  }
}

// tabs
:deep(.tenanat-tabs) {
  padding: 0 20px;

  .el-tabs__item {
    color: #999999;
  }

  .el-tabs__item.is-active {
    color: var(--el-color-primary);
  }
}

// tabs
:deep(.el-tabs__header) {
  padding-top: 10px;

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__item.is-top {
    font-size: 16px;
    font-weight: 700;
  }
}

// nav
.nav_status {
  height: 60px;
  padding: 10px 0 0 20px;
  border-bottom: 1px solid hsla(0, 0%, 20%, 0.06);
  position: relative;

  &:before {
    content: '';
    width: 3px;
    height: 18px;
    background-color: #1A1A1A;
  }

  .nav_title {
    height: 40px;
    line-height: 40px;
    color: #333;
    margin-left: 12px;

    &.lth {
      color: #999;
    }
  }

  // 确定取消
  .subBtnsBox {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}

.graphicBox {
  overflow: auto;
  padding: 20px;

  .graphicItem {
    background-color: #fff;
    padding: 20px;
  }
}
</style>
