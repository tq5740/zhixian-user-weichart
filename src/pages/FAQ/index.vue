/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
  <div class="FAQ">
    <van-search class="van-hairline--bottom" :value="query" @change="searchChange" use-action-slot placeholder="请输入关键词进行搜索" @search="onSearch">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <van-cell-group class="FAQ-cell-group">
      <van-cell v-for="(item,key) in problemData" :title="item.problemTitle" is-link :url="'../FAQMes/main?problemId='+item.problemId" :key="key" />
    </van-cell-group>
    <NoData :isNoData="isNoData"></NoData>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import FAQS from "../../api/modules/FAQ";
export default {
  data() {
    return {
      isNoData: false,
      query: "",
      problemData: []
    }
  },
  methods: {
    searchChange(e) {
      if(typeof e.mp.detail === "object"){
        this.query = e.mp.detail.value;
      } else {
        this.query = e.mp.detail;
      }
    },
    onSearch() {
      this.getList();
    },
    getList() {
      FAQS.problem_list({
        pageSize: "99", pageNum: "1", query: this.query, type: 1
      },(res) => {
        if (res.code === 0) {
          this.problemData = res.data.result;
        } else {
          this.$toast(res.msg);
        }

        if (res.data.result.length <= 0) {
          this.isNoData = true;
        } else {
          this.isNoData = false;
        }
      });
    }  
  },
  onLoad() {
    this.$store.commit("setTitle", "常见问题");
    this.getList();
  }
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
