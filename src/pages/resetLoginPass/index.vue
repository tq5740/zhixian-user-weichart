/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
    <div class="reset-login-pass">
        <van-cell-group>
            <van-cell>
                
                    <input class="password-input" placeholder="请输入旧密码" type="password" v-model="oldPassword" maxlength="16">
                    <div class="van-cell-text">旧密码</div>
                
            </van-cell>
            <van-cell>
                
                    <input class="password-input" placeholder="请输入新密码" type="password" v-model="newPassword" maxlength="16">
                    <div class="van-cell-text">新密码</div>
                
            </van-cell>
            <van-cell>
                
                    <input class="password-input" placeholder="请输入确认密码" type="password" v-model="newPasswords" maxlength="16">
                    <div class="van-cell-text">确认密码</div>
                
            </van-cell>
        </van-cell-group>
        <div class="btn-wrapper">
            <van-button class="save-btn" size="large" @click="update_userPassword" :loading="loading">保存</van-button>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import User from "../../api/modules/user";
export default {
  data () {
    return {
      oldPassword: "",
      newPassword: "",
      newPasswords: "",
      loading: false    
    }
  },
  methods: {
    update_userPassword() {
      if (this.oldPassword === "") {
        this.$toast("请输入旧密码");
        return;
      }
      if (this.newPassword === "" || this.newPasswords === "") {
        this.$toast("请输入新密码");
        return;
      }
      if (this.newPassword.length < 8 || this.newPasswords.length < 8) {
        this.$toast("请输入8~16位新密码");
        return;
      }
      if (this.newPassword == this.newPasswords) {
        if (this.loading === true) return;
        this.loading = true;
        User.update_userPassword({
            newPassword: (this.newPassword).toUpperCase(),
            oldPassword: (this.oldPassword).toUpperCase(),
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        },(res) => {
            if (res.code === 0) {
              this.$toast("修改成功");
              window.localStorage.removeItem("user_token");
              location.pathname = "/login";
            } else {
              this.$toast(res.msg);
            }
          })
          this.loading = false;
      } else {
        this.$toast("新密码不一致");
      }
    }  
  },
  onLoad() {
    this.$store.commit("setTitle", "修改密码");
  }
}
</script>
<style lang="scss" scoped>
.reset-login-pass {
  min-height: 100%;
  background-color: #f2f2f2;
  .password-input {
    flex: 3;
    text-align: left !important;
  }
  .btn-wrapper {
    padding: 0 half(20);
    margin-top: half(40);
  }
  .save-btn {
    border-radius: half(12) !important;
  }
}
</style>
