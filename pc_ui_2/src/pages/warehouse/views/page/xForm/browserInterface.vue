<!--主表浏览器页面-->
<template>
  <div class="browser_body">
    <div class="browser_body_tips">
      <span>拖动排序，设置浏览页面的显示</span>
    </div>
    <div v-if="browserFieldList.length > 0" class="browser_body_drag">
      <draggable
        v-model="browserFieldList"
        :animation="300"
        :scroll="true"
        :delay="0"
        :scroll-sensitivity="50"
        :sort="true"
        class="draggable"
      >
        <template #item="{element}">
          <div class="field_item">
            <span class="field_item_left">{{ element.name }}</span>
            <div class="field_item_right">
              <span>显示宽度:</span>
              <el-input
                v-model.number="element.width"
                class="field_item_right_input"
                size="mini"
                placeholder="请输入"
              />
              <el-select
                v-model="element.showType"
                placeholder="显示类型，默认文本"
                size="large"
                style="width: 180px;margin: 0 4px;"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-checkbox v-model="element.isShow">
                是否显示
              </el-checkbox>
              <span class="dragg_span">鼠标按住此处拖拽</span>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="browser_body_bottom">
      <el-button style="width: 100px" @click="cancelAdd">
        取消
      </el-button>
      <el-button style="width: 100px" type="primary" @click="confirmAdd">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { gdmtInterfaceInfo, gdmtInterfaceTemplet } from '@/api/warehouse'
import { generateBrowerInterfaceJSON } from './util/formUtils'
import { useXFormStore } from '@/store/xForm'
import { useUserStore } from '@/store/modules/user'

export default {
  name: 'BrowserInterface',
  components: { draggable },
  props: ['interface'],
  data() {
    return {
      browserFieldList: [],
      options: [
        { value: 0, label: '文本' },
        { value: 1, label: '图片' }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.initInterface()
    },
    initInterface() {
      const params = {
        accessToken: useUserStore().token,
        id: this.interface.id
      }
      gdmtInterfaceInfo(params).then(res => {
        if (res.code === 200) {
          // 先获取之前保存的，如果为空则说明没设置过
          if (res.data.templet && res.data.templet.json) {
            this.browserFieldList = res.data.templet.json || []
          } else {
            // 生成浏览界面
            this.browserFieldList = generateBrowerInterfaceJSON(useXFormStore().currentTable)
          }
          console.log('template', this.browserFieldList)
        }
      })
    },
    cancelAdd() {
      this.$emit('exit')
    },
    confirmAdd() {
      let json = { json: this.browserFieldList }
      const params = {
        accessToken: useUserStore().token,
        id: this.interface.id,
        templet: json
      }
      gdmtInterfaceTemplet(params).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: '保存成功!',
            type: 'success'
          })
          this.$emit('exit')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .browser_body {
    width: 100%;
    height: 100%;
    &_tips {
      height: 48px;
      align-items: center;
    }
    &_drag {
      height: calc(100% - 48px - 60px);
      overflow: auto;
      display: flex;
      align-items: center;
    }
    &_bottom {
      height: 60px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }

  .draggable {
    width: 100%;
    height: 100%;
  }

  .field_item {
    border: 0.5px solid #a5a5a5;
    margin: 10px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_left {
      color: #999999;
      font-size: 16px;
    }
    &_right {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        color: #999999;
        font-size: 12px;
        margin: 0 8px;
      }
      &_input {
        width: 60px;
        margin: 0 8px;
        background: #fff;
      }
    }
  }

  ::v-deep .el-input__inner {
    background: #fff;
  }

  .dragg_span {
    margin:16px;
    color: #999999;
    font-size: 16px;
    cursor: pointer;
  }

  ::v-deep .el-checkbox__inner {
    background: #fff;
  }
</style>
