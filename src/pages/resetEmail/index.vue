/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="reset-email">
    <van-cell-group>
      <van-cell>
        <div class="van-cell-text">电子邮箱</div>
        <input
          class="new-email-input"
          placeholder="请输入新邮箱地址"
          v-model="sendUserEmail"
        >
      </van-cell>
    </van-cell-group>
    <div class="tip-icon">
      <!-- <svg aria-hidden="true" class="input-icon">
              <use xlink:href="#icon-tishi1">
              </use>
          </svg>保存输入邮箱后,请注意首邮件,点击链接激活生效 -->
    </div>
    <div class="btn-wrapper">
      <van-button
        class="save-btn"
        size="large"
        @click="send_email"
        :loading="loading"
      >保存</van-button>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import User from "../../api/modules/user";
export default {
  data() {
    return {
      loading: false,
      sendUserEmail: ""
    }
  },
  methods: {
    send_email() {
      if (this.sendUserEmail === "") {
        this.$toast("请输入邮箱");
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      User.send_email({
          type: 1,
          sendUserEmail: this.sendUserEmail,
          sendMessage: `http://10.3.1.34:8081/sso/user/update_user_email?token=${
            this.$store.state.userInfo.token
            }`,
          theme: "邮箱"
      }, (res) => {
        if (res.code === 0) {
          let msg = this.$store.state.userInfo;
          msg.email = this.sendUserEmail;
          this.$store.commit("setUserInfo", msg);
          this.$toast("保存输入邮箱后,请注意邮件,点击链接激活生效");
        } else {
          this.$toast(res.msg);
        }
      }, (error) => { })
      this.loading = false;
    }
  },
  onLoad() {
    this.sendUserEmail = this.$store.state.userInfo.email || "";
    this.$store.commit("setTitle", "绑定邮箱");
  }
}
</script>
<style lang="scss" scoped>
  .reset-email {
    min-height: 100%;
    background-color: #f2f2f2;
    .new-email-input {
      flex: 3;
      text-align: left !important;
    }
    .tip-icon {
      display: flex;
      align-items: center;
      padding: half(10) 0 0 half(30);
      margin-bottom: half(40);
      font-size: half(24);
      color: #999;
    }
    .input-icon {
      margin-right: half(10);
    }
    .btn-wrapper {
      padding: 0 half(20);
    }
    .save-btn {
      border-radius: half(12) !important;
    }
  }
</style>
