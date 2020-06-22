/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="mine padding_b_98">
    <header class="header-wrapper van-hairline--bottom" @click="onUserProfileClick">
      <div class="user-avatar-box" @click="onUserAvatarClick">
        <div v-if="isLogin">
          <img class="user-avatar" src="../../../static/img/default/yonghutouxiang.png" alt="" v-if="photo == null||photo == 0||photo == 1||photo == 2||photo == 3||photo == 4">
          <img class="user-avatar" :src="photoImg" :key="photoImg" v-else>
        </div>
        <img class="user-avatar" src="../../../static/img/default/yonghutouxiang.png" v-else>
      </div>
      <div class="user-profile">
        <div class="user-subject">
          <div class="user-nickname">{{nickname}}</div>
          <i class="iconfont user-sex-icon icon-nv-" v-if="userInfo && (userInfo.sex == 2)"></i>
          <i class="iconfont user-sex-icon icon-nan-" v-if="userInfo && (userInfo.sex == 1)"></i>
        </div>
        <div class="user-telephone" v-if="userInfo">手机号码： {{phoneNumber}}</div>
        <div class="user-telephone" v-else>点击登录或注册</div>
      </div>
    </header>
    <van-cell-group class="split">
      <div class="cell-box">
        <van-cell center is-link title="身份认证" :value="authenticationStatusArr[authenticationStatus]" @click="setMeInfo('../IDAuthentication/main')" />
        <i class="iconfont module-icon icon-shenfenrenzheng1"></i>
      </div>
      <div class="cell-box">
        <van-cell center is-link title="我的简历" @click="setMeInfo('../userDetails/main')" />
        <i class="iconfont module-icon icon-wodejianli"></i>
      </div>
      <div class="cell-box">
        <van-cell center is-link title="投递记录" @click="setMeInfo('../reservationRecord/main')" />
        <i class="iconfont module-icon icon-toudijilu"></i>
      </div>
      <div class="cell-box">
        <van-cell center is-link title="面试日程" @click="setMeInfo('../interviewSchedule/main')" />
        <i class="iconfont module-icon icon-mianshiricheng"></i>
      </div>
    </van-cell-group>
    <van-cell-group class="split">
      <div class="cell-box">
        <van-cell center is-link title="客服热线" :value="customServiceTelephone" @click="onCustomServiceCellClick" />
        <i class="iconfont module-icon icon-kefurexian1"></i>
      </div>
      <div class="cell-box">
        <van-cell center is-link title="新手指南" @click="setMeInfo('../guide/main')" />
        <i class="iconfont module-icon icon-xinshouzhinan1"></i>
      </div>
      <div class="cell-box">
        <van-cell center is-link title="切换角色" @click="gotoHr" class="switch-role" v-if="isShowRoleSwitchCell" />
        <i class="iconfont module-icon icon-qiehuanjiaose"></i>
      </div>
      <div class="cell-box">
        <van-cell center is-link title="设置" @click="setMeInfo('../setting/main')" />
        <i class="iconfont module-icon icon-shezhi"></i>
      </div>
    </van-cell-group>
    <!-- <avatar-picker
      :showAvatarPicker="showAvatarPicker"
      @onAvatarPickerMaskClick="onAvatarPickerCancel"
      @photoUrl="photoUrl"
    ></avatar-picker> -->
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Authentication from "../../api/modules/authentication";
// import AvatarPicker from "../../components/AvatarPicker/AvatarPicker.vue";

export default {
  // components: {
  //   AvatarPicker
  // },
  data() {
    return {
      customServiceTelephone: "", // this.$store.state.configData.serviceTel || ""
      nickname: "未登录",
      phoneNumber: "",
      authenticationStatus: 1,
      authenticationStatusArr: [
        "未认证",
        "未认证",
        "认证失败",
        "审核中",
        "认证成功"
      ],
      showAvatarPicker: false,
      tipStepStatus: 0,
      tipClassNameArr: ["", "third-step"]
    }
  },
  computed: {
    isLogin() {
      return !!this.$store.state.userInfo;
    },
    configData() {
      return this.$store.state.configData;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    photo() {
      return this.$store.state.userInfo && this.$store.state.userInfo.photo ? this.$store.state.userInfo.photo : 0
    },
    photoImg() {
      if (this.photo) {
        return this.photo.includes('http') ? this.photo : this.$store.state.configData.imgDomain + this.photo;
      } else {
        return this.$store.state.configData.imgDomain;
      }
    },
    isShowRoleSwitchCell() {
      return !this.$store.state.userInfo ? false : this.$store.state.userInfo.isAdmin;
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "我的");
    // if (!this.isLogin) {
    //   wx.navigateTo({ url: '../login/main' });
    //   return;
    // }
    this.getAuthenticationMsg();
    wx.getStorageInfo({
      success(res) {
        console.log(res)
      }
    })
  },
  onShow() {
    if (this.isLogin) {
      this.nickname = this.$store.state.userInfo.name;
      this.phoneNumber = this.$store.state.userInfo.phone.substr(0, 3) + "****" + this.$store.state.userInfo.phone.substr(7, 4);
    } else {
      this.nickname = "未登录";
    }
  },
  methods: {
    getAuthenticationMsg() {
      if (this.isLogin) {
        this.nickname = this.$store.state.userInfo.name;
        this.phoneNumber = this.$store.state.userInfo.phone.substr(0, 3) + "****" + this.$store.state.userInfo.phone.substr(7, 4);
        const data = {
          userId: this.$store.state.userInfo.userId,
          token: this.$store.state.userInfo.token
        };
        Authentication.query_userauth(data, (res) => {
          if (res.code === 0) {
            const resData = res.data;
            if (resData) {
              this.authenticationStatus = resData.state;
            } else {
              this.authenticationStatus = 1;
            }
          } else {
            this.$toast(res.msg);
            if (res.msg === "token验证过期,请重新登录!") {
              wx.navigateTo({ url: '../login/main' });
            }
          }
        });
      } else {
        wx.navigateTo({ url: '../login/main' });
        return;
      }
    },
    onCustomServiceCellClick() {
      // if (!this.customServiceTelephone) {
      //   return;
      // }
      // const $aTag = document.createElement("a");
      // $aTag.href = "tel:" + this.customServiceTelephone;
      // $aTag.click();
    },
    onUserProfileClick() {
      if (!this.isLogin) {
        wx.navigateTo({ url: '../login/main' });
      } else {
        wx.navigateTo({ url: '../basicInfo/main' })
      }
    },
    onUserAvatarClick() {
      if (this.isLogin) {
        // this.showAvatarPicker = true;
      } else {
        wx.navigateTo({ url: '../login/main' });
      }
    },
    // 用户档案
    setMeInfo(url) {
      if (this.$store.state.userInfo) {
        wx.navigateTo({ url })
      } else {
        this.$toast("请先登录");
      }
    },
    photoUrl(url) {
    },
    gotoHr() {
      wx.showModal({
        title: '请用浏览器打开',
        content: "https://hr.cdwork.cn/",
        confirmText: "点击复制",
        success: function(res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: "https://hr.cdwork.cn/",
              success: function (res) {
                wx.showToast({
                  title: '复制成功',
                });
              }
            });
          } else if (res.cancel) {
          }
        }
      })
    },
    onAvatarPickerCancel() {
      //this.showAvatarPicker = false;
    }
  }
}
</script>
<style lang="scss" scoped>
  .padding_b_98 {
    padding-bottom: half(98);
  }
  .mine {
    min-height: 100%;
    background-color: #f2f2f2;
    .user-avatar-box {
      position: relative;
    }
    .switch-avatar-icon {
      position: absolute;
      right: half(12);
      top: half(12);
      width: half(36);
      height: half(36);
    }
    /deep/ {
      .states-split:after {
        border-color: #E8E8E8 !important;
      }
      .van-cell {
        padding-left: half(80) !important;
      }
      .van-cell__value {
        font-size: half(28) !important;
        color: #999;
        overflow: initial !important;
      }
      .van-cell-text {
        font-size: half(32);
      }
      .van-cell__right-icon.white {
        line-height: half(120);
        font-size: half(30);
        color: #fff;
      }
      .van-cell:not(:last-child)::after {
        left: half(0);
      }
      .van-hairline--top-bottom::after {
        border-width: half(0);
      }
    }

    .header-wrapper {
      display: flex;
      padding: half(20);
      padding-bottom: half(12);
      margin-bottom: half(20);
      background-color: #fff;
      font-size: half(34);
    }
    .user-profile {
      flex: 1;
      display: flex;
      overflow: hidden;
      flex-direction: column;
    }
    .user-avatar {
      width: half(120);
      height: half(120);
      margin-right: half(20);
      border-radius: 50%;
    }
    .user-subject {
      display: flex;
      align-items: center;
      overflow: hidden;
      margin: half(12) 0 half(8) 0;
    }
    .user-nickname {
      margin-right: half(10);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .user-sex-icon {
      font-size: half(24);
      flex-shrink: 0;
    }
    .icon-nv- {
      color: rgb(255, 117, 169);
    }
    .icon-nan- {
      color: rgb(18, 150, 219);
    }
    .user-telephone {
      font-size: half(28);
      color: #999;
    }

    .module-icon {
      position: absolute;
      font-size: half(38);
      left: half(30);
      top: half(20);
    }
    .new-icon {
      width: half(44);
      height: half(44);
      position: absolute;
      left: half(206);
      top: half(10);
    }

    .hr-profile {
      display: flex;
      flex: 1;
      flex-direction: column;
    }

    .split {
      margin: half(20);
      border-radius: half(14);
      overflow: hidden;
      .cell-box {
        position: relative;
      }
    }
  }
  .is-admin /deep/ {
    .tip-box {
      top: half(352);
      left: half(116);
    }
    .third-step {
      .tip-box {
        top: half(532);
      }
    }
    .fourth-step {
      .tip-box {
        top: half(260);
      }
    }
  }
</style>
