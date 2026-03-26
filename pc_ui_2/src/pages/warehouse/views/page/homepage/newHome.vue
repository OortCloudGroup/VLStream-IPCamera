<!--主表浏览器页面-->
<template>
  <div class="tj_page">
    <div class="tj_top">
      <span class="tj_top_span">当前分类:</span>
      <el-tree-select
        v-model="cid"
        :data="treeData"
        node-key="id"
        value-key="id"
        :current-node-key="1"
        :props="defaultProps"
        check-strictly
        :render-after-expand="false"
        style="width: 240px"
        @node-click="changeTreeItem"
      />
    </div>
    <div v-if="interface" class="tj_body">
      <div v-for="(item, index) in tjArr" :key="index" :class="{'card_item':item.cardType === 1,'cart_item': item.cardType === 2, 'card_common': true}">
        <card-item v-if="item.cardType===1" :data="item" :cid="cid" />
        <echart-item v-if="item.cardType ===2" :data="item" :cid="cid" />
      </div>
    </div>
    <div v-else class="tj_body tj_empty">
      <span>当前分类没有统计界面</span>
    </div>
  </div>
</template>

<script>
import { gdmtInterfaceInfo } from '@/api/warehouse'
import { useUserStore } from '@/store/modules/user'
import CardItem from '../XTable/cardItem.vue'
import EchartItem from '../XTable/echartItem.vue'
import { ckmtClassifyInAll, ckmtClassifyAll } from '@/api/warehouse'

export default {
  name: 'XTableIndex',
  components: {
    CardItem,
    EchartItem
  },
  data() {
    return {
      tjArr: [],
      cid: 1,
      interface: null,
      treeData: '',
      currentC: '',
      value: '',
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getAllClassify()
      await this.getAllInterFace()
      await this.initInterface()
    },
    async getAllClassify() {
      let data = {
        accessToken: useUserStore().userInfo.accessToken
      }
      let res = await ckmtClassifyAll(data)
      if (res.code === 200) {
        this.treeData = res.data
        this.currentC = res.data[0]
      }
    },
    async getAllInterFace() {
      let data = {
        accessToken: useUserStore().userInfo.accessToken,
        cid: this.cid
      }
      let res = await ckmtClassifyInAll(data)
      if (res.code === 200) {
        let classifyArr = res.data || []
        if (classifyArr.length === 0) {
          ElMessage({
            message: '当前分类没有统计界面',
            type: 'warning'
          })
          this.interface = null
          return
        } else {
          // 获取当前生效的界面信息
          this.interface = classifyArr.filter(item => item.status === 1 && item.type === 5)[0]
        }
      }
    },
    async changeTreeItem(data) {
      this.cid = data.id
      await this.getAllInterFace()
      await this.initInterface()
    },
    initInterface() {
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
    padding: 5px;
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
    width: 513px;
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

  .tj_top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    padding: 0 16px
  }

  .tj_top_span {
    font-size: 16px;
    color: #666;
    margin: 0 8px;
  }

  .tj_empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    span {
      font-size: 22px;
      color: #f77604;
    }
  }

</style>
