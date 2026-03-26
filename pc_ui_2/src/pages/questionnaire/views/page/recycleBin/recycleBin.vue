<template>
  <div class="homePage">
    <div class="homeTitle">
      回收站
    </div>
    <div class="flexRowAC quesCon">
      <div class="quesLTabsBox flexRowAC">
        <div
          v-for="(item,i) in quesList"
          :key="i"
          class="quesLTabsItem flexRowAC"
          :class="{act:i===qtlACt}"
          @click="qtlACt=i"
        >
          <img :src="item.img" class="qLTabsImg" alt="" />
          {{ item.t }}
        </div>
      </div>
      <div v-for="(item,i) in satiQuesL" :key="i" class="satiQues">
        <div class="satiQuesT flexRowAC">
          {{ item.t }}
          <div class="satiQuesTR flexRowAC">
            <div>ID：26591692</div>
            <div>10月10日 10:21</div>
          </div>
        </div>
        <div class="saOpeBoxOut flexRowAC">
          <div class="flexRowAC saOpeBox">
            <div class="saOpeT flexRowAC">
              <img class="saOpeImg" :src="copy" alt="" />
              回收站
            </div>
            <div class="saOpeT flexRowAC">
              <img class="saOpeImg" :src="copy" alt="" />
              彻底删除
            </div>
          </div>
        </div>
      </div>
      <div class="paginationBox flexRowAC">
        <el-pagination
          background
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagesize"
          layout="total, prev, pager, next, sizes"
          :total="count"
          class="justifyAlign"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ques from '@/assets/img/questionnaire/ques.png'
import vote from '@/assets/img/questionnaire/vote.png'
import online from '@/assets/img/questionnaire/online.png'
import clock from '@/assets/img/questionnaire/clock.png'
import sign from '@/assets/img/questionnaire/sign.png'
import assess from '@/assets/img/questionnaire/assess.png'
import copy from '@/assets/img/questionnaire/copy.png'

let count = ref<number>(0)
let page = ref<Number>(1)
let pagesize = ref<Number>(10)
let qtlACt = ref<number>(0) // act
let quesList = ref<any>([])
let satiQuesL = ref<any>([])
quesList.value = [
  { img: ques, t: '问卷调查' },
  { img: vote, t: '投票评选' },
  { img: online, t: '在线考试' },
  { img: clock, t: '接龙打卡' },
  { img: sign, t: '报名签到' },
  { img: assess, t: '在线测评' },
  { img: assess, t: '360评估' }
]
satiQuesL.value = [
  { img: '', t: '满意度调查问卷' },
  { img: '', t: '满意度调查问卷1' },
  { img: '', t: '9月15日加班餐接龙' },
  { img: '', t: '培训考试' }
]

// list
const getlistFn = () => {
}
let handleSizeChange = (val: number) => {
  pagesize.value = val
  getlistFn()
}
let handleCurrentChange = (val: number) => {
  page.value = val
  getlistFn()
}

onMounted(() => {
  getlistFn()
})
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
  //background: #F7F7F7;

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

.quesCon {
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 0 0 20px;
  gap: 20px;
}

.quesLTabsBox {
  padding: 4px;
  border-radius: 8px;
  background: #F8F8F8;
  gap: 12px;

  .quesLTabsItem {
    cursor: pointer;
    color: #333333;
    font-size: 14px;
    gap: 8px;
    padding: 5px 20px;

    .qLTabsImg {
      width: 32px;
      height: 32px;
    }
  }

  .quesLTabsItem.act {
    border-radius: 4px;
    color: var(--el-color-primary);
    background-color: #fff;
  }
}

.satiQues {
  width: calc(100% - 20px);
  padding: 20px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.04);

  .satiQuesT {
    font-size: 18px;
    padding-bottom: 20px;
    justify-content: space-between;

    .satiQuesTR {
      font-size: 14px;
      gap: 30px;
    }
  }

  .saOpeBoxOut {
    justify-content: space-between;
  }

  .saOpeBox {
    gap: 40px;

    .saOpeT {
      cursor: pointer;
      font-size: 14px;
      gap: 4px;
    }

    .saOpeImg {
      width: 20px;
      height: 20px;
    }
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

.paginationBox {
  justify-content: center;
  width: 100%;
  height: 100px;
}
</style>
