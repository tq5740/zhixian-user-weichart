/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
  <div class="reservation-record">
      <van-tabs :active="active" @change="_clickTabs" class="tabs">
          <van-tab v-for="(value, key) in tabOptions" :key="key" :title="value">
          </van-tab>
      </van-tabs>
    <v-scroll ref="vScroll" v-if="isShowList" :loadData="getReservationRecordList" :totalPageNumber="totalPageNumber">
      <ul class="reservation-item-ul">
        <li class="reservation-li van-hairline--bottom" v-for="item in reservationRecordData" :key="item.bookingId" @click="onItemClick(item.jobId)">
          <div class="company-box van-hairline--bottom">
            <div class="company-subject">
              <div class="company-position">{{item.jobName}}</div>
              <div class="company-salary">
                  <div  v-if="item.lowSalary == -1">
                      面议
                  </div>
                  <div v-else>
                      {{item.salary}}
                  </div>

                <!-- {{formatSalary(item.lowSalary,item.highSalary)}} -->
              </div>
            </div>
            <div class="company-detail">
              <div class="company-location van-hairline--right">{{item.jobCity}}{{item.jobCity && item.jobDistrict ? "-" : ""}}{{item.jobDistrict}}</div>
              <div class="company-degree van-hairline--right" v-if="item.highestEducation">{{education[item.highestEducation]}}</div>
              <div class="company-experience" v-if="item.startWorkYear">{{item.startWorkYear}}</div>
                <div class="dataTime">{{item.createTime}}</div>
            </div>
          </div>
          <div class="company-profile">
            <img class="company-avatar" :src="imgSrcDomain+item.orgLogo" :key="imgSrcDomain+item.orgLogo" v-if="item.orgLogo">
            <img src="../../../static/img/default/morenLOGO.png" class="company-avatar" v-else>
            <div class="company-name">{{item.orgName}}</div>
            <div class="delivery-state">{{deliveryState[item.state - 1]}}</div>
          </div>
        </li>
      </ul>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Interview from "../../api/modules/interview";
import { formatSalary, formatDate, getParseExperience } from "../../utils/index";
export default{

  data () {
    return {
      deliveryState: [
        "待查看",
        "不合适",
        "待面试",
        "未通过",
        "待入职",
        "未入职",
        "已入职"
      ],
      active: null,
      acticeIndex: 0,
      tabOptions: ["全部", "待查看", "不合适", "待面试", "未通过"],
      arr: ["已发布", "未通过", "已关闭"],
      getParseExperience: getParseExperience,
      isNoData: false,
      isShowList: true,
      pageSize: 10,
      formatDate: formatDate,
      formatSalary: formatSalary,
      pageNumber: 1,
      totalPageNumber: 0,
      education: [
        "不限",
        "初中及以下",
        "高中",
        "中技/中专",
        "大专",
        "本科",
        "硕士",
        "博士"
      ], //专业
      experience: ["不限", "1年", "2年", "3-4年", "5年及以上"], //工作经验
      reservationRecordData: []
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "投递记录");
    this.getReservationRecordList(1);
  },

  methods: {
    _clickTabs(event) {
      this.acticeIndex = event.mp.detail.index;
      // this.active = this.acticeIndex;
      this.isShowList = false;
      this.totalPageNumber = 0;
      this.getReservationRecordList(1);
    },
    getReservationRecordList(_pageNum) {
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          sortBy: false,
          bookingState: this.acticeIndex || '',
          sortField: "createTime",
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.$store.state.userInfo.token
        };
        this.$toast.loading({
          mask: true,
          message: "加载中..."
        });
        Interview.getReservationRecord(data, (res) => {
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
                this.reservationRecordData = [];
                this.pageNumber = _pageNum;
                this.bookingState = this.acticeIndex === 0 ? null : this.acticeIndex;
              }
              this.reservationRecordData = this.reservationRecordData.concat(
                res.data.result
              );
              this.reservationRecordData.forEach(item => {
                item.salary = formatSalary(item.lowSalary, item.highSalary, item.salaryType);
                item.startWorkYear = getParseExperience(item.startWorkYear);
                item.createTime = formatDate(item.createTime,'YYYY.MM.DD');
              });
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
          },(error) => {
            if (!error.Cancel) {
              this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
            }
            reject(error);
          })
          setTimeout(() => {
            this.$toast.clear();
          }, 500);
      });
    },

    onItemClick(positionId) {
      wx.navigateTo({ url: "../positionDetail/main?positionId=" + positionId })
    }  
  }
  
}
</script>
<style lang="scss" scoped>
.reservation-record {
  min-height: 100%;
  background-color: #f2f2f2;
  .tabs {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    /deep/ {
      .van-tab {
        flex: 0 0 20%!important;
        font-size: half(30);
      }
      .van-tab--active {
        color: #42b983;
      }
      .van-tabs__line {
        background-color: #42b983;
        width: half(40) !important;
        left: half(18);
        border-radius: half(4);
      }
      .van-hairline--top-bottom::after{
        border-top-width: half(0);
      }
    }
  }
  
  .v-scroll {
    padding-top: half(88) !important;
  }

  .reservation-item-ul {
    color: #666;
  }
  .reservation-li {
    padding: half(30) half(20) 0;
    margin-bottom: half(20);
    background-color: #fff;
  }
  .reservation-li:last-child {
    margin-bottom: 0;
  }
  .company-subject {
    display: flex;
    margin-bottom: half(30);
    overflow: hidden;
    font-size: half(32);
  }
  .company-box {
    display: flex;
    flex-direction: column;
    padding-bottom: half(30);
  }
  .company-location {
    padding-right: half(20);
  }
  .company-degree {
    padding: 0 half(20);
  }
  .company-experience {
    padding-left: half(20);
  }
  .dataTime {
    flex: 1;
    text-align: right;
    margin-left: half(10);
    color: #999;
    font-size: half(24);
  }
  .company-detail {
    display: flex;
    font-size: half(26);
  }
  .company-position {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
  }

  .company-avatar {
    width: half(70);
    height: half(70);
    margin-right: half(20);
  }
  .company-salary {
    color: #fc703e;
  }
  .company-profile {
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: half(14) 0;
    font-size: half(28);
  }
  .location-icon {
    width: half(30);
    height: half(30);
    margin-right: half(10);
    flex-shrink: 0;
  }
  .company-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .delivery-state {
    font-size: half(24);
    color: #999;
  }
}
</style>
