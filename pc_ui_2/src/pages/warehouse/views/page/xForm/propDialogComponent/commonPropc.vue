<template>
  <div>
    <!--通用属性-->
    <div class="prop_group_title">
      <span>位置属性</span>
    </div>
    <div class="prop_group_item">
      <div class="prop_group_item1">
        <span class="prop_group_item_title">上端</span>
        <div class="prop_group_item_content">
          <el-input v-model.number="position.top" controls-position="right" placeholder="请输入" @change="change">
            <template #append>
              <span @click="changeUnit">{{ unit }}</span>
            </template>
          </el-input>
        </div>
      </div>
      <div class="prop_group_item1">
        <span class="prop_group_item_title">左端</span>
        <div class="prop_group_item_content">
          <el-input v-model.number="position.left" controls-position="right" placeholder="请输入" @change="change">
            <template #append>
              <span @click="changeUnit">{{ unit }}</span>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="prop_group_item">
      <div class="prop_group_item1">
        <span class="prop_group_item_title">高度</span>
        <div class="prop_group_item_content">
          <el-input v-model.number="position.height" controls-position="right" placeholder="请输入" @change="change">
            <template #append>
              <span @click="changeUnit">{{ unit }}</span>
            </template>
          </el-input>
        </div>
      </div>
      <div class="prop_group_item1">
        <span class="prop_group_item_title">宽度</span>
        <div class="prop_group_item_content">
          <el-input v-model="position.width" controls-position="right" placeholder="请输入" @change="change">
            <template #append>
              <span @click="changeUnit">{{ unit }}</span>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="prop_group_title">
      <span>盒子属性</span>
    </div>
    <div class="prop_group_item">
      <div class="prop_group_item1">
        <span class="prop_group_item_title">层级</span>
        <div class="prop_group_item_content">
          <el-input-number v-model.number="cStyle.zIndex" controls-position="right" placeholder="请输入" @change="change" />
        </div>
      </div>
      <div class="prop_group_item1">
        <span class="prop_group_item_title">背景色</span>
        <div class="prop_group_item_content">
          <div class="prop_group_item_content">
            <el-color-picker v-model="cStyle.background" @change="change" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonPropc',
  props: ['data', 'containerStyle'],
  data() {
    return {
      position: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      cStyle: {
        zIndex: 10,
        background: '#fff',
        cStyle: 0
      },
      unit: 'px'
    }
  },
  watch: {
    // data() {
    //   this.initPosition()
    // }
  },
  created() {
    this.initPosition()
  },
  methods: {
    initPosition() {
      this.position = this.data

      this.cStyle = { ...this.cStyle, ...this.containerStyle }
      // console.log(this.cStyle)
    },
    changeUnit() {
      this.unitCalc()
      if (this.unit === 'px') {
        this.unit = 'mm'
      } else {
        this.unit = 'px'
      }
    },
    unitCalc() {
      let rad = 3.78
      if (this.unit === 'px') {
        this.position.top = (this.position.top / rad).toFixed(2)
        this.position.left = (this.position.left / rad).toFixed(2)
        this.position.width = (this.position.width / rad).toFixed(2)
        this.position.height = (this.position.height / rad).toFixed(2)
      } else {
        this.position.top = (this.position.top * rad).toFixed(2)
        this.position.left = (this.position.left * rad).toFixed(2)
        this.position.width = (this.position.width * rad).toFixed(2)
        this.position.height = (this.position.height * rad).toFixed(2)
      }
    },
    change() {
      let position = {
        left: this.position.left,
        top: this.position.top,
        width: this.position.width,
        height: this.position.height
      }
      if (this.unit === 'mm') {
        let rad = 3.78
        position.top = (this.position.top * rad).toFixed(2)
        position.left = (this.position.left * rad).toFixed(2)
        position.width = (this.position.width * rad).toFixed(2)
        position.height = (this.position.height * rad).toFixed(2)
      }
      this.$emit('change', { position: position, containerStyle: this.cStyle })
    }
  }
}
</script>

<style lang="scss" scoped>
.prop_group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;
  &_title {
    // height: 32px;
    font-size: 16px;
    color: #5176B5;
    line-height: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  &_item {
    display: flex;
    flex-direction: row;
    height: 48px;
    align-items: center;
    // width: 80%;
    margin-bottom: 20px;
    &_title {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #333333;
      width:70px;
      margin-right: 32px;
      font-family: MicrosoftYaHeiSemibold;
      font-size: 14px;
      color: #333333;
      font-weight: 600;
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
  .el-color-picker{
    width: 200px;
    box-sizing: border-box;
     ::v-deep.el-color-picker__trigger{
      position: relative;
      width: 100%;
      padding-right: 34px;
    }
     ::v-deep.el-color-picker__icon{
      position: absolute;
      left: 91%;
    }
  }
  .el-input-number{
    width: 200px;
     ::v-deep.el-input-number__decrease, ::v-deep.el-input-number__increase{
      display: none;
    }
     ::v-deep.el-input__inner{
      font-size: 14px;
      text-align: left;
      // padding-right: 15px;
      background: #FAFAFA;
      border: 1px solid rgba(198,203,212,1);
      border-radius: 2px;
    }
    // ::v-deep.el-input{
    //  position: relative;
    //  &::after{
    //    content: 'px';
    //    position: absolute;
    //    top: 50%;
    //    right: 8px;
    //    font-size: 14px;
    //    color: #C6CBD5;
    //    transform: translate(0,-50%);
    //  }
    //}
  }

}
</style>
