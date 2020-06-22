/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="position">
    <div class="screening-panel van-hairline--bottom">
      <div
        class="screening-location van-hairline--right"
        @click="onScreeningLocationClick"
      >
        <i class="iconfont location-icon icon-dingwei_1"></i>
        <span class="screening-sp">{{locationName}}</span>
      </div>
      <div
        class="screening-self van-hairline--right"
        @click="onScreeningSelfClick"
      >
        <span class="screening-sp">筛选</span>
        <i class="iconfont down-icon icon-xiala1" :class="{'rotate':this.showScreeningSelfPanel}"></i>
      </div>
    </div>
    <scroll-view
      ref="vScroll"
      v-if="isShowList"
      :loadData="getPositionList"
      :totalPageNumber="totalPageNumber"
    >
    <position-list-item :positionListData="positionListData"></position-list-item>
    </scroll-view>
    <no-data :isNoData="isNoData"></no-data>
    
      <div
        class="screening-mask"
        v-if="showScreeningMask"
        @click="onScreeningMaskClick"
      ></div>
    
    
      <div
        class="screening-self-panel"
        v-if="showScreeningSelfPanel"
      >
        <div class="screening-self-container">
          <div class="comprehensive-sort">
            <div class="screening-self-title">综合排序</div>
            <ul class="screening-self-ul">
              <li
                class="screening-self-li van-hairline--surround"
                :class="{'active':currentComprehensiveSortIndex === key}"
                v-for="(item, key) in screeningCurrentComprehensiveSortArr"
                :key="item"
                @click="onComprehensiveSortClick(key)"
              >{{item}}</li>
            </ul>
          </div>
          <div class="work-type">
            <div class="screening-self-title">工作性质</div>
            <ul class="screening-self-ul">
              <li
                class="screening-self-li van-hairline--surround"
                :class="{'active':currentWorkTypeIndex === key}"
                v-for="(item, key) in screeningSelfWorkTypeArr"
                :key="item"
                @click="onWorkTypeItemClick(key)"
              >{{item}}</li>
            </ul>
          </div>
          <div
            class="salary-range"
            :class="{'salary-range-disabled':currentWorkTypeIndex===2}"
          >
            <div class="screening-self-title">薪资范围</div>
            <ul class="screening-self-ul">
              <li
                class="screening-self-li van-hairline--surround"
                :class="{'active':currentSalaryRangIndex === key}"
                v-for="(item, key) in screeningSelfSalaryRangArr"
                :key="item"
                @click="onSalaryRangItemClick(key)"
              >{{item}}</li>
            </ul>
          </div>
        </div>
        <div
          class="sort-panel-bottom-bar van-hairline--top-bottom"
          @click="onSortConfirmBtnClick"
        >
          确定
        </div>
      </div>
    
    <bottom-menu :tabString="'/positionList'"></bottom-menu>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import PositionApi from '../../api/modules/position.js';
import PositionListItem from "../../components/PositionListItem/PositionListItem.vue";
import BottomMenu from '../../components/BottomMenu/BottomMenu'
export default {
  components: {
    PositionListItem,
    BottomMenu
  },
  data() {
    return {
      screeningCurrentComprehensiveSortArr: ["最近", "最新"],
      screeningSelfWorkTypeArr: ["不限", "全职", "兼职", "实习"],
      screeningSelfSalaryRangArr: [
        "不限",
        "2k以下",
        "2k-4k",
        "4k-6k",
        "6k-8k",
        "8k-10k",
        "10k以上"
      ],
      screeningCurrentComprehensiveSortParamsArr: [
        "distance",
        "updateTime"
      ],
      screeningSelfWorkTypeParamsArr: [0, 1, 2, 3],
      screeningSelfSalaryRangParamsArr: [
        "",
        { lowSalary: "", highSalary: 2000 },
        { lowSalary: 2000, highSalary: 4000 },
        { lowSalary: 4000, highSalary: 6000 },
        { lowSalary: 6000, highSalary: 8000 },
        { lowSalary: 8000, highSalary: 10000 },
        { lowSalary: 10000, highSalary: "" }
      ],
      lastScreeningStatusArr: [0, 0, 0],
      currentComprehensiveSortIndex: 0,
      currentWorkTypeIndex: 0,
      currentSalaryRangIndex: 0,
      showScreeningMask: false,
      showScreeningSelfPanel: false,
      showScreeningLocationPanel: false,
      isNoData: false,
      isShowList: true,
      totalPageNumber: 0,
      pageSize: 10,
      pageNumber: 1,
      locationName: "成都市锦江区天府广场",
      latitude: "",
      longitude: "",
      lowSalary: 0,
      highSalary: 0,
      positionListData: [],
      pickerColumnsArr: [
        ["不限", "全职", "兼职", "实习"],
        ["不限", "社会招聘", "校园招聘"],
        ["不限", "初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"],
        ["不限", "1年", "2年", "3-4年", "5年及以上"],
        ["不限", "2k以下", "2k-4k", "4k-6k", "6k-8k", "8k-10k", "10k以上"]
      ],
      total: ""
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "职位列表");
    this._initLocation();
    this.getPositionList(1, false);
  },
  onShow() {
    this._initLocation();
  },
  onReachBottom() {
    if(this.positionListData.length < this.total){
      this.getPositionList();
    }
  },
  methods: {
    onComprehensiveSortClick(key) {
      this.currentComprehensiveSortIndex = key;
    },
    onWorkTypeItemClick(key) {
      this.currentWorkTypeIndex = key;
    },
    onSalaryRangItemClick(key) {
      if (this.currentWorkTypeIndex === 2) return;
      this.currentSalaryRangIndex = key;
    },
    onSortConfirmBtnClick() {
      this.showScreeningSelfPanel = false;
      this.showScreeningMask = false;
      this.saveCurrentScreeningStatus();
      this.pageNumber = 1;
      this.getPositionList(1);
    },
    onScreeningMaskClick() {
      this.showScreeningSelfPanel = false;
      this.showScreeningLocationPanel = false;
      this.showScreeningMask = false;
      this.restoreLastScreeningStatus();
    },

    onScreeningSelfClick() {
      this.showScreeningLocationPanel = false;
      this.showScreeningSelfPanel = !this.showScreeningSelfPanel;
      this.showScreeningMask = this.showScreeningSelfPanel;
      this.restoreLastScreeningStatus();
    },
    onScreeningLocationClick() {
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
          _this.getPositionList(1);
        },
        fail: function (err) {
          console.log(err)
        }
      });
    },
    saveCurrentScreeningStatus() {
      const lastScreeningStatusArr = this.lastScreeningStatusArr;
      lastScreeningStatusArr[0] = this.currentComprehensiveSortIndex;
      lastScreeningStatusArr[1] = this.currentWorkTypeIndex;
      lastScreeningStatusArr[2] = this.currentSalaryRangIndex;
    },
    restoreLastScreeningStatus() {
      const lastScreeningStatusArr = this.lastScreeningStatusArr;
      this.currentComprehensiveSortIndex = lastScreeningStatusArr[0];
      this.currentWorkTypeIndex = lastScreeningStatusArr[1];
      this.currentSalaryRangIndex = lastScreeningStatusArr[2];
    },
    _initLocation() {
        try {
          let locationData = wx.getStorageSync("locationData");
          if (locationData) {
            locationData = JSON.parse(locationData);
            const latitude = locationData.latitude;
            const longitude = locationData.longitude;
            const locationName = locationData.locationName || "成都市锦江区天府广场";
            if (latitude && longitude) {
              this.latitude = latitude;
              this.longitude = longitude;
              this.locationName = locationName;
            }
          }
        } catch (e) {
          this.$toast("请关闭浏览器的无痕模式再进行操作！");
        }
    },
    getPositionList(
      _pageNum,
      isRouteUpdate
    ) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          siteHierarchy: this.$store.state.configData.hierarchy,
          pageSize: this.pageSize
        };
        this.handleApiParams(data, isRouteUpdate);
        PositionApi.getPositionList(data, (res) => {
          this.total = res.data.total;
          if (res.code === 0) {
            //没有数据的时候
            if (res.data.result.length === 0) {
              this.isNoData = true;
              this.isShowList = false;
              return;
            } else {
              this.isNoData = false;
            }
            !this.isShowList && (this.isShowList = true);
            // 调用第一页的时候
            if (_pageNum) {
              this.positionListData = [];
              this.pageNumber = _pageNum;
            }
            this.positionListData = this.positionListData.concat(
              res.data.result
            );
            this.totalPageNumber = res.data.pages;
            //当前页不等于总页数的时候和 总页数大于0的时候 做++
            if (
              this.pageNumber !== this.totalPageNumber &&
              this.totalPageNumber !== 0
            ) {
              ++this.pageNumber;
            }
          } else {
            this.$toast(res.msg);
          }
          this.isShowList = true;
          resolve();
        }, (error) => {
          this.isShowList = true;
          if (!error.Cancel) {
            this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
          }
          reject(error);
        });
      });
    },
    handleApiParams(data, isRouteUpdate) {
      const lastScreeningStatusArr = this.lastScreeningStatusArr;
      const comprehensiveSortValue = lastScreeningStatusArr[0];
      const WorkTypeValue = lastScreeningStatusArr[1];
      const SalaryRangValue = lastScreeningStatusArr[2];
      const screeningCurrentComprehensiveSortParamsArr = this
        .screeningCurrentComprehensiveSortParamsArr;
      const screeningSelfWorkTypeParamsArr = this.screeningSelfWorkTypeParamsArr;
      const screeningSelfSalaryRangParamsArr = this
        .screeningSelfSalaryRangParamsArr;
      data.sortField =
        screeningCurrentComprehensiveSortParamsArr[comprehensiveSortValue];
      if (WorkTypeValue) {
        data.workNature = screeningSelfWorkTypeParamsArr[WorkTypeValue];
      }
      if (SalaryRangValue && WorkTypeValue !== 2) {
        const lowSalary =
          screeningSelfSalaryRangParamsArr[SalaryRangValue].lowSalary;
        const highSalary =
          screeningSelfSalaryRangParamsArr[SalaryRangValue].highSalary;
        if (!lowSalary) {
          data.highest = highSalary;
        } else if (!highSalary) {
          data.lowest = lowSalary;
        } else {
          lowSalary && (data.lowSalary = lowSalary);
          highSalary && (data.highSalary = highSalary);
        }
      }

      if (isRouteUpdate) {
        // this.searchArr = [];
        delete data.workNature;
        delete data.type;
        delete data.education;
        delete data.experience;
      }
      const latitude = this.latitude;
      const longitude = this.longitude;
      if (latitude && latitude) {
        data.lat = latitude;
        data.lng = longitude;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .position {
    position: relative;
    min-height: 100%;
    padding-bottom: half(98);
    font-size: half(26);
    background: #f2f2f2;
    /deep/.position-list-box {
      padding-top: half(88) !important;
    }
    .screening-panel {
      position: fixed;
      z-index: 3;
      top: 0;
      left: 0;
      right: 0;
      height: half(88);
      display: flex;
      align-items: center;
      font-size: half(32);
      color: #000;
      background-color: #fff;
    }

    .screening-location,
    .screening-self {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .screening-location {
      padding-left: half(20);
      flex: 1;
      font-size: half(30);
      overflow: hidden;
    }
    .screening-location > .screening-sp {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .screening-self {
      width: half(140);
      flex-basis: half(140);
      justify-content: center;
      font-size: half(28);
      box-shadow: half(-10) 0 half(13) 0 rgba(0, 0, 0, 0.08);
    }
    .location-icon {
      margin-right: half(10);
      color: #42b983;
      font-size: half(28);
    }
    .down-icon {
      font-size: half(24);
      margin-left: half(18);
      margin-top: half(8);
      transition: transform 0.2s ease-out;
      color: #666;
    }
    .down-icon.rotate {
      transform: rotateZ(180deg);
    }
    .screening-self-panel {
      font-size: half(28);
    }
    .screening-self-container {
      padding: half(50) 0 0 half(30);
    }
    .screening-self-title {
      margin-bottom: half(40);
      font-size: half(30);
      color: #000;
    }

    .screening-self-ul {
      margin-bottom: half(20);
      display: inline-flex;
      flex-wrap: wrap;
    }
    .screening-self-li {
      width: half(210);
      height: half(60);
      margin-bottom: half(30);
      margin-right: half(30);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .screening-self-li.active {
      color: #42b983;
      &:after {
        border-color: #42b983 !important;
      }
    }
    .salary-range-disabled {
      color: #CCC;
      & > .screening-self-title {
        color: #CCC;
      }
      & .screening-self-li {
        color: #CCC;
        &:after {
          border-color: #CCC !important;
        }
      }
    }
    .screening-self-li:after {
      border-radius: half(16);
    }
    .sort-panel-bottom-bar {
      height: half(88);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: half(32);
      color: #fff;
      background-color: #42b983;
    }

    .screening-self-panel {
      position: fixed;
      z-index: 2;
      top: half(88);
      left: 0;
      right: 0;
      color: #666;
      background-color: #fff;
      transition: transform 0.2s ease-out;
      &.slide-enter-to,
      &.slide-leave {
        transform: translate3d(0, 0, 0);
      }
      &.slide-leave-to,
      &.slide-enter {
        transform: translate3d(0, -100%, 0);
      }
    }
    .screening-mask {
      position: fixed;
      z-index: 2;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.7;
      background-color: #000;
      transition: opacity 0.2s ease-out;
      &.fade-enter-to,
      &.fade-leave {
        opacity: 0.7;
      }
      &.fade-leave-to,
      &.fade-enter {
        opacity: 0;
      }
    }
    .margin_b_10 {
      margin-bottom: half(10);
    }
    .margin_r_10 {
      margin-right: half(10);
    }
    .padding_t_90 {
      padding-top: half(90);
    }
    /*  /deep/ {
      .van-search {
        padding: half(15) half(20) half(15) half(20) !important;
        left: half(216) !important;
        width: half(534);
        background: #fff !important;
      }
      .van-field__body {
        width: half(430);
        font-size: half(28);
      }
      .van-search{
        padding-left: 0px;
      }
      .van-search {
        left: half(40);
      }
      .van-search .van-cell {
        background: #f2f2f2 !important;
      }
    }*/

    .home_icon_N {
      width: half(28);
      height: half(28);
      margin-right: half(6);
    }
    .zp_icon {
      width: half(100);
      height: half(100);
    }
    .cont_title_icon {
      width: half(32);
      height: half(32);
    }
    .gengduo_icon {
      width: half(28);
      height: half(52);
    }
    .enterprise_img {
      width: half(80);
      height: half(80);
    }
  }
</style>
