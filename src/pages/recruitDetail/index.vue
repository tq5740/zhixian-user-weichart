/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="recruit-detail">
    <div class="recruit-detail-wrap" v-if="recruitDetailData.venueId">
      <div class="recruit-header van-hairline--bottom">
        <div class="recruit-name">{{recruitDetailData.venueName}}</div>
        <div class="recruit-hold-dateTime">举办时间：{{recruitTime}}</div>
      </div>
      <div class="recruit-navigation" @click="navToAddressNavigation">
        <i class="iconfont location-icon icon-dingwei_1"></i><span class="location-sp">{{recruitDetailData.province}}{{recruitDetailData.city}}{{recruitDetailData.district}}{{recruitDetailData.street}}</span></div>
      <div class="split-line"></div>
      <div class="recruit-container">
        <p class="recruit-msg">
          <wxParse v-if="recruitDetailData.intro" :content="recruitDetailData.intro" />
        </p>
        <div class="split-line"></div>
        <div class="recruit-tip-header van-hairline--bottom">参会须知</div>
        <p class="recruit-notice">
          <wxParse v-if="recruitDetailData.notice" :content="recruitDetailData.notice" />
        </p>
      </div>
      <div class="bottom-bar van-hairline--top">
        <div class="bottom-bar-btn consult-btn van-hairline--right" @click="onConsultBtnClick">
          <i class="iconfont recruit-btn-icon icon-kefuzixun"></i>咨询</div>
        <div class="bottom-bar-btn consult-btn van-hairline--right" @click="onCompanyAttendClick">
          <i class="iconfont recruit-btn-icon icon-canhuiqiye"></i>参会企业</div>
        <div class="bottom-bar-btn consult-btn" @click="onPendingPositionClick">
          <i class="iconfont recruit-btn-icon icon-zaizhaozhiwei"></i>在招职位</div>
        <div class="bottom-bar-btn position-btn" :class="{'disable':isDeadline}" @click="onRecruitEnrollClick">企业报名</div>
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>
<script>
import Recruit from "../../api/modules/recruit";
import { formatDate, wxShare } from "../../utils/index";
import wxParse from 'mpvue-wxparse';
export default {
  components: {
    wxParse
  },
  data() {
    return {
      isDeadline: false,
      formatDate: formatDate,
      recruitDetailData: {},
      recruitId: ""
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    recruitTime() {
      if(this.recruitDetailData.startTime === this.recruitDetailData.endTime){
        return formatDate(this.recruitDetailData.startTime, "MM.DD") + '(' + this.recruitDetailData.period + ')';
      } else {
        return formatDate(this.recruitDetailData.startTime, "MM.DD") + '~' + formatDate(this.recruitDetailData.endTime, "MM.DD") + '(' + this.recruitDetailData.period + ')';
      }
    }
  },
  onLoad(e) {
    this.recruitId = e.recruitId;
    this.getRecruitDetailData();
  },
  methods: {
    getRecruitDetailData() {
      if (!this.recruitId) return;
      const data = {
        venueId: this.recruitId
      };
      Recruit.query_venue(data, (res) => {
        this.$store.commit("setTitle", res.data.venueName);

        const resData = res.data;
        if (res.code === 0 && resData) {
          resData.intro = decodeURIComponent(resData.intro);
          resData.notice = decodeURIComponent(resData.notice);
          this.isDeadline = !resData.deadline;
          this.recruitDetailData = resData;
        }
      });
    },
    onConsultBtnClick() {
      const contactPhone = this.recruitDetailData.contactPhone;
      if (contactPhone) {
        wx.makePhoneCall({
          phoneNumber: contactPhone
        })
      }
    },
    onCompanyAttendClick() {
      if (!this.recruitId) return;
      wx.navigateTo({ url: "../participatingEnterprises/main?recruitId=" + this.recruitId })
    },
    onPendingPositionClick() {
      if (!this.recruitId) return;
      wx.navigateTo({ url: "../inRecruitmentPositionList/main?recruitId=" + this.recruitId })
    },
    onRecruitEnrollClick() {
      if (this.isDeadline) return;
      if (!this.recruitId) return;

      if (this.$store.state.userInfo) {
        if (this.$store.state.userInfo.isAdmin) {
          wx.navigateTo({ url: "../recruitEnroll/main?venueId=" + this.recruitId })
        } else {
          this.$toast("您还不是企业用户！");
        }
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '亲，您还没有登录哦 ~',
          cancelText: "不用了",
          confirmText: "立即登录",
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({ url: '../login/main' });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }

    },
    navToAddressNavigation() {
      if (wx.openLocation) {
        try {
          const recruitDetailData = this.recruitDetailData;
          wx.openLocation({
            latitude: recruitDetailData.lat,  
            longitude: recruitDetailData.lng,
            name: recruitDetailData.province + recruitDetailData.city + recruitDetailData.district + recruitDetailData.street,
            address: recruitDetailData.province + recruitDetailData.city + recruitDetailData.district + recruitDetailData.street,
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
<style scoped lang="scss">
  .recruit-detail {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    font-size: half(28);
    color: #666;
    background-color: #fff;
    .recruit-navigation {
      height: half(88);
      padding: 0 half(20);
      display: flex;
      align-items: center;
    }
    .split-line {
      height: half(20);
      background-color: #f5f5f5;
    }
    .location-icon {
      width: half(30);
      height: half(30);
      margin-right: half(8);
      flex-shrink: 0;
    }
    .location-sp {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .recruit-msg,
    .recruit-notice {
      padding: half(30) half(20);
      display: block;
    }
    .recruit-detail-wrap {
      padding-bottom: half(98);
    }
    .bottom-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: half(98);
      display: flex;
      align-items: center;
      z-index: 1;
      font-size: half(24);
      color: #42b983;
      background-color: #fff;
    }
    .bottom-bar-btn {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .position-btn {
      flex: 2;
      font-size: half(32);
      background-color: #42b983;
      color: #fff;
    }
    .position-btn.disable {
      background-color: #c7c7c7;
    }
    .recruit-btn-icon {
      font-size: half(48);
    }
    .recruit-header {
      padding: half(40) half(36);
      text-align: center;
    }
    .recruit-name {
      margin-bottom: half(30);
      color: #000;
      font-size: half(40);
    }
    .recruit-hold-dateTime,
    .recruit-hold-location {
      font-size: half(26);
    }
    .recruit-hold-dateTime {
      margin-bottom: half(20);
    }
    .recruit-tip-header {
      padding: half(28) 0;
      text-align: center;
      color: #000;
      font-size: half(32);
    }
    .recruit-container {
      padding: 0 0 half(20);
      /deep/ img{
        max-width: 100%;
      }
    }
  }
</style>
