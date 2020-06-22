/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="in-recruitment-position-list">
      <van-search class="van-hairline--bottom" :value="queryString" @change="searchChange" use-action-slot placeholder="请输入职位关键字" @search="onSearch">
          <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <v-scroll ref="vScroll" v-if="isShowList" :loadData="getPositionList" :totalPageNumber="totalPageNumber">
          <ul class="position-list-box">
              <li class="positionList_box" :class="{bg_dff0e7:downSetBG === index,margin_b_20: index < positionListData.length-1}" v-for="(item,index) in positionListData" :key="item.jobId" @click="navToPosition(item.jobId)" @touchmove="touchOver" @contextmenu="touchOver" @touchend="touchOver" @touchstart="touchAction(index)">
                  <div class="positionList_box_cont1">
                      <div class="positionList_box_cont1_t1">{{item.jobName}}</div>
                      <div class="positionList_box_cont1_t2" v-if="item.lowSalary == -1">
                          面议
                      </div>
                      <div class="positionList_box_cont1_t2" v-else>
                          {{item.salary}}
                      </div>
                  </div>
                  <div class="positionList_box_cont2 van-hairline--bottom">
                      <div class="position-list-profile">
                          <div class="positionList_box_cont2_t1">{{item.city}}{{item.city && item.district ? "-" : "" }}{{item.district}}</div>
                          <div class="positionList_box_cont2_t2 van-hairline--left">{{education[item.education]}}</div>
                          <div class="positionList_box_cont2_t3 van-hairline--left">{{experience[item.experience]}}</div>
                      </div>
                  </div>
                  <div class="positionList_box_cont3">
                      <img class="company_img" :src="imgSrcDomain+item.orgLogo" :key="imgSrcDomain+item.orgLogo" v-if="item.orgLogo">
                      <img src="../../../static/img/default/morenLOGO.png" class="company_img" v-else>
                      <span class="positionList_box_cont3_t1">{{item.orgName}}</span>
                  </div>
              </li>
          </ul>
      </v-scroll>
      <no-data :isNoData="isNoData"></no-data>
  </div>
</template>
<script>
import Recruit from "../../api/modules/recruit";
import { formatSalary } from "../../utils/index";
export default {
  data () {
    return {
      queryObj: {},
      queryString: "",
      isNoData: false,
      isShowList: true,
      downSetBG: "",
      formatSalary: formatSalary,
      education: [
        "不限",
        "初中及以下",
        "高中",
        "中技/中专",
        "大专",
        "本科",
        "硕士",
        "博士"
      ], //专业
      experience: ["不限", "1年", "2年", "3-4年", "5年及以上"], //工作经验
      totalPageNumber: 0,
      pageSize: 10,
      pageNumber: 1,
      positionListData: [],
      recruitId: "",
      total: ""
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  onLoad(e) {
    this.$store.commit("setTitle", "本场现场招聘在招职位");
    this.queryObj = e;
    this.recruitId = this.queryObj.recruitId;
    this.$nextTick(() => {
      this.getPositionList(1);
    });
  },
  methods: {
    searchChange(e) {
      if(typeof e.mp.detail === "object"){
        this.queryString = e.mp.detail.value;
      } else {
        this.queryString = e.mp.detail;
      }
    },
    onSearch() {
      this.getPositionList(1);
    },
    getPositionList(_pageNum) {
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          query: this.queryString,
          venueId: this.recruitId
        };
        Recruit.venue_job_list(data, (res) => {
          this.total = res.data.total;
            if (res.code === 0) {
              //没有数据的时候
              if (res.data.result.length === 0) {
                this.isNoData = true;
                this.isShowList = false;
                return;
              } else {
                this.isNoData = false;
              }
              !this.isShowList && (this.isShowList = true);
              // 调用第一页的时候
              if (_pageNum) {
                this.positionListData = [];
                this.pageNumber = _pageNum;
              }
              let item = res.data.result;
              item.forEach(element => {
                element.salary = formatSalary(element.lowSalary, element.highSalary, element.salaryType);
              });
              this.positionListData = this.positionListData.concat(
                res.data.result
              );
              this.totalPageNumber = res.data.pages;
              //当前页不等于总页数的时候和 总页数大于0的时候 做++
              if (
                this.pageNumber !== this.totalPageNumber &&
                this.totalPageNumber !== 0
              ) {
                ++this.pageNumber;
              }
            }
            this.isShowList = true;
            resolve();
          },(error) => {
            this.isShowList = true;
            if (!error.Cancel) {
              this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
            }
            reject(error);
          });
      });
    },
    // 触摸开始
    touchAction(i) {
      this.downSetBG = i;
    },
    // 触摸结束
    touchOver(i) {
      this.downSetBG = "";
    },
    navToPosition(positionId) {
      wx.navigateTo({ url: "../positionDetail/main?positionId=" + positionId });
    }  
  },
  onReachBottom() {
    if(this.positionListData.length < this.total){
      this.getPositionList();
    }
  }
}
</script>
<style scoped lang="scss">
.v-scroll {
  padding-top: half(92) !important;
}
.in-recruitment-position-list {
  min-height: 100%;
  background-color: #f2f2f2;
  /deep/ {
    .van-search__action {
      padding: 0 half(30);
    }
    .van-field__body {
      font-size: half(28);
    }
    .van-cell__value,
    .van-cell__value--alone {
      display: inline !important;
    }
  }
  .bg_dff0e7 {
    background: #E8E8E8 !important;
  }
  .margin_b_20 {
    margin-bottom: half(20);
  }
  .company_img {
    width: half(70);
    height: half(70);
    margin-right: half(22);
  }
  .positionList_box {
    background: #fff;
    padding: half(30) half(20) half(15) half(20);
  }
  .positionList_box_cont1 {
    font-size: half(32);
    display: flex;
    justify-content: space-between;
  }
  .positionList_box_cont1_t1 {
    flex: 1;
    margin-right: half(10);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .positionList_box_cont1_t2 {
    color: #fc703e;
  }
  .positionList_box_cont2 {
    color: #666;
    padding: half(20) 0 half(30) 0;
    display: flex;
    font-size: half(26);
  }
  .positionList_box_cont2_t1 {
    /*width: half(170);*/
    margin-right: half(20);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .positionList_box_cont2_t2,
  .positionList_box_cont2_t3 {
    padding: 0 half(20);
    flex-shrink: 0;
  }
  .position-list-profile {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  .positionList_box_cont3 {
    padding-top: half(15);
    font-size: half(28);
    display: flex;
    align-items: center;
  }
  .positionList_box_cont3_t1 {
    flex: 1;
    margin-right: half(10);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
