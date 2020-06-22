/**
*@author TanQing
*@dateTime 2018/8/1
*@description created
*/
<template>
  <div class="organization">
    <header>
      <div class="org-bgImg-wrapper">
        <img :src="includesHttp" class="org-bgImg" v-if="orgDetailData.orgImg">
        <img :src="isOrgImg" class="org-bgImg" v-else>
      </div>
      <div class="org-detail-panel van-hairline--bottom">
        <img :src="configData.imgDomain + orgDetailData.orgLogo" :key="configData.imgDomain + orgDetailData.orgLogo" class="org-avatar" v-if="orgDetailData.orgLogo">
        <img
          src="../../../static/img/default/morenLOGO.png"
          class="org-avatar"
          v-else
        >
        <div class="org-detail">
          <div class="org-name-wrap">
            <div class="org-name">{{orgDetailData.orgName}}</div>
          </div>
          <div class="org-profile">
            <div class="org-category van-hairline--right">{{industryList[orgDetailData.industry - 1]}}</div>
            <div class="org-scale">{{scaleList[orgDetailData.scale - 1]}}</div>
          </div>
        </div>

      </div>
      <div class="position-org-grade">
        <div class="position-org-stars">
          <i class="iconfont position-org-stars-icon icon-xing" v-for="item in 5" :key="item"></i>
        </div>
        <div class="position-org-number">共{{orgDetailData.comments || 0}}人评论</div>
      </div>
    </header>
    <footer class="org-summary">
      <div :class="fixedHeader" id="fixedHeaderRoot">
        <van-tabs class="van-hairline--bottom" :active="tabActive" @change="onTabsClick">
          <van-tab v-for="(item, index) in tabBarArr" :title="item" :key="index">
          </van-tab>
        </van-tabs>
      </div>
      <div class="org-summary-detail" v-if="showTabDetail">
        <div class="org-summary">
          <div class="org-summary-header" v-if="orgDetailData.intro">
            <span class="summary-sp">公司简介</span>
            <div class="horizontal-line"></div>
          </div>
          <div class="org-summary-content">
            <wxParse v-if="orgDetailData.intro" :content="orgDetailData.intro" />
          </div>
          <div class="org-summary-header" v-if="orgAddressData.length">
            <span class="summary-sp">公司地址</span>
            <div class="horizontal-line"></div>
          </div>
          <ul class="org-address-ul" v-if="orgAddressData.length">
            <li class="org-address-li" v-for="item in orgAddressData" :key="item.addressId">
              <i class="iconfont zx-svg location-icon icon-dingwei_"></i>
              <span class="location-sp">{{item.province || ''}}{{item.city || ''}}{{item.district || ''}}{{item.street || ''}}{{item.doorNumber || ''}}</span>
            </li>
          </ul>
          <div class="org-summary-header">
            <span class="summary-sp">工商信息</span>
            <div class="horizontal-line"></div>
          </div>
          <div class="org-basic-message">
            <div class="org-code org-basic"><span class="org-basic-item">信用代码</span><span class="org-basic-content">{{orgDetailData.orgCode}}</span></div>
            <div class="org-register-address org-basic"><span class="org-basic-item">注册地址</span><span class="org-basic-content">{{orgDetailData.address}}</span></div>
            <div class="org-establish-dateTime org-basic"><span class="org-basic-item">成立日期</span><span class="org-basic-content">{{createTime}}</span></div>
            <div class="org-corporate-representative org-basic"><span class="org-basic-item">法人代表</span><span class="org-basic-content">{{orgDetailData.legalPerson}}</span></div>
          </div>
        </div>
      </div>
      <ul class="position-recruit-ul" v-if="!showTabDetail">
        <li class="position-recruit-li van-hairline--bottom" v-for="item in positionListData" :key="item.jobId" @click="onPositionItemClick(item.jobId)">
          <div class="position-profile-header">
            <div class="position-name">{{item.jobName}}</div>
            <div class="position-salary" v-if=" item.lowSalary!=-1">
              {{item.metaSalary}}
            </div>
            <div class="position-salary" v-else>
              面议
            </div>
          </div>
          <div class="position-profile-bottom">
            <div class="position-location van-hairline--right">{{item.city}} {{item.city && item.district ? "-" : ""}}{{item.district}}</div>
            <div class="position-degree van-hairline--right">{{education[item.education]}}</div>
            <div class="position-experience">{{experience[item.experience]}}</div>
          </div>
        </li>
        <li class="position-recruit-li" v-if="isNoData">
          <no-data :isNoData="isNoData" :padding_t="0"></no-data>
        </li>
      </ul>
    </footer>
    <div class="position-btn-bar  van-hairline--top">
      <!--<div class="position-btn-close">关闭职位</div>-->
      <div class="position-btn-pending">
        <div class="position-btn-editor van-hairline--right"  @click="onCommentClick">
          <i class="iconfont customer-service-icon icon-pinglun"></i>评论</div>
        <div class="position-btn-empty"></div>
        <div class="position-btn-publish" :class="{'disable':!orgWebsiteUrl}" @click="onWebsiteClick">官网地址</div>
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Org from "../../api/modules/org";
import PositionApi from "../../api/modules/position";
import wxParse from 'mpvue-wxparse';
import noData from '../../components/NoData';
import {
  formatSalary,
  formatDate
} from "../../utils/index";
import index from '../../api/base';
export default{
  components: {
    wxParse,
    noData
  },
  data () {
    return {
      query: "",
      formatDate: formatDate,
      salary: "",
      tabActive: 0,
      orgDetailData: {},
      orgAddressData: [],
      formatSalary: formatSalary,
      // isLogin: !!this.$store.state.userInfo,
      showTabDetail: true,
      isNoData: false,
      scrollTimer: null,
      orgWebsiteUrl: "",
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
      industryList: [
        "计算机/互联网/通信/电子",
        "会计/金融/银行/保险",
        "专业服务/教育/培训",
        "贸易/消费/制造/营运",
        "房地产/建筑",
        "能源/原材料",
        "广告/媒体",
        "制药/医疗",
        "物流/运输",
        "服务业",
        "政府",
        "非盈利机构",
        "其他行业"
      ],
      scaleList: [
        "少于50人",
        "50-150人",
        "150-500人",
        "500-1000人",
        "1000-2000人",
        "2000人以上"
      ],
      offsetTop: null,
      offsetHeight: null,
      headerFixed: false,
      experience: ["不限", "1年", "2年", "3-4年", "5年及以上"], //工作经验
      positionListData: [],
      tabBarArr: ["基本信息", "招聘职位"]
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    },
    isOrgImg() {
      return this.configData.imgDomain + '/default/cdwork/org_img.jpg';
    },
    includesHttp() {
      return this.orgDetailData.orgImg && this.orgDetailData.orgImg.includes('http') ? this.orgDetailData.orgImg : this.configData.imgDomain + this.orgDetailData.orgImg;
    },
    fixedHeader() {
      return [`org-tab`,this.headerFixed ? ` isFixed`:`` ];
    },
    createTime() {
      return formatDate(this.orgDetailData.createTime,'YYYY-MM-DD')
    },
    token() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
    }
  },
  onLoad(e) {
    this.query = e;
    this.switchTabStatus();
    this.getOrganizationDetail();
    this.getOrgAddress();
    this.getPositionList();
  },
  methods: {
    onTabsClick(res) {
      this.tabActive = res.target.index;
      if (this.tabActive === 0) {
        this.showTabDetail = true;
        return;
      }
      this.showTabDetail = false;
    },
    cssSupport(attr, value) {
      var element = document.createElement("div");
      if (attr in element.style) {
        element.style[attr] = value;
        return element.style[attr] === value;
      } else {
        return false;
      }
    },
    switchTabStatus() {
      this.query.tabStatus && (this.tabActive = 1) && (this.showTabDetail = false);
    },
    getOrganizationDetail() {
      const query = this.query;
      const orgId = this.query.orgId;
      if (query && orgId) {
        const data = {
          orgId: orgId,
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.token
        };
        Org.getOrgDetail(data, (res) => {
          if (res.code === 0) {
            this.$store.commit("setTitle", res.data.orgName);

            const resData = res.data;
            this.orgDetailData = resData;
            this.orgDetailData.intro = resData.intro
              ? decodeURIComponent(resData.intro)
              : "";
            this.orgWebsiteUrl = resData.website;
          }
        });
      }
    },
    getOrgAddress() {
      const query = this.query;
      const orgId = query && query.orgId;
      if (query && orgId) {
        const data = {
          pageSize: 10,
          pageNum: 1,
          orgId: orgId
        };
        PositionApi.my_address(data, (res) => {
          if (res.code === 0) {
            const result = res.data.result;
            if (result.length) {
              this.orgAddressData = result;
            }
          }
        });
      }
    },
    getPositionList() {
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      const query = this.query;
      const orgId = query && query.orgId;
      if (orgId) {
        const data = {
          orgId: orgId,
          pageNum: 1,
          pageSize: 99,
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.token
        };
        PositionApi.getPositionList(data, (res) => {
            if (res.code === 0) {
              if (res.data.result.length) {
                this.isNoData = false;
              } else {
                this.isNoData = true;
              }
              this.positionListData = res.data.result;
              this.positionListData.forEach((item , index)  => {
                this.positionListData[index].metaSalary = formatSalary(item.lowSalary, item.highSalary, item.salaryType);
              });
              
            }console.log(this.positionListData)
          })
          setTimeout(() => {
            this.$toast.clear();
          }, 500);
      }
    },
    onCommentClick() {
      const query = this.query;
      const orgId = query && query.orgId;
      const orgName = this.orgDetailData.orgName;
      orgId &&
        orgName &&
        wx.navigateTo({url: "../commentDetail/main?orgId=" + orgId + "&orgName=" + encodeURIComponent(orgName)});
    },
    onWebsiteClick() {
      if(this.orgWebsiteUrl){
        wx.showModal({
          title: '官网地址',
          content: this.orgWebsiteUrl,
          confirmText: "点击复制",
          success: function(res) {
            if (res.confirm) {
              wx.setClipboardData({
                data: this.orgWebsiteUrl,
                success: function (res) {
                  wx.showToast({
                    title: '复制成功',
                  });
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    onPositionItemClick(positionId) {
      wx.navigateTo({url: "../positionDetail/main?positionId=" + positionId});
    }  
  }
}
</script>
<style lang="scss" scoped>
.organization {
  min-height: 100%;
  background-color: #f2f2f2;
  padding-bottom: half(104);
  .isFixed {
    position: fixed;
    top: 0;
    left: 0;
    height: half(50);
    width: 100%;
    z-index: 5;
  }
  .org-tab {
    position: -webkit-sticky;
    position: sticky;
    top: -2px;
    left: 0;
    z-index: 5;
  }
  .position-org-grade {
    display: flex;
    align-items: center;
    padding: half(12) half(20);
    margin-bottom: half(20);
    font-size: half(24);
    color: #999;
    background-color: #fff;
  }
  .position-org-stars {
    flex: 1;
  }
  .position-org-stars-icon {
    width: 17px;
    height: 17px;
    margin-right: 5px;
    display: inline-block;
  }
  .org-summary-content,
  .org-address-ul {
    margin-bottom: half(80);
  }
  .org-address-li {
    display: flex;
    /*align-items: center;*/
    /*align-items: baseline;*/
    margin-bottom: half(40);
    font-size: half(28);
    color: #999;
  }
  .org-address-li:last-child {
    margin-bottom: 0;
  }
  /*.location-sp {*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space: nowrap;*/
  /*}*/
  .location-icon {
    font-size: half(28);
    margin-top: half(4);
    flex-shrink: 0;
    margin-right: half(6);
    color: #999;
  }
  .org-basic {
    display: flex;
    margin-bottom: half(40);
  }
  .org-basic:last-child {
    margin-bottom: 0;
  }
  .org-basic-message {
    font-size: half(28);
    color: #000;
  }
  .org-basic-item {
    width: half(160);
    color: #999;
  }
  .org-basic-content {
    width: half(550);
  }
  .org-summary-header {
    display: flex;
    align-items: center;
    margin-bottom: half(50);
    font-size: half(30);
    color: #000;
  }
  .horizontal-line {
    border-bottom: 1px solid #d8d8d8;
    flex: 1;
    margin-left: half(30);
  }
  .position-btn-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: half(32);
    color: #fff;
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
  .position-btn-publish.disable {
    background-color: #E8E8E8;
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
    font-size: half(24)!important;
  }
  .customer-service-icon {
    font-size: half(48)!important;
  }
  .position-btn-empty {
    flex: 0.49333;
  }
  .position-btn-publish {
    flex: 1;
  }
  .position-btn-publish.unExsit {
    background-color: #CCC;
  }
  .org-profile {
    height: half(32);
    display: flex;
    align-items: center;
    font-size: half(24);
    color: #999;
  }
  .org-category {
    padding-right: half(20);
  }
  .org-scale {
    padding-left: half(20);
  }

  .stars-rater {
    margin-left: half(10);
  }
  .org-stars-icon {
    width: 17px;
    height: 17px;
    margin-right: 5px;
  }
  .org-stars-icon:last-child {
    margin-right: 0;
  }

  .org-bgImg-wrapper {
    position: relative;
    padding-top: 56.25%;
    background-color: #fff;
  }
  .org-bgImg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .org-detail-panel {
    display: flex;
    align-items: center;
    padding: half(20);
    background-color: #fff;
  }
  .org-avatar {
    width: half(100);
    height: half(100);
    margin-right: half(20);
  }
  .org-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: half(6);
  }
  .org-name-wrap {
    display: flex;
    align-items: center;
    padding-top: half(6);
    margin-bottom: half(20);
    font-size: half(32);
  }
  .org-name {
    height: half(42);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .org-summary {
    width: 100%;
    color: #000;
    background-color: #fff;
    // overflow-x: hidden;
  }
  /deep/ {
    .van-tabs {
      position: relative !important;
    }
    .van-tabs__line {
      width: half(318) !important;
      left: half(-66);
      background-color: #42b983;
    }
    .van-tab {
      color: #000;
      font-size: half(32);
    }
    .van-tab--active {
      line-height: half(88);
      color: #42b983;
    }
  }
  .position-recruit-li {
    display: flex;
    flex-direction: column;
    padding: half(30) half(20);
  }
  .position-salary {
    color: #fc703e;
  }
  .org-summary-detail {
    min-height: half(98);
    padding: half(30) half(20);
    font-size: half(28);
    overflow-x: hidden;
    word-wrap: break-word;
  }
  .position-profile-header {
    display: flex;
    margin-bottom: half(20);
    font-size: half(30);
  }
  .position-name {
    flex: 1;
    margin-right: half(10);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .position-profile-bottom {
    display: flex;
    font-size: half(26);
    color: #333;
  }
  .position-location {
    padding-right: half(20);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .position-degree,
  .position-experience {
    flex-shrink: 0;
  }
  .position-experience {
    padding-left: half(20);
  }
  .position-degree {
    padding: 0 half(20);
  }
}
</style>

<style lang="scss">
</style>
