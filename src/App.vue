<script>
import PositionApi from './api/modules/position.js';
export default {
  onLoad() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorage({ key: 'logs', value: logs })

    console.log('app created and cache logs by setStorage')
  },
  // onShow() {
  //   this.getLatLon();
  // },
  onLaunch() {
    this.getLatLon();
  },
  methods: {
    getLatLon() {
      var _this = this;
      wx.getLocation({
        success: function (res) {
          console.log(res.latitude +','+ res.longitude,"初始定位");
          let latitude = res.latitude;
          let longitude = res.longitude;
          let data = {
            lat: latitude || 0,
            lng: longitude || 0
          }
          PositionApi.get_addr_lng_lat(data, (res) => {
            let locationName = JSON.parse(res.data).result.address;
            wx.setStorageSync(
              "locationData",
              JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                locationName: locationName
              })
            );
            _this.$store.commit("setLngLat", {
              lat: latitude,
              lng: longitude,
              posString: locationName
            });
          }, error => {
            wx.setStorageSync(
              "locationData",
              JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                locationName: "成都市锦江区天府广场"
              })
            );
            _this.$store.commit("setLngLat", {
              lat: latitude,
              lng: longitude,
              posString: "成都市锦江区天府广场"
            });
          });
        }
      });
    }
  }
}
</script>
<style lang="scss">
  @import url("../static/style/reset.css");
  @import url("../static/style/global.css");
  @import url("../static/style/icon.css");
  @import url("../static/style/wxParse.css");
  @import url("../static/vant-weapp/common/index.css");
  html,
  body {
    height: 100%;
  }
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
  }
  /* this rule will be remove */
  * {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }
</style>
