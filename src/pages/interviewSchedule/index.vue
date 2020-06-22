/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
  <div class="interview-schedule">
    <van-search
      class="van-hairline--bottom"
      :value="queryString"
      @change="searchChange"
      use-action-slot
      placeholder="请输入职位名称进行搜索"
      @search="onSearch"
    >
      <view slot="action" @click="onSearch">搜索</view>
    </van-search>
    <v-scroll
      ref="vScroll"
      v-if="isShowList"
      :loadData="getInterviewScheduleList"
      :totalPageNumber="totalPageNumber"
    >
      <ul class="interview-item-ul">
        <li
          class="interview-li van-hairline--bottom"
          v-for="item in interviewScheduleData"
          :key="item.bookingId"
        >
          <div
            class="company-box van-hairline--bottom"
            @click="onCompanyBoxClick(item.jobId)"
          >
            <img
              class="company-avatar"
              :src="imgSrcDomain+item.orgLogo"
              :key="imgSrcDomain+item.orgLogo"
              v-if="item.orgLogo"
            >
            <img
              src="../../../static/img/default/morenLOGO.png"
              class="company-avatar"
              v-else
            >
            <div class="company-profile">
              <div class="company-name"><span class="company-job-Name">{{item.jobName}}</span><span class="dataTime">（{{item.interviewTime}}）</span>
              </div>
              <div class="company-detail">
                <div class="company-position van-hairline--right">{{item.orgName}}</div>

                <div class="company-salary">
                  <div v-if="item.lowSalary == -1">
                    面议
                  </div>
                  <div v-else>
                    {{item.salary}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="company-location"
            @click="onCompanyLocationClick(item)"
          >
            <i class="iconfont location-icon icon-dingwei_1"></i>
            <div class="company-location-sp">{{item.city}}{{item.district}}{{item.street}}</div>
            <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
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
import Vscroll from "../../components/Vscroll/Vscroll.vue";
import { formatSalary, formatDate } from "../../utils/index";
export default {
  components: {
    Vscroll
  },
  data() {
    return {
      isNoData: false,
      isShowList: true,
      queryString: "",
      pageSize: 10,
      pageNumber: 1,
      formatDate: formatDate,
      formatSalary: formatSalary,
      totalPageNumber: 0,
      interviewScheduleData: []
    }
  },

  // @Watch("queryString")
  // 
  watch:{
    handlerQueryInputChange(queryString) {
      if (!queryString.length) {
        this.getInterviewScheduleList(1);
      }
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "面试日程");
    this.$store.state.newInterview = false;
    this.getInterviewScheduleList(1);
  },
  methods: {
    searchChange(e) {
      if(typeof e.mp.detail === "object"){
        this.queryString = e.mp.detail.value;
      } else {
        this.queryString = e.mp.detail;
      }
    },
    getInterviewScheduleList(_pageNum) {
      return new Promise((resolve, reject) => {
        let data = {
          query: this.queryString,
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          sortBy: true,
          sortField: "interviewTime",
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.$store.state.userInfo.token
        };
        this.$toast.loading({
          mask: true,
          message: "加载中..."
        });
        Interview.getInterviewSchedule(data, (res) => {
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
              this.interviewScheduleData = [];
              this.pageNumber = _pageNum;
            }
            this.interviewScheduleData = this.interviewScheduleData.concat(
              res.data.result
            );
            this.interviewScheduleData.forEach(item => {
              item.salary = formatSalary(item.lowSalary, item.highSalary, item.salaryType);
              item.interviewTime = formatDate(item.interviewTime, 'YYYY-MM-DD hh:mm');
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
        }, (error) => {
          // 或者使用ts注释
          if (!error.Cancel) {
            this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
          }
          // return Promise.reject(error);
          reject(error);
        })
        setTimeout(() => {
          this.$toast.clear();
        }, 500);
      });
    },
    onSearch() {
      this.getInterviewScheduleList(1);
    },
    onCompanyBoxClick(positionId) {
      wx.navigateTo({ url: "../interviewAgreed/main?positionId=" + positionId })
    },
    onCompanyLocationClick(item) {
      if (wx.openLocation) {
        try {
          wx.openLocation({
            latitude: item.lat,  
            longitude: item.lng,
            name: (item.province || "四川省") + (item.city || "成都市") + (item.district || "") + (item.street || ""),
            address: (item.province || "四川省") + (item.city || "成都市") + (item.district || "") + (item.street || ""),
            scale: 15
          })
        } catch (e) {
          this.$toast("无法导航！");
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .interview-schedule {
    min-height: 100%;
    background-color: #f2f2f2;
    .v-scroll {
      padding-top: half(88) !important;
    }
    /deep/ .van-search .van-cell__value {
      display: block !important;
    }
    /deep/ .van-search__action {
      padding: 0 half(28);
    }
    .interview-item-ul {
      color: #666;
    }
    .interview-li {
      padding: half(20) half(20) 0;
      margin-bottom: half(20);
      background-color: #fff;
    }
    .company-box {
      display: flex;
      padding-bottom: half(20);
    }
    .company-avatar {
      width: half(100);
      height: half(100);
      margin-right: half(20);
    }
    .company-position {
      margin-right: half(20);
      padding-right: half(20);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .company-profile {
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: hidden;
    }
    .company-salary {
      white-space: nowrap;
    }
    .company-detail {
      display: flex;
      align-items: center;
      font-size: half(26);
      overflow: hidden;
    }
    .company-name {
      display: flex;
      margin-bottom: half(24);
      color: #000;
      font-size: half(32);
      overflow: hidden;
    }
    .company-job-Name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dataTime {
      white-space: nowrap;
    }
    .company-location {
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: half(20) 0;
      font-size: half(28);
    }
    .location-icon {
      width: half(30);
      height: half(30);
      margin-right: half(10);
      flex-shrink: 0;
    }
    .company-location-sp {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
