/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
    <div class="Faqmes">
        <div class="faqmes-item">
            <h1>{{Title}}</h1>
            <wxParse v-if="Msg" :content="decodeURIComponent(Msg)" />
        </div>
    </div>
</template>

<script>
import FAQS from "../../api/modules/FAQ";
import wxParse from 'mpvue-wxparse';
export default {
  components: {
    wxParse
  },
  data () {
    return {
      Title: "",
      Msg: ""
    }
  },
  onLoad() {
    var problemId = this.$route.query.problemId;
    FAQS.query_problem({ problemId },(res) => {
      this.Title = res.data.problemTitle;
      this.Msg = decodeURIComponent(res.data.answer);
    });
  }
}
</script>
<style lang="scss" scoped>
.Faqmes {
  min-height: 100%;
  padding: half(20);
  background-color: #f2f2f2;
  font-family: PingFang-SC-Medium;
  .faqmes-item {
    width: 100%;
    padding: half(25);
    padding-top: 0;
    background-color: #fff;
    border-radius: half(6);
    word-wrap: break-word;
    h1 {
      font-size: half(34);
      font-weight: bold;
      color: rgba(1, 1, 1, 1);
      padding: half(28) 0 half(34) 0;
    }
    div {
      font-size: half(30);
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      line-height: half(50);
    }
  }
}
</style>
