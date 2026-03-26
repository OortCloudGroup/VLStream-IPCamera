<template>
  <!-- <img v-if="imageSrc" :src="imageSrc" /> -->
  <el-image
    v-if="imageSrc"
    style="width: 60px; height: auto"
    :src="imageSrc"
    :preview-src-list="srcList"
    show-progress
    fit="cover"
    :z-index="999999"
  />
</template>

<script setup>

import { ref } from 'vue'
import config from '@/config'
import { useUserStore } from '@/store/modules/user'
const store = useUserStore()

const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})

const srcList = ref([])
const imageSrc = ref(config.URL + config.gateWay + 'oortcloud-table/' + 'ftp/img_show/' + props.name + '?token=' + store.getStoreToken())
srcList.value.push(imageSrc.value)
</script>

<style scoped lang="scss">

</style>
