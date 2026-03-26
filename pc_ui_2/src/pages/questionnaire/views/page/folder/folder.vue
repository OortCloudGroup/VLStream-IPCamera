<template>
  <div class="homePage">
    <div class="homeTitle">
      文件夹
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
.homeTitle {
  color: #3D3D3D;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  padding: 20px;
}

.homePage {
  height: 100%;
  width: 100%;
  border-radius: 8px 8px 0px 0px;
  background: #F7F7F7;

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
</style>
