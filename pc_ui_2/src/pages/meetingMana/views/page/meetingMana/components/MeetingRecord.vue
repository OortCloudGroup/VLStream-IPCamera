<template>
  <div class="meeting_record">
    <div class="meeting_record_title">
      <el-button type="primary" icon="Plus" @click="dVisi=true">
        上传录音录像
      </el-button>
    </div>
    <el-table
      class="new_table"
      :show-overflow-tooltip="true"
      stripe
      :data="tableData"
    >
      <el-table-column prop="date" label="序号" :width="clacPXToVW(65)">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pagesize + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="录音录像">
        <template #default="scope">
          <div class="isTitleBox flexRowAC">
            <div v-if="isTitle!==scope.row.materialuid" class="flexRowAC" @click="isTitle=scope.row.materialuid,titleInput=scope.row.title">
              <calc-file-type-img class="urlBox" :data="scope.row.title" />
              &nbsp;&nbsp;
              {{ scope.row.title }}
            </div>
            <div v-else class="flexRowAC t">
              <el-input v-model="titleInput" placeholder="结论文件名称" />
              <el-button @click="titleFn(scope.row)">
                确定
              </el-button>
              <el-button @click="isTitle=false">
                取消
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" :width="clacPXToVW(100)">
        <template #default="scope">
          <div class="flexRowAC">
            {{ FilesSizeCalc(scope.row.size) || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件类型" :width="clacPXToVW(100)">
        <template #default="scope">
          <div v-if="scope.row.title" class="flexRowAC">
            {{ jugeFileType(scope.row.title) }}文件
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="上传时间" :width="clacPXToVW(180)" />
      <el-table-column prop="operate" label="操作" fixed="right" align="right" :width="clacPXToVW(300)">
        <template #default="scope">
          <div class="operateBox flexRowAC">
            <el-tooltip
              content="预览"
              effect="light"
              placement="top"
            >
              <preview-files-url :url="scope.row.url">
                <template #url>
                  <div class="new_table_svg_group">
                    <oort-svg-icon width="20" height="20" name="table_preview_eye" />
                  </div>
                </template>
              </preview-files-url>
            </el-tooltip>
            <el-tooltip
              content="下载"
              effect="light"
              placement="top"
            >
              <div class="new_table_svg_group" @click="viewFn(scope.row.url)">
                <oort-svg-icon width="20" height="20" name="table_download" />
              </div>
            </el-tooltip>
            <el-tooltip
              content="删除"
              effect="light"
              placement="top"
            >
              <div class="new_table_svg_group" @click="delClick(scope.row)">
                <oort-svg-icon width="20" height="20" name="table_delect" />
              </div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationBox flexRowAC">
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
    <el-dialog
      v-model="dVisi"
      title="上传录音录像"
      class="priview_dialog"
      append-to-body
      width="40%"
    >
      <div class="voiceBox">
        <div class="voiceBox_t">
          上传
        </div>
        <el-upload
          class="upload-demo"
          drag
          multiple
          :action="upfileURL"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeUpload"
        >
          <div class="flexRowAC voiceUp">
            <el-icon class="el-icon--upload">
              <img src="@/assets/img/audioVideo.png" alt="" />
            </el-icon>
            <div class="voiceUp_t flexRowAC">
              上传录音录像
            </div>
            <!--            <div class="voiceUp_t_tip">-->
            <!--              录音文件仅支持WAV、MP3、AAC格式，录像文件仅支持MPG、MP4、FLV、AVI格式-->
            <!--            </div>-->
          </div>
        </el-upload>
        <div class="filesUp">
          <div v-for="(item,index) in fileList" :key="index" class="f flexRowAC">
            <file-upload-progress :data="item" :is-repeat="item['isRepeat']" />
            <!--            {{ item.title }}
            <div
              class="d flexRowAC"
              @click="fileList.splice(index,1)"
            >
              <el-icon color="red" size="18">
                <CircleCloseFilled />
              </el-icon>
            </div>-->
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dVisi=false">取消</el-button>
          <el-button type="primary" @click="materialAddFn">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { clacPXToVW } from '@/utils/index'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { materialAdd, materialDelete, materialEdit, materialList } from '@/api/meetingMana'
import config from '@/config'
import FileUploadProgress from '@/pages/meetingMana/views/page/meetingMana/components/fileUploadProgress.vue'
import PreviewFilesUrl from '@/components/previewFilesUrl.vue'
import { FilesSizeCalc } from '@/utils/filesSizeCalc'
import jugeFileType from '@/utils/jugeFileType'
import CalcFileTypeImg from '@/components/calcFileTypeImg.vue'

const props = defineProps(['id'])
const store: any = useUserStore()
let headers = ref<any>(config.headers) // 上传headers
let upfileURL = ref<any>('') // 上传路径
upfileURL.value = config.URL + config.gateWay + 'oortcloud-fastdfsservice/fastdfs/v1/uploadFile'
const tableData = ref([])
const count = ref(0)
const page = ref(1)
const pagesize = ref(10)
let dVisi = ref<Boolean>(false)
let url = ref('')
let fileList = ref<any>([])
let isTitle = ref<any>(false) // 是否修改标题
let titleInput = ref<any>('') // 标题输入框

// 修改标题
const titleFn = async(rows) => {
  let data = {
    accessToken: store.userInfo.accessToken,
    materialuid: rows.materialuid,
    title: titleInput.value
  }
  let res: any = await materialEdit(data)
  if (res.code === 200) {
    getListFn()
    isTitle.value = false
    ElMessage.success('文件名称修改成功')
  }
}
// 上传
const handleAvatarSuccess = (res: any) => {
  if (res.code === 200) {
    url.value = res.data.url
    let obj:any = {
      url: res.data.url,
      file_md5: res.data.md5,
      title: res.data.src?.split('/').slice(-1).join(),
      size: res.data.size
    }
    if (obj) {
      obj.isRepeat = fileList.value.findIndex(tt => tt.file_md5 === obj.file_md5) !== -1
    }
    fileList.value.push(obj)
  } else {
    ElMessage.error(res.msg)
  }
}

const viewFn = (url, type) => {
  if (type === 0) url.replace('download=1', 'download=0')
  window.open(url, '_blank')
}
// 文件大小
const beforeUpload = () => {
  // let isLimit = file.size / 1024 / 1024 < 2
  // if (!isLimit) {
  //   ElMessage.error('大小不能超过2MB!')
  // }
  // return isLimit
}

const materialAddFn = async() => {
  if (!fileList.value.length) return ElMessage.warning('请上传录音录像')
  let data = {
    accessToken: store.userInfo.accessToken,
    conference_uid: props.id,
    file_list: fileList.value,
    material_type: 1 // 1录音录像
  }
  let res: any = await materialAdd(data)
  if (res.code === 200) {
    dVisi.value = false
    fileList.value = []
    ElMessage.success('录音录像上传成功')
    getListFn()
  }
}

// 删除
const delClick = (rows) => {
  ElMessageBox.confirm('是否删除该录音录像？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(async() => {
    const params = {
      accessToken: store.userInfo.accessToken,
      conference_uid: rows.conference_uid,
      materialuid: rows.materialuid,
      vote_uid: rows.vote_uid
    }
    let res: any = await materialDelete(params)
    if (res.code === 200) {
      ElMessage.success('录音录像删除成功')
      getListFn()
    }
  })
}

const getListFn = async() => {
  let data = {
    accessToken: store.userInfo.accessToken,
    material_type: 1,
    page: page.value,
    pagesize: pagesize.value,
    conference_uid: props.id
  }
  let res: any = await materialList(data)
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

watch(() => props.id, () => {
  getListFn()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.meeting_record {
  //padding: 0 20px;
}

.meeting_record_title {
  //height: 60px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

.voiceBox {
  .voiceBox_t {
    padding: 20px 0 12px;
  }

  .voiceUp {
    flex-direction: column;
  }

  .el-icon--upload {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  .voiceUp_t {
    justify-content: center;
    width: 104px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, .15);
  }

  .voiceUp_t_tip {
    padding-top: 8px;
    font-size: 12px;
    color: #999999;
    text-align: center;
    font-weight: 400;
  }
}

.urlBox {
  height: 48px;
  width: auto;
  background-size: cover;
}

// 附件显示
.filesUp {
  padding-bottom: 20px;
  padding-top: 10px;
  align-items: flex-start;
  flex-direction: column;

  .f {
    margin-bottom: 10px;
    //padding: 2px 16px;
    flex: 1;
    justify-content: space-between;
    //background-color: var(--el-menu-hover-bg-color);

    .el-icon {
      cursor: pointer;
    }
  }
}

.paginationBox {
  justify-content: center;
  height: 100px;
}

.operateBox {
  gap: 20px;
}

.isTitleBox {
  .t {
    width: 100%;
  }

  width: 100%;

  .el-input {
    flex: 1;
    margin-right: 12px;
  }

  .el-button {
    flex-shrink: 0;
  }
}
</style>
