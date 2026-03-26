<template>
  <div class="homePage codeCreate">
    <div class="codeC_content">
      <div class="flexRowAC creTabBox">
        <div v-for="(item,i) in creTab" :key="i" class="flexRowAC cTItem" :class="{act:cAct===i}" @click="cAct=i">
          {{ item }}
        </div>
      </div>
      <code-create-code v-if="cAct===0" />
      <code-create-a-p-i v-if="cAct===1" />
      <code-create-docu v-if="cAct===2" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CodeCreateCode from './codeCreateCode.vue'
import CodeCreateAPI from './codeCreateAPI.vue'
import CodeCreateDocu from './codeCreateDocu.vue'

let creTab = ref<any>(['创建二维码', 'API生成', '查看文档']) // 创建二维码
let cAct = ref<number>(0)
</script>
<style lang="scss" scoped>
.codeCreate {
  height: 100%;

  .codeC_content {
    height: 100%;
    overflow: auto;
    padding: 40px;
    border-radius: 10px;
    background-color: #fff;
  }
}

// 创建二维码
.creTabBox {
  gap: 40px;
  padding-bottom: 40px;

  .cTItem {
    cursor: pointer;
    font-size: 16px;
    color: #939393;
    position: relative;
    padding-bottom: 6px;
    align-items: flex-start;
  }

  .cTItem.act {
    color: var(--el-color-primary);

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 34px;
      height: 2px;
      background: var(--el-color-primary);
      transform: translate(50%);
    }
  }
}

.creddTabBox {
  .cdTItem {
    cursor: pointer;
    color: #939393;
    padding: 10px 20px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.04);
  }

  .cdTItem.act {
    border-color: var(--el-color-primary);
  }
}
</style>
