/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="address-navigation">
    <ul id="autoCompleteOptionsUl">
    </ul>
    <van-cell-group class="header-cell-group">
      <van-cell center>

        <div class="small-dot"></div>
        <input id="addressDepartureInput" class="addressSearchInput name-rg" type="text" v-if="showDepartureInput" v-model="departure" placeholder="从哪儿出发" @focus="onInputFocus('addressDepartureInput')">
        <div class="departure-disable-box" v-if="!showDepartureInput">{{departure}}</div>

      </van-cell>
      <van-cell center>

        <div class="small-dot second"></div>
        <!--<input  id="addressDestinationInput"-->
        <!--class="addressSearchInput name-rg"-->
        <!--type="text"-->
        <!--disabled-->
        <!--v-model="destination"-->
        <!--placeholder="您要去哪儿"-->
        <!--@focus="onInputFocus('addressDestinationInput')">-->
        <span class="addressSearchInput name-rg">{{destination}}</span>

      </van-cell>
      <div class="shadow-box"></div>
    </van-cell-group>
    <div id="mapContainer">
    </div>

    <div class="van-button-wrapper">
      <van-button :disabled="isBtnDisabled" size="large" :loading="btnLoadingStatus" @click="onSubmitClick">导航</van-button>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Position from "../../api/modules/position";

export default {
  data() {
    return {
      showDepartureInput: false,
      getLocationState: false,
      autocompleteInputType: true,
      departure: "正在获取当前起始点...",
      btnLoadingStatus: false,
      destination: "",
      province: "四川省",
      city: "成都市",
      driving: null,
      district: "金牛区",
      longitude: 0, //经度
      latitude: 0, //纬度
      destinationLat: 0,
      destinationLng: 0,
      map: null
    }
  },
  computed: {
    isBtnDisabled() {
      return !(
        !this.btnLoadingStatus &&
        this.departure &&
        this.destination &&
        this.getLocationState
      );
    }
  },
  methods: {
    beforeDestroy() {
      const $body = document.body;
      // const $dom: document.getElementsByClassName("amap-sug-result");
      const $dom = $body.querySelectorAll(".amap-sug-result");
      const len = $dom.length;
      for (let i = 0; i < len; i++) {
        $body.removeChild($dom[i]);
        // $body.removeChild($dom[0]);
      }
    },
    _initDestination() {
      if (wx.getStorageSync) {
        try {
          const locationData = wx.getStorageSync("navLocationData");
          const formatLocationData = JSON.parse(locationData);
          const city = formatLocationData.city;
          const district = formatLocationData.district;
          const street = formatLocationData.street;
          const destinationLat = formatLocationData.lat;
          const destinationLng = formatLocationData.lng;
          if (locationData && district && street) {
            if (destinationLat && destinationLng) {
              this.destinationLat = destinationLat;
              this.destinationLng = destinationLng;
            }
            this.city = city;
            this.destination =
              (city ? city : "成都市") + (district ? district : "") + street;
          }
        } catch (e) {
          this.$toast("请关闭浏览器的无痕模式再进行操作！");
        }
      }
    },

    //初始化地图
    _initMap() {
      this.map = new AMap.Map("mapContainer", {
        features: ["bg", "point", "road", "building"], //设置地图上显示的元素种类支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
        showBuildingBlock: true //设置地图显示3D楼块效果，移动端也可使用。推荐使用。
        // viewMode: "3D" //默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。（自V1.4.0开始支持）
      });
    },
    //初始化定位
    _initGeolocationPlugin() {
      this.btnLoadingStatus = true;
      this.showDepartureInput = false;
      this.departure = "正在获取当前起始点...";
      let geolocation = null;
      let map = this.map;
      let _this = this;
      //初始化地图对象，加载地图
      map.plugin("AMap.Geolocation", function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          showButton: true //显示定位按钮，默认：true
          // buttonPosition: "RB"
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function () {
          _this.handlerGeolocationButton();
        });
        AMap.event.addListener(geolocation, "complete", _this.onLocationSuccess); //返回定位信息
        AMap.event.addListener(geolocation, "error", _this.onLocationError); //返回定位出错信息
      });
    },
    //初始化输入关键字，获取位置信息插件
    _initAutocompletePlugin(inputDom) {
      let autocomplete = null;
      const _this = this;
      const map = this.map;
      this.autocompleteInputType = inputDom === "addressDepartureInput";
      map.plugin("AMap.Autocomplete", function () {
        autocomplete = new AMap.Autocomplete({
          input: inputDom,
          output: "autoCompleteOptionsUl",
          city: _this.city || "成都市",
          citylimit: true
        });
        map.addControl(autocomplete);
        AMap.event.addListener(
          autocomplete,
          "complete",
          _this.onSearchLocationSuccess
        ); //返回输入关键字查询成功信息
        AMap.event.addListener(
          autocomplete,
          "error",
          _this.onSearchLocationError
        ); //返回输入关键字查询失败信息
        AMap.event.addListener(
          autocomplete,
          "select",
          _this.onSearchLocationSelect
        ); //返回用户选择下拉列表地址对象信息
      });
    }, //初始化输入关键字儿路驾车径规划，获取位置信息插件
    _initDrivingPlugin() {
      this.btnLoadingStatus = true;
      const _this = this;
      const map = this.map;
      map.plugin("AMap.Driving", function () {
        _this.driving = new AMap.Driving({
          map: map,
          policy: AMap.DrivingPolicy.REAL_TRAFFIC, //驾车路线规划策略
          extensions: "all", //  默认值：base，返回基本地址信息当取值为：all，返回DriveStep基本信息+DriveStep详细信息
          autoFitView: true
        });
        map.addControl(_this.driving);
        // AMap.event.addListener(driving, "complete", _this.onDrivingSuccess); //返回输入关键字查询成功信息
        // AMap.event.addListener(driving, "error", _this.onDrivingError); //返回输入关键字查询失败信息
        if (
          _this.destinationLng &&
          _this.destinationLat &&
          _this.longitude &&
          _this.latitude
        ) {
          const origin = new AMap.LngLat(_this.longitude, _this.latitude);
          const destination = new AMap.LngLat(
            _this.destinationLng,
            _this.destinationLat
          );
          _this.driving.search(origin, destination, {}, _this.onDrivingCallback);
        } else {
          _this.driving.search(
            [
              { keyword: _this.departure, city: _this.city },
              { keyword: _this.destination, city: _this.city }
            ],
            _this.onDrivingCallback
          );
        }
      });
    },
    //路径规划回调函数
    onDrivingCallback(status, result) {
      console.log("onDrivingCallback", status, result);
      this.btnLoadingStatus = false;
      if (status === "error") {
        const info = result.info;
        this.$toast(info ? info : result);
      } else {
        const _this = this;
        this.driving.searchOnAMAP({
          origin: result.origin,
          originName: _this.departure,
          destination: result.destination,
          destinationName: _this.destination
        });
      }
    },
    // //规划路径成功回调函数
    // onDrivingSuccess(DrivingResult) {
    //   console.log("onDrivingSuccess", DrivingResult);
    // },
    // //规划路径失败回调函数
    // onDrivingError(ErrorStatus) {
    //   this.$toast(ErrorStatus.info);
    //   console.log("onDrivingError", ErrorStatus);
    // },
    handlerGeolocationButton() {
      const $geolocationButton = document.getElementsByClassName(
        "amap-geolocation-con"
      )[0];
      $geolocationButton &&
        ($geolocationButton.onclick = () => {
          if (!this.showDepartureInput) return;
          this.departure = "正在获取当前起始点...";
          this.showDepartureInput = false;
        });
    },
    onLocationSuccess(result) {
      if (result && result.addressComponent) {
        this.btnLoadingStatus = false;
        this.getLocationState = true;
        this.showDepartureInput = true;
        const position = result.position;
        this.longitude = position.lng; //经度
        this.latitude = position.lat; //纬度
        const addressComponent = result.addressComponent;
        this.province = addressComponent.province;
        this.city = addressComponent.city || "成都市";
        this.district = addressComponent.district;
        this.departure =
          addressComponent.city +
          addressComponent.district +
          addressComponent.street +
          addressComponent.township;
      } else {
        this.$toast("定位失败，请打开设备GPS重新定位或刷新页面！");
      }
    },
    onLocationError(result) {
      this.btnLoadingStatus = false;
      this.getLocationState = false;
      this.showDepartureInput = true;
      this.$toast("定位失败，请打开设备GPS重新定位或刷新页面！");
    },
    onSearchLocationSuccess(result) {
      if (result.info === "NO_DATA") {
        this.getLocationState = false;
        this.$toast("该地址未查询到，请重新输入哦！");
      } else {
        this.$toast.clear();
      }
    },
    onSearchLocationError(result) {
      this.$toast("该地址未查询到，请重新输入哦！");
      this.getLocationState = false;
    },
    onInputFocus(inputDom) {
      if (!this.map) {
        this._initMap();
      }
      this._initAutocompletePlugin(inputDom);
    },
    onSearchLocationSelect(result) {
      this.getLocationState = true;
      const poi = result.poi;
      const location = poi.location;
      this.longitude = location.lng; //经度
      this.latitude = location.lat; //纬度
      if (this.autocompleteInputType) {
        this.departure = poi.name;
      } else {
        this.destination = poi.name;
      }
    },
    onSubmitClick() {
      if (!this.isBtnDisabled) {
        this._initMap();
        this._initDrivingPlugin();
      }
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "地图导航");
    this._initDestination();
  },
  onShow() {
    this._initMap();
    this._initGeolocationPlugin();
  }
}
</script>
<style lang="scss" scoped>
  #mapContainer {
    position: absolute;
    top: half(176);
    left: 0;
    right: 0;
    bottom: half(108);
  }

  .address-navigation {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    padding-bottom: half(108);
    overflow-x: hidden;
    /deep/ .address-location {
      padding-right: half(20);
      margin-right: half(20);
    }
    .header-cell-group {
      z-index: 1;
    }
    .addressSearchInput,
    .departure-disable-box {
      color: #999;
      text-align: left !important;
      flex: 1;
    }
    .shadow-box {
      box-shadow: 0 0 half(13) half(3) rgba(0, 0, 0, 0.1);
    }
    .small-dot {
      width: half(16);
      height: half(16);
      margin-right: half(18);
      border-radius: 50%;
      background-color: #42b983;
    }
    .small-dot.second {
      background-color: #ffae00;
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
    }
  }
</style>
