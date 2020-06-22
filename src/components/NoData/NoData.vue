<template>
  <div class="noData" v-if="isNoData">阿尔噶热个
    <div>
      <img :src="require('../../../static/img/noData.png')" :key="require('../../../static/img/noData.png')" alt="" >
      <br>
      <br>
    </div>
    暂无数据
  </div>
</template>

<script>

export default {
  props: {
    isNoData: {
      type: Boolean,
      default: false
    },
    padding_t: {
      type: Number,
      default: 100
    }
  }
}
</script>
<style scoped lang="scss">
.noData {
  color: #999;
  text-align: center;
  font-size: half(32);
  height: half(620.16);
  img {
    width: half(300);
  }
}
</style>
