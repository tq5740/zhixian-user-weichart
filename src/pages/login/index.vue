/**
*@author chao
*@dateTime 2018/8/6
*@description created
*/
<template>
  <div class="login">
    <div
      class="loading"
      v-if="changeLoading"
    >
      <van-loading color="#999" />
      <p>角色切换中,请稍候...</p>
    </div>
    <van-cell-group class="margin_b_20">
      <div class="pass_box1">
        <input
          v-model="phone"
          class="pass_box_inp"
          type="number"
          pattern="[0-9]*"
          placeholder="请输入手机号码"
        >
      </div>

    </van-cell-group>
    <van-cell-group class="margin_b_20">
      <div class="pass_box1">
        <input
          v-model="password"
          class="pass_box_inp"
          type="password"
          placeholder="请输入密码"
        >
      </div>

    </van-cell-group>
    <div
      class="pass_box"
      v-if="imgVerifyCode"
    >
      <input
        v-model="answerCode"
        class="pass_box_inp"
        type="number"
        pattern="[0-9]*"
        placeholder="请输入验证码"
      >
      <img
        class="pass_box_t"
        :src="imgSrcDomain+imgVerifyCode"
        alt=""
        srcset=""
        @click="imageCode"
      >
    </div>
    <div class="forget_pass">
      <span>
        <van-checkbox
          :value="checked"
          checked-color="#42b983"
          @change="checked = !checked"
        >
          记住密码
        </van-checkbox>
      </span>
    </div>
    <van-button
      size="large"
      class="btn"
      @click="loginFunc"
      :loading="loading"
    >登录</van-button>
    <div
      class="setlogin_box"
      :style="{'margin-bottom':imgVerifyCode ?  '55px' :''}"
    >
      <div class="setlogin_box_t1">
        <span @click="forgetPW">忘记密码？</span>
      </div>
      <div class="setlogin_box_t2">
        <span @click="registerFunc">立即注册</span>
      </div>
    </div>

    <!-- <p class="login_way">其他登录方式</p>
    <button class="icon_wx" open-type="getUserInfo" :bindgetuserinfo="bindGetUserInfo" @click="wxlogin()">
      <i class="zx-svg home_icon_N iconfont icon-weixin"></i>
    </button> -->

    <van-toast id="van-toast" />
  </div>
</template>

<script>
import User from "../../api/modules/user";
import md5 from "md5";

export default {
  data() {
    return {
      imgVerifyCode: "",
      phone: "",
      password: "",
      answerCode: "",
      checked: false,
      loading: false,
      changeLoading: false,
      latitude: "",
      longitude: ""
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  onLoad() {
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
      this.$toast("获取缓存失败！");
    }
  },
  methods: {
    loginManner() {
      wx.redirectTo({ url: "../verifyCodeLogin/main" })
    },
    // 忘记密码;
    forgetPW() {
      wx.redirectTo({ url: "../forgetPW/main" })
    },
    // 登录
    loginFunc() {
      console.log(this.$store.state.configData)
      if (!this.phone || !this.password) {
        this.$toast({
          message: "请输入正确的手机号码或密码"
        });
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      var data = {
        phone: this.phone,
        password: md5(this.password).toUpperCase(),
        lat: this.latitude,
        lng: this.longitude
      };
      if (this.imgVerifyCode) {
        data.answerCode = this.answerCode;
        this.user_login(data);
      } else {
        User.imageCode({ phone: this.phone }, (res) => {
          if (res.code === 0) {
            if (res.data.errorTimes == 5) {
              this.imgVerifyCode = res.data.url;
              this.loading = false;
              wx.setStorage({ key: "imgVerifyCode", data: res.data.url });
            } else {
              this.loading = true;
            }
            if (res.data.errorTimes == 5 && this.answerCode == "") {
              this.$toast("密码错误超过5次,请输入验证码登录!");
            } else {
              this.user_login(data);
            }
          }
        })
      }
    },
    imageCode() {
      User.imageCode({ phone: this.phone }, (res) => {
        if (res.code === 0) {
          if (res.data.errorTimes == 5) {
            wx.setStorage({ key: "imgVerifyCode", data: res.data.url });
            this.imgVerifyCode = res.data.url;
            this.loading = false;
          } else {
            this.loading = true;
          }
        }
      })
    },
    user_login(data) {
      if (this.imgVerifyCode && this.answerCode === "") {
        this.loading = false;
        this.$toast("请输入验证码");
        return;
      }
      User.user_login(data, res => {
        if (res.code === 0) {
          if (this.checked === true) {
            let accountInfo = {
              phone: this.phone,
              password: this.getCharcode(this.password),
              lat: this.latitude,
              lng: this.longitude,
              province: this.$store.state.configData.province,
              city: this.$store.state.configData.city,
              district: this.$store.state.configData.district,
              street: this.$store.state.configData.street
            };
            wx.setStorage({ key: "accountInfo", data: accountInfo });
          } else {
            wx.removeStorage({ key: 'accountInfo' });
            this.phone = "";
            this.password = "";
          }
          wx.removeStorage({ key: 'imgVerifyCode' })
          wx.setStorage({ key: "user_token", data: res.data.token });
          this.$store.commit("setUserInfo", res.data);
          this.$store.commit("setMenu", "/mine");
          wx.navigateBack({ delta: 1 });
        } else if (res.code === 3070) {
          this.imageCode();
          this.$toast(res.msg);
        } else {
          this.$toast(res.msg);
        }
      })
      this.loading = false;
    },
    bindGetUserInfo(e) {
      console.log(e.detail.userInfo)
    },
    wxlogin() {
      let _this = this;
      if(!(wx.canIUse('button.open-type.getUserInfo'))){
        this.$toast("请升级微信版本");
        return;
      }
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success(res) {
                console.log(res,"getUserInfo");
                let userInfo = JSON.stringify({encryptedData: res.encryptedData, iv: res.iv});

                wx.login({
                  success(res) {
                    if (res.code) {
                      var data = {
                        code: res.code,
                        type: 2,
                        device: 1,
                        lat: _this.$store.state.pos.lat,
                        lng: _this.$store.state.pos.lng,
                        data: userInfo,
                        siteHierarchy: _this.$store.state.configData.hierarchy
                      };
                      User.OAuth(data, res => {
                        if (res.code === 0) {
                          console.log(res,"OAuth");
                          if(!res.data.isLogin){
                            let openId = res.data.user.openId;
                            this.bindUserPhone(openId);
                          }
                          let OAuthInfo = {
                            photo: res.data.avatarUrl
                          };
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })

              }
            })
          }
        }
      })
      
    },
    // 绑定第三方登录
    bindUserPhone(openId) {
      let data = {
        openId: "openId",
        phone: "phone",
        password: "password",
        authCode: "authCode",
        type: "3",
        siteHierarchy: "siteHierarchy"
      }
      User.OAuth(data, res => {
        if (res.code === 0) {
          console.log(res,"OAuth");
          if(!res.data.isLogin){
            let openId = res.data.user.openId;
            this.bindUserPhone(openId);
          }
          let OAuthInfo = {
            photo: res.data.avatarUrl
          };
        }
      })
    },
    // 加密
    getCharcode(str) {
      return str.replace(/./g, function (a) {
        return String.fromCharCode(a.charCodeAt(0) + 5);
      });
    },
    // 解密密码
    charcode(str) {
      return str.replace(/./g, function (a) {
        return String.fromCharCode(a.charCodeAt(0) - 5);
      });
    },
    // 注册
    registerFunc() {
      wx.redirectTo({ url: "../register/main" })
    }
  },

  mounted() {
    this.$store.commit("setTitle", "登录");
    if (wx.getStorageSync("imgVerifyCode")) {
      this.imgVerifyCode = wx.getStorageSync("imgVerifyCode");
    }
    if (wx.getStorageSync("user_token")) { //this.$route.query.t 
      //this.changeLoading = true;
      let data = { token: wx.getStorageSync("user_token") };//token: this.$route.query.t 

      User.getUserByToken(data, res => {
        if (res.code === 0) {
          this.$store.commit("setUserInfo", res.data);
          wx.setStorage({ key: "user_token", data: res.data.token });
          this.$toast("登录成功");
          setTimeout(() => {
            this.changeLoading = false;
            wx.navigateBack({
              delta: 1
            })
          }, 1200);
        } else {
          this.changeLoading = false;
          this.$toast("登录失败,请重新登录");
          wx.removeStorageSync('user_token');
        }
      })
    }
    let accountInfos = wx.getStorageSync("accountInfo");
    //let accountInfo = JSON.parse(accountInfos);
    if (accountInfos) {
      this.phone = accountInfos.phone;
      this.password = this.charcode(accountInfos.password);
      this.checked = true;
    }
  }
}
</script>
<style lang="scss" scoped>
  .margin_b_20 {
    margin-bottom: half(20);
  }

  .login {
    background: #fff;
    padding: half(40) half(20) half(200) half(20);
    font-size: half(24);
    .loading {
      position: fixed;
      top: 0;
      left: 0;
      min-height: 100%;
      width: 100%;
      background: #f2f2f2;
      color: #666;
      z-index: 99999;
      .van-loading {
        margin: auto;
        margin-top: 60%;
      }
      p {
        text-align: center;
        margin-top: half(10);
        font-size: half(28);
      }
    }
    /deep/ .van-field__body {
      font-size: half(32);
      width: 100%;
    }
    /deep/ .van-cell {
      background: #f2f2f2;
      border-radius: half(10);
    }
    [class*="van-hairline"]::after {
      border: 0 solid;
    }
    /deep/ .van-checkbox__icon--round .van-icon {
      border-radius: half(4);
      width: half(24);
      height: half(24);
    }
    /deep/ .van-checkbox__label {
      margin-left: half(10);
    }
    /deep/ .van-checkbox__icon {
      line-height: 0.9;
    }
    .btn {
      width: half(710);
      height: half(88);
      border-radius: half(10) !important;
      font-size: half(34);
      line-height: 0;
      margin-bottom: half(50);
    }
    .pass_box {
      height: half(88);
      font-size: half(32);
      margin-bottom: half(50);
      display: flex;
      align-items: center;
      overflow: hidden;
      .pass_box_inp {
        height: 100%;
        width: half(450);
        background: #f2f2f2;
        border-radius: half(10);
        padding: half(20);
      }
      .pass_box_t {
        color: #42b983;
        width: half(240);
        margin-left: half(20);
        height: half(84);
        border-radius: half(10);
      }
    }
    .pass_box1 {
      height: half(88);
      font-size: half(32);
      margin-bottom: half(20);
      display: flex;
      align-items: center;
      overflow: hidden;
      .pass_box_inp {
        height: 100%;
        width: 100%;
        background: #f2f2f2;
        border-radius: half(10);
        padding: half(20);
      }
      .pass_box_t {
        color: #42b983;
        width: half(240);
        margin-left: half(20);
        height: half(84);
        border-radius: half(10);
      }
    }
    .forget_pass {
      font-size: half(26);
      color: #999;
      text-align: right;
      margin-bottom: half(30);
      margin-top: half(50);
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        display: inline-block;
        height: half(40);
      }
    }
    .setlogin_box {
      color: #999;
      margin-bottom: half(218);
      display: flex;
      .setlogin_box_t1,
      .setlogin_box_t2 {
        flex: 1;
        margin-top: half(30);
      }
      .setlogin_box_t2 {
        text-align: right;
        color: #42b983;
      }
    }
    .login_way {
      text-align: center;
      color: #999;
      margin-bottom: half(60);
    }
    .icon_wx {
      text-align: center;
      background: transparent;
      width: half(80);
      height: half(80);
      line-height: half(80);
      margin: 0 auto;
      .home_icon_N {
        font-size: half(80);
        color: #42b983;
      }
    }
    .icon_wx::after{ border: none; }
  }
</style>
