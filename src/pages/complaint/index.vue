/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="complaint">
      <div class="complaint-reason-subject">请选择投诉原因</div>
      <van-cell-group class="split">
          <van-cell center clickable @click="onCellClick(0)">

            <span class="van-cell-text">{{complaintValueArr[0]}}</span>
            <i class="iconfont hook-icon icon-gou" v-if="currentIndex===0"></i>
              
          </van-cell>
          <van-cell center clickable @click="onCellClick(1)">

                  <span class="van-cell-text">{{complaintValueArr[1]}}</span>
                  <i class="iconfont hook-icon icon-gou" v-if="currentIndex===1"></i>
                  
              
          </van-cell>
          <van-cell center clickable @click="onCellClick(2)">

                  <span class="van-cell-text">{{complaintValueArr[2]}}</span>
                  <i class="iconfont hook-icon icon-gou" v-if="currentIndex===2"></i>
                  
              
          </van-cell>
          <van-cell center clickable @click="onCellClick(3)">
          
              <span class="van-cell-text">{{complaintValueArr[3]}}</span>

              <i class="iconfont hook-icon icon-gou" v-if="currentIndex===3"></i>
              
          
      </van-cell>
          <van-cell center clickable @click="onCellClick(4)">

                  <span class="van-cell-text">{{complaintValueArr[4]}}</span>
                  <i class="iconfont hook-icon icon-gou" v-if="currentIndex===4"></i>
                  
              
          </van-cell>
          <van-cell center clickable @click="onCellClick(5)">
          
              <span class="van-cell-text">{{complaintValueArr[5]}}</span>
              <i class="iconfont hook-icon icon-gou" v-if="currentIndex===5"></i>
              
          
      </van-cell>
      </van-cell-group>
      <div class="personalityLabel-section">
          <div class="personalityLabel-header van-hairline--bottom">投诉原因说明（选填）</div>
          <textarea class="personalityLabel-content" maxlength="50" onchange="this.value=this.value.substring(0, 50)" onkeydown="this.value=this.value.substring(0, 50)" onkeyup="this.value=this.value.substring(0, 50)" v-model="personalityLabelContent" placeholder="请输入投诉原因（50字以内）"></textarea>
          <i class="iconfont input-icon textarea-input-icon icon-shuru"></i>
      </div>
      <div class="complaint-confirm-btn" @click.stop.prevent="onComplaintConfirmBtn">确定投诉</div>
      <div class="complaint-success-container" v-if="showComplaintSuccessContainer">
          <div class="complaint-success-icon-wrap">
            <i class="iconfont complaint-success-icon icon-shangchuanchenggong"></i>
          </div>
          <div class="complaint-success-sub">投诉成功！</div>
          <div class="complaint-success-confirm-btn" @click="onComplaintSuccessConfirmBtn">确定</div>
      </div>
      <van-toast id="van-toast" />
  </div>
  
</template>


<script>
import Complaint from "../../api/modules/complaint";
export default {
  props:{
    complaintTitle: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      complaintValueArr: [
        "虚假职位/违规职位",
        "违规行为",
        "违法乱收费",
        "骗取钱财",
        "企业信息作假",
        "求职歧视"
      ],
      isLogin: !!this.$store.state.userInfo,
      showComplaintSuccessContainer: false,
      currentIndex: -1,
      personalityLabelContent: ""
    }
  },
  onCellClick(key) {
    this.currentIndex = key;
  },
  onComplaintConfirmBtn() {
    if (!this.isLogin) {
      this.$router.push("/login");
      return;
    }
    const currentIndex = this.currentIndex;
    if (currentIndex === -1) {
      this.$toast("请选择投诉原因");
      return;
    }
    const url = this.$store.state.configData.doMain + this.$route.fullPath;
    const complaintTitle = this.complaintTitle;
    if (!complaintTitle) return;
    const data = {
      title: complaintTitle,
      url: url,
      complaintType: this.complaintValueArr[currentIndex],
      complaintReason: this.personalityLabelContent
    };
    Complaint.create_complaint(data, (res) => {
      if (res.code === 0) {
        this.showComplaintSuccessContainer = true;
      } else {
        this.$toast(res.msg);
      }
    });
  },
  onComplaintSuccessConfirmBtn() {
    this.$emit("onComplaintSuccess");
  }
}
</script>
<style lang="scss" scoped>
.complaint {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: half(98);
  font-size: half(32);
  color: #000;
  background-color: #f2f2f2;
  .complaint-reason-subject {
    height: half(88);
    padding-left: half(30);
    display: flex;
    align-items: center;
    font-size: half(30);
    color: #666;
  }
  .complaint-confirm-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: half(98);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: half(34);
    color: #fff;
    background-color: #42b983;
  }
  .hook-icon {
    width: half(30);
    height: half(30);
    transition: opacity 0.2s ease-out;
    opacity: 1;
    &.fade-enter-to,
    &.fade-leave {
      opacity: 1;
    }
    &.fade-leave-to,
    &.fade-enter {
      opacity: 0;
    }
  }
  .personalityLabel-section {
    position: relative;
    margin-top: half(20);
    background-color: #fff;
  }
  .personalityLabel-header,
  .personalityLabel-content {
    padding: half(30);
  }
  .personalityLabel-content {
    width: 100%;
    height: half(220);
    color: #999;
  }
  .textarea-input-icon {
    position: absolute;
    bottom: half(30);
    right: half(20);
  }
  .complaint-success-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: half(0) half(30);
    text-align: center;
    background-color: #fff;
  }
  .complaint-success-icon-wrap {
    padding-top: half(100);
  }
  .complaint-success-sub {
    padding: half(60) 0;
    font-size: half(40);
  }
  .complaint-success-icon {
    width: half(200);
    height: half(200);
  }
  .complaint-success-confirm-btn {
    height: half(88);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #42b983;
    border-radius: half(10);
  }
}
</style>
