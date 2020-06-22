/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="recruit-list">
    <v-scroll ref="vScroll" v-if="isShowList" :loadData="getRecruitList" :totalPageNumber="totalPageNumber">
      <ul class="recruit-ul">
        <li  class="recruit-li" v-for="item in recruitListData" :key="item.venueId">
           <div class="recruit-profile van-hairline--bottom" @click="navToRecruitDetail(item.venueId)">
               <img class="recruit-avatar"  :src="item.venueCover ? imgSrcDomain + item.venueCover : recruitImg">
               <div class="recruit-details">
                   <div class="recruit-subject">【{{item.type}}】{{item.venueName}}</div>
                   <div class="recruit-dateTime">举办时间：{{item.startTime}}~{{item.endTime}}({{item.period}})</div>
               </div>
           </div>
           <div class="recruit-address" @click="navToAddressNavigation(item)">
               <i class="iconfont address-icon-location icon-dingwei_1"></i>
               <div class="address-sp">{{item.province}}{{item.city}}{{item.district}}{{item.street}}</div>
               <i class="iconfont address-icon-arrow icon-gengduo"></i>
           </div>
        </li>
      </ul>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>
    <van-toast id="van-toast" />
  </div>
</template>
<script>
import Recruit from "../../api/modules/recruit";
import { formatDate } from "../../utils/index";
export default {
  data(){
    return{
      formatDate: formatDate,
      recruitImg: require("../../../static/img/recruit/recruitImg.png"),
      loading: false,
      isNoData: false,
      isShowList: true,
      totalPageNumber: 0,
      pageSize: 10,
      pageNumber: 1,
      recruitListData: []
    }
  },
  
  onLoad() {
    this.$store.commit("setTitle", "招聘会");
    this.$nextTick(() => {
      this.getRecruitList(1);
    });
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  methods: {
    getRecruitList(_pageNum) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          sortBy: true,
          sortField: "startTime"
        };
        Recruit.venue_list(data , (res) => {
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
                this.recruitListData = [];
                this.pageNumber = _pageNum;
              }
              if (res.data.result.length) {
                for (let i = 0; i < res.data.result.length; i++) {
                  res.data.result[i].startTime = formatDate(res.data.result[i].startTime, "MM.DD");
                  res.data.result[i].endTime = formatDate(res.data.result[i].endTime, "MM.DD");
                  res.data.result[i].type === 1 ? res.data.result[i].type = "专场" : res.data.result[i].type = "校招";
                }
                this.recruitListData = this.recruitListData.concat(res.data.result);
              }
              this.totalPageNumber = res.data.pages;
              //当前页不等于总页数的时候和 总页数大于0的时候 做++
              if (
                this.pageNumber !== this.totalPageNumber &&
                this.totalPageNumber !== 0
              ) {
                ++this.pageNumber;
              }
            }
            resolve();
          }, (error) => {
            // 或者使用ts注释
            if (!error.Cancel) {
              this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
            }
            // return Promise.reject(error);
            reject(error);
          })
          this.loading = false;
          resolve();
      });
    },
    navToRecruitDetail(venueId) {
      venueId && wx.navigateTo({ url: "../recruitDetail/main?recruitId=" + venueId})
    },
    navToAddressNavigation(item) {
      if (wx.openLocation) {
        try {
          wx.openLocation({
            latitude: item.lat,  
            longitude: item.lng,
            name: item.province + item.city + item.district + item.street,
            address: item.province + item.city + item.district + item.street,
            scale: 15
          })
        } catch (e) {
          this.$toast("无法导航！");
        }
      }
    }  
  },
  getRecruitList(_pageNum) {
    /**
     * 2种写法都可以 return new Promise  或者return TestReq
     */
    return new Promise((resolve, reject) => {
      let data = {
        pageNum: _pageNum || this.pageNumber,
        pageSize: this.pageSize,
        sortBy: true,
        sortField: "startTime"
      };
      Recruit.venue_list(data, (res) => {
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
              this.recruitListData = [];
              this.pageNumber = _pageNum;
            }
            if (res.data.result.length) {
              for (let i = 0; i < res.data.result.length; i++) {
                res.data.result[i].startTime = formatDate(res.data.result[i].startTime, "MM.DD");
                res.data.result[i].endTime = formatDate(res.data.result[i].endTime, "MM.DD");
                res.data.result[i].type === 1 ? res.data.result[i].type = "专场" : res.data.result[i].type = "校招";
              }
              this.recruitListData = this.recruitListData.concat(res.data.result);
            }
            this.totalPageNumber = res.data.pages;
            //当前页不等于总页数的时候和 总页数大于0的时候 做++
            if (
              this.pageNumber !== this.totalPageNumber &&
              this.totalPageNumber !== 0
            ) {
              ++this.pageNumber;
            }
          }
          resolve();
        }, (error) => {
          // 或者使用ts注释
          if (!error.Cancel) {
            this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
          }
          // return Promise.reject(error);
          reject(error);
        })
        this.loading = false;
        resolve();
    });
  },
  navToRecruitDetail(venueId) {
    venueId && wx.navigateTo({ url: "../recruitDetail/main?recruitId=" + venueId })
  },
  navToAddressNavigation(item) {
    if (wx.openLocation) {
      try {
        wx.openLocation({
          latitude: item.lat,  
          longitude: item.lng,
          name: item.province + item.city + item.district + item.street,
          address: item.province + item.city + item.district + item.street,
          scale: 15
        })
      } catch (e) {
        this.$toast("无法导航！");
      }
    }
  }
}
</script>
<style scoped lang="scss">
._v-scroll {
  padding-top: 0 !important;
}
.recruit-list {
  min-height: 100%;

  .recruit-ul {
    font-size: half(32);
  }
  .recruit-li {
    margin-bottom: half(20);
    padding: 0 half(20);
    background-color: #fff;
  }
  .recruit-li:last-child {
    margin-bottom: 0;
  }
  .recruit-avatar {
    width: half(100);
    height: half(100);
    margin-right: half(20);
  }
  .recruit-profile {
    padding: half(30) 0;
    display: flex;
    align-items: center;
  }
  .recruit-subject {
    margin-bottom: half(20);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .recruit-dateTime {
    font-size: half(26);
    color: #666;
  }
  .recruit-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .recruit-address {
    padding: half(30) 0;
    display: flex;
    align-items: center;
  }
  .address-icon-location {
    font-size: half(30);
  }
  .address-sp {
    margin: 0 half(10);
    flex: 1;
    font-size: half(28);
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .address-icon-arrow {
    width: half(24);
    height: half(26);
    font-size: half(24);
  }
  /deep/ {
    .van-search__action {
      padding: 0 half(30);
    }
    .van-field__body {
      font-size: half(28);
    }
    .van-cell__value,
    .van-cell__value--alone {
      display: inline !important;
    }
  }
}
</style>
