/**
*@author chao
*@dateTime 2018/8/7
*@description created
*/
<template>
  <div class="login">
    <van-cell-group class="margin_b_20">
      <div class="pass_box">
        <input v-model="phone" class="pass_box_info" type="number" pattern="[0-9]*" placeholder="请输入手机号码">
      </div>
    </van-cell-group>
    <van-cell-group class="margin_b_20">
      <div class="pass_box">
        <input v-model="password" class="pass_box_info" type="password" placeholder="请输入密码" maxlength="16">
      </div>
    </van-cell-group>
    <div class="pass_box">
      <input v-model="verifyCode" class="pass_box_inp" type="number" pattern="[0-9]*" placeholder="请输入验证码">
      <span class="pass_box_t" @click="getVerifyCode">{{verifyCodeTxt}}</span>
    </div>

    <van-button size="large" class="btn" @click="registerFunc" :loading="loading">注册</van-button>
    <div class="setlogin_box">
      <div class="setlogin_box_t1">
        已有账号？<span class="color" @click="loginManner">立即登录</span>
      </div>
      <!-- <div class="setlogin_box_t2" @click="verifyCodeFunc">
        验证码登录
      </div> -->
    </div>
    <!-- <p class="login_way">其他登录方式</p>
    <div class="icon_wx">
      <i class="iconfont zx-svg home_icon_N icon-weixin" @click="wx.redirectTo({ url: '../wxLogin/main' });"></i>
    </div> -->
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import SmsAuth from "../../api/modules/smsAuth";
import User from "../../api/modules/user";
import md5 from "md5";
import { mobileReg } from "../../utils/index";
export default {
  data () {
    return {
      verifyCodeTxt: "获取验证码",
      phone: "",
      verifyCode: "",
      password: "",
      Interval: "",
      loading: false
    }
  },
  methods: {
    // 登录方式切换
    loginManner() {
      wx.redirectTo({ url: '../login/main' });
    },
    verifyCodeFunc() {
      wx.redirectTo({url: "../verifyCodeLogin/main"});
    },
    // 获取验证码
    getVerifyCode() {
      if (!mobileReg(this.phone) || !this.phone) {
        this.$toast("请输入正确的手机号码");
        return;
      }
      if (this.verifyCodeTxt.length < 4) return;
      SmsAuth.send_authCode({
          phone:
            "HFDQBCWQAEQ" +
            this.phone
              .replace(/1/g, "Q")
              .replace(/2/g, "W")
              .replace(/3/g, "E")
              .replace(/4/g, "R")
              .replace(/5/g, "T")
              .replace(/6/g, "Y")
              .replace(/7/g, "U")
              .replace(/8/g, "I")
              .replace(/9/g, "O")
              .replace(/0/g, "P"),
          siteHierarchy: this.$store.state.configData.hierarchy
      });
      let num = 60;
      this.verifyCodeTxt = "60s";
      this.Interval = setInterval(() => {
        if (num == 1) {
          clearInterval(this.Interval);
          this.verifyCodeTxt = "重新获取";
        } else {
          num = num - 1;
          this.verifyCodeTxt = num + "s";
        }
        console.log(123);
      }, 1000);
    },
    // 忘记密码;
    forgetPW() {
      wx.redirectTo({url: "../forgetPW/main"});
    },
    // 注册
    registerFunc() {
      if (this.phone === "" || this.phone.length != 11) {
        this.$toast("请输入手机号码");
        return;
      }
      if (this.password === "") {
        this.$toast("请输入密码");
        return;
      }
      if (this.password.length < 8) {
        this.$toast("请输入8~16位密码");
        return;
      }
      if (this.verifyCode === "") {
        this.$toast("请输入验证码");
        return;
      }
      let data = {
        phone: this.phone,
        password: md5(this.password).toUpperCase(),
        authCode: this.verifyCode,
        siteHierarchy: this.$store.state.configData.hierarchy
      };
      if (this.loading === true) return;
      this.loading = true;
      User.user_reg(data,(res) => {
          if (res.code === 0) {
            this.$toast({
              message: "注册成功",
              type: "success"
            });
            wx.redirectTo({ url: '../login/main' });
          } else {
            this.$toast({
              message: res.msg
            });
          }
        })
          this.loading = false;
    }  
  },
  onLoad() {
    this.$store.commit("setTitle", "注册");
  }
}
</script>
<style lang="scss" scoped>
.margin_b_20 {
  margin-bottom: half(20);
}
.color {
  color: #42b983;
}
.login {
  background: #fff;
  min-height: 100%;
  padding: half(40) half(20);
  font-size: half(24);
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
  .btn {
    // margin: half(40) half(20);
    width: half(710);
    height: half(88);
    display: block;
    border-radius: half(10) !important;
    font-size: half(34);
    line-height: 0;
    margin-bottom: half(50);
  }
  .pass_box {
    position: relative;
    height: half(88);
    font-size: half(32);
    margin-bottom: half(20);
    border-radius: half(10);
    display: flex;
    align-items: center;
    overflow: hidden;
    background: #f2f2f2;
    .pass_box_info {
      height: 100%;
      width: 100%;
      padding: half(20);
    }
    .pass_box_inp {
      height: 100%;
      width: half(463);
      border-right: 1px solid #ccc;
      padding-left: half(20);
    }
    .pass_box_t {
      position: absolute;
      right: half(10);
      top: half(25);
      color: #42b983;
      display: inline-block;
      width: half(214);
      text-align: center;
    }
  }
  .forget_pass {
    font-size: half(26);
    color: #999;
    text-align: right;
    margin-bottom: half(40);
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
    margin-bottom: half(180);
    display: flex;
    .setlogin_box_t1,
    .setlogin_box_t2 {
      flex: 1;
    }
    .setlogin_box_t1 {
      // display: flex;
      // justify-content: flex-end;
      // padding-right: half(30);
      // border-right: 1px solid #c7c7c7;
      text-align: right;
    }
    .setlogin_box_t2 {
      padding-left: half(30);
    }
  }
  .login_way {
    text-align: center;
    color: #999;
    margin-bottom: half(60);
  }
  .icon_wx {
    text-align: center;
    .home_icon_N {
      font-size: half(80);
    }
  }
}
</style>
