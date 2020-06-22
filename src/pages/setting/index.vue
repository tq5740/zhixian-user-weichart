/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="setting">
    <van-cell-group class="header-cell-group">
      <van-cell title="账户与安全" is-link url="../accountAndSafety/main" />
      <!-- <van-cell title="第三方登录" is-link url="../thirdPartyLogin/main" /> -->
    </van-cell-group>
    <van-cell-group class="footer-cell-group">
      <van-cell title="常见问题" is-link url="../FAQ/main" />
      <van-cell title="意见反馈" is-link url="../opinion/main" />
      <van-cell title="关于我们" is-link url="../contact/main" />
    </van-cell-group>
    <div class="btn-wrapper" @click="quitLogin">
      退出登录
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    quitLogin() {
      // let webSocketInstance = this.$parent.ws;
      // webSocketInstance && webSocketInstance.close();
      // webSocketInstance = null;
      wx.removeStorageSync("user_token");
      this.$store.commit("setUserInfo", null);
      // this.$store.commit("setMenu", "/login");
      wx.redirectTo({ url: '../login/main' });
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "设置");
  }
}
</script>
<style lang="scss" scoped>
  .setting {
    min-height: 100%;
    background-color: #f2f2f2;
    .header-cell-group {
      margin-bottom: half(20);
    }
    .footer-cell-group {
      margin-bottom: half(40);
    }
    .btn-wrapper {
      padding: half(28) 0;
      text-align: center;
      font-size: half(32);
      color: #fc703e;
      background-color: #fff;
    }
  }
</style>
