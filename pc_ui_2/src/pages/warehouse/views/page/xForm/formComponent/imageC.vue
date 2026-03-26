/**
Created by  lanjian   on 2022/2/22  14:50
Copyright 奥尔特云（深圳）智慧科技有限公司. All rights reserved.
*/
<template>
  <div class="image_container">
    <img style="pointer-events: none" :src="src" />
  </div>
</template>

<script>
import defaultImg from '@/assets/img/formEdit/default_img.png'
import config from '@/config/index'
export default {
  name: 'ImageC',
  props: {
    data: {
      type: Object,
      required: true
    },
    isEditor: { // // 判断是否在编辑状态
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      src: defaultImg
    }
  },
  mounted() {
    if (this.data.other.fieldValue) {
      this.src = config.URL + config.gateWay + 'oortcloud-warehouse' + '/api/v1/files.show?pic_id=' + this.data.other.fieldValue
    }
  }
}
</script>

<style lang="scss" scoped>
  .image_container {
    width: 100%;
    height: 100%;
    display: flex;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
