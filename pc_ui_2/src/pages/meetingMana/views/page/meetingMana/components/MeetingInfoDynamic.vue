<template>
  <div class="dynamicPage">
    <div class="issueBox">
      <el-input
        v-model="form.content"
        :rows="5"
        class="dsarea"
        maxlength="256"
        placeholder="说点什么吧"
        show-word-limit
        type="textarea"
      />
      <div class="coverBoxOut">
        <div v-if="form.material_photo&&form.material_photo.length" class="coverBox flexRowAC">
          <div v-for="(item,index) in form.material_photo" :key="index" class="img d">
            <img v-if="item" class="img" :src="item.url" alt="" />
            <el-icon @click="form.material_photo.splice(index,1)">
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
        <div v-if="form.material_audio&&form.material_audio.length" class="coverBox do flexRowAC">
          <div v-for="(item,index) in form.material_audio" :key="index" class="doTitle d">
            {{ item.url }}
            <el-icon @click="form.material_audio.splice(index,1)">
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
        <div v-if="form.material_document&&form.material_document.length" class="coverBox do flexRowAC">
          <div v-for="(item,index) in form.material_document" :key="index" class="doTitle d">
            {{ item.url }}
            <el-icon @click="form.material_document.splice(index,1)">
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="isBtnBox flexRowAC">
        <div class="isBtnL flexRowAC">
          <oort_upload
            :size-limit="9999"
            :accept="'image/*,'"
            tip="上传菜单Logo"
            :uploader="true"
            @update:photo="val=>photoFn(val,1)"
          >
            <template #uploader>
              <img name="avatar-uploader" class="isBtnimg" src="@/assets/img/meeting_assistant/textPhoto.png" alt="" />
            </template>
          </oort_upload>
          <oort_upload
            :size-limit="9999"
            :data-obj="true"
            accept="video/*, audio/*"
            :uploader="true"
            @update:photo="val=>photoFn(val,2, obj)"
          >
            <template #uploader>
              <img class="isBtnimg" src="@/assets/img/meeting_assistant/textAudio.png" alt="" />
            </template>
          </oort_upload>
          <oort_upload
            :size-limit="9999"
            :data-obj="true"
            accept=".word,.excel,.ppt,.doc,.docx,.pdf,.xls,.xlsx,.pdf,.apk,.zip,.rar,.7z,.tar,.gz,.txt"
            :uploader="true"
            :size-tip="'文件大小不能超过'"
            @update:photo="(val,obj)=>photoFn(val,3, obj)"
          >
            <template #uploader>
              <img class="isBtnimg" src="@/assets/img/meeting_assistant/textFile.png" alt="" />
            </template>
          </oort_upload>
        </div>
        <el-button class="issue" @click="commentFn">
          发表
        </el-button>
      </div>
    </div>
    <div v-for="(item,i) in commentList" :key="i" class="commentListBox">
      <div class="flexcontent flexRowAC">
        <div class="av flexRowAC">
          <el-avatar v-if="item['user_info']['from_photo']" :size="42" :src="item['user_info']['from_photo']" />
          <img v-else src="@/assets/img/tx.png" />
          <span>{{ item['user_info']['from_user_name'] || '-' }}</span>
        </div>
        <div class="perr-time">
          {{ item['created_at'] || '-' }}
        </div>
      </div>
      <div class="part">
        <div class="part_r">
          <div class="title">
            {{ item.content }}
          </div>
          <div class="title_photo">
            <div class="flexRowAC listBoxOut">
              <div v-for="(mm, mi) in item['media_photo']" :key="mi" class="listBox flexRowAC">
                <el-image
                  v-if="mm.title"
                  class="files_png"
                  :zoom-rate="1.2"
                  :src="mm.url"
                  show-progress
                  :preview-src-list="item['media_photo'].map(tt=>tt.url)"
                  fit="cover"
                />
              </div>
            </div>
            <div v-for="(mm, mi) in item['media_audio']" :key="mi" class="listBox do flexRowAC">
              <div class="files_pdf flexRowAC">
                <calc-file-type-img class="urlBox" :data="mm.title" />
                <div class="view flexRowAC">
                  <preview-files-url :url="mm.url">
                    <template #url>
                      <el-icon>
                        <View />
                      </el-icon>
                    </template>
                  </preview-files-url>
                  <el-icon @click="viewFn(mm.url)">
                    <Download />
                  </el-icon>
                </div>
                <div>
                  {{ mm.title }}
                  <div class="time">
                    {{ FilesSizeCalc(mm.size) }} ・ {{ mm['created_at'] }}
                  </div>
                </div>
              </div>
            </div>
            <div v-for="(mm, mi) in item['media_document']" :key="mi" class="listBox do flexRowAC">
              <div class="files_pdf flexRowAC">
                <calc-file-type-img class="urlBox" :data="mm.title" />
                <div class="view flexRowAC">
                  <preview-files-url :url="mm.url">
                    <template #url>
                      <el-icon>
                        <View />
                      </el-icon>
                    </template>
                  </preview-files-url>
                  <el-icon @click="viewFn(mm.url)">
                    <Download />
                  </el-icon>
                </div>
                <div>
                  {{ mm.title }}
                  <div class="time">
                    {{ FilesSizeCalc(mm.size) }} ・ {{ mm['created_at'] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="item.summary_uid===replyAct" class="reply_box flexRowAC">
            <el-input
              v-model="reply_content"
              :rows="3"
              class="re_area"
              maxlength="256"
              :placeholder="`回复${item['user_info']['from_user_name']}`"
              show-word-limit
              type="textarea"
            />
            <el-button class="issue" @click="replyClick(item)">
              回复
            </el-button>
          </div>
          <div class="flexdire flexRowAC">
            <img
              class="btn"
              src="@/assets/img/meeting_assistant/textReply.png"
              alt=""
              @click="replyAct=item.summary_uid"
            />
            <img
              v-if="store.userInfo.oort_uuid===item['user_info']['from_user_id']"
              class="btn"
              src="@/assets/img/meeting_assistant/textDel.png"
              alt=""
              @click="itemDelete(item)"
            />
          </div>
          <div v-if="item.replies">
            <div v-for="(tt,index) in item.replies" :key="index" class="dynamic_child">
              <div class="flexcontent flexRowAC">
                <div class="av flexRowAC">
                  <el-avatar v-if="tt['user_info']['from_photo']" :size="42" :src="tt['user_info']['from_photo']" />
                  <img v-else src="@/assets/img/tx.png" />
                  <span> {{ tt['user_info']['from_user_name'] }}<span class="reply">回复</span>{{ tt['user_info']['to_user_name'] }}</span>
                </div>
                <div class="perr-time ">
                  {{ tt['created_at'] || '-' }}
                </div>
              </div>
              <div class="title pl54">
                {{ tt.content }}
              </div>
              <div v-show="tt.summary_uid===replyAct" class="reply_box pl54 flexRowAC">
                <el-input
                  v-model="reply_content"
                  :rows="3"
                  class="re_area"
                  maxlength="256"
                  :placeholder="`回复${tt['user_info']['from_user_name']}`"
                  show-word-limit
                  type="textarea"
                />
                <el-button class="issue" @click="replyClick(tt,item.summary_uid)">
                  回复
                </el-button>
              </div>
              <div class="flexdire flexRowAC">
                <img
                  class="btn"
                  src="@/assets/img/meeting_assistant/textReply.png"
                  alt=""
                  @click="replyAct=tt.summary_uid"
                />
                <img
                  v-if="store.userInfo.oort_uuid===tt['user_info']['from_user_id']"
                  class="btn"
                  src="@/assets/img/meeting_assistant/textDel.png"
                  alt=""
                  @click="itemDelete(tt)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--     end       -->
    </div>
  </div>
</template>

<script setup lang="ts">
import Oort_upload from '@/components/oort_upload.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { summaryAdd, summaryDel, summaryList, summaryReply } from '@/api/meetingMana'
import { reactive, ref, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import CalcFileTypeImg from '@/components/calcFileTypeImg.vue'
import PreviewFilesUrl from '@/components/previewFilesUrl.vue'
import { FilesSizeCalc } from '@/utils/filesSizeCalc'

const props: any = defineProps(['id'])
const store: any = useUserStore()
const reply_content = ref('') // 回复
let replyAct = ref<any>(undefined) // 回复Act
const commentList = ref<commentList[]>([]) // 动态列表
const idTemp = ref<any>('') // 动态列表
const form = reactive<any>({
  content: '',
  material_photo: [],
  material_audio: [],
  material_document: []
})

// 上传附件
const photoFn = (val, type, O = {}) => {
  let obj = { ...O, url: val }
  if (type === 1) form.material_photo.push(obj)
  if (type === 2) form.material_audio.push(obj)
  if (type === 3) form.material_document.push(obj)
}

// 下载
const viewFn = (url) => {
  window.open(url, '_blank')
}

// 发表
const commentFn = () => {
  let data = {
    ...form,
    conference_uid: idTemp.value
  }
  summaryAdd(data).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success('发表成功')
      form.content = ''
      form.material_photo = []
      form.material_audio = []
      form.material_document = []
      summaryListFn()
    }
  })
}

// 回复
const replyClick = (item, id) => {
  if (!reply_content.value) ElMessage.warning('内容不能为空')
  let data = {
    conference_uid: idTemp.value,
    content: reply_content.value,
    replyto_user_id: item.user_info.from_user_id,
    summary_uid: id || item.summary_uid
  }
  summaryReply(data).then((res: any) => {
    if (res.code === 200) {
      summaryListFn()
      reply_content.value = ''
      replyAct.value = undefined
      ElMessage.success(res.msg)
    }
  })
}

// 删除项目的评论
const itemDelete = (rows) => {
  ElMessageBox.confirm('是否删除该评论？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const params = {
      accessToken: store.userInfo.accessToken,
      summary_uid: rows.summary_uid
    }
    let res: any = await summaryDel(params)
    if (res.code === 200) {
      ElMessage.success('评论议删除成功')
      summaryListFn()
    }
  }).catch(() => {
  })
}

// 动态列表
const summaryListFn = () => {
  summaryList({ conference_uid: idTemp.value, time_sort: 1 }).then((res: any) => {
    if (res.code === 200) {
      commentList.value = res.data.list || []
    }
  })
}

watch(() => props.id, (val) => {
  idTemp.value = val
  if (val) summaryListFn()
}, { immediate: true })
</script>
<style lang="scss" scoped>
// 动态
.dynamicPage {
  // 发表-input
  .issueBox {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-left: 16px;

    :deep(.el-textarea__inner) {
      box-shadow: none;
      border-bottom: 1px solid #ebeef5;
    }

    .isBtnBox {
      padding: 10px;
      justify-content: space-between;

      .isBtnL {
        gap: 16px;

        .isBtnimg {
          height: 30px;
          width: auto;
        }
      }

      .issue {
        background: #3763FD;
        color: #fff;
      }
    }
  }

  // 回复
  .reply {
    font-size: 16px;
    color: #525E90;
    letter-spacing: 0;
    font-weight: 400;
    padding: 0 10px;

    &_title {
      padding: 10px 0 0 54px;
    }
  }

  .commentListBox {
    padding-left: 16px;
    border-bottom: 1px solid #E8E8E8;

    &:last-child {
      border-bottom: none;
    }

    // 头像名字
    .flexcontent {
      padding-top: 30px;
      justify-content: space-between;

      .el-avatar {
        margin-right: 12px;
      }

      .av > img {
        width: 42px;
        height: 42px;
        margin-right: 12px;
      }

      .perr-time {
        font-size: 12px;
        color: #525E90;
        letter-spacing: 0;
        font-weight: 400;
        margin-left: auto;
        float: right;
      }
    }

    .part .part_r {
      margin-left: 54px;

      .pl54 {
        padding-left: 54px !important;
      }

      .title {
        padding: 10px 0 20px;
        font-size: 14px;
        color: #333;
        word-break: break-all;
      }

      .dynamic_child {
        border-top: 1px solid #E8E8E8;
      }

      .flexdire {
        gap: 20px;
        padding-bottom: 6px;
        justify-content: flex-end;

        .btn {
          width: 24px;
          height: 24px;
        }
      }

      .reply_box {
        padding: 24px 0 10px;
        align-items: flex-start;
        gap: 8px;

        .issue {
          background: #3763FD;
          color: #fff;
        }
      }
    }

  }
}

.title_photo {
  gap: 14px;

  .listBoxOut{
    padding-bottom: 8px;
    flex-wrap: wrap;
  }

  .listBox {
    flex-wrap: wrap;
    padding-bottom: 8px;
  }

  .files_png {
    width: 100px;
    height: 100px;
    margin-right: 15px;

    &.f {
      background-color: #f7f7f7;
    }
  }

  .files_pdf {
    flex-shrink: 0;
    min-height: 54px;
    min-width: 400px;
    padding: 0 12px;
    font-size: 14px;
    color: #333;
    background-color: var(--el-menu-hover-bg-color);

    .materialImg {
      width: 28px;
      height: 38px;
      margin-right: 14px;
    }

    .time{
      color: #B1B9C5;
      font-size: 11px;
    }
  }
}

.coverBoxOut {
  padding: 20px 20px 0;
}

// 图片
.coverBox {
  gap: 10px;
  padding-bottom: 20px;

  .d {
    position: relative;

    .el-icon {
      display: none;
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      color: red;
    }
  }

  .d:hover .el-icon {
    display: flex;
  }

  .img {
    flex-shrink: 0;
    width: 110px;
    height: 110px;
    background-size: cover;
  }

  &.do {
    flex-direction: column;
    .doTitle {
      word-break: break-all;
      width: 100%;
      padding: 16px 12px;
      font-size: 14px;
      color: #333;
      background-color: var(--el-menu-hover-bg-color);
    }
  }
}

.files_pdf {
  position: relative;

  .urlBox {
    height: 48px;
    width: auto;
    background-size: cover;
    margin-right: 8px;
  }

  &:hover .view {
    display: flex;
  }

  .view {
    cursor: pointer;
    gap: 20px;
    position: absolute;
    right: 20px;
    display: none;
  }
}

</style>
