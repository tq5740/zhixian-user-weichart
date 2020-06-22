<template>
  <div class="index">
    <div class="GPS_box van-hairline--bottom">
      <div class="left_box" @click="onLocationClick">
        <i class="iconfont zx-svg home_icon_N icon-dingwei_1"></i>
        <span class="left_box_t">{{locationName}}</span>
      </div>
      <div class="search-box van-hairline--left" @click="onSearchClick">
        <i class="iconfont search-icon icon-sousuo"></i>
      </div>
    </div>
    <swiper :autoplay="3000" class="swipe-img-wrap">
      <swiper-item v-for="item in bannerDataArr" :key="item.bannerId" @click.native="onSwipeBannerItemClick(item.linkUrl)">
        <image class="swipe-img" :src="item.img ? configData.imgDomain + item.img : 'https://img.yzcdn.cn/1.jpg'" />
      </swiper-item>
    </swiper>
    <div class="article-container">
      <img class="article-avatar" src="../../../static/img/indexArticleMoreIcon.png" @click="onArticleAvatarClick">
      <ul class="article-list-wrap">
        <li class="article-list-item" :class="{'first':!key && articleListData.length>1 }" v-for="(item,key) in articleListData" :key="item.articleId" @click="onArticleItemClick(item.articleId)">{{item.createTime}} &nbsp;{{item.articleTitle}}</li>
      </ul>
    </div>
    <div class="cont_title van-hairline--top-bottom" v-if="recruitListData && recruitListData.length">
      <div class="cont_title_t1">
        <i class="iconfont zx-svg cont_title_icon icon-zhuanchangzhaopin"></i>现场招聘
      </div>
      <div class="cont_title_t2" @click="navToRecruitList">更多
        <i class="iconfont zx-svg gengduo_icon icon-gengduo"></i>
      </div>
    </div>
    <ul class="recruit-ul">
      <li class="recruit-li " :class="{'van-hairline--bottom': index < recruitListData.length-1}" v-for="(item,index) in recruitListData" :key="item.venueId" @click="navToRecruitDetail(item.venueId)">
        <img class="recruit-avatar" :src="item.venueCover ? configData.imgDomain + item.venueCover : recruitImg">
        <div class="recruit-profile">
          <div class="recruit-subject">【{{item.type}}】{{item.venueName}}</div>
          <div class="recruit-dateTime">举办时间：{{item.startTime}} [{{item.period}}]</div>
        </div>
      </li>
    </ul>
    <div class="cont_title van-hairline--top-bottom">
      <div class="cont_title_t1">
        <i class="iconfont zx-svg cont_title_icon icon-remenqiye"></i>热门企业
      </div>
      <div class="cont_title_t2" @click="moreCompany">更多
        <i class="iconfont zx-svg gengduo_icon icon-gengduo"></i>
      </div>
    </div>
    <div class="enterprise-wrap">
      <div class="enterprise-wrap-ul">
        <li class="enterprise_box" v-for="item in orgGuestListData" :key="item.orgId" @click="onOrgItemClick(item.orgId)">
          <div class="enterprise-img-wrapper">
            <img class="enterprise_img" :src="configData.imgDomain + item.orgLogo" :key="configData.imgDomain + item.orgLogo" v-if="item.orgLogo">
          </div>
          <div class="enterprise_box_txt">
            {{item.shortName}}
          </div>
        </li>
      </div>
    </div>
    <div class="cont_title van-hairline--top-bottom">
      <div class="cont_title_t1">
        <i class="iconfont zx-svg cont_title_icon icon-tuijianzhiwei"></i>推荐职位
      </div>
      <div class="cont_title_t2" @click="morePosition">更多
        <i class="iconfont zx-svg gengduo_icon icon-gengduo"></i>
      </div>
    </div>
    <position-list-item :positionListData="positionListData"></position-list-item>
    <no-data :isNoData="isNoData"></no-data>

    <footer class="bottom-tip" v-if="showBottomTip">已经到底啦...</footer>
    <guide-box :tipContent="tipContent" :btnValue="btnValue" :showGuideBox="showGuideBox" @onGuideBtnClick="onGuideBtnClick"></guide-box>
    <van-toast id="van-toast" />

  </div>
</template>

<script>

import GuideBox from "../../components/GuideBox/GuideBox.vue";
import PositionListItem from "../../components/PositionListItem/PositionListItem.vue";
import Banner from '../../api/modules/banner.js';
import Article from '../../api/modules/article.js';
import Recruit from '../../api/modules/recruit.js';
import Org from '../../api/modules/org.js';
import PositionApi from '../../api/modules/position.js';
import { formatDate } from '../../utils/index.js';
import { mapState } from 'vuex';
import { setTimeout } from 'timers';

export default {
  components: {
    GuideBox,
    PositionListItem
  },
  data() {
    return {
      totalPageNumber: 0,
      isShowList: true,
      pageNumber: 1,
      isNoData: false,
      recruitImg: require("../../../static/img/recruit/recruitImg.png"),
      showBottomTip: false,
      tipContent: "准确的定位，能帮助您查找到就近工作职位！",
      btnValue: "知道了",
      showGuideBox: true,
      bannerDataArr: [],
      pageSize: 10,
      orgGuestListData: [],
      positionListData: [],
      latitude: "",
      longitude: "",
      locationName: "",
      recruitListData: [],
      articleListData: [],
      total: ""
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }, 1200);
  },
  methods: {
    _initLocation() {
      try {
        let locationData = wx.getStorageSync("locationData");
        let indexGuideStatus = wx.getStorageSync("indexGuideStatus");
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
        if (indexGuideStatus) {
          this.showGuideBox = false;
        }
      } catch (e) {
        this.$toast("无法获取缓存数据！");
      }
    },
    getArticleList() {
      const data = {
        pageNum: 1,
        pageSize: 2,
        sortField: "createTime",
        sortBy: false,
        isRecommend: 1,
        orgId: this.$store.state.configData.orgId,
        siteHierarchy: this.$store.state.configData.hierarchy
      };
      Article.article_list(data, (res) => {
        if (res.code === 0) {
          if (res.data.result.length) {
            for (let i = 0; i < res.data.result.length; i++) {
              res.data.result[i].createTime = formatDate(res.data.result[i].createTime, "MM/DD");
            }
            this.articleListData = res.data.result;
          }
        }
      }, (res) => {
        // this.$toast(res.msg);
      });
    },
    getRecruitList() {
      const data = {
        pageNum: 1,
        pageSize: 2,
        siteHierarchy: this.$store.state.configData.hierarchy,
        sortBy: true,
        sortField: "startTime"
      };
      Recruit.venue_list(data, res => {
        if (res.code === 0) {
          const result = res.data.result;
          if (result.length) {
            for (let i = 0; i < res.data.result.length; i++) {
              res.data.result[i].startTime = formatDate(res.data.result[i].startTime, "YYYY-MM-DD");
              res.data.result[i].type === 1 ? res.data.result[i].type = "专场" : res.data.result[i].type = "校招";
            }
            this.recruitListData = result;
          }
        }
      }, error => {
        // this.$toast(res.data.msg);
      });
    },
    getOrgListGuest() {
      const data = {
        pageSize: 10,
        pageNum: 1,
        isRecommend: true,
        siteHierarchy: this.$store.state.configData.hierarchy,
        sortBy: false,
        sortField: "updateTime"
      };
      Org.getOrgGuestList(data, (res) => {
        this.orgGuestListData = res.data.result;
      });
    },
    getBannerList() {
      const data = {
        type: 2,
        pageSize: 5,
        siteHierarchy: this.$store.state.configData.hierarchy
      };
      Banner.getBannerSwiperList(data, res => {
        if (res.code === 0) {
          const resData = res.data;
          const len = resData.length;
          if (len < 5) {
            this.bannerDataArr = resData;
          } else {
            this.bannerDataArr = res.data.slice(0, 5);
          }
        }
      });
    },
    onArticleItemClick(articleId) {
      wx.navigateTo({ url: "../articleDetail/main?articleId=" + articleId });
    },
    onArticleAvatarClick() {
      wx.navigateTo({ url: "../articleList/main" })
    },
    onOrgItemClick(orgId) {
      wx.navigateTo({ url: "../organization/main?orgId=" + orgId })
    },
    //  热门企业
    moreCompany() {
      wx.navigateTo({ url: "../companyList/main" })
    },
    //  推荐职位
    morePosition() {
      wx.navigateTo({ url: "../positionList/main" })
    },
    navToRecruitList() {
      wx.navigateTo({ url: "../recruitList/main" })
    },
    navToRecruitDetail(venueId) {
      venueId && wx.navigateTo({ url: "../recruitDetail/main?recruitId=" + venueId })
    },
    onLocationClick() {
      var _this = this;
      wx.chooseLocation({
        success: function (res) {
          wx.setStorageSync(
            "locationData",
            JSON.stringify({
              latitude: res.latitude,
              longitude: res.longitude,
              locationName: res.address
            })
          );
          _this.$store.commit("setLngLat", {
            lat: res.latitude,
            lng: res.longitude,
            posString: res.address
          });
          _this.locationName = res.address;
          _this.latitude = res.latitude;
          _this.longitude = res.longitude;
          _this.getPositionList(1);
        },
        fail: function (err) {
          console.log(err)
        }
      });
    },
    onSearchClick() {
      wx.navigateTo({ url: "/pages/search/main" });
    },
    onGuideBtnClick() {
      try {
        wx.setStorageSync("indexGuideStatus","1" );
      } catch (e) {
        this.$toast("无法存储数据！");
      }
      this.showGuideBox = false;
    },
    getPositionList(_pageNum, isRouteUpdate) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          siteHierarchy: this.configData.hierarchy,
          sortField: "distance",
          lat: this.latitude || 0,
          lng: this.longitude || 0
        };
        // this.handleApiParams(data, isRouteUpdate);
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
            console.log(this.showBottomTip,"1")
            if (this.pageNumber > this.totalPageNumber) {
              this.showBottomTip = true;
              return;
            }
            console.log(this.showBottomTip,"2")
            this.positionListData = this.positionListData.concat(
              res.data.result
            )
            //当前页不等于总页数的时候和 总页数大于0的时候 做++
            if (
              this.totalPageNumber !== 0
            ) {
              ++this.pageNumber;
            }
          } else {
            // this.$toast(res.msg);
          }
          this.isShowList = true;
          resolve();
        }, (error) => {
          this.isShowList = true;
          if (!error.Cancel) {
            this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
          }
          reject(error);
        });
      });
    }
  },
  onShow() {
    this._initLocation();
  },
  onLoad() {
    this._initLocation();
    setTimeout(() => {
      this._initLocation();
    },500)
    setTimeout(() => {
      this._initLocation();
    },2000)
    setTimeout(() => {
      this._initLocation();
    },4000)
    this.$store.dispatch("getConfigData", { doMain: "www.cdwork.cn" }).then(res => {
      this.getBannerList();
      this.getArticleList();
      this.getRecruitList();
      this.getOrgListGuest();
      this.getPositionList(1);
    })
  },
  mounted() {
    this.$store.commit( "setTitle", "微就业" );
  },
  onReachBottom() {
    if(this.positionListData.length < this.total){
      this.getPositionList();
    }
  }
}
</script>
<style lang="scss" scoped>
  .index {
    min-height: 100%;
    font-size: half(26);
    overflow-x: hidden;
    margin-bottom: half(98);
    .article-container {
      height: half(132);
      margin-bottom: half(20);
      display: flex;
      align-items: center;
      padding: 0 half(30);
      background-color: #fff;
      font-size: half(28);
      color: #333;
    }
    .article-list-wrap {
      flex: 1;
      overflow: hidden;
    }
    .article-avatar {
      width: half(92);
      height: half(92);
      margin-right: half(20);
    }
    .recruit-ul {
      padding: 0 half(20);
      background-color: #fff;
    }
    .article-list-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .article-list-item.first {
      margin-bottom: half(10);
    }
    .recruit-ul,
    .enterprise-wrap {
      margin-bottom: half(20);
    }
    .recruit-li {
      display: flex;
      align-items: center;
      padding: half(30) 0;
    }
    .recruit-avatar {
      width: half(100);
      height: half(100);
      margin-right: half(20);
    }
    .recruit-profile {
      flex: 1;
      font-size: half(32);
      color: #000;
      overflow: hidden;
    }
    .recruit-subject {
      margin-bottom: half(24);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .recruit-dateTime {
      font-size: half(26);
      color: #666;
    }
    .search-box {
      width: half(100);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: half(-10) 0 half(14) half(-4) rgba(85, 85, 85, 0.233);
    }
    .search-icon {
      font-size: half(40);
      color: rgb(255, 174, 0);
    }
    .bottom-tip {
      height: half(60);
      line-height: half(60);
      text-align: center;
      color: #555;
    }
    .position-list-box {
      padding-top: 0;
    }
    .van-swipe-item {
      width: half(750) !important;
      /*height: half(300) !important;*/
    }

    .swipe-img {
      /*width: half(750);*/
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      pointer-events: none;
      /*height: half(300);*/
    }
    .swipe-img-wrap {
      width: 100%;
      height: half(300);
      margin-top: half(88);
      image{
        display: block;
        width: 100%;
        height: half(300);
      }
    }
    /deep/ {
      .van-swipe {
        width: 100%;
        height: half(300);
      }
      .tip-box {
        margin: half(66) 0 0 half(90);
      }
      .tip-circle {
        height: half(460);
        background: url("../../../static/img/guide/guideIndexImg.png") no-repeat;
        background-size: contain;
      }
      .tip-subject {
        width: half(380);
        margin: half(-190) 0 0 half(80);
      }
      .guide-btn {
        margin: half(150) 0 0 half(164);
      }
      .van-field__body {
        width: half(430);
        font-size: half(28);
      }
      .van-swipe__indicator {
        width: half(16);
        height: half(16);
        background-color: #CCC;
      }
      .van-swipe__indicator--active {
        background-color: #FFAE00;
      }
    }
    .margin_b_10 {
      margin-bottom: half(10);
    }
    .margin_r_10 {
      margin-right: half(10);
    }

    .home_icon_N {
      flex-shrink: 0;
      width: half(28);
      height: half(28);
      margin-right: half(10);
      color: rgb(66, 185, 131);
      font-size: half(28);
    }
    .zp_icon {
      width: half(100);
      height: half(100);
    }
    .cont_title_icon {
      width: half(32);
      height: half(32);
      margin-right: half(10);
      color: rgb(66, 185, 131);
      font-size: half(32);
    }
    .icon-remenqiye {
      color: rgb(22, 178, 247);
    }
    .icon-tuijianzhiwei {
      color: rgb(255, 174, 0);
    }
    .gengduo_icon {
      font-size: 28rpx;
      color: #999;
    }
    .enterprise-img-wrapper {
      text-align: center;
      margin-bottom: half(16);
    }
    .enterprise_img {
      width: half(100);
      height: half(100);
    }
    .GPS_box {
      position: fixed;
      top: 0;
      z-index: 1;
      width: half(750);
      height: half(88);
      background: #fff;
      font-size: half(30);
      display: flex;
      justify-content: space-between;
      .left_box {
        display: flex;
        align-items: center;
        height: half(88);
        padding-left: half(20);
        flex: 1;
        overflow: hidden;
        .left_box_t {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .banner {
      width: 100%;
      height: half(300);
      background: #42b983;
    }
    .cont_title {
      padding: half(28) half(20);
      display: flex;
      align-items: center;
      font-size: half(32);
      background-color: #fff;
      .cont_title_t1 {
        display: flex;
        align-items: center;
      }
      .cont_title_t2 {
        color: #999;
        font-size: half(28);
        margin-left: auto;
        display: flex;
        align-items: center;
      }
    }
    .enterprise-wrap {
      width: half(750);
      padding: half(30) half(20);
      background: #fff;
    }
    .enterprise-wrap-ul {
      overflow-x: auto;
      white-space: nowrap;
    }
    .enterprise_box {
      width: half(160);
      // margin-right: half(12);
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      font-size: half(26);
    }
    .enterprise_box_txt {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
</style>