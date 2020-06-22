/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="search">
    <div class="search_address van-hairline--bottom" @click="onLocationClick">
      <i class="iconfont location-icon icon-dingwei_1"></i>
      <span>{{initAddress}}</span>
      <span class="icon_right">
        <i class="iconfont input-icon icon-gengduo"></i>
      </span>
    </div>
    <van-cell-group class="header-cell-group">

      <picker mode="selector" @change="onPickerConfirm($event, 0)" :range="pickerColumnsArr[0]">
        <van-cell center title="工作性质" is-link :value="bindColumnsArr[0]" @click="clickCell(0)" />
      </picker>

      <picker mode="selector" @change="onPickerConfirm($event, 1)" :range="pickerColumnsArr[1]">
        <van-cell v-if="bindColumnsArr[0]!=='兼职'" center title="招聘类型" is-link :value="bindColumnsArr[1]" @click="clickCell(1)" />
      </picker>
      
    </van-cell-group>
    <van-cell-group class="middle-cell-group">

      <picker mode="selector" @change="onPickerConfirm($event, 2)" :range="pickerColumnsArr[2]">
        <van-cell v-if="bindColumnsArr[0]!=='兼职'" center title="学历要求" is-link :value="bindColumnsArr[2]" @click="clickCell(2)" />
      </picker>

      <picker mode="selector" @change="onPickerConfirm($event, 3)" :range="pickerColumnsArr[3]">
        <van-cell v-if="bindColumnsArr[0]!=='兼职'" center title="经验要求" is-link :value="bindColumnsArr[3]" @click="clickCell(3)" />
      </picker>

      <picker mode="selector" @change="onPickerConfirm($event, 4)" :range="pickerColumnsArr[4]">
        <van-cell v-if="bindColumnsArr[0]!=='兼职'" center title="薪资范围" :is-link="bindColumnsArr[0]!=='兼职'" :value="bindColumnsArr[4]" @click="clickCell(4)" />
      </picker>


      <!--<van-cell center title="薪资" is-link  :value="bindColumnsArr[3]" @click="clickCell(3)"/>-->

      
    </van-cell-group>
    <van-cell-group class="footer-cell-group">

      <van-field class="name-rg" ref="searchInput" :value="searchKeyWord" @change="searchChange" @blur="onInputBlur()" @focus="activeEle=true" :focus="isFocus0" label="职位名称" placeholder="请输入关键词" placeholder-class="phcolor" bind:click-icon="onClickIcon" />
      <i class="iconfont input-icon icon-shuru" v-if="getShowIconEdit" @click="isFocus0 = true"></i>
      <i class="iconfont input-icon icon-shanchu" v-if="!getShowIconEdit" @click="isFocus0 = true;searchKeyWord='';searchChange()"></i>
    </van-cell-group>
    <div class="btn-wrapper">
      <van-button size="large" class="search-btn" @click="clickBtn">搜索</van-button>
    </div>
    

    <div class="position-area-picker-wrap">

      <div class="position-area-picker-mask" v-if="showAreaPicker" @click="clickAreaPickerMask"></div>

      <van-area class="position-area-picker" value="510104" v-if="showAreaPicker" :area-list="areaList" @confirm="onAreaPickerConfirm" @cancel="onAreaPickerCancel" />

    </div>
    <welfare-panel :show="showWelfarePanel" @cancel="onWelfareCancel" @confirm="onWelfareConfirm"></welfare-panel>

    <bottom-menu :tabString="'/search'"></bottom-menu>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import areaList from "../../utils/area";
import WelfarePanel from "../../components/WelfarePanel/WelfarePanel";
import BottomMenu from '../../components/BottomMenu/BottomMenu'


export default {
  components: {
    BottomMenu
  },
  data() {
    return {
      isFocus0: false,
      activeEle: false,
      doc: document,
      initAddress: "成都市锦江区天府广场",
      bindColumnsArea: "请选择",
      showAreaPicker: false,
      showPicker: false,
      showAddressPanel: false,
      showWelfarePanel: false,
      areaList: areaList,
      pickedType: -1,
      searchKeyWord: "",
      isRecommend: false,
      pickerColumns: [],
      pickerColumnsArr: [
        ["不限", "全职", "兼职", "实习"],
        ["不限", "社会招聘", "校园招聘"],
        ["不限", "初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"],
        ["不限", "1年", "2年", "3-4年", "5年及以上"],
        ["不限", "2k以下", "2k-4k", "4k-6k", "6k-8k", "8k-10k", "10k以上"]
      ],
      bindColumnsArr: ["不限", "不限", "不限", "不限", "不限"]
    }
  },


  // 计算属性
  computed: {
    getShowIconEdit() {
      if (this.searchKeyWord && this.searchKeyWord.length > 0 && this.activeEle) {
        return false;
      } else {
        return true;
      }
    }
  },


  onLoad(e) {
    this.$store.commit("setTitle", "搜索");
    const queryObj = e;
    const keyword = queryObj.keyword;
    const isRecommend = queryObj.isRecommend;
    if (keyword !== undefined) {
      this.searchKeyWord = keyword;
    }
    if (isRecommend !== undefined && isRecommend === "1") {
      this.isRecommend = true;
    }
  },
  onShow(){
    this._initLocation();
  },
  created() {
    this._initLocation();
  },
  methods: {
    searchChange(e) {
      if(typeof e.mp.detail === "object"){
        this.searchKeyWord = e.mp.detail.value;
      } else {
        this.searchKeyWord = e.mp.detail;
      }
    },
    _initLocation() {
      try {
        let locationData = wx.getStorageSync("locationData");
        if (locationData) {
          locationData = JSON.parse(locationData);
          const latitude = locationData.latitude;
          const longitude = locationData.longitude;
          const locationName = locationData.locationName;
          if (latitude && longitude) {
            this.initAddress = locationName || "成都市锦江区天府广场";
            this.latitude = latitude;
            this.longitude = longitude;
          }
        } else {
          this.initAddress = "成都市锦江区天府广场";
        }
      } catch (e) {
        this.$toast("请关闭浏览器的无痕模式再进行操作！");
      }
    },
    onLocationClick() {
      var _this = this;
      wx.chooseLocation({
        success: function (res) {
          wx.setStorageSync(
            "locationData",
            JSON.stringify({
              latitude: res.latitude,
              longitude: res.longitude,
              locationName: res.address
            })
          );
          _this.$store.commit("setLngLat", {
            lat: res.latitude,
            lng: res.longitude,
            posString: res.address
          });
          _this.locationName = res.address;
          _this.latitude = res.latitude;
          _this.longitude = res.longitude;
        },
        fail: function (err) {
          console.log(err)
        }
      });
    },
    onInputBlur() {
      this.activeEle = false;
    },
    onSearchInputFocus() {
      this.$refs.searchInput.scrollIntoView();
    },
    onPickerCancel() {
      this.showPicker = false;
    },
    onPickerConfirm(e, item) {
      this.showPicker = false;
      this.bindColumnsArr[item] = this.pickerColumnsArr[item][e.mp.detail.value];

    },
    onWelfareCancel() {
      this.showWelfarePanel = false;
    },
    onAreaPickerConfirm(item) {
      this.showAreaPicker = false;
      this.bindColumnsArea =
        item[0].name + "-" + item[1].name + "-" + item[2].name;
    },
    onAreaPickerCancel(item) {
      this.showAreaPicker = false;
      this.bindColumnsArea = "请选择";
    },

    onWelfareConfirm(welfareArr) {
      this.showWelfarePanel = false;
    },
    clickBtn() {
      const bindColumnsArr = this.bindColumnsArr;
      const pickerColumnsArr = this.pickerColumnsArr;
      let tempArr = [];
      if (bindColumnsArr[0] === "兼职") {
        tempArr = [2, 0, 0, 0, 0];
      } else {
        for (let i = 0; i < 5; i++) {
          tempArr[i] = pickerColumnsArr[i].indexOf(bindColumnsArr[i]);
        }
      }
      const isRecommend = "";
      if (this.isRecommend) {
        wx.navigateTo({ url: "../searchList/main?searchStr=" + tempArr.join("") + "&keyword=" + this.searchKeyWord + "&isRecommend=1" })
      } else {
        wx.navigateTo({ url: "../searchList/main?searchStr=" + tempArr.join("") + "&keyword=" + this.searchKeyWord })
      }
    },
    clickAreaPickerMask() {
      this.showAreaPicker = false;
    },
    clickAreaCell() {
      this.showAreaPicker = true;
    },
    clickCell(type) {
      if (type !== 4 || (type === 4 && this.bindColumnsArr[0] !== "兼职")) {
        this.pickedType = type;
        this.pickerColumns = this.pickerColumnsArr[type].slice(0);
        this.showPicker = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .search {
    position: relative;
    min-height: 100%;
    background-color: #f2f2f2;
    .search_address {
      height: half(88);
      background-color: #fff;
      margin-bottom: half(20);
      padding: 0 half(20);
      font-size: half(30);
      display: flex;
      align-items: center;
      .icon_right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }
    .location-icon {
      font-size: half(28);
      margin-right: half(10);
      color: #42b983;
      font-size: half(28);
    }
    .header-cell-group,
    .middle-cell-group {
      margin-bottom: half(20);
      display: block;
    }
    .footer-cell-group {
      margin-bottom: half(40);
      display: block;
      .input-icon {
        position: absolute;
        right: half(30);
        top: half(30);
        color: #CCC;
      }
    }
    .btn-wrapper {
      padding: 0 half(20);
    }
    .search-btn {
      display: block;
      overflow: hidden;
      border-radius: half(12) !important;
    }

    .name-rg {
      text-align: right;
      position: relative;
    }
    /deep/ {
      .van-cell__title {
        display: flex;
      }
      .van-cell-text {
        flex: 1;
      }
      .van-cell__value {
        color: #999;
      }
      .van-field__input {
        text-align: right;
        margin-right: half(40);
      }
    }
    .footer-cell-group /deep/ {
      input::-webkit-input-placeholder {
        color: #999;
      }
      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999;
      }
      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #999;
      }
      input:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #999;
      }
    }
  }
</style>
