<template>
  <div class="template_body">
    <div class="template_item" @click="selectTemplate('[]')">
      <span>空白模版</span>
    </div>
    <div
      v-for="(item,index) in templateList"
      :key="index"
      class="template_item"
      @click="selectTemplate(item.jsonTemplate)"
    >
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
import { generateInterfaceJSON } from '../util/formUtils'
// import { mapGetters } from 'vuex'
export default {
  name: 'SelectTemplate',
  data() {
    return {
      templateList: [
        { name: '当前主表模板', jsonTemplate: '' }
      ]
    }
  },
  // computed: {
  //   ...mapGetters({
  //     currentTable: 'currentTable'
  //   })
  // },
  created() {
    this.init()
  },
  methods: {
    init() {
      let json = generateInterfaceJSON(this.currentTable)
      this.templateList = [{ name: '当前主表模板', jsonTemplate: JSON.stringify(json) }]
    },
    selectTemplate(data) {
      this.$emit('selectTemplate', data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .template_body {
    display: flex;
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
  }

  .template_item:hover {
    background: #d5dff3;
    border: 0.5px solid #518ff1;
    span {
      color: #518ff1;
    }
  }

  .template_item {
    cursor: pointer;
    margin: 16px;
    width: 200px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-items: center;
    border: 0.5px solid #a5a5a5;
    span {
      font-size: 16px;
      color: #6a6a6a;
    }
  }
</style>
