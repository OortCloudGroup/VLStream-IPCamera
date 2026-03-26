<template>
  <div>
    <div class="prop_group_title">
      <span>字段设置</span>
    </div>
    <div class="prop_group_item">
      <div class="prop_group_item1">
        <span class="prop_group_item_title">主表字段</span>
        <div class="prop_group_item_content">
          <el-select v-model="fieldLocal" :popper-append-to-body="false" placeholder="请选择" @change="changeField">
            <el-option
              v-for="(item,index) in currentTable"
              :key="index"
              :label="item.name"
              :value="item.field"
            />
          </el-select>
        </div>
      </div>
      <div class="prop_group_item1">
        <span class="prop_group_item_title">主表字段值</span>
        <div class="prop_group_item_content">
          <el-input v-model="fieldLocal" disabled />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useXFormStore } from '@/store/xForm'
export default {
  name: 'AdvanceInfo',
  props: ['field'],
  data() {
    return {
      fieldLocal: '',
      currentTable: useXFormStore().currentTable
    }
  },
  created() {
    if (this.field) {
      this.fieldLocal = this.field
    }
  },
  methods: {
    changeField(data) {
      let index = this.currentTable.findIndex(item => { return item.field === data })
      if (index !== -1) {
        this.$emit('change', this.currentTable[index])
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.prop_group {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 60px);
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
    width: 200px;
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
