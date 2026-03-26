<!--主表浏览器页面-->
<template>
  <div class="tj_page">
    <div class="tj_body">
      <div v-for="(item, index) in tjArr" :key="index" :class="{'card_item':item.cardType === 1,'cart_item': item.cardType === 2, 'card_common': true}">
        <card-item v-if="item.cardType===1" :data="item" :cid="cid" />
        <echart-item v-if="item.cardType ===2" :data="item" :cid="cid" />
        <div class="opr_btns">
          <span @click="editCard(item, index)">编辑</span>
          <span @click="deleteCard(item, index)">删除</span>
        </div>
      </div>
      <div class="card_item add_card" @click="addCard">
        <el-icon size="40" color="#999">
          <Plus />
        </el-icon>
        <span style="color:#999">添加统计卡片</span>
      </div>
    </div>
    <div class="tj_bottom">
      <el-button style="margin:0 8px" @click="cancelAdd">
        取消
      </el-button>
      <el-button style="margin:0 8px" type="primary" @click="confirmAdd">
        保存
      </el-button>
    </div>
    <el-dialog
      v-model="showTableInterVis"
      title="统计卡片设计"
      width="75%"
      :close-on-click-modal="false"
    >
      <card-design v-if="showTableInterVis" :interface="interface" :cid="cid" :data="currentItem" @updateItem="updateItem" @exit="showTableInterVis=false" />
    </el-dialog>
  </div>
</template>

<script>
import { gdmtInterfaceInfo, gdmtInterfaceTemplet } from '@/api/warehouse'
// import { useXFormStore } from '@/store/xForm'
import { useUserStore } from '@/store/modules/user'
import CardItem from './cardItem.vue'
import EchartItem from './echartItem.vue'
import CardDesign from './cardDesignDia.vue'

export default {
  name: 'XTableIndex',
  components: {
    CardDesign,
    CardItem,
    EchartItem
  },
  props: ['interface', 'cid'],
  data() {
    return {
      tjArr: [],
      currentItem: null,
      currentIndex: -1,
      showTableInterVis: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
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
          try {
            this.tjArr = JSON.parse(res.data.templet.json)
          } catch (error) {
            this.tjArr = []
          }
        }
      })
    },
    updateItem(data) {
      this.tjArr[this.currentIndex] = data
      this.showTableInterVis = false
    },
    addCard() {
      this.tjArr.push({
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
      })
    },
    editCard(item, index) {
      this.currentItem = item
      this.currentIndex = index
      this.showTableInterVis = true
    },
    deleteCard(item, index) {
      this.tjArr.splice(index, 1)
    },
    cancelAdd() {
      this.$emit('exit')
    },
    confirmAdd() {
      let json = { json: JSON.stringify(this.tjArr) }
      const params = {
        accessToken: useUserStore().token,
        id: this.interface.id,
        templet: json
      }
      gdmtInterfaceTemplet(params).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: '保存成功!',
            type: 'success'
          })
          this.$emit('exit')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tj_page {
    height: 100%;
    width: 100%;
    min-height: 500px;
    overflow: auto;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
  }

  .tj_body {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    padding: 20px;
    width: 100%;
    align-content: flex-start;
  }

  .card_common {
    margin:10px;
    box-sizing: border-box;
  }

  .tj_bottom {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .card_item {
    display: flex;
    width: 380px;
    height: 200px;
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .cart_item {
    display: flex;
    width: 512px;
    height: 400px;
    position: relative;
    justify-content: center;
  }

  .add_card {
    display: flex;
    flex-direction: column;
    border: 2px dashed #b8b8b8;
    justify-content: center;
    align-items: center;
  }

  .opr_btns {
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 32px;
    background-color: #f0f0f0;
    span {
      margin: 0 8px;
      font-size: 14px;
      cursor: pointer;
    }
    span:nth-of-type(1) {
      color: #0296f1;
    }
    span:nth-of-type(2) {
      color: red;
    }
  }

</style>
