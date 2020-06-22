
<template>
  <div class="address-pick" >
    <ul id="autoCompleteOptionsUl">
    </ul>
    <van-cell center>
      <input
        id="addressSearchInput"
        class="name-rg"
        type="text"
        v-show="showDepartureInput"
        v-model="street"
        :placeholder="placeholderString"
        @focus="onStreetInputFocus"
      >
      <div
        class="departure-disable-box"
        v-show="!showDepartureInput"
      >{{street}}</div>
    </van-cell>

    <div
      class="switch-location-module"
      @click="getCenterLocation"
    >
      <i class="iconfont location-icon icon-dingwei_1"></i>
      点击使用当前位置

    </div>
    <div class="shadow-box"></div>

    <map
      id="mapContainer"
      subkey="Z45BZ-X4LKO-KXJW4-SMWLQ-QAASJ-3VBIP"
      scale="15"
      :latitude="latitude"
      :longitude="longitude"
      @markers="markers"
      @covers="covers"
      show-location
      style="width: 100%;height: 80%;"
    ></map>

    <div class="van-button-wrapper">
      <van-button
        :disabled="isBtnDisabled"
        :loading="btnLoadingStatus"
        size="large"
        @click="onSubmitClick"
      >确定
      </van-button>
    </div>
    <van-toast id="van-toast" />
  </div>

</template>

<script>
import Position from "../../api/modules/position";

export default {

  data() {
    return {
      path: "",
      isRouterEnter: false,
      showDepartureInput: true,
      getLocationState: false,
      btnLoadingStatus: false,
      province: "四川省",
      city: "成都市",
      district: "金牛区",
      longitude: 104.065837, //经度
      latitude: 30.657349, //纬度
      street: "",
      map: null,
      adcode: "",
      placeSearchObj: null,
      locationStatus: true,
      locationRaduis: 150, //定位范围半径
      placeholderString: "例：社保大厦",
      isBtnDisabled: false
    }
  },
  computed: {

  },
  onLoad() {
    this.$store.commit("setTitle", "地图定位");
    this.getLastLocation();
  },
  onShow() {

  },
  onReady(e) {
    this.mapCtx = wx.createMapContext('mapContainer')
  },
  methods: {
    getLastLocation() {
      const locationData = wx.getStorageSync("locationData");
      if (locationData) {
        const parseLocationData = JSON.parse(locationData);
        const locationName = parseLocationData.locationName;
        const adcode = parseLocationData.adcode;
        const latitude = parseLocationData.latitude;
        const longitude = parseLocationData.longitude;
        if (parseLocationData && locationName && adcode) {
          this.street = locationName;
          this.adcode = adcode;
          this.latitude = latitude;
          this.longitude = longitude;
        }
      }
    },
    getCenterLocation () {
      var _this = this;
      this.mapCtx.getCenterLocation({
        success(res){
          _this.longitude = res.longitude;
          _this.latitude = res.latitude;
        }
      })
      this.moveToLocation();
    },
    moveToLocation () {
      var that = this;
      wx.chooseLocation({
        success: function (res) {
          console.log(res,"111111111")
          that.street = res.address;
          that.latitude = res.latitude;
          that.longitude = res.longitude;
        },
        fail: function (err) {
          console.log(err)
        }
      });
    },
    translateMarker() {
      this.mapCtx.translateMarker({
        markerId: 1,
        autoRotate: true,
        duration: 1000,
        destination: {
          latitude:23.10229,
          longitude:113.3345211,
        },
        animationEnd() {
          console.log('animation end')
        }
      })
    },
    includePoints() {
      this.mapCtx.includePoints({
        padding: [10],
        points: [{
          latitude:23.10229,
          longitude:113.3345211,
        }, {
          latitude:23.00229,
          longitude:113.3345211,
        }]
      })
    },
    onSubmitClick() {
    if (!this.isBtnDisabled) {
      try {
        wx.setStorageSync("locationData",
          JSON.stringify({
            latitude: this.latitude,
            longitude: this.longitude,
            locationName: this.street,
            adcode: this.adcode
          })
        );
        this.$store.commit("setLngLat", {
          lat: this.latitude,
          lng: this.longitude,
          posString: this.street
        });
        wx.navigateBack({ delta: 1 });
        // this.$router.push({ path: this.path })
      } catch (e) {
        this.$toast("请关闭浏览器的无痕模式再进行操作！");
      }
    }
  }
  }
}
</script>
<style lang="scss" scoped>
  #mapContainer {

  }

  #addressSearchInput {
    text-align: left !important;
    flex: 1;
  }

  .departure-disable-box {
    color: #999;
    text-align: left !important;
    flex: 1;
  }

  .address-pick {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding-bottom: half(108);
    overflow-x: hidden;

    .shadow-box {
      position: absolute;
      top: half(186);
      left: 0;
      right: 0;
      z-index: 1;
      box-shadow: 0 half(6) half(13) half(3) rgba(0, 0, 0, 0.1);
    }
    .switch-location-module {
      display: flex;
      align-items: center;
      color: #42b983;
      font-size: half(28);
      padding: half(30);
      background: #fff;
    }
    .location-icon {
      font-size: half(28);
      display: inline-block;
      margin-right: half(10);
    }

    /deep/ .amap-logo {
      display: none !important;
    }
    /deep/ .amap-copyright {
      display: none !important;
    }
    /deep/ .amap-geolocation-con {
      z-index: 0 !important;
    }
    .van-button-wrapper {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
    }
  }
</style>
