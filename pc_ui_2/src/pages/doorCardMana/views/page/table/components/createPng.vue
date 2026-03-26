<template>
  <div class="create_png">
    <div class="create_png_header">
      <el-button :icon="RefreshLeft" @click="commands.undo()">
        撤销
      </el-button>
      <el-button :icon="RefreshRight" @click="commands.redo()">
        重做
      </el-button>
      <el-button :icon="Picture" @click="insertPic">
        插入图片
      </el-button>
      <el-button :icon="Picture" @click="previewPic">
        预览
      </el-button>
      <el-button v-if="!!pngData" :icon="Folder" @click="savePic(true)">
        另存为
      </el-button>
      <el-button :icon="Folder" @click="savePic(false)">
        保存
      </el-button>
    </div>
    <ESEditor ref="editorRef" :data="data" theme="light" size="960x680" />
    <Preview
      v-model="showPreview"
      :is-save-png="isSavePng"
      size="960x680"
      @cancel="showPreview = false"
      @savePng="savePngConfirm"
      @save-click="handleSaveClick"
    />
  </div>
</template>

<script setup lang="ts">

import { ref, defineEmits, onMounted } from 'vue'
import { ESEditor } from '@/components/pngEditor/editor'
import { useCommand } from '@/components/pngEditor/editor/src/hooks/useCommand.ts'
import { useEditorStore } from '@/components/pngEditor/editor/src/store/index.ts'
import { useId } from '@/components/pngEditor/editor/src/utils/common'
import { $upload } from '@/components/pngEditor/editor/src/components/common'
import Preview from '@/components/pngEditor/editor/src/components/common/Preview.vue'
import { RefreshLeft, RefreshRight, Picture, Folder } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const store = useEditorStore()
const { commands } = useCommand(store)
const editorRef = ref(null)
const emit = defineEmits(['call-api'])
const data = ref({
  container: {
    markline: {
      show: true,
      color: ''
    },
    snapToGrid: true,
    gridSize: 10,
    gridColor: '',
    style: {},
    scaleRatio: 1
  },
  elements: [
    {
      id: 'one',
      component: 'div',
      width: 960,
      height: 100,
      left: 0,
      top: 0,
      text: '标题',
      style: {
        background: '#fff',
        color: '#000000',
        fontSize: '20px'
      }
    },
    {
      id: 'one_11',
      component: 'div',
      width: 960,
      height: 10,
      left: 0,
      top: 100,
      text: '',
      style: {
        background: 'red'
      }
    },
    {
      id: 'one_11',
      component: 'div',
      width: 960,
      height: 10,
      left: 0,
      top: 110,
      text: '',
      style: {
        background: '#fff'
      }
    },
    {
      id: 'two',
      component: 'div',
      width: 960,
      height: 560,
      left: 0,
      top: 120,
      text: '主题',
      style: {
        background: 'grey',
        color: '#fff',
        fontSize: '50px'
      }
    }
  ]
})

const showPreview = ref(false)
const isSavePng = ref(false)
const previewPic = () => {
  isSavePng.value = false
  showPreview.value = true
}

const isSaveNew = ref(false)
const savePic = (isNew) => {
  isSaveNew.value = isNew
  isSavePng.value = true
  showPreview.value = true
}

const handleSaveClick = () => {
  // 触发父组件的事件
  emit('call-api')
}

const insertPic = () => {
  $upload({
    resultType: 'image',
    limitSize: 2,
    onChange(e) {
      const defaultWidth = 200
      const newElement = {
        id: useId(),
        component: 'img',
        props: {
          src: e,
          width: defaultWidth,
          onLoadOnce(e) {
            // 避免多次执行
            if (newElement.props.loaded) return
            // 图片加载完毕，得到原始宽高
            const { naturalHeight, naturalWidth } = e.target
            const cur = store.data.elements.find(
              item => item.id === newElement.id
            )
            // 上传图片最大宽度设置
            let rate = defaultWidth / naturalWidth
            if (rate > 1) rate = 1
            cur.width = naturalWidth * rate
            cur.height = naturalHeight * rate
            newElement.props.loaded = true
          }
        }
      }
      store.data.elements.push(newElement)
    }
  })
}

import { useUserStore } from '@/store/modules/user'
import { tableImgUpload, tableImgInfo, tableImgEdit } from '@/api/tableService/index_door'
const savePngConfirm = async(data) => {
  const params = {
    accessToken: useUserStore().getStoreToken(),
    file: data,
    template: JSON.stringify(editorRef.value.getData())
  }
  let res = null
  if (!!props.pngData) {
    params.id = props.pngData.id
    params.name = props.pngData.name
  }
  if (!isSaveNew.value) {
    if (!!params.id) {
      res = await tableImgEdit(params)
    } else {
      res = await tableImgUpload(params)
    }
  } else {
    res = await tableImgUpload(params)
  }
  if (res.code === 200) {
    ElMessage({
      message: '保存成功!',
      type: 'success'
    })
    showPreview.value = false
  }
}

const props = defineProps({
  pngData: {
    type: Object,
    default: null
  }
})

const getPngRe = async() => {
  let res = await tableImgInfo({
    accessToken: useUserStore().getStoreToken(),
    id: props.pngData.id
  })
  if (res.code === 200 && res.data.template) {
    try {
      data.value = JSON.parse(res.data.template)
    } catch (error) {
      console.error('parse templte error')
    }
  }
}

onMounted(() => {
  if (props.pngData) {
    getPngRe()
  }
})

</script>

<style lang="scss" scoped>
.create_png {
  width: 100%;
  height: calc(100vh - 80px);
  color: var(--es-color);
  background-color: var(--es-color-bg);
  min-width: 1118px;
  position: relative;
}

.create_png_header {
  position: absolute;
  top: 0px;
  left: 25%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  height: 48px;
  z-index: 10;
}
</style>
