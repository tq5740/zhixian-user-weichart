/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="participating-Enterprises-list">
      <van-search class="van-hairline--bottom" :value="queryString" @change="searchChange" use-action-slot placeholder="请输入企业关键字" @search="onSearch">
          <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    <v-scroll ref="vScroll" v-show="isShowList" :loadData="getRecruitList" :totalPageNumber="totalPageNumber">
      <ul class="recruit-ul">
        <li  class="recruit-li" v-for="item in recruitListData" :key="item.venueOrgId" @click="navToOrgDetail(item.orgId)">
           <div class="recruit-profile van-hairline--bottom" >
               <img class="recruit-avatar" :src="imgSrcDomain+item.orgLogo" :key="imgSrcDomain+item.orgLogo" v-if="item.orgLogo">
               <svg class="zx-svg recruit-avatar" aria-hidden="true" v-else>
                   <use xlink:href="#icon-morenLOGO"></use>
               </svg>
               <div class="recruit-details">
                   <div class="recruit-subject">{{item.orgName}}</div>
                   <div class="org-detail-desc">
                       <div class="org-type">{{item.industry ? industryList[item.industry] : ""}}</div>
                       <div class="org-scale van-hairline--left">{{item.scale ? scaleList[item.scale] : ""}}</div>
                   </div>
               </div>
           </div>
           <div class="recruit-address">
               <div class="address-sp">展位号：<span class="stand-id">{{item.boothId ?item.boothId:'现场为准'}}</span></div>
           </div>
        </li>
      </ul>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>
  </div>
</template>
<script>
import Recruit from "../../api/modules/recruit";
import { formatDate } from "../../utils/index";
export default {
  /**
   * 书写顺序 :1,props 2,data,3:计算属性,4,vuex,5:方法 6:生命周期 5:方法
   * 默认是public
   */
  data() {
    return {
      queryString: "",
      industryList: [
        "",
        "计算机/互联网/通信/电子",
        "会计/金融/银行/保险",
        "专业服务/教育/培训",
        "贸易/消费/制造/营运",
        "房地产/建筑",
        "能源/原材料",
        "广告/媒体",
        "制药/医疗",
        "物流/运输",
        "服务业",
        "政府",
        "非盈利机构",
        "其他行业"
      ],
      scaleList: [
        "",
        "少于50人",
        "50-150人",
        "150-500人",
        "500-1000人",
        "1000-2000人",
        "2000人以上"
      ],
      loading: false,
      isNoData: false,
      isShowList: true,
      totalPageNumber: 0,
      pageSize: 10,
      pageNumber: 1,
      recruitListData: [],
      recruitId: "",
      total: ""
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    token() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
    }
  },
  onLoad(e) {
    this.recruitId = e.recruitId
    this.$store.commit("setTitle", "参会企业");
    this.getRecruitList();
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
      if (!this.recruitId) return;
      this.getRecruitList(1);
    },
    getRecruitList(_pageNum) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          venueId: this.recruitId,
          query: this.queryString,
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.token
        };
        Recruit.venue_org_list(data, (res) => {
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
                this.recruitListData = [];
                this.pageNumber = _pageNum;
              }
              this.recruitListData = this.recruitListData.concat(res.data.result);
              this.totalPageNumber = res.data.pages;
              //当前页不等于总页数的时候和 总页数大于0的时候 做++
              if (
                this.pageNumber !== this.totalPageNumber &&
                this.totalPageNumber !== 0
              ) {
                ++this.pageNumber;
              }
            }
            resolve();
          },(error) => {
            // 或者使用ts注释
            if (!error.Cancel) {
              this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
            }
            // return Promise.reject(error);
          })
          this.loading = false;
          resolve();
      });
    },
    navToOrgDetail(orgId) {
      orgId && wx.navigateTo({ url: "../organization/main?orgId=" + orgId })
    }
  },
  onReachBottom() {
    if(this.recruitListData.length < this.total){
      this.getRecruitList();
    }
  }
}
</script>
<style scoped lang="scss">
.v-scroll {
  padding-top: half(92) !important;
}
/*.v-scroll {*/
/*padding-top: 0 !important;*/
/*}*/
.participating-Enterprises-list {
  min-height: 100%;
  .recruit-ul {
    font-size: half(32);
  }
  .recruit-li {
    margin-bottom: half(20);
    padding: 0 half(20);
    background-color: #fff;
  }
  .recruit-li:last-child {
    margin-bottom: 0;
  }
  .recruit-avatar {
    width: half(80);
    height: half(80);
    margin-right: half(20);
  }
  .recruit-profile {
    padding: half(30) 0;
    display: flex;
    align-items: center;
  }
  .recruit-subject {
    margin-bottom: half(14);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .org-detail-desc {
    display: flex;
    align-items: center;
    font-size: half(26);
    color: #999;
  }
  .org-type {
    padding-right: half(20);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .org-scale {
    flex: 1;
    padding-left: half(20);
  }
  .recruit-details {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
  .recruit-address {
    padding: half(30) 0;
    display: flex;
    align-items: center;
  }
  .address-sp {
    margin: 0 half(10);
    flex: 1;
    font-size: half(28);
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stand-id {
    color: #42B983;
  }
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
}
</style>
