<template>
  <div class="meeting_vote">
    <div class="meeting_vote_title">
      <el-button type="primary" icon="Plus" @click="addMeeting({})">
        新建投票
      </el-button>
    </div>
    <div class="meeting_vote_body">
      <div v-for="(item, index) in tableData" :key="index" class="vote_item" @click="editMeeting(item)">
        <div class="vote_item_left">
          <div class="vote_item_left_title">
            <span>{{ item.title }}</span>
            <span v-if="item.anonymous===2">匿名</span>
          </div>
          <div class="vote_item_left_text">
            <span>{{ item.content }}</span>
          </div>
          <div class="vote_item_left_other">
            <div class="vote_item_left_other_item">
              <img src="@/assets/img/tx.png" />
              <span>{{ item['create_name'] }}</span>
            </div>
            <div class="vote_item_left_other_item flexRowAC ">
              <span v-if="item.status===0" class="wks">
                <template v-if="item.created_uid===store.userInfo.oort_uuid">未发布</template>
                <template v-else>未开始</template>
              </span>
              <span v-if="item.status===1" class="ing">
                <template v-if="item.created_uid===store.userInfo.oort_uuid">已发布</template>
                <template v-else>进行中</template>
              </span>
              <span v-if="item.status===3">已结束</span>
              <van-icon name="arrow" color="#999999" size="16" />
            </div>
            <div class="vote_item_left_other_item flexRowAC">
              <span v-if="item.is_voted" class="vo WX">已投票</span>
              <span v-else class="vo">未投票</span>
            </div>
            <div class="vote_item_left_other_item">
              <span>发布时间：{{ item.start_dt }}</span>
            </div>
            <div class="vote_item_left_other_item">
              <span>截止时间：{{ item.end_dt }}</span>
            </div>
            <div class="vote_item_left_other_item">
              <span>已参与人数：{{ item.voter_count }}</span>
            </div>
          </div>
        </div>
        <div class="vote_item_right">
          <div class="operateBox flexRowAC">
            <el-tooltip
              v-if="item.status===0"
              content="编辑"
              effect="light"
              placement="top"
            >
              <div class="new_table_svg_group" @click.stop="addMeeting(item)">
                <oort-svg-icon width="20" height="20" name="table_edit" class="new_table_svg_group_svg" />
              </div>
            </el-tooltip>
            <el-tooltip
              v-if="item.created_uid===store.userInfo.oort_uuid"
              content="删除"
              effect="light"
              placement="top"
            >
              <div class="new_table_svg_group" @click.stop="delClick(item)">
                <oort-svg-icon width="20" height="20" name="table_del" />
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div v-if="tableData&&tableData.length" class="paginationBox flexRowAC">
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 50]"
          layout="total,prev,pager, next,sizes"
          :total="count"
          class="justifyAlign"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="dViSi"
      top="5vh"
      width="50%"
      :title="dItem?.vote_uid?'编辑投票':'新建投票'"
      class="priview_dialog"
      append-to-body
    >
      <question-page v-if="dViSi" :item="dItem" @close="dViSi=false" @handle="getListFn" />
    </el-dialog>
    <el-dialog
      v-model="rViSi"
      top="5vh"
      width="50%"
      title="投票结果"
      class="priview_dialog"
      append-to-body
    >
      <vote-page-effect v-if="rViSi&&dItem.vote_uid" :item="dItem" @close="rViSi=false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { voteDel, voteList } from '@/api/meetingMana'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import QuestionPage from '@/pages/meetingMana/views/page/meetingMana/components/questionPage.vue'
import VotePageEffect from '@/pages/meetingMana/views/page/meetingMana/components/votePageEffect.vue'

const tableData = ref([])
let dViSi = ref(false)
let rViSi = ref(false)
let dItem = ref('')
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)
const props = defineProps(['id'])
const store: any = useUserStore()

const addMeeting = (rows) => {
  rows['conference_uid'] = props.id
  dItem.value = rows
  dViSi.value = true
}

// 投票
const editMeeting = (rows) => {
  rows['conference_uid'] = props.id
  dItem.value = rows
  rViSi.value = true
}

// 删除
const delClick = (rows) => {
  ElMessageBox.confirm('是否删除该投票？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(async() => {
    const params = {
      accessToken: useUserStore().token,
      conference_uid: rows.conference_uid,
      vote_uid: rows.vote_uid
    }
    let res: any = await voteDel(params)
    if (res.code === 200) {
      ElMessage.success('投票删除成功')
      getListFn()
    }
  })
}

const getListFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    page: page.value,
    pagesize: pagesize.value,
    conference_uid: props.id
  }
  let res: any = await voteList(data)
  if (res.code === 200) {
    tableData.value = res.data.list || []
    count.value = res.data.count
  }
}

function handleSizeChange(pageSize) {
  pagesize.value = pageSize
  getListFn()
}

function handleCurrentChange(pageNum) {
  page.value = pageNum
  getListFn()
}

watch(() => props.id, (val) => {
  if (val) getListFn()
}, { immediate: true })

</script>

<style lang="scss" scoped>
.meeting_vote {
}

.meeting_vote_title {
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

.meeting_vote_body {
  display: flex;
  flex-direction: column;
}

.vote_item:hover {
  background-color: var(--el-menu-hover-bg-color);

  .vote_item_right {
    display: flex;
  }
}

.vote_item:last-child {
  border-bottom: 1px solid #ebeef5;
}

.vote_item {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #ebeef5;
  padding: 10px 6px;

  &_left {
    padding: 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;

    &_title {
      display: flex;
      align-items: center;
      flex-direction: row;

      span:nth-of-type(1) {
        font-size: 16px;
        color: #333333;
      }

      span:nth-of-type(2) {
        background: var(--el-menu-hover-bg-color);
        border-radius: 2px;
        padding: 4px 8px;
        font-size: 10px;
        color: var(--el-color-primary);
        margin-left: 10px;
      }

    }

    &_text {
      margin: 4px 0;
      font-size: 14px;
      color: #666666;
    }

    &_other {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 20px;

      &_item {
        margin-right: 12px;
        display: flex;
        align-items: center;

        img {
          width: 16px;
          height: 16px;
        }

        span {
          margin-left: 8px;
          font-size: 12px;
          color: #999999;
          margin-left: 4px;
        }
      }
    }
  }

  .vote_item_right {
    width: 80px;
    display: none;
    flex-direction: row;

    img {
      margin-right: 16px;
      width: 30px;
      height: 30px;
    }
  }
}

.paginationBox {
  justify-content: center;
  height: 100px;
}

.operateBox {
  align-items: flex-end;
}

.vo {
  position: relative;
  padding-left: 12px;

  &:before {
    content: "";
    display: flex;
    position: absolute;
    top: 6px;
    left: 0px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: gray;
  }

  &.WX {
    color: #52C41A;

    &:before {
      background: #52C41A;
    }
  }
}

.vote_item_left_other_item {
  .ing {
    color: #3CB300;
  }

  .wks {
    color: #F77C3C;
  }
}
</style>
