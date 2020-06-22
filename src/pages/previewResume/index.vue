/**
*@author tanqing
*@dateTime 2018/12/25
*@description created
*/
<template>
  <div class="userDetails">
    <div class="user_info van-hairline--bottom">
      <div class="padding_b_20 user_info_title">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-jibenxinxi"></i>
          </span>
          <span class="title">基本信息</span>
        </div>
      </div>
    </div>
    <div class="user_info">
      <div class="list">
        <div class="list_box">
          <div class="con_img">
            <img
              class="con_img"
              src="../../../static/img/default/yonghutouxiang.png"
              v-if="userData.photo == null || userData.photo == 0 || userData.photo == 1||userData.photo == 2||userData.photo == 3||userData.photo == 4"
            >
            <img class="con_img" :src="userData.photo.includes('http') ? userData.photo : imgSrcDomain + userData.photo" v-else>
          </div>
          <div class="con_info">
            <div class="con_text1">
              <div class="con_text1_name">{{userData.userName}}</div>
              <div class="con_text1_sex">
                <i class="iconfont zx-svg con_text1_sex icon-nan-" v-if="userData.sex == 1"></i>
                <i class="iconfont zx-svg con_text1_sex icon-nv-" v-if="userData.sex == 2"></i>
              </div>
            </div>
            <div class="con_text1 con_text2">
              <div class="con_text2_tag">{{userData.workState}}{{userData.workState && userData.availableTime ? "-" : ""}}{{userData.availableTime}}到岗</div>
            </div>
          </div>
        </div>
      </div>
      <div class="user_info card" v-if="userData.birthDate || userData.education || userData.startWorkYear || userData.phone">
        <div class="user_info_cont1">
          <div class="user_info_box">
            {{isBirthDate}}岁
          </div>
          <div class="user_info_box">
            {{userData.education}}
          </div>
          <div class="user_info_box">
            {{isStartWorkYear}}年经验
          </div>
        </div>
        <div class="user_info_cont1">
          <div class="user_info_box">
            <a class="phone" :href="'tel:'+userData.phone">{{userData.phone}}</a>            
          </div>
          <div class="user_info_box">     
            {{userData.city || ""}}
            {{userData.city && userData.district ? "-" : ""}}
            {{userData.district || ""}}   
          </div>
        </div>
      </div>
      <div class="user_tag">
        {{userData.tag}}
      </div>
    </div>
    <div class="user_info margin_t_20">
      <div class="padding_b_20 user_info_title" :class="{'van-hairline--bottom': (userData.intention && userData.intention.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-qiuzhiyixiang"></i>
          </span>
          <span class="title">求职意向</span>
        </div>
      </div>
      
      <div class="user_info card" v-if="userData.intention">
        <div class="user_info_cont1">
          <div class="user_info_box bgclr1">
            {{userData.intention.intentionalJob}}
          </div>
          <div class="user_info_box bgclr1">
            {{userData.intention.lowSalary}}{{pickerColumnsArr[4][userData.intention.workNature] === '兼职' ? '/天' : ''}}
          </div>
        </div>
        <div class="user_info_cont1">
          <div class="user_info_box bgclr1">
            {{userData.intention.city}}
            {{userData.intention.city && userData.intention.district ? "-" : ""}}
            {{userData.intention.district || ""}}
          </div>
          <div class="user_info_box bgclr1">
            {{pickerColumnsArr[4][userData.intention.workNature]}}
          </div>
        </div>
      </div>
      <div class="user_tag">
        {{selfReview}}
      </div>
    </div>
    <div class="user_info margin_t_20" v-if="userData.workUndergo && userData.workUndergo.length">
      <div class="padding_b_20 user_info_title" :class="{'van-hairline--bottom': (userData.workUndergo && userData.workUndergo.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-gongzuojingli"></i>
          </span>
          <span class="title">工作经历</span>
        </div>
      </div>
      <div class="user_info_cont2" v-if="userData.workUndergo && userData.workUndergo.length">
        <div class="workUndergo_box" v-for="item in userData.workUndergo" :key="item.workUndergoId">
          <div>
            <div class="workUndergo_box_time">{{item.startMonth}} - {{item.endMonth}}</div>
            <div class="workUndergo_box_name">{{item.companyName}}/{{item.jobClassifyName}}</div>
            <div class="text_t1">{{item.orientation}}</div>
            <div class="text_t2">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="user_info margin_t_20" v-if="userData.eduUndergo && userData.eduUndergo.length">
      <div class="padding_b_20 user_info_title" :class="{'van-hairline--bottom': (userData.eduUndergo && userData.eduUndergo.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
            <i class="iconfont zx-svg edit_icon icon-jiaoyujingli"></i>
          </span>
          <span class="title">教育经历</span>
        </div>
      </div>
      <div class="user_info_cont2" v-if="userData.eduUndergo && userData.eduUndergo.length">
        <div class="workUndergo_box" v-for="item in userData.eduUndergo" :key="item.eduUndergoId">
          <div>
            <div class="workUndergo_box_time">{{item.startMonth}} - {{item.endMonth}}</div>
            <div class="workUndergo_box_name">{{item.schoolName}}</div>
            <div class="text_t1">{{userData.majorName}}{{userData.majorName && userData.education ? "-" : ""}}{{userData.education}}</div>
            <div class="text_t2">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="user_info margin_t_20" v-if="userData.trainUndergo && userData.trainUndergo.length">
      <div class="padding_b_20 user_info_title" :class="{'van-hairline--bottom': (userData.trainUndergo && userData.trainUndergo.length)}">
        <div class="margin_l_20 text_title">
          <span class="icon">
          <i class="iconfont zx-svg edit_icon icon-peixunjingli"></i>
        </span>
          <span class="title">培训经历</span>
        </div>
      </div>
      <div class="user_info_cont2" v-if="userData.trainUndergo && userData.trainUndergo.length">
        <div class="workUndergo_box" v-for="item in userData.trainUndergo" :key="item.trainUndergoId">
          <div>
            <div class="workUndergo_box_time">{{item.startMonth}} - {{item.endMonth}}</div>
            <div class="workUndergo_box_name">{{item.project}}</div>
            <div class="text_t1">{{item.institutionName}}</div>
            <div class="text_t2">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="isOpen">
      <div class="isOpen_left">
        <div class="isOpen_left_1">是否公开简历</div>
        <div class="isOpen_left_2">公开后,hr可以搜索到您的简历,为您推荐职位~</div>
      </div>
      <div>
        <van-switch v-model="checked" :loading="loading" @change="setIsOvert(userData.intention.intentionId)" />
      </div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import {
  getTimeSpan,
  getFloat,
  getParseAge,
  getParseExperience
} from "../../utils/index.js";
import File from "../../api/modules/userFile";
export default{
  data () {
    return {
      selfReview: "",
      getParseAge: getParseAge,
      getParseExperience: getParseExperience,
      getFloat: getFloat,
      pickerColumnsArr: [
        ["男", "女"],
        ["在职", "离职", "在校大学生"],
        ["随时", "一周内", "一个月内", "待定"],
        ["不限", "初中及以下", "高中", "中技/中专", "大专", "本科", "硕士", "博士"],
        ["不限", "全职", "兼职", "实习"],
        ["月薪", "年薪", "日薪"]
      ],
      //时间
      getTimeSpan: getTimeSpan,
      userData: {},
      checked: false,
      loading: false
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    isBirthDate() {
      return getParseAge(this.userData.birthDate);
    },
    isStartWorkYear() {
      return getParseExperience(this.userData.startWorkYear);
    }
  },
  methods: {
    // 开/关档案
    setIsOvert(id) {
      if (this.loading === true) return;
      this.loading = true;
      File.update_intention({
          intentionId: id,
          isOvert: this.checked,
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.$store.state.userInfo.token
      },(res) => {})
      this.loading = false;
    }  
  },

  onLoad() {
    this.$store.commit("setTitle", "我的简历");

    let data = {
      userId: this.$store.state.userInfo.userId,
      siteHierarchy: this.$store.state.configData.hierarchy,
      token: this.$store.state.userInfo.token
    };
    this.$toast.loading({
      mask: true,
      message: "加载中..."
    });
    // 用户档案
    File.user_archives(data, (res) => {
        if (res.code === 0) {
          this.userData = res.data;
          this.selfReview = this.userData.intention ? this.userData.intention.selfEvaluation : null;
          this.userData.photo === null ? 0 : this.userData.photo;
          this.userData.intention && this.userData.intention.isOvert
            ? (this.checked = true)
            : (this.checked = false);

          this.userData.education = this.pickerColumnsArr[3][
            this.userData.education
          ];
          this.userData.workState = this.pickerColumnsArr[1][
            this.userData.workState - 1
          ];
          this.userData.availableTime = this.pickerColumnsArr[2][
            this.userData.availableTime - 1
          ];

          if(this.userData.workUndergo && this.userData.workUndergo.length){
            let len = this.userData.workUndergo.length;
            for(let i = 0; i < len; i++){
              this.userData.workUndergo[i].startMonth = this.userData.workUndergo[i].startMonth.replace("-",".");
              this.userData.workUndergo[i].endMonth = this.userData.workUndergo[i].endMonth.replace("-",".");
            }
          };
          if(this.userData.eduUndergo && this.userData.eduUndergo.length){
            let len = this.userData.eduUndergo.length;
            for(let i = 0; i < len; i++){
              this.userData.eduUndergo[i].startMonth = this.userData.eduUndergo[i].startMonth.replace("-",".");
              this.userData.eduUndergo[i].endMonth = this.userData.eduUndergo[i].endMonth.replace("-",".");
            }
          };
          if(this.userData.trainUndergo && this.userData.trainUndergo.length){
            let len = this.userData.trainUndergo.length;
            for(let i = 0; i < len; i++){
              this.userData.trainUndergo[i].startMonth = this.userData.trainUndergo[i].startMonth.replace("-",".");
              this.userData.trainUndergo[i].endMonth = this.userData.trainUndergo[i].endMonth.replace("-",".");
            }
          };
        }
      })
      setTimeout(() => {
        this.$toast.clear();
      }, 500);
  }
}
</script>
<style lang="scss" scoped>
.userDetails {
  .txtBr {
    white-space: normal;
    word-break: break-all;
  }
  .ellipsis {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // padding-bottom: half(98);
  /deep/ .van-switch--on {
    background-color: #42b983;
  }
  font-size: half(24);
  .H30 {
    height: half(30);
  }
  .inline_block {
    display: inline-block;
  }
  .black666 {
    color: #666;
  }
  .flexNone {
    display: none;
  }
  .bg {
    background: #ccc !important;
  }
  .padding_b_20 {
    padding-bottom: half(20);
  }
  .padding_l_20 {
    padding-left: half(20);
  }
  .margin_t_20 {
    margin-top: half(20);
  }
  .margin_b_20 {
    margin-bottom: half(20);
  }
  .margin_l_20 {
    margin-left: half(20);
  }
  .margin_r_20 {
    margin-right: half(20);
  }
  .phone {
    color: #000;
  }
  .con_text1_sex {
    font-size: half(24);
    margin-left: half(6);
    // transform: scale3d(2);
    img {
      width: 100%;
    }
  }
  .edit_icon {
    font-size: half(26);
    position: relative;
    top: half(2);
  }
  .user_tag{
    background: #fff;
    margin: half(0) half(30) half(20) half(30);
    color: #666;
    font-size: half(28);
  }
  .user_info {
    font-size: half(28);
    background: #fff;
    height: 100%;
    .card{
      margin-bottom: half(10);
    }
    .user_info_title {
      position: relative;
      padding: half(30);
      .text_title {
        font-size: half(32);
        margin-left: half(0);
        position: relative;
        .title{
          margin-left: half(46);
        }
        .icon {
          position: absolute;
          top: half(5);
        }
        .edit {
          color: #666;
          font-size: half(28);
          margin-left: auto;
          float: right;
          // display: flex;
          // align-items: center;
        }
      }
    }
    .user_info_box.bgclr1{
      background-color: #F8EEDF;
    }
    .user_info_box{
      background-color: #DCF2E8;
      margin: half(6);
      padding: half(6);
      flex: 1;
      text-align: center;
    }
    .user_info_cont1 {
      width: 100%;
      display: flex;
      justify-content: center;
      padding:half(0) half(24);
    }
    .user_info_cont2 {
      padding-bottom: half(36);
      .workUndergo_box {
        padding-left: half(30);
        padding-right: half(30);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .edit_icon {
          margin-top: half(50);
        }
        .workUndergo_box_name {
          width: half(650);
          margin-top: half(8);
          margin-bottom: half(14);
          font-size: half(34);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .workUndergo_box_time {
          color: #666;
          width: half(650);
          margin-top: half(36);
          margin-bottom: half(8);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .text_t1{
          color: #666;
        }
        .text_t2{
          color: #666;
          font-size: half(24);
          margin-top: half(8);
        }
      }
      .user_info_cont2_box {
        padding-bottom: half(20);
        position: relative;
      }
      .round {
        width: half(22);
        height: half(22);
        border-radius: 50%;
        background: #42b983;
        display: inline-block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: half(-50);
        margin: auto;
      }
      .user_info_cont_text1 {
        font-size: falg(30);
      }
      .user_info_cont2_intro {
        margin-left: half(60);
        font-size: half(30);
        .user_info_cont2_intro_t1 {
          position: relative;
        }
        .user_info_cont2_intro_t3 {
          margin-bottom: half(30);
          font-size: half(28);
        }
        .user_info_cont2_intro_t4 {
          font-size: half(28);
        }
      }
    }
  }
  .list {
    font-size: half(24);
    background: #fff;
    .list_box {
      display: flex;
      padding: half(30) half(0);
      padding-left: half(30);
      padding-bottom: half(24);
      .con_img {
        width: half(100);
        height: half(100);
        border-radius: 100%;
        margin-right: half(20);
        img {
          width: 100%;
          width: 100%;
        }
      }
      .con_info {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        .con_text1 {
          width: 100%;
          display: flex;
          align-items: center;
          .con_text1_name {
            font-size: half(40);
            max-width: half(150);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .con_text2 {
          .con_text2_tag {
            color: #666;
            font-size: half(26);
            padding-right: half(20);
          }
        }
      }
    }
  }
  .isOpen {
    height: half(90);
    margin: half(40) 0;
    padding: 0 half(20);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .isOpen_left {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .isOpen_left_1 {
        font-size: half(32);
      }
      .isOpen_left_2 {
        font-size: half(24);
        color: #999;
      }
    }
  }
}
</style>
