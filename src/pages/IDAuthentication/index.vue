/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
  <div class="ID-authentication">
    <div class="id-step">
      <div class="stepNo no1"><span>1</span><p>{{stepNo1}}</p></div>
      <i :class="{'line':authenticationStatus === 2 || authenticationStatus === 3 || authenticationStatus === 4}"></i>
      <div class="stepNo no2" :class="[{'active':authenticationStatus === 2 || authenticationStatus === 3 || authenticationStatus === 4}]"><span>2</span><p>{{stepNo2[authenticationStatus === 2 ? 1 : 0 || authenticationStatus === 4 ? 1 : 0 || 0]}}</p></div>
      <i :class="{'line':authenticationStatus === 2 || authenticationStatus === 4}"></i>
      <div class="stepNo no3" :class="[{'active':authenticationStatus === 4},{'activeError':authenticationStatus === 2}]">
        <span>
          <i class="iconfont step-icon icon-renzhengshibai" v-if="authenticationStatus === 2"></i>
          <div v-else>3</div>
        </span>
        <p>{{stepNo3[authenticationStatus === 2 ? 1 : 0 || authenticationStatus === 4 ? 2 : 0 || 0]}}</p></div>
    </div>

    <div class="id-container">
      <div class="title">输入身份信息</div>
      <van-cell-group :class="{'input-disabled':inputDisabled}">
        <van-cell center >
          <input type="text" :disabled="inputDisabled" class="fill-in-input user-name-input" v-model="userName" placeholder="你的身份证姓名">
          <span class="van-cell__title">姓名</span>
        </van-cell>
        <van-cell center class="van-hairline--bottom">  
          <input type="text" :disabled="inputDisabled" class="fill-in-input" v-model="IDNumber" placeholder="18位身份证号">
          <span class="van-cell__title">身份证号</span>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="ID-input-wrapper van-hairline--surround" v-if="isInput">
      <div @click="clickConfirmBtn">{{inputName}}</div>
      <div class="false-warn" v-if="authenticationStatus === 2 && reason">认证失败原因：{{reason}}</div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template> 

<script>
import Authentication from "../../api/modules/authentication";
export default{
  data () {
    return {
      userName: "",
      IDNumber: "",
      isInput: true,
      inputName: "确认",
      authenticationStatus: 1,
      authenticationData: {},
      stepNo1: "上传身份信息",
      inputDisabled: false,
      stepNo2: [
        "审核中",
        "审核完成"
      ],
      stepNo3: [
        "认证结果",
        "认证失败",
        "认证成功"
      ],
      reason: ""
    }
  },
  
  onLoad() {
    this.$store.commit("setTitle", "身份认证");
    this.getAuthenticationMsg();
  },
  methods: {
    getAuthenticationMsg() {
      if (this.$store.state.userInfo) {
        const data = {
          userId: this.$store.state.userInfo.userId,
          token: this.$store.state.userInfo.token
        };
        Authentication.query_userauth(data, (res) => {
          if (res.code === 0) {
            const resData = res.data;
            this.authenticationData = resData;
            this.userName = resData.name;
            this.IDNumber = resData.idNumber;
            if (resData) {
              this.authenticationStatus = resData.state;
            } else {
              this.authenticationStatus = 1;
            }
            if(this.authenticationStatus === 3 || this.authenticationStatus === 4){
              this.isInput = false;
              this.inputDisabled = true;
            }else if(this.authenticationStatus === 2){
              this.inputName = "重新认证";
              this.reason = resData.reason || "";
              this.isInput = true;
              this.inputDisabled = true;
            }
          } else {
            this.$toast(res.msg);
          }
        });
      } else {
        wx.navigateTo({ url: '../login/main' })
      }
    },
    clickConfirmBtn() {
      if(this.inputName === "重新认证"){
        this.authenticationStatus = 1;
        this.inputDisabled = false;
        this.userName = "";
        this.IDNumber = "";
        this.inputName = "确认";
      }else if(this.userName){
        this.checkIdCardPattern();
      } else {
        this.$toast("姓名不能为空!");
      }
    },
    checkIdCardPattern() {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(this.IDNumber)) {
        this.$toast("身份证号码格式不合法!");
        return;
      }
      this.checkUserAuthMsg();
    },
    checkUserAuthMsg() {
      const data = {
        name: this.userName,
        idNumber: this.IDNumber,
        userId: this.$store.state.userInfo.userId
      };
      Authentication.update_userauth(data,(res) => {
        if (res.code === 0) {
          this.navToUploadSuccess();
        } else {
          this.$toast(res.msg);
        }
      });
    },
    navToUploadSuccess() {
      wx.navigateTo({url: 'pages/authenticationUploadSuccess/main'})
    }
  }
}
</script>
<style lang="scss" scoped>
  .ID-authentication {
    text-align: center;
    height: 100%;
    color: #000;
    background-color: #fff;
    position: relative;
    .id-step{
      padding: half(64) half(0) half(104) half(0);
      font-size: half(26);
      border-bottom: half(20) solid #F2F2F2;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .stepNo{
        position: relative;
        flex: 0.1;
        span{
          width: half(48);
          height: half(48);
          line-height: half(48);
          display: block;
          margin: 0 auto;
          color: #fff;
          background: #ccc;
          border-radius: half(48);
        }
        p{
          position: absolute;
          width: half(170);
          left: half(-50);
          bottom: half(-50);
          color: #999;
        }
      }
      i{
        display: flex;
        flex: 0.25;
        height: half(6);
        background: #ccc;
      }
      .line{
        background: #42b983;
      }
      .no1,.active{
        span{
          background: #42b983;
        }
        p{
          color: #42b983;
        }
      }
      .activeError{
        span{
          background: #FD9F29;
        }
        p{
          color: #FD9F29;
        }
      }
      .step-icon{
        font-size: half(20);
      }
    }
    .id-container {
      padding: half(80) 0 half(10);
      .title{
        text-align: left;
        font-size: half(30);
        font-weight: bold;
        color: #42b983;
        padding-left: half(40);
      }
      .fill-in-input{
        flex: 3.2;
        text-align: left !important;
        color: #000 !important;
      }
      .input-disabled{
        .fill-in-input{
          color: #666 !important;
        }
      }
    }
    /deep/ .van-button__text,
    .ID-input-wrapper {
      font-size: half(34) !important;
    }
    .ID-input-wrapper {
      position: relative;
      height: half(88) !important;
      line-height: half(88) !important;
      margin: half(10) half(40);
      border-radius: half(10);
      background-color: rgba(66, 185, 131, 1);
      color: #ffffff;
      .false-warn{
        font-size: half(26);
        color: #fc703e;
        text-align: left;
      }
    }
    /deep/ {
      .van-hairline--surround::after {
        border-radius: half(26);
      }
      .van-hairline--top-bottom::after{
        border-width: half(0);
      }
      .van-cell:not(:last-child)::after{
        left: half(0);
        border-color: #e5e5e5;
      }
      .van-cell-group {
        margin: half(20) half(10);
      }
      .van-cell{
        padding: half(30) half(0)!important;
        margin: half(0) half(30);
        width: auto;
      }
      .van-cell__title{
        color: #666;
        flex: 1;
      }
    }
  }
</style>
