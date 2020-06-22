/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="basic-info">
    <van-cell-group class="header-cell-group">
      <van-cell
        is-link
        center
        @click="onUserAvatarClick"
      >
        <img
          class="user-avatar"
          :src="touxiang"
          v-if="touxiang"
        >
        <div v-else>
          <img
            class="user-avatar"
            src="../../../static/img/mine/yonghutouxiang.png"
            v-if="photo == null||photo == 0 || photo == 1||photo == 2||photo == 3||photo == 4"
          >
          <img
            class="user-avatar"
            :src="photo.includes('http') ? photo : imgSrcDomain + photo"
            :key="photo.includes('http') ? photo : imgSrcDomain + photo"
            v-else
          >
        </div>
        <div class="van-cell-text text1">头&nbsp;&nbsp;&nbsp;&nbsp;像</div>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="middle-cell-group">
      <van-cell center>
        <!-- 编辑小图标 -->
        <i
          class="iconfont input-icon icon-shuru"
          @click="isFocus0=true"
          v-if="getShowIconEdit"
        ></i>
        <i
          class="iconfont input-icon icon-shanchu"
          @click="isFocus0=true;name=''"
          v-if="!getShowIconEdit"
        ></i>
        <!-- 编辑小图标 -->
        <input
          class="name-rg"
          @focus="activeEle=true"
          :focus="isFocus0"
          @blur="activeEle=false"
          type="text"
          v-model="name"
          placeholder="请填写真实姓名"
        >
        <div class="van-cell-text">
          姓&nbsp;&nbsp;&nbsp;&nbsp;名<span class="asterisk">*</span></div>
      </van-cell>
      <picker
        mode="selector"
        @change="onPickerConfirm($event, 0)"
        :range="pickerColumnsArr[0]"
      >
        <van-cell
          is-link
          center
        >

          <div class="van-cell-text">
            性&nbsp;&nbsp;&nbsp;&nbsp;别<span class="asterisk">*</span></div>
          <span class="selected">{{pickerColumnsValueArr[0]}}</span>
        </van-cell>
      </picker>
      <picker
        mode="date"
        @change="onBirthPickerClick"
        :value="timeOfBirth"
        start="1950-01-01"
      >
        <van-cell
          is-link
          center
        >
          <div class="van-cell-text">
            出生日期<span class="asterisk">*</span></div>
          <span class="selected">{{dateOfBirth}}</span>
        </van-cell>
      </picker>
      <van-cell
        is-link
        center
      >
        <div class="van-cell-text">
          手机号码<span class="asterisk">*</span></div>
        <span class="selected">{{telephone}}</span>
      </van-cell>
      <picker
        mode="selector"
        @change="onPickerConfirm($event, 1)"
        :range="pickerColumnsArr[1]"
      >
        <van-cell
          is-link
          center
        >
          <div class="van-cell-text">
            目前状态<span class="asterisk">*</span></div>
          <span class="selected">{{pickerColumnsValueArr[1]}}</span>
        </van-cell>
      </picker>
      <picker
        mode="selector"
        @change="onPickerConfirm($event, 2)"
        :range="pickerColumnsArr[2]"
      >
        <van-cell
          is-link
          center
        >
          <div class="van-cell-text">
            到岗时间<span class="asterisk">*</span></div>
          <span class="selected">{{pickerColumnsValueArr[2]}}</span>
        </van-cell>
      </picker>
      <picker
        mode="selector"
        @change="onPickerConfirm($event, 3)"
        :range="pickerColumnsArr[3]"
      >
        <van-cell
          is-link
          center
        >
          <div class="van-cell-text">
            最高学历<span class="asterisk">*</span></div>
          <span class="selected">{{pickerColumnsValueArr[3]}}</span>
        </van-cell>
      </picker>
      <picker
        mode="date"
        @change="setEntranceYear"
        :value="entranceYear"
        start="1940"
        end="endYear"
        fields="year"
      >
      <van-cell
        is-link
        center
      >
        <span class="van-cell-text">
          开始工作年份<span class="asterisk">*</span></span>
        <span class="selected">{{startWorkingYear}}</span>
      </van-cell>
      </picker>
      <picker
        mode="region"
        @change="onAddressPickerClick"
        :value="region"
      >
      <van-cell
        is-link
        center
      >

        <div class="van-cell-text">所在地区</div>
        <span class="selected">{{locationAddress}}</span>
      </van-cell>
      </picker>
    </van-cell-group>
    <div class="personalityLabel-section">
      <div class="personalityLabel-header van-hairline--bottom">个性标签</div>
      <textarea
        @blur="onInputBlur"
        class="personalityLabel-content"
        maxlength="50"
        onchange="this.value=this.value.substring(0, 50)"
        onkeydown="this.value=this.value.substring(0, 50)"
        onkeyup="this.value=this.value.substring(0, 50)"
        v-model="personalityLabelContent"
        placeholder="请输入自我评价（50字以内）"
      ></textarea>
      <i class="iconfont input-icon textarea-input-icon icon-shuru"></i>
    </div>
    <div class="position-btn-bar  van-hairline--top">
      <!--<div class="position-btn-close">关闭职位</div>-->
      <div class="position-btn-pending">
        <div class="position-btn-editor van-hairline--right">
          <i class="iconfont customer-service-icon icon-kefuzixun"></i>客服</div>
        <div class="position-btn-empty"></div>
        <van-button
          class="bottom_btn_yes position-btn-empty"
          type="primary"
          :loading="loading"
          @click="update_user"
        >保存</van-button>
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import areaList from "../../utils/area";
import AvatarPicker from "../../components/AvatarPicker/AvatarPicker.vue";
import MyPicker from "../../components/MyPicker/MyPicker.vue";
import User from "../../api/modules/user";
import { formatDate } from "../../utils/index";

export default {
  data() {
    return {
      isFocus0: false,
      activeEle: false,

      doc: document,

      showAreaPicker: false,

      showDateTimePicker: false,
      loading: false,
      areaList: areaList,
      currentDate: new Date(),
      minDate: new Date("1950/01/01"), //最小
      maxDate: new Date(), //最大
      //   姓名
      name: "",
      telephone: "",
      locationAddress: "",
      //   个性标签
      personalityLabelContent: "",
      //   工作年份
      currentPickerType: -1,

      //   出生年月
      dateOfBirth: "",
      showPicker: false,

      // 开始工作年份
      entranceYearColumns: [],
      isShowEntranceYear: false,
      startWorkingYear: "",

      province: "",
      city: "",
      district: "",
      //   头像
      photo: "4",
      touxiang: "",
      region: ['四川省', '成都市', '锦江区'],
      pickerColumnsArr: [
        ["男", "女"],
        ["在职", "离职", "在校大学生"],
        ["随时", "一周内", "一个月内", "待定"],
        ["不限", "初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"]
      ],
      pickerColumnsValueArr: []
    }
  },

  // 计算属性
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    getShowIconEdit() {
      if (this.name) {
        if (this.name.length > 0 && this.activeEle) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    endYear() {
      let now = new Date();
      return now.getYear();
    },
    token() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
    }
  },

  methods: {
    onInputBlur() {
    },
    setEntranceYear(date) {
      this.isShowEntranceYear = true;
      this.startWorkingYear = date.target.value;
    },

    onUserAvatarClick() {
      let _this = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          _this.touxiang = res.tempFilePaths[0]
          wx.uploadFile({
            url: 'https://www.cdwork.cn/publics/system/upload',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              file: 'test',
              uploadType: '1',
              token: _this.token,
              path: "/user/user/photo"
            },
            success(res) {
              console.log(res,"1")
              _this.$toast("上传成功");
              _this.photo = res.data.url;
              // 是(我的)页面就主动请求修改用户信息接口
              let pages = getCurrentPages()
              let currentPage = pages[pages.length-1]
              let url = currentPage.route
              if (url === "pages/mine/main") {
                _this.update_user(res.data.url);
              }
            },
            fail(res) {
              _this.$toast(res.msg);
            },
            complete() {
              setTimeout(() => {
                _this.$toast.clear();
              }, 500);
            }
          })
         }
      })
      console.log(_this.photo,"photo")
    },
    onPickerCancel() {
      this.showPicker = false;
    },
    onPickerConfirm(e, item) {
      this.showPicker = true;
      this.currentPickerType = e.mp.detail.value;
      this.pickerColumnsValueArr[item] = this.pickerColumnsArr[item][e.mp.detail.value];
    },
    onAddressPickerClick(date) {
      this.province = date.target.value[0];
      this.city = date.target.value[1];
      this.district = date.target.value[2];
      this.locationAddress =
        (this.province ? this.province + "-" : "请") +
        (this.city ? this.city + "-" : "选") +
        (this.district ? this.district : "择");
    },
    onBirthPickerClick(date) {
      this.dateOfBirth = date.target.value;
      this.showDateTimePicker = true;
    },
    onDatePickercancel(res) {
      this.showDateTimePicker = false;
    },
    update_user(url) {
      if (
        this.name === "" ||
        this.pickerColumnsValueArr[0] === "请选择" ||
        this.dateOfBirth === "请选择" ||
        this.pickerColumnsValueArr[1] === "请选择" ||
        this.pickerColumnsValueArr[2] === "请选择" ||
        this.pickerColumnsValueArr[3] === "请选择" ||
        this.startWorkingYear === "请选择"
      ) {
        this.$toast({
          message: "请输入完整的信息"
        });
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      let data = {
        name: this.name,
        sex:
          this.pickerColumnsArr[0].indexOf(this.pickerColumnsValueArr[0]) + 1,
        birthDate: this.dateOfBirth,
        workState:
          this.pickerColumnsArr[1].indexOf(this.pickerColumnsValueArr[1]) + 1,
        availableTime:
          this.pickerColumnsArr[2].indexOf(this.pickerColumnsValueArr[2]) + 1,
        highestEducation: this.pickerColumnsArr[3].indexOf(
          this.pickerColumnsValueArr[3]
        ),
        startWorkYear: this.startWorkingYear,
        province: this.province,
        city: this.city,
        district: this.district,
        tag: this.personalityLabelContent,
        photo: this.photo,
        userId: this.$store.state.userInfo.userId,
        isHr: false,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      }
      User.update_user(data, (res) => {
        if (res.code === 0) {
          this.$toast("修改成功");
          wx.navigateBack({ delta: 1 });
          let userInfo = this.$store.state.userInfo;
          userInfo.photo = res.data.photo;
          userInfo.name = res.data.name;
          userInfo.sex = res.data.sex;
          userInfo.birthDate = res.data.birthDate;
          userInfo.workState = res.data.workState;
          userInfo.availableTime = res.data.availableTime;
          userInfo.highestEducation = res.data.highestEducation;
          userInfo.startWorkYear = res.data.startWorkYear;
          userInfo.province = res.data.province;
          userInfo.city = res.data.city;
          userInfo.district = res.data.district;
          userInfo.tag = res.data.tag;
          this.$store.commit("setUserInfo", userInfo);
          // this.$store.commit("setUserInfo", res.data);
        } else {
          this.$toast(res.msg);
        }
      })
      this.loading = false;
    }
  },

  onLoad() {
    this.$toast.loading({
      mask: true,
      message: "加载中..."
    });
    this.$store.commit("setTitle", "基本资料");
    User.query_user({
      userId: this.$store.state.userInfo.userId,
      siteHierarchy: this.$store.state.configData.hierarchy,
      token: this.token
    }, (res) => {
      if (res.code === 0) {
        // 头像
        this.photo = res.data.photo === null ? 0 : res.data.photo;
        // 姓名
        this.name = res.data.name;
        // 男女
        this.pickerColumnsValueArr[0] = res.data.sex
          ? this.pickerColumnsArr[0][res.data.sex - 1]
          : "请选择";
        // 出生日期
        this.dateOfBirth = res.data.birthDate
          ? formatDate(res.data.birthDate, "YYYY-MM-DD")
          : "请选择";
        // 手机号码
        this.telephone = res.data.phone;
        // 目前状态
        this.pickerColumnsValueArr[1] = res.data.workState
          ? this.pickerColumnsArr[1][res.data.workState - 1]
          : "请选择";
        // 到港时间
        this.pickerColumnsValueArr[2] = res.data.availableTime
          ? this.pickerColumnsArr[2][res.data.availableTime - 1]
          : "请选择";
        // 最高学历
        this.pickerColumnsValueArr[3] = res.data.highestEducation
          ? this.pickerColumnsArr[3][res.data.highestEducation]
          : "请选择";
        // 工作年份
        this.startWorkingYear = res.data.startWorkYear
          ? res.data.startWorkYear
          : "请选择";

        //this.startWorkingYear = res.data.startWorkingYear;

        // 地区
        this.locationAddress =
          (res.data.province ? res.data.province + "-" : "请") +
          (res.data.city ? res.data.city + "-" : "选") +
          (res.data.district ? res.data.district : "择");
        // 个性标签
        this.province = res.data.province || "";
        this.city = res.data.city || "";
        this.district = res.data.district || "";
        this.personalityLabelContent = res.data.tag;
      } else {
        this.$toast(res.msg);
      }
    })
    setTimeout(() => {
      this.$toast.clear();
    }, 500);

    var indexDate = new Date().getFullYear();
    for (let i = 0; i < 80; i++) {
      this.entranceYearColumns.push(indexDate);
      indexDate--;
    }
  }
}
</script>
<style lang="scss" scoped>
  .bottom_btn_yes {
    width: half(300);
    background: #42b983;
    line-height: half(98);
    text-align: center;
    font-size: half(32);
    color: #fff;
  }
  .basic-info {
    min-height: 100%;
    padding-bottom: half(106);
    background: #f2f2f2;
    .header-cell-group {
      margin-bottom: half(20);
    }
    .user-avatar {
      width: half(80);
      height: half(80);
      border-radius: 100%;
      overflow: hidden;
    }
    .middle-cell-group {
      margin-bottom: half(20);
      .telephone-rg {
        width: half(240);
      }
    }
    .text1 {
      line-height: half(80);
    }
    .van-uploader {
      display: flex;
    }
    .personalityLabel-section {
      position: relative;
      font-size: half(32);
      background-color: #fff;
    }
    .personalityLabel-header,
    .personalityLabel-content {
      padding: half(30);
    }
    .personalityLabel-content {
      width: 100%;
      height: half(160);
      color: #999;
    }
    .textarea-input-icon {
      position: absolute;
      bottom: half(30);
      right: half(20);
    }
    .position-btn-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: half(32);
      color: #fff;
      z-index: 2;
    }
    .position-btn-close,
    .position-btn-publish {
      padding: half(32) 0;
      text-align: center;
    }
    .position-btn-close,
    .position-btn-publish {
      background-color: #42b983;
    }
    .position-btn-pending {
      display: flex;
      background-color: #fff;
      height: half(98);
    }
    .position-btn-editor {
      display: flex;
      align-items: center;
      padding: half(10) half(50);
      color: #42b983;
      font-size: half(24);
    }
    .position-btn-empty {
      flex: 0.714285714;
    }
    .position-btn-publish {
      flex: 1;
    }
    .position-btn-publish.unpassed {
      background-color: #CCC;
    }
  }
</style>
