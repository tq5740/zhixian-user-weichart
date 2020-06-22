/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="recruit-detail">
    <div class="recruit-detail-wrap" v-if="recruitDetailData.venueId">
      <div class="recruit-header van-hairline--bottom">
        <div class="recruit-name">{{recruitDetailData.venueName}}</div>
        <div class="recruit-hold-dateTime" v-if="deadline">报名截止日期：{{deadline}}</div>
        <div class="recruit-hold-dateTime" v-else>已经超过报名截止日期，无法报名。</div>
      </div>
      <van-cell-group class="cell-group">
        <van-cell center>
          <i class="iconfont input-icon icon-shuru" v-if="getShowIconEditName" @click="isFocus0True"></i>
          <i class="iconfont input-icon icon-shanchu" v-else @click="companyNameNull"></i>
          <input @blur='onInputBlur("Name")' @focus="activeEleName=true" :focus="isFocus0" class="name-rg" type="text" v-model="companyName" placeholder="输入公司名称">
          <div class="van-cell-text">
            公司名称<span class="red">*</span></div>
        </van-cell>
        <van-cell is-link center @click="onAddressPickerClick">
          <div class="van-cell-text">
            注册地区<span class="red">*</span></div>
          <span class="selected" v-if="registerAddress">{{registerAddress}}</span>
          <span class="unselected" v-else>未选择</span>
        </van-cell>
        <van-cell center>
          <i class="iconfont input-icon icon-shuru" v-if="getShowIconEditPerson" @click="isFocus1=true"></i>
          <i class="iconfont input-icon icon-shanchu" v-else @click="isFocus1=true;contactMan=''"></i>
          <input @blur='onInputBlur("Person")' @focus="activeElePerson=true" :focus="isFocus1" class="name-rg" type="text" v-model="contactMan" placeholder="输入联系人姓名">
          <div class="van-cell-text">
            联系人<span class="red">*</span></div>
        </van-cell>
        <van-cell center>
          <i class="iconfont input-icon icon-shuru" v-if="getShowIconEditPhone" @click="isFocus2=true"></i>
          <i class="iconfont input-icon icon-shanchu" v-else @click="isFocus2=true;contactNumber=''"></i>
          <input @blur='onInputBlur("Phone")' @focus="activeElePhone=true" :focus="isFocus2" class="name-rg" type="text" v-model="contactNumber" placeholder="输入联系电话">
          <div class="van-cell-text">
            联系电话<span class="red">*</span></div>
        </van-cell>
        <van-cell center>
          <input class="name-rg" type="text" maxlength="100" v-model="remarkContent" placeholder="输入备注内容(<100字)">
          <div class="van-cell-text">
            备注</div>
        </van-cell>
      </van-cell-group>
      <!-- <div class="personalityLabel-section">
        <div class="personalityLabel-header van-hairline--bottom">备注</div>
        <textarea class="personalityLabel-content" maxlength="100" onchange="this.value=this.value.substring(0, 100)" onkeydown="this.value=this.value.substring(0, 100)" onkeyup="this.value=this.value.substring(0, 100)" v-model="remarkContent" placeholder="请输入备注内容（100字以内）"></textarea>
        <i class="iconfont input-icon textarea-input-icon icon-shuru"></i>
      </div> -->
      <div class="bottom-bar van-hairline--top">
        <div class="bottom-bar-btn" @click="onCancelBtnClick">取消</div>
        <div class="bottom-bar-btn position-btn" :class="{'disable':isDeadline}" @click="onConfirmBtnClick">确定</div>
      </div>
      <div>
      <div class="position-area-picker-mask" v-if="showAreaPicker"></div>
        <van-area class="position-area-picker" :class="showAreaPicker ? 'position-area-picker-true' : 'position-area-picker-false'" value="510104" :area-list="areaList" @confirm="onAreaPickerConfirm" @cancel="onAreaPickerCancel" />
      </div>
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import Recruit from "../../api/modules/recruit";
import areaList from "../../utils/wholeCountryArea";
import { mobileReg } from "../../utils/index";
export default {
  data () {
    return {
      activeEleName: false,
      // 控制图标显示--联系人
      activeElePerson: false,
      // 控制图标显示--联系电话
      activeElePhone: false,
      doc: document,
      // 报名提示语
      alertMsg: "恭喜您报名成功，前去管理中心即可发布招聘职位",
      isDeadline: false,
      companyName: "",
      contactMan: "",
      contactNumber: "",
      areaList: areaList,
      showAreaPicker: false,
      registerAddress: "",
      province: "四川省",
      city: "成都市",
      district: "锦江区",
      recruitDetailData: { deadline: "" },
      recruitId: "",
      remarkContent: "",
      isFocus0: false,
      isFocus1: false,
      isFocus2: false
    }
  },
  computed: {
    deadline() {
      return this.recruitDetailData.deadline && this.recruitDetailData.deadline.slice(0,10)
    },
    getShowIconEditName() {
      if (this.companyName.length > 0 && this.activeEleName) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditPerson() {
      if (this.contactMan.length > 0 && this.activeElePerson) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditPhone() {
      if (this.contactNumber.length > 0 && this.activeElePhone) {
        return false;
      } else {
        return true;
      }
    }
  },
  onLoad(e) {
    this.$store.commit("setTitle", "现场招聘");
    console.log(e,"eee")
    this.recruitId = e.venueId;
    this.getRecruitDetailData();
  },
  methods: {
    isFocus0True() {
      console.log("wwwwwww")
      this.isFocus0 = true;
    },
    companyNameNull(){
      console.log("ssss");
      this.isFocus0True();
      this.companyName = '';
    },
    onInputBlur(str) {
      if (str === "Name") {
        this.activeEleName = false;
      } else if (str === "Person") {
        this.activeElePerson = false;
      } else if (str === "Phone") {
        this.activeElePhone = false;
      }
    },
    getRecruitDetailData() {
      if (!this.recruitId) return;
      const data = {
        venueId: this.recruitId
      };
      Recruit.query_venue(data, (res) => {
        const resData = res.data;
        if (res.code === 0 && resData) {
          resData.intro = decodeURIComponent(resData.intro);
          resData.notice = decodeURIComponent(resData.notice);
          this.isDeadline = !resData.deadline;
          this.recruitDetailData = resData;
        }
      });
    },
    onAddressPickerClick() {
      this.showAreaPicker = true;
    },
    onAreaPickerConfirm(item) {
      this.showAreaPicker = false;
      this.province = item.target.detail.province;
      this.city = item.target.detail.city;
      this.district = item.target.detail.county;
      this.registerAddress =
        this.province + "-" + this.city + "-" + this.district;
    },
    onAreaPickerCancel() {
      this.showAreaPicker = false;
    },
    onCancelBtnClick() {
      wx.navigateBack({ delta: 1 });
    },
    onConfirmBtnClick() {
      if (this.isDeadline) return;
      if (!this.recruitId) return;
      if (!this.companyName) {
        this.$toast("请输入公司名称");
        return;
      }
      if (!this.registerAddress) {
        this.$toast("请选择公司注册地址");
        return;
      }
      if (!this.contactMan) {
        this.$toast("请输入联系人");
        return;
      }
      if (!this.contactNumber) {
        this.$toast("请输入联系电话");
        return;
      }
      if (!mobileReg(this.contactNumber)) {
        this.$toast("电话号码格式不合法");
        return;
      }
      this.recruitEnroll();
    },
    recruitEnroll() {
      const data = {
        venueId: this.recruitId,
        orgName: this.companyName,
        address: this.registerAddress.replace(/-/g, ""),
        contact: this.contactMan,
        phone: this.contactNumber,
        intro: this.remarkContent
      };
      this.$toast.loading({
        mask: true,
        message: "报名中..."
      });
      Recruit.create_venue_reg(data, (res) => {
        this.$toast.clear();
        if (res.code === 0) {
          if (res.data.whetherOrNot !== 1) {
            this.alertMsg =
              "报名申请已提交成功，相关工作人员会尽快联系您，祝您生活愉快~";
          }
          this.$dialog
            .alert({ title: "温馨提示", message: this.alertMsg })
            .then(() => {
              wx.navigateBack({ delta: 1 });
            });
        } else {
          this.$toast(res.msg);
        }
      });
    }
  }
}
</script>
<style scoped lang="scss">
  .position-area-picker-true {
    transition: all 0.3s;
    bottom: 0;
  }
  .position-area-picker-false {
    transition: all 0.3s;
    bottom: -500px;
  }
  .recruit-detail {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    font-size: half(28);
    color: #666;
    .cell-group {
      font-size: half(32);
      margin-bottom: half(20);
      display: block;
      background: #fff;
      ._van-cell {
        display: flex;
      }
    }
    .red {
      color: red;
    }
    // .personalityLabel-section {
    //   position: relative;
    //   font-size: half(32);
    //   color: #000;
    //   background-color: #fff;
    // }
    // .personalityLabel-header,
    // .personalityLabel-content {
    //   padding: half(30);
    // }
    // .personalityLabel-content {
    //   width: 100%;
    //   height: half(260);
    //   color: #999;
    // }
    // .textarea-input-icon {
    //   position: absolute;
    //   bottom: half(30);
    //   right: half(20);
    // }
    .recruit-detail-wrap {
      padding-bottom: half(98);
    }
    .bottom-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: half(98);
      display: flex;
      align-items: center;
      z-index: 1;
      font-size: half(24);
      color: #000;
      background-color: #fff;
    }
    .bottom-bar-btn {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      font-size: half(32);
    }
    .position-btn {
      background-color: #42b983;
      color: #fff;
    }
    .position-btn.disable {
      background-color: #c7c7c7;
    }
    .recruit-header {
      padding: half(40) half(36);
      margin-bottom: half(20);
      text-align: center;
      background-color: #fff;
    }
    .recruit-name {
      margin-bottom: half(30);
      color: #000;
      font-size: half(40);
    }
    .recruit-hold-dateTime {
      margin-bottom: half(20);
      font-size: half(26);
    }
  }
</style>
