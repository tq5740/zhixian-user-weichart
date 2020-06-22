/**
*@author chao
*@dateTime 2018/10/15
*@description created
*/
<template>
  <div class="searchList">
    <div class="GPS_box van-hairline--bottom">
      <div
        class="sele_recently van-hairline--right"
        :class="{colorPrimary: stateRecently}"
        @click="seleRecently"
      >
        <i class="iconfont zx-svg home_icon_N icon-zuijin_xuanzhong" v-if="stateRecently"></i>
        <i class="iconfont zx-svg home_icon_N icon-zuijin" v-else></i>最近
      </div>
      <div
        class="sele_newest"
        :class="{colorPrimary: stateNewest}"
        @click="seleNewest"
      >
        <i class="iconfont zx-svg home_icon_N icon-zuixin_xuanzhong" v-if="stateNewest"></i>
        <i class="iconfont zx-svg home_icon_N icon-zuixin" v-else></i>最新
      </div>
    </div>
    <v-scroll
      ref="vScroll"
      v-if="isShowList"
      :loadData="getPositionList"
      :totalPageNumber="totalPageNumber"
    >
      <position-list-item :positionListData="positionListData"></position-list-item>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import PositionApi from "../../api/modules/position";
import PositionListItem from "../../components/PositionListItem/PositionListItem.vue";

export default {
  components: {
    PositionListItem
  },
  data() {
    return {
      queryObj: {},
      isKeepAlive: false,
      isNewest: false,
      stateRecently: true,
      stateNewest: false,
      isNoData: false,
      isShowList: true,
      totalPageNumber: 0,
      pageSize: 10,
      searchString: "",
      queryString: "",
      pageNumber: 1,
      total: "",
      // isFirstEnter: false,
      locationName: "成都市",
      latitude: "",
      longitude: "",
      lowSalary: 0,
      isRecommend: false,
      highSalary: 0,
      searchArr: [],
      lowSalaryArr: [0, 2, 4, 6, 8, 10],
      highSalaryArr: [2, 4, 6, 8, 10, 0],
      positionListData: [],
      pickerColumnsArr: [
        ["不限", "全职", "兼职", "实习"],
        ["不限", "社会招聘", "校园招聘"],
        ["不限", "初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"],
        ["不限", "1年", "2年", "3-4年", "5年及以上"],
        ["不限", "2k以下", "2k-4k", "4k-6k", "6k-8k", "8k-10k", "10k以上"]
      ]
    }
  },
  onLoad(e) {
    this.queryObj = e;
    this.searchString = e.query;
    this.isKeepAlive = false;
    this.$store.commit("setTitle", "搜索列表");
    this.formatSearchStr();
    this._formatQueryStr();
    this._initLocation();
    this.stateRecently = true;
    this.stateNewest = false;
    this.getPositionList(1, false);
  },
  methods: {
    activated() {
      if (this.isKeepAlive) {
        this.$store.commit("setTitle", "搜索列表");
        this.formatSearchStr();
        this._formatQueryStr();
        this._initLocation();
        if (!wx.getStorageSync("positionDetail")) {
          this.isNewest = false;
          this.stateRecently = true;
          this.stateNewest = false;
          this.getPositionList(1, false);
        }
      } else {
        this.isKeepAlive = true;
      }
    },
    seleRecently() {
      if (this.stateRecently) return;
      this.isNewest = false;
      this.getPositionList(1, false);
      this.stateRecently = true;
      this.stateNewest = false;
    },
    seleNewest() {
      // 参数3为  倒序修改时间
      if (this.stateNewest) return;
      this.isNewest = true;
      this.getPositionList(1, false);

      this.stateRecently = false;
      this.stateNewest = true;
    },
    _formatQueryStr() {
      let queryStr = JSON.stringify(this.queryObj);
      let queryString = queryStr.split("?")[1];
      if (queryString) {
        this.queryString = queryString;
      } else {
        this.queryString = "";
      }
    },
    _initLocation() {
      if (wx.getStorageSync) {
        try {
          let locationData = wx.getStorageSync("locationData");
          if (locationData) {
            locationData = JSON.parse(locationData);
            const latitude = locationData.latitude;
            const longitude = locationData.longitude;
            const locationName = locationData.locationName;
            if (latitude && longitude) {
              this.latitude = latitude;
              this.longitude = longitude;
              this.locationName = locationName;
            }
          }
        } catch (e) {
          this.$toast("请关闭浏览器的无痕模式再进行操作！");
        }
      }
    },
    formatSearchStr() {
      const queryObj = this.queryObj;
      const searchStr = queryObj.searchStr;
      const keyword = queryObj.keyword;
      const isRecommend = queryObj.isRecommend;
      if (isRecommend !== undefined && isRecommend === "1") {
        this.isRecommend = true;
      }
      if (searchStr !== undefined) {
        const searchStrArr = searchStr.split("");
        this.searchArr = searchStrArr.slice(0, 5);
        const salary = +searchStrArr[4] - 1;
        if (salary > -1) {
          this.lowSalary = this.lowSalaryArr[salary];
          this.highSalary = this.highSalaryArr[salary];
        }
        if (keyword) {
          this.searchString = keyword;
        } else {
          this.searchString = "";
        }
      }
      // this.getPositionList(1);
    },
    getPositionList(_pageNum, isRouteUpdate) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          query: this.searchString,
          sortField: "distance",
          siteHierarchy: this.$store.state.configData.hierarchy
        };
        if (this.latitude && this.longitude) {
          data.lat = this.latitude;
          data.lng = this.longitude;
        }
        if (this.isNewest) {
          data.sortBy = false;
          data.sortField = "updateTime";
        } else {
          data.sortField = "distance";
        }
        if (
          this.pageNumber !== this.totalPageNumber && this.totalPageNumber !== 0
        ) {
          ++this.pageNumber;
        }
        this.$toast.loading({
          mask: true,
          message: "加载中..."
        });

        if (_pageNum === 1) {
          this.totalPageNumber = 0;
        }
        
        this.handlerApiParams(data, isRouteUpdate);
        PositionApi.getPositionList(data, (res) => {
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
              this.positionListData = [];
              this.pageNumber = _pageNum;
            }
            this.totalPageNumber = res.data.pages;
            if (this.pageNumber > this.totalPageNumber) {
              return;
            }
            this.positionListData = this.positionListData.concat(
              res.data.result
            );
            //当前页不等于总页数的时候和 总页数大于0的时候 做++
            if (
              this.totalPageNumber !== 0
            ) {
              ++this.pageNumber;
            }
            
          }
          this.isShowList = true;
          resolve();
        }, (error) => {
          this.isShowList = true;
          if (!error.Cancel) {
            this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
          }
          reject(error);
        })
        setTimeout(() => {
          this.$toast.clear();
        }, 500);
      });
    },
    handlerApiParams(data, isRouteUpdate) {
      if (this.isRecommend) {
        data.isRecommend = this.isRecommend;
      } else {
        delete data.isRecommend;
      }
      if (this.lowSalary) {
        data.lowSalary = this.lowSalary * 1000;
      }
      if (this.highSalary) {
        data.highSalary = this.highSalary * 1000;
      }
      const searchArr = this.searchArr;
      const len = searchArr.length;
      if (len === 5) {
        const workNatureValue = +searchArr[0];
        const typeValue = +searchArr[1];
        const educationValue = +searchArr[2];
        const experienceValue = +searchArr[3];
        if (workNatureValue) {
          data.workNature = workNatureValue;
        }
        if (typeValue) {
          data.type = typeValue;
        }
        if (educationValue) {
          data.education = educationValue;
        }
        if (experienceValue) {
          data.experience = experienceValue;
        }
      }
      const queryObj = this.queryObj;
      const recruitType = queryObj.recruitType;
      const workNature = queryObj.workNature;
      if (recruitType !== undefined || workNature !== undefined) {
        if (recruitType) {
          if (recruitType === "0") {
            data.type = "1";
          } else if (recruitType === "1") {
            data.type = "2";
          }
          delete data.workNature;
        } else if (workNature === "1") {
          data.workNature = "2";
          delete data.type;
        }
        delete data.education;
        delete data.experience;
        delete data.isRecommend;
      }
      if (isRouteUpdate) {
        this.searchArr = [];
        delete data.workNature;
        delete data.type;
        delete data.education;
        delete data.experience;
      }
      const latitude = this.latitude;
      const longitude = this.longitude;
      if (latitude && latitude) {
        data.lat = latitude;
        data.lng = longitude;
      }
    },
    onLocationClick() {
      var _this = this;
      wx.chooseLocation({
        success: function (res) {
          wx.setStorage({
            key: "locationData",
            data: JSON.stringify({
              latitude: res.latitude,
              longitude: res.longitude,
              locationName: res.address
            })
          });
          _this.$store.commit("setLngLat", {
            lat: res.latitude,
            lng: res.longitude,
            posString: res.address
          });
          _this.locationName = res.address;
          _this.latitude = res.latitude;
          _this.longitude = res.longitude;
          _this._initLocation();
          _this.getPositionList(1);
        },
        fail: function (err) {
          console.log(err)
        }
      });
    },
    onSearchClick() {
      if (this.isRecommend) {
        wx.navigateTo({ url: "../search/main?keyword=" + this.searchString + "&isRecommend=1" })
      } else {
        wx.navigateTo({ url: "../search/main?keyword=" + this.searchString })
      }
    }
  },
  onReachBottom() {
    if(this.positionListData.length < this.total){
      this.getPositionList();
    }
  }
}
</script>
<style lang="scss" scoped>
  .searchList {
    background: #f2f2f2;
    min-height: 100%;
    //   padding-bottom: half(98);
    font-size: half(26);
    /*-webkit-overflow-scrolling: touch;*/
    .margin_b_10 {
      margin-bottom: half(10);
    }
    .margin_r_10 {
      margin-right: half(10);
    }
    .padding_t_90 {
      padding-top: half(90);
    }
    .colorPrimary {
      color: #42b983;
    }
    /*  /deep/ {
          .van-search {
            padding: half(15) half(20) half(15) half(20) !important;
            left: half(216) !important;
            width: half(534);
            background: #fff !important;
          }
          .van-field__body {
            width: half(430);
            font-size: half(28);
          }
          .van-search,
          .van-tabs {
            padding-left: 0px;
          }
          .van-search {
            left: half(40);
          }
          .van-search .van-cell {
            background: #f2f2f2 !important;
          }
        }*/

    .home_icon_N {
      font-size: half(32);
      margin-right: half(10);
      display: inline-block;
      position: relative;
      top: half(4);
    }
    .zp_icon {
      width: half(100);
      height: half(100);
    }
    .cont_title_icon {
      width: half(32);
      height: half(32);
    }
    .gengduo_icon {
      width: half(28);
      height: half(52);
    }
    .enterprise_img {
      width: half(80);
      height: half(80);
    }
    .GPS_box {
      position: fixed;
      top: 0;
      z-index: 1;
      width: half(750);
      height: half(60);
      line-height: half(60);
      background: #fff;
      font-size: half(28);
      display: flex;
      justify-content: space-between;
      padding: half(20) 0;
      // .left_box {
      //   display: flex;
      //   align-items: center;
      //   padding-left: half(20);
      //   flex: 1;
      //   .left_box_t {
      //     width: half(160);
      //     overflow: hidden;
      //     text-overflow: ellipsis;
      //     white-space: nowrap;
      //   }
      // }
      .sele_recently,
      .sele_newest {
        flex: 1;
        font-size: half(32);
        text-align: center;
      }
      // .sele_newest {
      //   flex: 1;
      //   font-size: half(32);
      //   text-align: center;
      // }
    }
  }
</style>
