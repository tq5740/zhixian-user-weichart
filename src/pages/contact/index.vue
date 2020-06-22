/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
  <div class="contact">
    <van-cell-group class="FAQ-cell-group">
      <van-cell v-for="(item,key) in problemData" :title="item.problemTitle" is-link :url="'../FAQMes/main?problemId='+item.problemId" :key="key" />
      联系我们
    </van-cell-group>
    <NoData :isNoData="isNoData"></NoData>
  </div>
</template>

<script>
import FAQS from "../../api/modules/FAQ";
export default {
  
}
</script>
<style lang="scss" scoped>
.FAQ {
  min-height: 100%;
  background-color: #f2f2f2;
  /*-webkit-overflow-scrolling: touch;*/
  /deep/ .van-search__action {
    padding: 0 half(28);
  }
  .FAQ-cell-group {
    padding-top: half(100);
  }
  /deep/ .van-search .van-cell__value {
    display: block !important;
  }
}
</style>
