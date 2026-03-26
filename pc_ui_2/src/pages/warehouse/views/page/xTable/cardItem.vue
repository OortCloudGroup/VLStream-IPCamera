<template>
  <div class="number_item flexColumn">
    <div class="flexRowAC number_item_header">
      <img class="number_item_headerImg" src="@/assets/img/warehouse/to1.png" alt="" />
      <span>{{ data.title }}</span>
    </div>
    <div class="flexRowAC number_item_content">
      <div class="flexColumn number_item_content_text">
        <span>{{ count }}</span>
      </div>
      <img class="number_item_content_img" src="@/assets/img/warehouse/total1.png" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ckmtDataList } from '@/api/warehouse'

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  cid: {
    type: String,
    default: ''
  }
})

// 监听props.data的field 和 countType的变化
watch(() => [props.data.field, props.data.countType], () => {
  if (props.data.field && props.data.countType) {
    getList()
  }
})

const count = ref(0)
const store = useUserStore()
const tableData = ref([])

// 数据列表
const getList = async() => {
  let params = {
    accessToken: store.userInfo.accessToken,
    page: 1,
    pagesize: 999,
    cid: props.cid
  }
  if (props.data.field) {
    params.show_field = [props.data.field + '']
  }
  ckmtDataList(params).then((res) => {
    if (res.code === 200) {
      if (props.data.countType === 'sum') {
        count.value = 0
        let tempArr = (res.data.list || [])
        tempArr.forEach(item => {
          if (item[props.data.field]) {
            try {
              if (isNaN(parseFloat(item[props.data.field]))) {
                count.value += 0
              } else {
                count.value += parseFloat(item[props.data.field])
              }
            } catch (error) {
              console.error(error, '数据项中字段类型错误,无法parseInt')
            }
          }
        })
      }
      if (props.data.countType === 'count') {
        count.value = (res.data.list || []).length
      }
      tableData.value = res.data.list || []
    }
  })
}

onMounted(() => {
  getList()
})

</script>

<style>

.number_item {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
}

.number_item_header {
    height: 50px;
    margin: 0 24px;
    gap: 8px;
    border-bottom: 1px solid rgba(238, 239, 242, 1);

  > span {
    font-size: 16px;
    color: #111827;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
  }

  .number_item_headerImg {
    width: 24px;
    height: 24px;
    background-size: cover;
  }
}

.number_item_content {
  flex: 1;
  margin: 0 24px;
  justify-content: space-between;
}

.number_item_content_text {
  span:nth-of-type(1) {
    font-size: 32px;
    color: #111827;
    letter-spacing: 0;
    line-height: 32px;
    font-weight: 700;
    margin: 8px 0px;
  }

  div {
    span:nth-of-type(1) {
      font-size: 14px;
      color: #FD6A6A;
      letter-spacing: 0;
      line-height: 22px;
    }

    span:nth-of-type(2) {
      margin: 0 6px;
      font-size: 14px;
      color: #718096;
      letter-spacing: 0;
      line-height: 22px;
    }
  }
}

.number_item_content_img {
  width: 100px;
}

</style>

