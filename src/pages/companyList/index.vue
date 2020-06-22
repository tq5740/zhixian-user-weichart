/**
*@author chao
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="company-list-box">
    <van-search :value="queryString" placeholder="请输入关键词进行搜索" use-action-slot @change="searchChange" @click="onSearch" class="van-hairline--bottom">
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <v-scroll ref="vScroll" v-if="isShowList" :loadData="getOrgList" :totalPageNumber="totalPageNumber">
      <ul class="company-list">
        <li v-for="item in orgGuestListData" :key="item.orgId" class="company-list-li">
          <div class="list_box van-hairline--bottom" @click="onCompanyListClick(item.orgId)">
            <div class="list_box_left">
              <img :src="imgSrcDomain+item.orgLogo" class="list_box_left" v-if="item.orgLogo">
              <img src="../../../static/img/default/morenLOGO.png" class="list_box_left" v-else>
            </div>
            <div class="list_box_right">
              <div class="list_box_right_t1">{{item.orgName}}</div>
              <div class="list_box_right_t2">
                <span class="padding_r_20">{{industryList[item.industry - 1]}}</span>
                <span class="padding_l_20 van-hairline--left">{{scaleList[item.scale - 1]}}</span>
              </div>
            </div>
          </div>
            <div class="hot-position-wrap" @click="onHotPositionClick(item.orgId)">
                <div class="hot-position">查看此公司在招职位
                    <span class="hot-position-num"> ({{item.countJobs}}) </span>
                </div>
                <i class="iconfont icon-arrow icon-gengduo"></i>
            </div>
        </li>
      </ul>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>

  </div>

</template>

<script>
import Org from "../../api/modules/org";
export default {
  data () {
    return {
      industryList: [
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
      queryString: "",
      orgGuestListData: [],
      total: ""
    }
  },
  
  // @Watch("queryString")
  // handlerQueryInputChange(newVal) {
  //   if (!newVal.length) {
  //     this.getOrgList(1);
  //   }
  // }

  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "企业");
    this.$nextTick(() => {
      this.getOrgList(1);
    });
  },
  onReachBottom() {
    if(this.orgGuestListData.length < this.total){
      this.getOrgList();
    }
  },
  methods: {
    searchChange(e) {
      if(typeof e.mp.detail === "object"){
        this.queryString = e.mp.detail.value;
      } else {
        this.queryString = e.mp.detail;
      }
    },
    getOrgList(_pageNum) {
      return new Promise((resolve, reject) => {
        let data = {
          query: this.queryString,
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          sortBy: false,
          sortField: "updateTime"
        };
        Org.getOrgGuestList(data, (res) => {
            if (res.code === 0) {
              this.total = res.data.total;
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
                this.orgGuestListData = [];
                this.pageNumber = _pageNum;
              }
              this.orgGuestListData = this.orgGuestListData.concat(
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
            resolve();
          }, (error) => {
            // 或者使用ts注释
            if (!error.Cancel) {
              this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
            }
            // return Promise.reject(error);
            reject(error);
          })
          this.loading = false;
          resolve();
      });
    },
    onSearch() {
      // if (this.loading === true) return;
      // this.loading = false;
      this.getOrgList(1);
    },
    onPickerCancel() {
      this.$emit("cancel");
    },
    onPickerConfirm(items) {
      this.$emit("confirm", items);
    },
    onCompanyListClick(orgId) {
      wx.navigateTo({ url: "../organization/main?orgId=" + orgId });
    },
    onHotPositionClick(orgId) {
      wx.navigateTo({ url: "../organization/main?orgId=" + orgId + "&tabStatus=1"});
    }
  }
}
</script>
<style scoped lang="scss">
.padding_r_20 {
  padding-right: half(20);
}
.padding_l_20 {
  padding-left: half(20);
}
.v-scroll {
  padding-top: half(92) !important;
}
.company-list-box {
  min-height: 100%;
  background-color: #f2f2f2;
  /*-webkit-overflow-scrolling: touch;*/
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

.company-list {
  font-size: half(32);
  .company-list-li {
    padding: 0 half(20);
    margin-bottom: half(20);
    background-color: #fff;
  }
  .company-list-li:last-child {
    margin-bottom: 0;
  }
  .hot-position-wrap {
    display: flex;
    align-items: center;
    padding: half(30) 0;
    color: #666;
    font-size: half(28);
  }
  .hot-position-num {
    color: #42b983;
  }
  .hot-position {
    flex: 1;
  }
  .icon-arrow {
    width: half(24);
    height: half(26);
  }
  .list_box {
    padding: half(30) 0;
    display: flex;
    align-items: center;
    .list_box_left {
      width: half(80);
      height: half(80);
      margin-right: half(20);
    }
    .list_box_right {
      color: #999;
      font-size: half(26);
      display: flex;
      overflow: hidden;
      flex-direction: column;
      justify-content: space-between;
      .list_box_right_t1 {
        margin-bottom: half(8);
        color: #000;
        font-size: half(32);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list_box_right_t2 {
        margin: half(4) 0;
      }
    }
  }
}
</style>
