/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="guide">
    <p class="title">新手操作指南</p>
    <img class="guide-bg-img"  src="https://i.cdwork.cn/default/cdwork/guideImg.png" mode="widthFix">
  </div>
</template>

<script>
export default{
  onLoad() {
    this.$store.commit("setTitle", "新手指南");
  }
}
</script>
<style lang="scss" scoped>
.guide {
  min-height: 100%;
  background-color: #d6efe4;
  padding: half(80) half(30);
  .title{
    text-align: center;
    font-size: half(34);
    font-weight: bold;
    color: #628B78;
    margin-bottom: half(24);
  }
  .guide-bg-img {
    width: 100%;
  }
}
</style>
