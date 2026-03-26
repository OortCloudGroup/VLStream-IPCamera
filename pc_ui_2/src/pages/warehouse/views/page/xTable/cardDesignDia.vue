<!--主表浏览器页面-->
<template>
  <div class="browser_body">
    <div class="table_design_body">
      <div class="table_item">
        <div class="browser_body_tips">
          <span>统计设计</span>
        </div>
        <div class="report_group">
          <span class="report_group_title">标题</span>
          <div class="report_group_body">
            <el-input
              v-model="cardData.title"
              placeholder="输入标题"
            />
          </div>
        </div>
        <div class="report_group">
          <span class="report_group_title">卡片类型</span>
          <div class="report_group_body">
            <el-select
              v-model="cardData.cardType"
              placeholder="请选择类型"
            >
              <el-option
                label="数值卡片"
                :value="1"
              />
              <el-option
                label="可视化图表卡片"
                :value="2"
              />
            </el-select>
          </div>
        </div>
        <template v-if="cardData.cardType === 1">
          <div class="report_group">
            <span class="report_group_title">绑定字段</span>
            <div class="report_group_body">
              <el-select
                v-model="cardData.field"
                placeholder="选择字段类型"
              >
                <el-option
                  v-for="(item,index) in currentTable"
                  :key="index"
                  :label="item.name"
                  :value="item.field"
                />
              </el-select>
            </div>
          </div>
          <div class="report_group">
            <span class="report_group_title">统计方式</span>
            <div class="report_group_body">
              <el-select
                v-model="cardData.countType"
                placeholder="请选择方式"
              >
                <el-option
                  label="数据项累加"
                  value="sum"
                />
                <el-option
                  label="数据项计数 "
                  value="count"
                />
              </el-select>
            </div>
          </div>
        </template>
        <template v-if="cardData.cardType === 2">
          <div class="report_group">
            <span class="report_group_title">X轴字段</span>
            <div class="report_group_body">
              <el-select
                v-model="cardData.xField"
                placeholder="选择字段类型"
              >
                <el-option
                  v-for="(item,index) in currentTable"
                  :key="index"
                  :label="item.name"
                  :value="item.field"
                />
              </el-select>
            </div>
          </div>
          <div class="report_group">
            <span class="report_group_title">Y轴字段</span>
            <div class="report_group_body">
              <el-select
                v-model="cardData.yField"
                placeholder="选择字段类型"
              >
                <el-option
                  v-for="(item,index) in currentTable"
                  :key="index"
                  :label="item.name"
                  :value="item.field"
                />
              </el-select>
            </div>
          </div>
          <div class="report_group">
            <span class="report_group_title">图表类型</span>
            <div class="report_group_body">
              <el-select
                v-model="cardData.chartType"
                placeholder="请选择方式"
              >
                <el-option
                  label="柱状图"
                  :value="1"
                />
                <el-option
                  label="折线图"
                  :value="2"
                />
                <el-option
                  label="扇形图"
                  :value="3"
                />
              </el-select>
            </div>
          </div>
        </template>
      </div>
      <div class="table_item">
        <div class="browser_body_tips">
          <span>统计图表预览</span>
        </div>
        <div class="table_preview">
          <div v-if="cardData.cardType === 1" class="common_card">
            <card-item :data="cardData" :cid="cid" />
          </div>
          <div v-if="cardData.cardType === 2" class="common_cart">
            <echart-item :data="cardData" :cid="cid" />
          </div>
        </div>
      </div>
    </div>

    <div class="browser_body_bottom">
      <el-button size="large" style="width: 100px" @click="cancelAdd">
        取消
      </el-button>
      <el-button size="large" style="width: 100px" type="primary" @click="confirmAdd">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { gdmtInterfaceInfo } from '@/api/warehouse'
// import { useXFormStore } from '@/store/xForm'
import { useUserStore } from '@/store/modules/user'
import { useXFormStore } from '@/store/xForm'
import CardItem from './cardItem.vue'
import EchartItem from './echartItem.vue'

export default {
  name: 'CardDesignDia',
  components: {
    CardItem, EchartItem
  },
  props: ['interface', 'cid', 'data'],
  data() {
    return {
      browserFieldList: [],
      cardData: {
        title: '统计图表',
        cardType: 1,
        field: undefined,
        xField: undefined,
        yField: undefined,
        chartType: 1,
        countType: 'sum',
        echartOptions: '',
        xAxisField: '',
        yAxisField: ''
      },
      defaultOptions: '',
      currentTable: useXFormStore().currentTable
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.data) {
        this.cardData = JSON.parse(JSON.stringify(this.data))
      }
      this.initInterface()
    },
    initInterface() {
      console.log('this.interface', this.interface)
      const params = {
        accessToken: useUserStore().token,
        id: this.interface.id
      }
      gdmtInterfaceInfo(params).then(res => {
        if (res.code === 200) {
          // 先获取之前保存的，如果为空则说明没设置过
          if (res.data.templet && res.data.templet.json) {
            this.browserFieldList = res.data.templet.json || []
          }
        }
      })
    },
    cancelAdd() {
      this.$emit('exit')
    },
    confirmAdd() {
      this.$emit('updateItem', this.cardData)
    }
  }
}
</script>

<style lang="scss" scoped>
  .common_card {
    width: 386px;
    height: 220px;
  }

  .common_cart {
    width: 480px;
    height: 380px;
  }
  .browser_body {
    height: 100%;
    width: 100%;
    min-height: 500px;
    overflow: auto;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    &_tips {
      height: 48px;
      align-items: center;
    }
    &_drag {
      height: calc(100% - 48px - 60px);
      overflow: auto;
      display: flex;
      align-items: center;
    }
    &_bottom {
      height: 60px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }

  .draggable {
    width: 100%;
    height: 100%;
  }

  .field_item {
    border: 0.5px solid #a5a5a5;
    margin: 10px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_left {
      color: #999999;
      font-size: 16px;
    }
    &_right {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        color: #999999;
        font-size: 12px;
        margin: 0 8px;
      }
      &_input {
        width: 60px;
        margin: 0 8px;
        background: #fff;
      }
    }
  }

  ::v-deep .el-input__inner {
    background: #fff;
  }

  .dragg_span {
    margin:16px;
    color: #999999;
    font-size: 16px;
    cursor: pointer;
  }

  ::v-deep .el-checkbox__inner {
    background: #fff;
  }

  .report_group {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    &_title {
      color: #999999;
      font-size: 16px;
      width: 120px;
    }
    &_body {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }

  .table_design_body {
    display: flex;
    flex-direction: row;
    flex: 1;
  }

  .table_item {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .table_preview {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7f7f7;
    width: 100%;
    height: 100%;
  }

  .browser_body_bottom {
    width: 100%;
    height: 60px;
  }

</style>
