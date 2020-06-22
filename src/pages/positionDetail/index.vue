/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="position-detail">
    <header class="position-header">
      <div class="position-top-wrap">
        <div class="position-top">
          <div class="position-name">
            <span>{{positionDetailData.jobName}}</span>
            <span class="position-name-icon" v-if="positionDetailData.workNature">{{workNatureArr[positionDetailData.workNature]}}</span>
          </div>
          <div class="position-dateTime">{{positionDateTime}}</div>
        </div>
        <div class="position-remuneration-wrap">
          <div class="position-remuneration" v-if="positionDetailData.lowSalary== -1">
            面议
          </div>
          <div class="position-remuneration" v-if="(positionDetailData.highSalary || positionDetailData.lowSalary) && positionDetailData.lowSalary!= -1">
            {{salary}}
          </div>
        </div>
        <ul class="position-demand">
          <li class="position-demand-num">
            <i class="iconfont position-detail-icon icon-renshu"></i>{{positionDetailData.recruitNumber>0?'招'+positionDetailData.recruitNumber+'人':'若干'}}</li>
          <li class="position-demand-degree">
            <i class="iconfont position-detail-icon icon-xueli"></i>{{education[positionDetailData.education]}}</li>
          <li class="position-demand-experience">
            <i class="iconfont position-detail-icon experience icon-gongzuojingyan"></i>{{experience[positionDetailData.experience]}}</li>
        </ul>
      </div>
      <ul class="position-welfare van-hairline--top" v-if="positionDetailData.welfare.length">
        <li class="position-welfare-li" v-for="value in positionDetailData.welfare" :key="value">{{value}}</li>
      </ul>
    </header>
    <section class="position-address-wrapper" @click="onPositionAddressClick">
      <div class="position-address">
        <div class="position-address-name">
          <i class="iconfont position-address-icon icon-dingwei_1"></i>
          <span class="position-address-profile">
            {{positionDetailData.city || ''}}{{positionDetailData.district || ''}}{{positionDetailData.street || ''}}
          </span>
        </div>
        <!--<div class="position-address-detail">-->
        <!--</div>-->
      </div>
      <i class="iconfont gengduo_icon icon-gengduo"></i>
    </section>
    <section class="position-org-detail">
      <div class="position-org-introduce" @click="onOrgIntroduceClick">
        <img :src="configData.imgDomain + positionDetailData.orgLogo" :key="configData.imgDomain + positionDetailData.orgLogo" class="position-org-avatar" v-if="positionDetailData.orgLogo">
        <img src="../../../static/img/default/morenLOGO.png" class="position-org-avatar" v-else>
        <div class="position-org-profile">
          <div class="position-org-name">{{positionDetailData.orgName}}</div>
          <div class="position-org-sub">
            <span class="position-org-type van-hairline--right">{{industryList[positionDetailData.industry - 1]}}</span>
            <span class="position-org-scale">{{scaleList[positionDetailData.scale - 1]}}</span>
          </div>
        </div>
        <i class="iconfont gengduo_icon icon-gengduo"></i>

      </div>
      <div class="position-org-grade van-hairline--top">
        <div class="position-org-stars">
          <i class="iconfont position-org-stars-icon icon-xing" v-for="item in 5" :key="item"></i>
        </div>

        <div class="position-org-number">共{{comments}}人评论</div>

      </div>
    </section>
    <div class="position-description">
      <div class="position-desc-subject van-hairline--bottom">职位描述</div>
      <div class="position-desc-content">
        <wxParse v-if="positionDetailData.intro" :content="positionDetailData.intro" />
        <p v-else>暂无数据</p>
      </div>
      <div style="clear: both;"></div>
      <div class="position-des-tip-wrap">
        <p class="position-des-tip-sp">*如遇无效、虚假、诈骗信息，请立即投诉。</p>
        <p class="position-des-tip-sp">*求职过程请勿缴纳费用，谨防诈骗！若信息不实请投诉。</p>
      </div>
      <div class="complaint-wrap">
        <div class="complaint-btn" @click="onComplaintBtnClick">投诉</div>
      </div>
    </div>
    <div class="position-recommend-container" v-if="positionRecommendData.length">
      <div class="position-position-header">
        <span class="horizontal-line"></span>
        <span class="position-position-sub">职位推荐</span>
        <span class="horizontal-line"></span>
      </div>
      <position-list-item :positionListData="positionRecommendData"></position-list-item>
    </div>
    <div class="position-btn-bar  van-hairline--top">
      <div class="position-btn-pending">
        <div class="position-btn-editor van-hairline--right" @click="onCommunicationClick">
          <i class="iconfont customer-service-icon icon-goutong"></i>沟通</div>
        <div class="position-btn-empty"></div>
        <div class="position-btn-publish" @click="onReservationClick">
          <div class="position-btn-publish-inner" :class="{'activated':reservationState}">
            {{!reservationState?'投递简历':'已投递'}}
          </div>
        </div>
      </div>
    </div>
    <guide-box class="second-step" :tipContent="tipContent" :btnValue="btnValue" :showGuideBox="showGuideBox" @onGuideBtnClick="onGuideBtnClick"></guide-box>
    <complaint v-if="showComplaint" :complaintTitle="complaintTitle" @onComplaintSuccess="onComplaintSuccess"></complaint>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import {
  formatSalary,
  formatDate,
  isWxBrowser
} from "../../utils/index";
import complaint from "../../pages/complaint/index.vue";
import PositionApi from "../../api/modules/position";
import Org from "../../api/modules/org";
import Reservation from "../../api/modules/reservation";
import PositionListItem from "../../components/PositionListItem/PositionListItem.vue";
import wxParse from 'mpvue-wxparse';
export default {
  components: {
    complaint,
    PositionListItem,
    wxParse
  },
  data() {
    return {
      complaintTitle: "",
      showComplaint: false,
      reservationState: false,
      workNatureArr: ["不限", "全职", "兼职", "实习"],
      formatDate: formatDate,
      formatSalary: formatSalary,
      tipContent: "想要深入了解职位？试试和HR进一步沟通吧!",
      btnValue: "知道了",
      showGuideBox: true,
      active: 0,
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
      experience: ["不限", "1年", "2年", "3-4年", "5年及以上"], //工作经验
      tabOptions: ["全部", "未通过", "已发布", "已关闭"],
      positionDetailData: { welfare: [] },
      latitude: "",
      longitude: "",
      positionRecommendData: [],
      positionId: "",
      comments: 0
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.state.userInfo
    },
    configData() {
      return this.$store.state.configData;
    },
    positionDateTime() {
      return this.positionDetailData.updateTime ? formatDate(this.positionDetailData.updateTime, 'YYYY-MM-DD') : '';
    },
    isLowSHighS() {
      return (this.positionDetailData.highSalary || this.positionDetailData.lowSalary) && this.positionDetailData.lowSalary != -1;
    },
    salary() {
      return formatSalary(this.positionDetailData.lowSalary, this.positionDetailData.highSalary, this.positionDetailData.salaryType);
    },
    token() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
    }
  },
  onLoad(e) {
    this.positionId = e.positionId;
    this.handleGuideMask();
    this.queryPositionDetail();
    this._initLocation();
    this.getReservationState();
  },

  methods: {
    onComplaintSuccess() {
      this.showComplaint = false;
    },
    handleGuideMask() {
      if (wx.getStorageSync("positionDetailGuideStatus")) {
        this.showGuideBox = false;
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
            if (latitude && longitude) {
              this.latitude = latitude;
              this.longitude = longitude;
            }
          }
        } catch (e) {
          // this.$toast("请关闭浏览器的无痕模式再进行操作！");
        }
      }
    },
    queryPositionDetail() {
      const positionId = this.positionId;
      if (!positionId) return;
      const data = {
        jobId: positionId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      };
      PositionApi.queryPositionDetail(data, (res) => {
        if (res.code === 0) {
          this.$store.commit("setTitle", res.data.jobName);

          const resData = res.data;
          resData.welfare = JSON.parse(resData.welfare);
          this.positionDetailData = resData;
          this.complaintTitle = resData.jobName;
          this.positionDetailData.intro = decodeURIComponent(resData.intro);
          this.getRecommendPositionList(1);

          // 请求评论数
          const data = {
            orgId: res.data.orgId,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.token
          };
          // if (this.token) {
          //   data.token = this.token
          // }
          Org.getOrgDetail(data, (res) => {
            if (res.code === 0) {
              if (res.data) {
                this.comments = res.data.comments;
              }
            }
          })

        } else {
          this.$toast(res.msg);
        }
      });
    },
    getRecommendPositionList(_pageNum) {
      const positionId = this.positionId;
      if (!positionId) return;
      const data = {
        pageNum: _pageNum,
        pageSize: 11,
        siteHierarchy: this.$store.state.configData.hierarchy,
        query: this.positionDetailData.jobName
        // isRecommend: true
      };
      const latitude = this.latitude;
      const longitude = this.longitude;
      if (latitude && latitude) {
        data.lat = latitude;
        data.lng = longitude;
      }
      PositionApi.getPositionList(data, (res) => {
        if (res.code === 0) {
          const resData = res.data.result;
          if (resData.length) {
            this.removeRepeatData(resData, positionId);
          }
        }
      });
    },
    removeRepeatData(resData, positionId) {
      this.positionRecommendData = resData
        .filter((item) => {
          return positionId !== item.jobId;
        })
        .slice(0, 10);
    },
    getReservationState() {
      const positionId = this.positionId;
      if (!positionId) return;
      const userInfo = this.$store.state.userInfo;
      const userId = userInfo && userInfo.userId;
      if (!userId) return;
      const data = {
        jobId: positionId,
        userId: userId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      };
      Reservation.getReservationStatus(data, (res) => {
        if (res.code === 0) {
          const resData = res.data;
          if (resData && resData.state) {
            this.reservationState = true;
          } else {
            this.reservationState = false;
          }
        } else {
          this.$toast(res.msg);
        }
      });
    },
    //用户预约
    userReservationPosition() {
      const positionId = this.positionId;
      if (!positionId) return;
      const userInfo = this.$store.state.userInfo;
      const userId = userInfo && userInfo.userId;
      if (!userId) return;
      const data = {
        jobId: positionId,
        userId: userId,
        type: "1",
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      };
      Reservation.userReservation(data, (res) => {
        if (res.code === 0 && res.data.bookingId) {
          wx.showToast({ title: '简历投递成功！' });
          this.reservationState = true;
        } else if (res.code === -999) {
          this.$toast("您已经预约了，请耐心等待30天再次预约吧~");
          this.reservationState = true;
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onComplaintBtnClick() {
      if (!this.isLogin) {
        wx.navigateTo({ url: '../login/main' });
        return;
      }
      this.showComplaint = true;
      // this.positionId &&
      //   this.$router.push("/position/complaint?positionId=" + this.positionId);
    },
    onReservationClick() {
      if (this.isLogin) {
        if (!this.reservationState) {
          this.userReservationPosition();
        } else {
          this.$toast("您已经预约了，请耐心等待30天再次预约吧~");
        }
      } else {
        this.$dialog
          .alert({
            title: "温馨提示",
            message: "亲，您还未登录哦！点击确认，马上去登录...",
            showCancelButton: true
          })
          .then(() => {
            wx.navigateTo({ url: '../login/main' });
          })
          .catch(() => { });
      }
    },
    onCommunicationClick() {
      const $state = this.$store.state;
      const userInfo = $state.userInfo;
      const positionDetailData = this.positionDetailData;
      const createUserId = positionDetailData.createUser;
      if (userInfo) {
        if (createUserId && createUserId !== userInfo.userId) {
          if (wx.setStorage) {
            try {
              wx.setStorage({ key: "newsIntentionalJob", data: userInfo.intentionalJob || "" });
              wx.navigateTo({ url: "../newsDetails/main?userId=" + createUserId })
            } catch (e) {
              this.$toast("请关闭浏览器的无痕模式再进行操作！");
            }
          }
        }
      } else {
        wx.navigateTo({ url: '../login/main' })
      }
    },
    onOrgIntroduceClick() {
      wx.navigateTo({ url: "../organization/main?orgId=" + this.positionDetailData.orgId })
    },
    onPositionAddressClick() {
      if (wx.openLocation) {
        try {
          const positionDetailData = this.positionDetailData;
          wx.openLocation({
            latitude: positionDetailData.lat,  
            longitude: positionDetailData.lng,
            name: positionDetailData.province + positionDetailData.city + positionDetailData.district + positionDetailData.street,
            address: positionDetailData.province + positionDetailData.city + positionDetailData.district + positionDetailData.street,
            scale: 15
          })
        } catch (e) {
          this.$toast("无法导航！");
        }
      }
    },
    onGuideBtnClick() {
      if (wx.setStorage) {
        try {
          wx.setStorage({ key: "positionDetailGuideStatus", data: "1" });
        } catch (e) {
          this.$toast("无法存储数据！");
        }
      }
      this.showGuideBox = false;
    }
  }
}
</script>
<style lang="scss" scoped>
  .position-detail {
    position: relative;
    min-height: 100%;
    padding-bottom: half(106);
    background-color: #f2f2f2;
    overflow-x: hidden;
    /*-webkit-overflow-scrolling: touch;*/
    .gengduo_icon{
      font-size: half(24);
      color: #999;
    }
    /deep/ {
      .tip-box {
        bottom: half(94);
        right: half(50);
      }

      .tip-circle {
        height: half(460);
        background: url("../../../static/img/guide/guideMineFirstStepImg.png")
          no-repeat;
        background-size: contain;
      }
      .tip-subject {
        width: half(380);
        margin: 0 0 half(70) half(28);
      }
      .tip-subject-panel {
        bottom: half(190);
      }
      .guide-btn {
        margin: half(30) 0 0 half(112);
      }
      .second-step {
        .tip-circle {
          background-image: url("../../../static/img/guide/guidePositionSecondStepImg.png");
        }
        .tip-box {
          bottom: half(110);
          left: half(102);
        }
        .tip-subject {
          margin: 0 0 half(84) half(52);
        }
        .guide-btn {
          margin-left: half(144);
        }
      }
    }
    .position-detail-icon {
      font-size: half(28);
      margin-right: half(10);
    }
    .position-org-stars-icon {
      font-size: half(34);
      margin-right: half(10);
      display: inline-block;
    }
    .position-detail-icon.experience {
      width: half(27);
      height: half(27);
    }
    .position-address-icon {
      font-size: half(30);
      margin-right: half(10);
      flex-shrink: 0;
    }
    .position-address-profile {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position-address-wrapper {
      display: flex;
      align-items: center;
      padding: half(30) half(20);
      margin-bottom: half(20);
      background-color: #fff;
    }
    .position-header,
    .position-address,
    .position-org-detail,
    .position-description {
      background-color: #fff;
    }
    .position-description {
      padding-bottom: half(30);
    }
    .position-position-header {
      height: half(88);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .horizontal-line {
      height: half(2);
      width: half(50);
      background-color: #d8d8d8;
    }
    .position-position-sub {
      padding: 0 half(20);
      color: #666;
      font-size: half(28);
    }
    .position-header {
      padding: half(40) half(20) 0;
      margin-bottom: half(20);
    }
    .position-top-wrap {
      height: half(236);
    }
    .position-top {
      display: flex;
      height: half(48);
      align-items: center;
    }
    .position-remuneration-wrap {
      padding: half(38) 0;
    }
    .position-name {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      margin-right: half(10);
      font-size: half(36);
      color: #000;
    }
    .position-name-sp {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position-name-icon {
      flex-shrink: 0;
      padding: half(2) half(8);
      margin-left: half(20);
      font-size: half(24);
      background-color: #42b983;
      color: #fff;
    }
    .position-dateTime {
      font-size: half(24);
      color: #999;
    }
    .position-remuneration {
      height: half(48);
      font-size: half(36);
      color: #fc703e;
    }
    .position-demand {
      display: flex;
      height: half(64);
      padding-bottom: half(30);
      font-size: half(26);
      color: #666;
    }
    .position-demand-num,
    .position-demand-degree {
      margin-right: half(80);
    }
    .position-demand-num,
    .position-demand-degree,
    .position-demand-experience {
      display: flex;
      align-items: center;
    }
    .position-welfare {
      min-height: half(80);
      display: flex;
      flex-wrap: wrap;
      padding: half(20) 0 0;
      font-size: half(24);
      color: #42b983;
    }
    .position-welfare-li {
      padding: half(2) half(16);
      margin-bottom: half(20);
      border: 1px solid #42b983;
      border-radius: half(20);
      margin-right: half(40);
      height: half(32);
    }
    .position-address {
      display: flex;
      /*min-height: half(92);*/
      flex: 1;
      flex-direction: column;
      overflow: hidden;
      color: #666;
      font-size: half(30);
    }
    .position-address-name {
      flex: 1;
      overflow: hidden;
    }
    .position-address-name {
      display: flex;
      height: half(42);
      align-items: center;
      /*margin-bottom: half(18);*/
    }
    /*  .position-address-detail {
            height: half(32);
            margin-left: half(40);
            font-size: half(24);
            color: #999;
          }*/
    .position-org-detail {
      height: half(196);
      padding: half(20) half(20) half(14);
      margin-bottom: half(20);
    }
    .position-org-introduce {
      height: half(108);
      display: flex;
      align-items: center;
      padding-bottom: half(20);
    }
    .position-org-avatar {
      width: half(80);
      height: half(80);
      margin-right: half(20);
    }
    .position-org-profile {
      flex: 1;
      display: flex;
      overflow: hidden;
      flex-direction: column;
    }
    .position-org-name {
      margin-bottom: half(14);
      font-size: half(32);
    }
    .position-org-sub {
      font-size: half(24);
      color: #999;
    }
    .position-org-type {
      padding-right: half(20);
    }
    .position-org-scale {
      padding-left: half(20);
    }
    .position-org-grade {
      height: half(54);
      display: flex;
      align-items: center;
      padding-top: half(14);
      color: #999;
      font-size: half(24);
    }
    .position-org-stars {
      flex: 1;
    }
    .position-desc-subject {
      padding: half(30) 0;
      text-align: center;
      font-size: half(32);
    }
    .position-desc-content {
      padding: half(26) half(20);
      font-size: half(28);
      display: block;
      /deep/ img {
        width: 100%;
      }
    }
    .position-des-tip-wrap {
      margin: half(40) half(20) half(30);
      padding: half(20);
      font-size: half(24);
      color: #000;
      border: 1px dashed #42b983;
      border-radius: half(6);
    }
    .complaint-wrap {
      text-align: right;
      font-size: half(26);
      color: #999;
    }
    .complaint-btn {
      padding: half(10) half(20);
      display: inline-block;
    }
    .position-des-tip-sp {
      line-height: half(40);
    }
    .position-btn-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: half(32);
      color: #fff;
    }

    .position-btn-pending {
      display: flex;
      background-color: #fff;
      height: half(98);
    }
    .position-btn-editor {
      display: flex;
      align-items: center;
      padding: half(10) half(50);
      color: #42b983;
      font-size: half(24);
    }
    .position-btn-empty {
      flex: 0.714285714;
    }
    .position-btn-publish {
      flex: 1;
      position: relative;
      padding: half(32) 0;
      text-align: center;
    }
    .position-btn-publish-inner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #42b983;
    }
    .position-btn-publish-inner.activated {
      background-color: #CCC;
    }
  }
</style>
