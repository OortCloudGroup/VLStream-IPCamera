<template>
  <div class="xform_container">
    <div class="formedit_header">
      <formedit-header />
    </div>
    <div class="formedit_body">
      <div ref="form_comp_group" class="formedit_body_left">
        <div
          v-for="(item,index) in componentsConfig"
          :key="index"
          class="form_comp_item"
          :class="index"
        >
          <!-- <img :src="require('@/assets/img/formEdit/'+ item.icon)" /> -->
          <img :src="getItemIcon(item.icon)" />
          <span>{{ item.name }} </span>
        </div>
      </div>
      <div class="formedit_body_right">
        <div class="form_edit_content">
          <div id="comp_container" class="componet_container">
            <A4Page :scale="scaleValue * 2" :show-grid-vis="showGridVis" />
          </div>
          <rule :scale="scaleValue * 2" />
        </div>
        <div class="bottom_bar">
          <div class="bottom_content">
            <div>
              <span> 当前控件坐标点 : </span>
              <span>X:{{ pos.clientX.toFixed(2) }} Y:{{ pos.clientY.toFixed(2) }}</span>
            </div>
            <div class="slide_container">
              <img class="slide_container_img" src="@/assets/img/formEdit/zoomreduce.png" @click="scaleValue--" />
              <el-slider v-model="scaleValue" style="flex: 1" :show-tooltip="false" />
              <img class="slide_container_img" src="@/assets/img/formEdit/zoomplus.png" @click="scaleValue++" />
              <span class="slide_container_text">{{ scaleValue * 2 }} %</span>
            </div>
            <el-popover
              placement="top-start"
              width="300"
              trigger="click"
            >
              <el-table style="max-height: 800px;overflow: auto;" :data="newCommArr" @row-click="cellClick" @row-dblclick="cellDbclick">
                <el-table-column type="index" />
                <el-table-column width="100" prop="name" label="控件类型" />
                <el-table-column width="200" prop="__vModel__" label="内容/id">
                  <template #default="{ row }">
                    <span>{{ row.other.content?row.other.content: row.id }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <template #reference>
                <el-button>控件列表</el-button>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="preViewVis"
      title="预览"
      class="priview_dialog"
      :destroy-on-close="true"
      append-to-body
    >
      <a4-preview-page v-if="preViewVis" :component-arr="componentArr" :show-grid-vis="showGridVis" @submit="saveMockData" />
      <div class="d_body_bottom">
        <el-button @click="preViewVis=false">
          取消
        </el-button>
        <el-button type="primary" @click="mockSubmit">
          模拟提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="templateViss"
      title="选择模版"
      class="priview_dialog"
      append-to-body
    >
      <select-template v-if="templateViss" @selectTemplate="selectTemplate" />
    </el-dialog>
  </div>
</template>

<script>
import FormeditHeader from './components/formeditHeader.vue'
import { Draggable } from '@shopify/draggable'
import componentsConfig from './componentConfigUtils.js'
import bus from './util/bus'
import Rule from './components/rule.vue'
import A4Page from './components/A4Page.vue'
import A4PreviewPage from './components/A4PreviewPage.vue'
import SelectTemplate from './components/selectTemplate.vue'
import { gdmtInterfaceInfo, gdmtInterfaceTemplet } from '@/api/warehouse'
import { useXFormStore } from '@/store/xForm'
import { useUserStore } from '@/store/modules/user'

export default {
  name: 'Index',
  components: { SelectTemplate, A4PreviewPage, A4Page, Rule, FormeditHeader },
  props: ['interface'],
  data() {
    return {
      pos: {
        clientX: 0,
        clientY: 0
      },
      currentType: '',
      componentsConfig: componentsConfig,
      scaleValue: 50,
      componentArr: [],
      preViewVis: false,
      templateViss: false,
      templet: '', // 后台返回的页面json
      formOpen: false,
      formTitle: '',
      // 表单参数
      form: {
        formId: null,
        formName: null,
        content: null,
        remark: null
      },
      // 表单校验
      rules: {
        formName: [
          { required: true, message: '请输入表单名称', trigger: 'blur' }
        ]
      },
      jsonDrawerVisible: false,
      JSONData: '',
      showGridVis: false,
      newCommArr: [],
      getSetTimeout: null
    }
  },
  watch: {
    interface() {
      this.init()
    }
  },
  created() {
    bus.$on('previewForm', this.previewForm)
    bus.$on('templateShow', this.templateShow)
    bus.$on('saveForm', this.saveForm)
    bus.$on('exitXForm', this.exitDesgin)
    // bus.$on('showJSON', this.showJSON)
    bus.$on('showGrid', this.showGrid)
    bus.$on('getNewsArr', this.getNewsArr)

    window.addEventListener('keydown', function(event) {
      // 检查按下的键是不是上箭头或下箭头
      if (event.keyCode === 38 || event.keyCode === 40) {
        // 阻止上下箭头的默认行为
        event.preventDefault()
      }
    }, false)
  },
  activated() {
    // console.log('activated')
  },
  mounted() {
    this.init()
    this.initDraqggable()
  },
  unmounted() {
    bus.$off('previewForm', this.previewForm)
    bus.$off('templateShow', this.templateShow)
    bus.$off('saveForm', this.saveForm)
    bus.$off('exitXForm', this.exitDesgin)
    // bus.$on('showJSON', this.showJSON)
    bus.$off('showGrid', this.showGrid)
    bus.$off('getNewsArr', this.getNewsArr)
  },
  methods: {
    cellDbclick(row) {
      bus.$emit('showProp', { data: row.id })
    },
    cellClick(row) {
      bus.$emit('activeComponentType', { data: row.id })
    },
    showGrid() {
      this.showGridVis = !this.showGridVis
    },
    getNewsArr(data) {
      this.newCommArr = data
    },
    getItemIcon(iconName) {
      return new URL(
        // 本地资源路径
        `/src/assets/img/formEdit/${iconName}`,
        import.meta.url
      ).href
    },
    init() {
      // 获取界面详情
      if (this.interface) {
        // 设置当前模版
        this.initInterface()
      } else {
        this.selectTemplate('[]')
      }
    },
    exitDesgin() {
      let newStr = window.localStorage.getItem('formCArr')
      let json = {
        json: newStr ? JSON.parse(newStr) : '',
        pageProp: useXFormStore().pageProp
      }
      newStr = JSON.stringify(json)
      let oldStr = JSON.stringify(this.templet)
      if (oldStr === newStr) {
        // 设置当前模版
        this.initInterface()
        this.$emit('exit')
      } else {
        ElMessageBox.alert('当前界面是否保存后退出', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonText: '取消',
          callback: (action) => {
            if (action === 'confirm') {
              this.saveForm()
            } else {
              this.$emit('exit')
            }
          }
        })
      }
    },
    async saveForm() {
      let str = window.localStorage.getItem('formCArr')
      if (str) {
        let json = {
          json: JSON.parse(str),
          pageProp: useXFormStore().pageProp
        }
        const params = {
          accessToken: useUserStore().token,
          id: this.interface.id,
          templet: json
        }
        let res = await gdmtInterfaceTemplet(params)
        if (res.code === 200) {
          ElMessage({
            message: '保存成功!',
            type: 'success'
          })
          this.templet = json
          this.$emit('exit')
        }
      }
    },
    async initInterface() {
      const params = {
        accessToken: useUserStore().token,
        id: this.interface.id
      }
      let res = await gdmtInterfaceInfo(params)
      if (res.code === 200) {
        // 先获取之前保存的，如果为空则说明没设置过
        if (res.data.templet && res.data.templet.json) {
          this.templet = res.data.templet
          // 获取组件s属性
          this.selectTemplate(JSON.stringify(res.data.templet.json))
          // 获取页面属性 默认 宽高 背景
          useXFormStore().SET_PAGE_PROP(res.data.templet.pageProp || { style: { width: 210, height: 297, backgroundColor: '#fff' }})
        } else {
          this.selectTemplate('[]')
        }
      }
    },
    templateShow() {
      this.templateViss = true
    },
    selectTemplate(data) {
      window.localStorage.setItem('formCArr', data)
      this.templateViss = false
      bus.$emit('refreshPage')
    },
    previewForm() {
      let str = window.localStorage.getItem('formCArr')
      if (str) {
        this.componentArr = JSON.parse(str)
      }
      this.preViewVis = true
    },
    initDraqggable() {
      const draggable = new Draggable(this.$refs.form_comp_group, {
        draggable: '.form_comp_item',
        classes: {
          mirror: 'darggable_mirror'
        }
      })
      draggable.on('drag:stop', () => {
        console.log('拖拽结束 stop--', { position: this.pos, data: componentsConfig[this.currentType] })
        bus.$emit('createComponent', { position: this.pos, data: componentsConfig[this.currentType] })
      })
      draggable.on('drag:move', (e) => {
        // console.log('drag:move', e)
        this.pos = e.data.sensorEvent.data
        this.currentType = e.data.originalSource.classList[1] // div.form_comp_item.file
        // console.log(this.currentType)
      })
    },
    mockSubmit() {
      bus.$emit('submit_xForm')
    },
    saveMockData(data) {
      if (data) {
        let submitData = {}
        data.forEach(item => {
          submitData[item.field] = item.fieldValue
        })
        console.log(submitData)
        ElMessage({
          message: '模拟提交数据成功',
          type: 'success'
        })
      }
    }
  }
}

</script>

<style lang="scss">

  .xform_container {
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: #f4f4f4;
  }

.priview_dialog {
  .el-dialog {
    margin-top: 10vh!important;
    background: #FFFFFF!important;
    box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.3);
    border-radius: 2px;
    height: 80vh;
  }

  .el-dialog__header {
    background: #F7F7F7!important;
  }

  .el-dialog__title {
    font-size: 18px;
    color: #333333!important;
    letter-spacing: 0;
    font-weight: 600;
  }

  .el-dialog__close {
    font-size: 48px;
  }

  .el-dialog__headerbtn {
    top: 4px
  }

  .el-dialog__body {
    background:  #F7F7F7;
    overflow: auto;
    height: calc(100% - 0.48rem - 0.48rem);
  }
}

</style>

<style lang="scss" scoped>
  .formedit_header {
    width: 100%;
    height: 70px;
    background: #2856A5;
  }

  .formedit_body {
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .formedit_body_left {
    height: 100%;
    width: 160px;
    min-width: 160px;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    align-content: flex-start;
    user-select: none;
  }

  .formedit_body_right {
    height: 100%;
    flex: 1;
    background: #F7F7F7;
    display: flex;
    flex-direction: column;
  }

  .form_comp_item {
    cursor: pointer;
    width: 78px;
    max-width: 78px;
    height: 60px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    img {
      width: 24px;
      height: 24px;
    }
    span {
      margin-top: 2px;
      font-size: 14px;
      color: #666666;
    }
  }

  .form_comp_item:hover {
    background: #F7F7F7;
  }

  .form_edit_content {
    width: 100%;
    flex: 1;
    position: relative;
    height: calc(100% - 48px);
  }
  .bottom_bar {
    width: 100%;
    height: 48px;
    max-height: 48px;
    background: #fff;
    border-top: 0.5px solid #d9d9d9;
  }

  .bottom_content {
    width: 80%;
    margin: 0 auto;
    height: 100%;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .componet_container {
    height: 100%;
    /* height: calc(100% - 48px - 32px); */
    padding: 32px;
    overflow: auto;
  }

  .darggable_mirror {
    z-index: 999;
    /*border: 0.5px #999999 solid;*/
    box-shadow: 0px 0px 1px #999999;
  }

  .slide_container {
    display: flex;
    flex-direction: row;
    width: 400px;
    align-items: center;
    &_img {
      width: 24px;
      height: 24px;
      margin: 0 16px;
    }

    &_text {
      width: 48px;
    }
  }

  .d_body_bottom {
    width: 93%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: 48px;
  }

</style>
