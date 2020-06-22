/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="account-and-safety">
      <van-cell-group class="header-cell-group">
          <van-cell title="手机号码" is-link :value="telephoneNumber" url="../resetTelephone/main"/>
          <van-cell title="电子邮箱" is-link :value="email" url="../resetEmail/main"/>
      </van-cell-group>
      <van-cell-group class="footer-cell-group">
          <van-cell title="登录密码" is-link  url="../resetLoginPass/main"/>
      </van-cell-group>

  </div>
</template>

<script>
export default{
  data () {
    return {
      telephoneNumber: "",
      email: ""
    }
  },
  onLoad() {
    wx.setNavigationBarTitle({ title: "账号安全" });
    this.$store.commit("setTitle", "账号安全");
  }
}
</script>
<style lang="scss" scoped>
.account-and-safety {
  min-height: 100%;
  background-color: #f2f2f2;
  .header-cell-group {
    margin-bottom: half(20);
  }
  .footer-cell-group {
    margin-bottom: half(40);
  }
}
</style>
