<template>
  <div class="votePageEffect">
    <div v-if="voteTemp" class="titleName">
      <div class="t1 flexRowAC">
        {{ voteTemp.title }}
        <span v-if="voteTemp.anonymous===2" class="ann">匿名</span>
      </div>
      <div class="t2">
        {{ voteTemp.content }}
      </div>
      <div class="flexRowAC">
        {{ item.total_votes || 0 }}人已投 ·
        <div class="meeting_vote_item_right">
          <span v-if="item.status===0" class="wks">
            未开始
          </span>
          <span v-if="item.status===1" class="ing">
            进行中
          </span>
          <span v-if="item.status===3">已结束</span>
        </div>
      </div>
    </div>
    <div class="effect_content">
      <!--题目-->
      <div class="work_index_body_title optionsBox">
        <div v-for="(item,i) in form.themes" :key="i" class="optionsItem">
          <div v-if="item.multi===1" class="optionsItemInner">
            <div class="ti flexRowAC">
              {{ NOFn(i) }}.{{ item.theme }} <span class="t_s">「单选」</span>
            </div>
            <el-radio-group>
              <el-radio v-for="(tt,ii) in item.options" :key="ii" :value="tt.option_content">
                <div v-if="tt.url" class="flexRowAC">
                  <oort_img
                    :key="tt.url"
                    class="image"
                    :src="tt.url||tt"
                  />
                </div>
                <div class="flexRowAC voteNums">
                  {{ tt.option_content }}
                  <div v-if="is_vote" class="s">
                    {{ tt.votes || 0 }}票 · {{ (parseFloat(tt.votes / item.total_votes) || 0) * 100 }}%
                  </div>
                </div>
                <template v-if="is_vote">
                  <div class="proBox">
                    <div class="pro" :style="'width: '+ (parseFloat(tt.votes / item.total_votes) || 0) * 100+'%;'" />
                  </div>
                  <div class="flexRowAC photoBox">
                    <div v-for="(mm,im) in tt.voters" :key="im" class="flexRowAC photoBox">
                      <oort-img class="mm_photo" :src="mm.photo" default-img="tx" />
                      <span class="t">{{ mm.user_name }}</span>
                    </div>
                  </div>
                </template>
              </el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.multi===2" class="optionsItemInner">
            <div class="ti">
              {{ NOFn(i) }}.{{ item.theme }}<span class="t_s">「多选」</span>
            </div>
            <el-checkbox-group>
              <el-checkbox v-for="(tt,ii) in item.options" :key="ii" shape="square" :value="item.options">
                <div v-if="tt.url" class="flexRowAC">
                  <oort_img
                    :key="tt.url"
                    class="image"
                    :src="tt.url||tt"
                  />
                </div>
                <div class="flexRowAC voteNums">
                  {{ tt.option_content }}
                  <div v-if="is_vote" class="s">
                    {{ tt.votes || 0 }}票 · {{ (parseFloat(tt.votes / item.total_votes) || 0) * 100 }}%
                  </div>
                </div>
                <template v-if="is_vote">
                  <div class="proBox">
                    <div class="pro" :style="'width: '+ (parseFloat(tt.votes / item.total_votes) || 0) * 100+'%;'" />
                  </div>
                  <div class="flexRowAC photoBox">
                    <div v-for="(mm,im) in tt.voters" :key="im" class="flexRowAC">
                      <oort-img class="mm_photo" :src="mm.photo" default-img="tx" />
                      <span class="t">{{ mm.user_name }}</span>
                    </div>
                  </div>
                </template>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <!--题目-end-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { vote2Info } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'
import Oort_img from '@/components/oort_img.vue'
import OortImg from '@/components/oort_img.vue'

const store: any = useUserStore()
const props = defineProps(['item'])
let is_vote = ref(false)
let voteTemp = ref('')
const form = reactive({
  title: '',
  themes: []
})

// 题目序号
const NOFn = (index) => {
  index = Number(index + 1)
  return index > 9 ? index : '0' + index
}

const infoFn = async() => {
  const params = {
    accessToken: store.userInfo.accessToken,
    vote_uid: props.item.vote_uid
  }
  let res: any = await vote2Info(params)
  if (res.code === 200) {
    form.themes = res.data.themes
    voteTemp.value = res.data.vote
    is_vote.value = res.data.is_vote
  }
}
if (props.item) infoFn()

</script>
<style lang="scss" scoped>
.votePageEffect {
  .title {
    font-family: MicrosoftYaHei;
    font-size: 20px;
    color: #111827;
    letter-spacing: 0;
    line-height: 30px;
    font-weight: 400;
    border-bottom: 1px solid #E8E8E8;
  }

  .titleName {
    padding-bottom: 20px;

    .t1 {
      font-size: 28px;
      color: #121828;
      letter-spacing: 0.35px;
      font-weight: 400;

      .ann {
        margin-top: 0;
        background: rgba(15, 107, 255, .1);
        border-radius: 2px;
        padding: 2px 4px;
        font-size: 10px;
        color: #0F6BFF;
        margin-left: 10px;
        background: var(--el-menu-hover-bg-color);
        color: var(--el-color-primary);
      }
    }

    .t2 {
      padding-bottom: 10px;
      font-size: 16px;
      color: #999;
      letter-spacing: 0.35px;
      font-weight: 400;
    }
  }
}

.work_index_body_title {
  background-color: #fff;

  .title {
    width: calc(100% - 20px);
    padding: 16px 6px;
    margin: 0 10px;
    font-size: 22px;
    border-bottom: 1px solid #E8E8E8;
  }

  .cover {
    width: 50%;
    justify-content: center;
    flex-direction: column;
    border-radius: 0px;
    background: #EBEFF6;
    padding: 8px;
  }

  .topic {
    padding: 20px 16px 10px;
    color: #718096;
    width: 100%;
    background-color: #f7F7F7;
  }

  :deep(.van-icon) {
    display: flex;
    align-items: center;
  }
}

.optionsBox {
  border-radius: 12px;
  border-radius: 12px;

  .optionsItem {
    background: #FAFAFA;;
    margin-bottom: 10px;
    padding: 18px 16px;
    border-radius: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    // 投票数
    .optionsItemInner {
      padding-bottom: 8px;

      .voteNums {
        justify-content: space-between;

        .s {
          font-size: 14px;
          color: #718096;
          letter-spacing: 0.17px;
          text-align: right;
          font-weight: 400;
        }
      }

      .proBox{
        margin-top: 18px;
        height: 4px;
        background-color: #ECECEC;
        border-radius: 10px;
      }

      .pro{
        height: 4px;
        border-radius: 10px;
        background-color: var(--el-color-primary);
      }
    }

    .ti {
      color: #1A1A1A;
      font-size: 18px;
      line-height: normal;
      letter-spacing: 0px;
      text-align: left;
      padding-bottom: 12px;

      .t_s {
        font-size: 16px;
        color: #718096;
        font-weight: 400;
      }
    }

    .van-radio, .van-checkbox {
      padding-bottom: 12px;
      align-items: flex-start;
    }

    .image {
      margin-bottom: 10px;
      width: auto;
      height: 76px;
      background-size: cover;
    }

  }

  // 单选
  :deep(.el-radio-group){
    width: 100%;
    flex-direction: column;
    gap: 32px;

    .el-radio {
      margin: 0;
      width: 100%;
      height: inherit;
    }

    .el-radio__input {
      display: none;
    }

    .el-radio__label {
      width: 100%;
      padding: 0;
    }
  }

  // 多选选
  :deep(.el-checkbox-group) {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 32px;

    .el-checkbox {
      margin: 0;
      width: 100%;
      height: inherit;
    }

    .el-checkbox__input {
      display: none;
    }

    .el-checkbox__label {
      width: 100%;
      padding: 0;
    }
  }
}

// 进行中
.meeting_vote_item_right {
  display: flex;
  flex-direction: row;

  .ing {
    color: #3CB300;
  }

  .wks {
    color: #F77C3C;
  }

  span {
    font-size: 14px;
    color: #999999;
    margin-right: 10px;
  }

  :deep(.van-icon) {
    display: flex;
    align-items: center;
  }
}

// 投票人员头像
.photoBox{
  padding-top: 8px;
  margin-right: 20px;
  .mm_photo{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-size: cover;
    margin-right: 10px;
  }
}
</style>

