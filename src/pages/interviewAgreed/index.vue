/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="position-detail">
    <div class="invitation-info">
      <span class="name">约定信息</span>
      <div class="invitation-wrap van-hairline--bottom"><span>联系人&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <p v-if="userInfo.contact">{{userInfo.contact}}</p>
      </div>
      <div class="invitation-wrap van-hairline--bottom"><span>联系电话</span>
        <p v-if="userInfo.tel">{{userInfo.tel}}</p>
      </div>
      <div class="invitation-wrap van-hairline--bottom"><span>面试时间</span>
        <p v-if="encryptObj.interviewTime">{{isInterviewTime}}</p>
      </div>
      <div class="invitation-wrap van-hairline--bottom"><span>面试地点</span>
        <p v-if="userInfo.province || userInfo.city || userInfo.district || userInfo.street">{{interviewLocation}}</p>
      </div>
      <div v-if="encryptObj.state == 5" class="invitation-wrap"><span>携带资料</span>
        <p>{{userInfo.tel}}</p>
      </div>
    </div>
    <header class="position-header">
      <div class="position-top-wrap">
        <div class="position-top">
          <div class="position-name">
            <span>{{positionDetailData.jobName}}</span>
            <span class="position-name-icon" v-if="positionDetailData.workNature">{{workNatureArr[positionDetailData.workNature]}}</span>
          </div>
          <div class="position-dateTime">{{positionDetailData.updateTime?isUpdateTime:''}}</div>
        </div>
        <div class="position-remuneration-wrap">
          <div class="position-remuneration" v-if="positionDetailData.lowSalary== -1">
            面议
          </div>
          <div class="position-remuneration" v-if="(positionDetailData.highSalary || positionDetailData.lowSalary) && positionDetailData.lowSalary!= -1">
            {{isPrice}}
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
            {{positionDetailData.city}}{{positionDetailData.district}}{{positionDetailData.street}}
          </span>
        </div>
      </div>
      <i class="van-icon van-icon-arrow van-cell__right-icon position-org-arrow"></i>
    </section>
    <section class="position-org-detail">
      <div class="position-org-introduce" @click="onOrgIntroduceClick">
        <!-- <img :src="imgSrcDomain+positionDetailData.orgLogo" class="position-org-avatar"> -->
        <img :src="imgSrcDomain+positionDetailData.orgLogo" :key="imgSrcDomain+positionDetailData.orgLogo" class="position-org-avatar" v-if="positionDetailData.orgLogo">
        <img src="../../../static/img/default/morenLOGO.png" class="position-org-avatar" v-else>
        <div class="position-org-profile">
          <div class="position-org-name">{{positionDetailData.orgName}}</div>
          <div class="position-org-sub">
            <span class="position-org-type van-hairline--right">{{industryList[positionDetailData.industry - 1]}}</span>
            <span class="position-org-scale">{{scaleList[positionDetailData.scale - 1]}}</span>
          </div>
        </div>
        <i class="van-icon van-icon-arrow van-cell__right-icon position-org-arrow"></i>

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
    <div class="position-btn-bar  van-hairline--top" @click="onReply">
      <div class="position-btn-pending" :class="{'btn-no': btnNo}">
        {{btnContent}}
      </div>
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import {
  formatDate,
  isWxBrowser,
  wxConfig,
  wxShare
} from "../../utils/index";
import PositionApi from "../../api/modules/position";
import Org from "../../api/modules/org";
import Reservation from "../../api/modules/reservation";
import Invitation from "../../api/modules/invitation";
import PositionListItem from "../../components/PositionListItem/PositionListItem.vue";
import wxParse from 'mpvue-wxparse';
export default {
  components: {
    PositionListItem,
    wxParse
  },
  data() {
    return {
      queryObj: {},
      complaintTitle: "",
      workNatureArr: ["不限", "全职", "兼职", "实习"],
      formatDate: formatDate,
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
      positionDetailData: { welfare: [] },
      positionRecommendData: [],
      isLogin: !!this.$store.state.userInfo,
      positionId: "",
      comments: "",
      encryptId: "",
      encryptObj: {},
      userInfo: {},
      btnContent: "回复",
      btnNo: false
    }
  },
  computed: {
    getUserInfo() {
      return this.$store.state.userInfo;
    },
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    isInterviewTime() {
      return formatDate(this.encryptObj.interviewTime, 'YYYY-MM-DD hh:mm')
    },
    isUpdateTime() {
      return formatDate(this.positionDetailData.updateTime,'YYYY-MM-DD')
    },
    interviewLocation() {
      return (this.getUserInfo.province || '') + (this.getUserInfo.city || '') + (this.getUserInfo.district || '') + (this.getUserInfo.street || '') + (this.getUserInfo.doorNumber || '');
    },
    isPrice() {
      return formatSalary(this.positionDetailData.lowSalary, this.positionDetailData.highSalary, this.positionDetailData.salaryType);
    }
  },
  onLoad(e) {
    this.queryObj = e;
    this.encryptId = this.queryObj.encrypt;
    this.positionId = this.queryObj.positionId;
    this.reply();
    this.btnContent = "回复";
    this.btnNo = false;
  },
  methods: {
    onReply() {
      if (this.encryptObj.state === 3) {
        if(this.btnContent === "已回复邀请" || this.btnContent === "已接受面试邀请" || this.btnContent === "已拒绝面试邀请") {
          this.$toast("已回复面试邀请！");
          return;
        }else {
          this.$dialog
            .confirm({
              title: "回复",
              confirmButtonText: "接受",
              cancelButtonText: "拒绝",
              message: `是否接受《${
                this.positionDetailData.jobName
              }》面试邀请，参加面试？`,
              showCancelButton: true
            })
            .then(() => {
              Reservation.reply_booking({
                bookingId: this.encryptObj.bookingId, 
                callback: 1,
                siteHierarchy: this.$store.state.configData.hierarchy,
                token: this.$store.state.userInfo.token
              },(res) => {
                if (res.code === 0) {
                  this.$toast("已接受面试邀请！");
                  this.btnContent = "已接受面试邀请";
                  this.btnNo = true;
                  this.reply();
                  if (wx.setStorage) {
                    try {
                      wx.setStorage({
                        key: "interviewAgreed",
                        value: this.encryptObj.bookingId
                      });
                      
                    } catch (e) {
                      this.$toast("请关闭浏览器的无痕模式再进行操作！");
                    }
                  }
                } else {
                  this.$toast(res.msg);
                }
              });
            })
            .catch(() => {
              Reservation.reply_booking({
                bookingId: this.encryptObj.bookingId,
                callback: 0,
                siteHierarchy: this.$store.state.configData.hierarchy,
                token: this.$store.state.userInfo.token
              },(res) => {
                if (res.code === 0) {
                  this.$toast("已拒绝面试邀请！");
                  this.btnContent = "已拒绝面试邀请";
                  this.btnNo = true;
                  this.reply();
                  if (wx.setStorage) {
                    try {
                      wx.setStorage({
                        key: "interviewAgreed",
                        value: this.encryptObj.bookingId
                      });
                    } catch (e) {
                      this.$toast("请关闭浏览器的无痕模式再进行操作！");
                    }
                  }
                } else {
                  this.$toast(res.msg);
                }
              });
            });
        }
      } else if (this.encryptObj.state == 5) {
        if(this.btnContent === "已回复邀请" || this.btnContent === "已接受入职邀请" || this.btnContent === "已拒绝入职邀请") {
          this.$toast("已回复入职邀请！");
          return;
        }else {
          this.$dialog
            .confirm({
              title: "回复",
              confirmButtonText: "接受",
              cancelButtonText: "拒绝",
              message: `是否接受《${this.positionDetailData.jobName}》的入职邀请？`,
              showCancelButton: true
            })
            .then(() => {
              Reservation.reply_booking({
                bookingId: this.encryptObj.bookingId,
                callback: 2 ,
                state: 7,
                siteHierarchy: this.$store.state.configData.hierarchy,
                token: this.$store.state.userInfo.token
              },(res) => {
                if (res.code === 0) {
                  this.$toast("已接受入职邀请！");
                  this.btnContent = "已接受入职邀请";
                  this.btnNo = true;
                  this.reply();
                  if (wx.setStorage) {
                    try {
                      wx.setStorage({
                        key: "interviewAgreed",
                        value: this.encryptObj.bookingId
                      });
                    } catch (e) {
                      this.$toast("请关闭浏览器的无痕模式再进行操作！");
                    }
                  }
                } else {
                  this.$toast(res.msg);
                }
              });
            })
            .catch(() => {
              Reservation.reply_booking({
                bookingId: this.encryptObj.bookingId,
                callback: 0,
                siteHierarchy: this.$store.state.configData.hierarchy,
                token: this.$store.state.userInfo.token
              },(res) => {
                if (res.code === 0) {
                  this.$toast("已拒绝入职邀请！");
                  this.btnContent = "已拒绝入职邀请";
                  this.btnNo = true;
                  this.reply();
                  if (wx.setStorage) {
                    try {
                      wx.setStorage({
                        key: "interviewAgreed",
                        value: this.encryptObj.bookingId
                      });
                    } catch (e) {
                      this.$toast("请关闭浏览器的无痕模式再进行操作！");
                    }
                  }
                } else {
                  this.$toast(res.msg);
                }
              });
            });
        }
      }
    },
    reply() {
      const positionId = this.positionId;
      if (!positionId) return;
      const userInfo = this.getUserInfo;
      const userId = userInfo && userInfo.userId;
      if (!userId) return;
      const data = {
        jobId: positionId, 
        userId: userId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.$store.state.userInfo.token};
      Invitation.reply(data, (res) => {
        if (res.code === 0) {
          this.encryptObj = res.data.booking;
          this.userInfo = res.data.address;
          this.queryPositionDetail();
          const resData = res.data.booking;
          if (resData && resData.state === 3) {
            if(resData.callback === 0){
              this.btnContent = "已拒绝面试邀请";
              this.btnNo = true; 
              return;
            }else if(resData.callback === 1){
              this.btnContent = "已接受面试邀请";
              this.btnNo = true;
              return;
            }
          }else if (resData && resData.state === 5) {
            if(resData.callback === 0){
              this.btnContent = "已拒绝入职邀请";
              this.btnNo = true;
              return;
            }else if(resData.callback === 2){
              this.btnContent = "已接受入职邀请";
              this.btnNo = true;
              return;
            }
          }
          if (wx.getStorageSync("interviewAgreed")) {
            if(this.encryptObj.bookingId == wx.getStorageSync("interviewAgreed")){
              this.btnContent = "已回复邀请";
              this.btnNo = true;
            }
          }
        } else {
          this.$toast(res.msg);
        }
      });
    },
    queryPositionDetail() {
      const positionId = this.positionId;
      if (!positionId) return;
      const data = {
        jobId: positionId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.$store.state.userInfo.token
      };
      PositionApi.queryPositionDetail(data, (res) => {
        if (res.code === 0) {
          if (this.encryptObj.state == 3) {
            this.$store.commit("setTitle", "面试邀请函");
          } else if (this.encryptObj.state == 5) {
            this.$store.commit("setTitle", "入职邀请函");
          }

          const resData = res.data;
          resData.welfare = JSON.parse(resData.welfare);
          this.positionDetailData = resData;
          this.complaintTitle = resData.jobName;
          this.positionDetailData.intro = decodeURIComponent(resData.intro);

          // 请求评论数
          Org.getOrgDetail({
            orgId: res.data.orgId,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
          }, (res) => {
            if (res.code === 0) {
              this.comments = res.data.comments;
            }
          })

        } else {
          this.$toast(res.msg);
        }
      });
    },

    onComplaintBtnClick() {
      if (!this.isLogin) {
        wx.navigateTo({ url: '../login/main' })
        return;
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
  .position-detail-icon {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
  .position-org-stars-icon {
    width: 17px;
    height: 17px;
    display: inline-block;
    margin-right: 5px;
  }
  .position-detail-icon.experience {
    width: half(27);
    height: half(27);
  }
  .position-address-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
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
    min-height: half(108);
    padding: half(30) half(20);
    margin-bottom: half(20);
    background-color: #fff;
  }
  .position-header,
  .invitation-info,
  .position-address,
  .position-org-detail,
  .position-description {
    background-color: #fff;
  }
  .invitation-info {
    padding: half(20) half(30);
    margin-bottom: half(20);
    font-size: half(32);
    .name {
      font-size: half(28);
      color: #4c5e56;
    }
    .invitation-wrap {
      padding: half(20) half(0);
      span {
        color: #999;
        display: inline-block;
        margin-right: half(32);
        vertical-align: top;
      }
      p {
        display: inline-block;
        width: half(520);
      }
    }
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
    height: half(124);
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
    background-color: #42b983;
    height: half(98);
    justify-content: center;
    align-items: center;
  }
  .btn-no {
    background-color: #CCC;
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
