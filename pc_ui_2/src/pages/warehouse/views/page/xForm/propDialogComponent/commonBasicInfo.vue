<template>
  <div>
    <!--组件基础信息-->
    <div class="prop_group_title">
      <span>基础</span>
    </div>
    <div class="prop_group_item">
      <span class="prop_group_item_title">名称</span>
      <div class="prop_group_item_content">
        <el-input v-model="basicInfo.name" placeholder="" disabled="" />
      </div>
    </div>
    <div class="prop_group_item">
      <span class="prop_group_item_title">类型</span>
      <div class="prop_group_item_content">
        <el-input v-model="basicInfo.type" placeholder="" disabled="" />
      </div>
    </div>
    <div class="prop_group_item">
      <span class="prop_group_item_title">ID</span>
      <div class="prop_group_item_content">
        <el-input v-model="basicInfo.id" placeholder="" disabled="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonBasicInfo',
  props: ['data'],
  data() {
    return {
      basicInfo: {}
    }
  },
  created() {
    this.basicInfo = this.data
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

   ::v-deep.el-input.is-disabled .el-input__inner {
    background-color: #f0f0f0!important;
  }

  .prop_group {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 32px;
    &_title {
      display: flex;
      align-items: center;
      // height: 32px;
      font-size: 16px;
      color: #5176B5;
      font-weight: 600;
      line-height: 20px;
      margin-bottom: 20px;
    }

    &_item {
      display: flex;
      flex-direction: row;
      height: 48px;
      align-items: center;
      // width: 80%;
      // margin: 12px 0;
      margin-bottom: 20px;
      &_title {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width:70px;
        font-weight: 600;
        font-size: 14px;
        color: #333333;
        margin-right: 32px;
      }
      &_content {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: row;
      }
    }

    &_item1 {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .el-select,.el-input{
      // width: 200px;
       ::v-deep.el-input__inner{
        font-size: 14px;
        text-align: left;
        // padding-right: 15px;
        background: #FAFAFA;
        border: 1px solid rgba(198,203,212,1);
        border-radius: 2px;
      }
    }
  }
</style>
