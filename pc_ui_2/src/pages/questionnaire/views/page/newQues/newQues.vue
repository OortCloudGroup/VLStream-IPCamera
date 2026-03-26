<template>
  <div class="homePage">
    <div class="homeTitle flexRowAC">
      新建问卷
      <el-button @click="titleW=!titleW">
        预览
      </el-button>
    </div>
    <div class="cT_content flexRowAC">
      <div class="cTC_l">
        <div class="cTC_l_title flexRowAC">
          <div class="line" />
          题型
        </div>
        <div class="cTC_l_title_d">
          添加基础题目
        </div>
        <div class="quesType flexRowAC">
          <div v-for="(item,i) in quesTypeArr" :key="i" class="quesTypeItem flexRowAC" @click="quesAddClick(item.d)">
            <img class="quesTypeImg" :src="item.img" alt="" />
            {{ item.t }}
          </div>
        </div>
      </div>
      <div v-if="titleW" class="cTC_R">
        <div class="quesBOx t_t">
          <div class="t_title tt flexRowAC">
            <span class="mustRed">*</span>
            <el-input
              v-model="testTopic.title"
              maxlength="20"
              show-word-limit
            />
          </div>
          <div class="flexRowAC">
            <span class="mustRed" />
            <el-input v-model="testTopic.desc" type="textarea" maxlength="256" show-word-limit />
          </div>
          <!--题目标题-->
        </div>
        <div
          v-for="(item, i) in testTopic['children']"
          :key="i"
          class="quesBOx t_t"
        >
          <div
            class="singleChoice"
            :class="{MulChoice:item.id==='mc',singleCloze:item.id==='scl',mulCloze:item.id==='mcl',shortAnswer:item.id==='sa',mulShortAnswer:item.id==='msa',trueFalse:item.id==='tf'}"
          >
            <div class="noTitleBox flexRowAC">
              <span class="mustRed">*</span>
              <span v-if="i<10">0</span>{{ i + 1 }}、
              <el-input
                v-model="item.choiceT"
                maxlength="256"
                show-word-limit
              />
              <el-icon class="quesTitleDel" @click="delOptionClick(i)">
                <Delete />
              </el-icon>
            </div>
            <!--选项-->
            <div v-if="item?.choiceArr" class="scSBox">
              <div
                v-for="(child, index) in item.choiceArr"
                :key="index"
                class="scS flexRowAC"
              >
                <div v-if="item.id==='sel'" class="scS_inp flexRowAC">
                  <div class="circleSing" />
                  <el-input v-model="child.t" maxlength="50" show-word-limit />
                </div>
                <div v-if="item.id==='mul'" class="scS_inp flexRowAC">
                  <div class="squareMul" />
                  <el-input v-model="child.t" maxlength="50" show-word-limit />
                </div>
                <div v-if="item.id==='cloze'" class="scS_inp">
                  <el-input v-model="child.t" class="PL12" maxlength="50" show-word-limit />
                  <div class="scS_R" />
                </div>
                <div class="removeOption flexRowAC" @click="removeClick(item.id,index,i)">
                  <div class="removeO_l flexRowAC">
                    <div class="removeO_l_l" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.id==='sel'||item.id==='mul'" class="flexRowAC scAdd" @click="addOptionClick(item.id,i)">
              <div class="scAdd_op flexRowAC">
                <el-icon>
                  <plus />
                </el-icon>
                添加
              </div>
            </div>
          </div>
        </div>
        <!-- end-->
      </div>
      <div v-else class="cTC_R">
        <div class="vQuesBox t_t">
          <div class="t_title">
            {{ testTopic.title }}
          </div>
          <div class="t_titile_desc">
            {{ testTopic.desc }}
          </div>
          <!--题目标题-->
          <div
            v-for="(item, i) in testTopic['children']"
            :key="i"
            class="singleChoice"
            :class="{MulChoice:item.id==='mc',singleCloze:item.id==='scl',mulCloze:item.id==='mcl',shortAnswer:item.id==='sa',mulShortAnswer:item.id==='msa',trueFalse:item.id==='tf'}"
          >
            <div class="quesTBOx">
              <div class="quesTTopBOx flexRowAC">
                <span class="mustRed">*</span>
                <span v-if="i<10">0</span>{{ i + 1 }}、
                <div class="quesTitle qtInp">
                  {{ item['choiceT'] }}
                </div>
                <span v-if="item?.id" class="tspan">
                  <span v-if="item.id==='sel'">单选题</span>
                  <span v-if="item.id==='mul'">多选题</span>
                  <span v-if="item.id==='cloze'">填空题</span>
                  <span v-if="item.id==='score'">评分题</span>
                </span>
              </div>
            </div>
            <!--选项-->
            <div class="scSBox">
              <div
                v-for="(child, index) in item.choiceArr"
                :key="index"
                class="scS flexRowAC"
                :class="{tt:child.flag===false}"
              >
                <div v-if="item.id==='sel'" class="circleSing" />
                <div v-if="item.id==='mul'" class="squareMul" />
                <div class="clozeW">
                  {{ child.t }}
                </div>
              </div>
            </div>
          </div>
          <!-- end-->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import ic_2 from '@/assets/img/questionnaire/ques.png'
import ic_4 from '@/assets/img/questionnaire/vote.png'
import ic_6 from '@/assets/img/questionnaire/online.png'

// const router = useRouter()
let titleW = ref(true)
let quesTypeArr = ref<any>([])
let testTopic = ref<any>({})

quesTypeArr.value = [
  { t: '单选题', img: ic_2, d: 'sel' },
  { t: '多选题', img: ic_2, d: 'mul' },
  { t: '填空题', img: ic_4, d: 'cloze' },
  { t: '评分题', img: ic_6, d: 'score' }
]
testTopic.value = {
  title: '添加标题',
  desc: '添加说明',
  children: []
}

const quesAddClick = (val) => {
  if (val === 'sel') {
    let obj: any = {
      choiceT: '单选标题',
      id: val,
      choiceArr: [
        { t: '选项1', flag: true },
        { t: '选项2', flag: true },
        { t: '选项3', flag: true }
      ]
    }
    testTopic.value['children'].push(obj)
  }
  if (val === 'mul') {
    let obj: any = {
      choiceT: '多选标题',
      id: val,
      choiceArr: [
        { t: '选项1' },
        { t: '选项2' },
        { t: '选项3' }
      ]
    }
    testTopic.value['children'].push(obj)
  }
  if (val === 'cloze') {
    let obj: any = {
      choiceT: '填空标题',
      id: val
    }
    testTopic.value['children'].push(obj)
  }
  if (val === 'score') {
    let obj: any = {
      choiceT: '评分标题',
      scoreH: '',
      scoreL: '',
      id: val
    }
    testTopic.value['children'].push(obj)
  }
}

const addOptionClick = (val, i) => {
  if (val === 'sel') {
    let obj = { t: '选项' + Number(testTopic.value['children'][i].choiceArr.length + 1) }
    testTopic.value['children'][i].choiceArr.push(obj)
  }
  if (val === 'mul') {
    let obj = { t: '选项' + Number(testTopic.value['children'][i].choiceArr.length + 1) }
    testTopic.value['children'][i].choiceArr.push(obj)
  }
}

const removeClick = (val, index, i) => {
  let flag = val === 'sel' || val === 'mul'
  if (flag && testTopic.value['children'][i].choiceArr.length > 1) {
    testTopic.value['children'][i].choiceArr.splice(index, 1)
  }
}

const delOptionClick = (i) => {
  testTopic.value['children'].splice(i, 1)
}
</script>
<style lang="scss" scoped>
.homeTitle {
  justify-content: space-between;
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

.cursorP {
  flex: 1;
  cursor: pointer;
}

.PL12 {
  padding-left: 16px;
}

.clozeW {
  flex: 1;
}

.tt {
  :deep(.el-input) {
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    height: inherit;

    .el-input__inner {
      padding: 0;
      background-color: transparent;
      border: none;
      font-size: inherit;
      color: inherit;
      font-weight: inherit;
      height: inherit;
    }

    .el-input__count {
      align-items: end;
    }
  }
}

.removeOption {
  justify-content: center;
  cursor: pointer;
  width: 48px;
  height: 48px;

  .removeO_l {
    justify-content: center;
    width: 16px;
    height: 16px;
    background-color: red;
    border-radius: 50%;
  }

  .removeO_l_l {
    width: 12px;
    height: 2px;
    background-color: #fff;
  }
}

.mustRed {
  font-size: 14px;
  color: red;
  top: 0px;
}

.circleSing {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #C6CBD4;
  margin: 0 21px 0 24px;
}

.squareMul {
  width: 14px;
  height: 14px;
  border: 1px solid #C6CBD4;
  margin: 0 21px 0 24px;
}

.singleChoice {
  .scSBox {
    width: 964px;
    margin: 0 auto 16px;
  }

  .scS {
    margin-bottom: 8px;
    width: 680px;
    height: 48px;
  }

  .scS_inp {
    width: 100%;
  }

  .scAdd {
    margin-left: 12px;
    font-size: 16px;
    color: var(--el-color-primary);
    font-weight: 400;
  }

  .scAdd_op {
    cursor: pointer;
    font-size: 16px;
    justify-content: center;
    gap: 8px;

    .el-icon {
      width: 16px;
      height: 16px;
      font-size: 14px;
      border-radius: 2.29px;
      color: #fff;
      background: var(--el-color-primary);
    }
  }
}

// 题型
.cT_content {
  height: calc(100% - 64px);
  gap: 20px;
  padding-top: 4px;
  align-items: flex-start;
  background-color: #F7F7F7;

  .cTC_l {
    height: 100%;
    width: 300px;
    padding: 20px;
    background-color: #fff;
  }

  .cTC_l_title {
    gap: 8px;
    color: #3D3D3D;
    font-weight: bold;
    font-size: 18px;

    .line {
      width: 3px;
      height: 20px;
      opacity: 1;
      border-radius: 47px;
      background: #0F6BFF;
    }
  }

  .cTC_l_title_d {
    color: #718096;
    font-size: 12px;
    padding: 16px 0 0;
  }
}

// 添加基础题目
.quesType {
  padding-top: 15px;
  gap: 12px;
  flex-wrap: wrap;

  .quesTypeImg {
    width: 24px;
    height: 24px;
    background-size: cover;
  }

  .quesTypeItem {
    cursor: pointer;
    padding: 8px;
    width: calc(50% - 6px);
    gap: 8px;
    background-color: #F8F8F8;
    font-size: 14px;
    color: #666;
  }
}

// 题目
.cTC_R {
  height: 100%;
  overflow: auto;
  background-color: #fff;
  flex: 1;

  .mustRed {
    text-align: center;
    width: 24px;
    font-size: 14px;
    color: red;
  }

  .t_t {
    width: 90%;
    margin: 20px auto 20px;

    .t_title {
      margin: 0 auto 20px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 24px;
      color: var(--el-color-primary);
      font-weight: 700;
      position: relative;
    }

    .t_titile_desc {
      margin: 0 auto 20px;
      font-size: 14px;
      color: #333333;
      padding: 10px 12px;
      height: 62px;
    }
  }
}

// 预览题目
.vQuesBox {
  width: 1280px;
  margin: 0 auto 20px;

  .t_title {
    padding: 30px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 24px;
    color: var(--el-color-primary);
    font-weight: 700;
  }
}

// 编辑题目
.quesBOx {
  border: 1px dashed var(--el-color-primary);
  background-color: #F8F8F8;
  padding: 20px 120px !important;

  .quesTitle {
    flex: 1;
  }
  .noTitleBox {
    .quesTitleDel {
      width: 48px;
      height: 48px;
    }
  }
}

.quesTBOx{
  .tspan{
    padding: 2px 12px;
    margin-left: 8px;
    border-radius: 4px;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-dark-2);
    background-color: var(--el-color-primary-light-9);
    background-color: var(--el-color-primary-hb);
  }
}
</style>
