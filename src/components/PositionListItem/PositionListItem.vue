<template>
  <ul class="position-list-box">
    <li
      class="positionList_box"
      :class="{bg_dff0e7:downSetBG === index,margin_b_20: index < positionListData.length-1}"
      v-for="(item,index) in positionListData"
      :key="item.jobId"
      @click="navToPosition(item.jobId)"
      @touchmove="touchOver"
      @contextmenu="touchOver"
      @touchend="touchOver"
      @touchstart="touchAction(index)"
    >
      <div class="positionList_box_cont1">
        <div class="positionList_box_cont1_t1">{{item.jobName}}</div>
        <div
          class="positionList_box_cont1_t2"
          v-if="item.lowSalary == -1"
        >
          面议
        </div>
        <div
          class="positionList_box_cont1_t2"
          v-else
        >
          {{item.salary}}
        </div>
        <!-- <div class="positionList_box_cont1_t2">{{formatSalary(item.lowSalary,item.highSalary)}}</div> -->
      </div>
      <div class="positionList_box_cont2 van-hairline--bottom">
        <div class="position-list-profile">
          <div class="positionList_box_cont2_t1" v-if="item.city && item.district">{{item.city ? item.city : ""}}{{item.city && item.district ? "-" : "" }}{{item.district ? item.district : ""}}</div>
          <div class="positionList_box_cont2_t2 van-hairline--left">{{education[item.education]}}</div>
          <div class="positionList_box_cont2_t3 van-hairline--left">{{experience[item.experience]}}</div>
        </div>
        <div class="positionList_box_cont2_t4">{{item.updateTime}}</div>
      </div>
      <div class="positionList_box_cont3">
        <img
          class="company_img"
          :src="configData.imgDomain+item.orgLogo"
          :key="configData.imgDomain+item.orgLogo"
          v-if="item.orgLogo"
        >
        <img src="../../../static/img/default/morenLOGO.png" class="company_img" v-else>
        <span class="positionList_box_cont3_t1">{{item.orgName}}</span>
        <div
          class="positionList_box_cont3_t2"
          v-if="item.distance"
        >
          <i class="iconfont zx-svg gps_icon distance-icon icon-dingwei_"></i>
          {{item.distance}}
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { formatSalary, getTimeSpan } from "../../utils/index";
import { stringify } from 'querystring';
export default {
  props: {
    positionListData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      downSetBG: "",
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
      getTimeSpan: getTimeSpan,
      formatSalary: formatSalary
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    }
  },
  watch: {
    positionListData() {
      this.formData();
    }
  },
  onLoad() {
    this.formData();
  },
  methods: {
    //格式化距离
    formatDistance(distanceVal) {
      const distance = +distanceVal;
      if (distance >= 1) {
        return distance.toFixed(1) + "km";
      } else if (distance > 0 && distance < 1) {
        return Math.round(distance * 1000) + "m";
      } else {
        return "0m";
      }
    },
    formData() {
      this.positionListData.forEach((val, index) => {
        let item = this.positionListData[index];
        if(item.distance && item.distance.includes("m") === false){
          item.distance = this.formatDistance(val.distance);
        };
        if(typeof item.updateTime == "number"){
          item.updateTime = this.getTimeSpan(val.updateTime, true)
        };
        item.jobId = val.jobId;
        item.salary = formatSalary(item.lowSalary, item.highSalary, item.salaryType);
      });
    },
    // 触摸开始
    touchAction(i) {
      this.downSetBG = i;
    },
    // 触摸结束
    touchOver(i) {
      this.downSetBG = "";
    },
    navToPosition(positionId) {
      wx.navigateTo({ url: "../../pages/positionDetail/main?positionId=" + positionId })
    }
  }
}
</script>
<style scoped lang="scss">
  .bg_dff0e7 {
    background: #E8E8E8 !important;
  }
  .margin_b_20 {
    margin-bottom: half(20);
  }
  .distance-icon {
    margin-right: half(8);
  }
  .company_img {
    width: half(70);
    height: half(70);
    margin-right: half(22);
  }
  .gps_icon {
    font-size: half(24);
    color: #CCC;
  }
  .positionList_box {
    background: #fff;
    padding: half(30) half(20) half(15) half(20);
    .positionList_box_cont1 {
      font-size: half(32);
      display: flex;
      justify-content: space-between;
      .positionList_box_cont1_t1 {
        flex: 1;
        margin-right: half(10);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .positionList_box_cont1_t2 {
        color: #fc703e;
      }
    }
    .positionList_box_cont2 {
      color: #333;
      padding: half(20) 0 half(30) 0;
      display: flex;
      font-size: half(26);
      .positionList_box_cont2_t1 {
        /*width: half(170);*/
        margin-right: half(20);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .positionList_box_cont2_t2,
      .positionList_box_cont2_t3 {
        padding: 0 half(20);
        flex-shrink: 0;
      }

      .positionList_box_cont2_t4 {
        font-size: half(24);
        color: #999;
      }
    }
    .position-list-profile {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .positionList_box_cont3 {
      padding-top: half(15);
      font-size: half(28);
      display: flex;
      align-items: center;
      .positionList_box_cont3_t1 {
        flex: 1;
        margin-right: half(10);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .positionList_box_cont3_t2 {
        display: flex;
        align-items: center;
        font-size: half(24);
        color: #999;
      }
    }
  }
</style>
