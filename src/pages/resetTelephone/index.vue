/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="reset-telephone">
    <van-cell-group class="margin_b_20">
      <div class="pass_box">
        <input v-model="phone" class="pass_box_info" type="number" pattern="[0-9]*" placeholder="请输入手机号码">
      </div>
    </van-cell-group>
    <div class="pass_box">
      <input v-model="verifyCode" class="pass_box_inp" type="text" placeholder="请输入验证码">
      <span class="pass_box_t" @click="getVerifyCode">{{verifyCodeTxt}}</span>
    </div>
    <div class="btn-wrapper">
      <van-button class="save-btn" size="large" :loading="loading" @click="update_userPhone">保存</van-button>
    </div>
  <van-toast id="van-toast" />
  </div>
</template>

<script>
import User from "../../api/modules/user";
import SmsAuth from "../../api/modules/smsAuth";

export default {
  data () {
    return {
      phone: "",
      verifyCode: "",
      verifyCodeTxt: "获取验证码",
      Interval: null,
      loading: false   
    }
  },
  methods: {
    // 获取验证码
    getVerifyCode() {
      if (this.phone === "") {
        this.$toast("请输入手机号码");
        return;
      }
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
              .replace(/0/g, "P")
      },(res) => {
        if (res.code === 0) {
          this.$toast("验证码已发送请查收");
        }
      });
      if (this.verifyCodeTxt.length < 4) return;
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
    update_userPhone() {
      if (this.phone === "") {
        this.$toast("请输入手机号码");
        return;
      }
      if (this.verifyCode) {
        if (this.loading === true) return;
        this.loading = true;
        User.update_userPhone({
            authCode: this.verifyCode,
            phone: this.phone,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        },(res) => {
            if (res.code === 0) {
              this.$toast("修改成功");
            } else {
              this.$toast(res.msg);
            }
          })
          this.loading = false;
      } else {
        this.$toast("请输入验证码");
      }
    }  
  },
  onLoad() {
    this.phone = this.$store.state.userInfo.phone || "";
    this.$store.commit("setTitle", "修改手机号码");
  }
}
</script>
<style lang="scss" scoped>
.reset-telephone {
  min-height: 100%;
  background: #fff;
  padding: half(40) half(20);
  font-size: half(24);
  .margin_b_20 {
    margin-bottom: half(20);
  }
  [class*="van-hairline"]::after {
    border: 0 solid;
  }
  /deep/ .van-field__body {
    font-size: half(32);
    width: 100%;
  }
  /deep/ .van-cell {
    background: #f2f2f2;
    border-radius: half(10);
  }
  .pass_box {
    height: half(88);
    background: #f2f2f2;
    border-radius: half(10);
    font-size: half(32);
    padding-left: half(30);
    position: relative;
    .pass_box_info {
      height: 100%;
      width: half(463);
      display: inline-block;
      background: #f2f2f2;
    }
    .pass_box_inp {
      height: 100%;
      width: half(463);
      display: inline-block;
      background: #f2f2f2;
      border-right: 1px solid #ccc;
    }
    .pass_box_t {
      color: #42b983;
      display: inline-block;
      width: half(214);
      height: 100%;
      text-align: center;
      position: absolute;
      top: half(20);
    }
  }
  .btn-wrapper {
    margin-top: half(40);
  }
  .save-btn {
    border-radius: half(12) !important;
  }
}
</style>
