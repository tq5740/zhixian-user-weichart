/**
*@author chao
*@dateTime 2018/8/16
*@description created
*/
<template>
  <div class="addEducation">
    <van-cell-group class="pr">
      <van-cell :value="education" is-link @click="setEducation">
        
          <span class="van-cell-text">
            获得学历<span class="red">*</span></span>
          <span v-if="!education" class="unselected">请选择</span>
        
      </van-cell>
    </van-cell-group>
    <van-cell-group class="margin_t_20">
      <van-cell :value="startMonth" is-link @click="setEntranceYear">
        
          <span class="van-cell-text">
            入学年份<span class="red">*</span></span>
          <span v-if="!startMonth" class="unselected">请选择</span>
        
      </van-cell>
      <van-cell is-link @click="setGraduateYear">
        
          <span class="van-cell-text">
           毕业年份<span class="red">*</span></span>
          <span class="selected">{{endMonth}}</span>
      </van-cell>
      <van-cell center>
        <!-- 编辑小图标 -->
        <i class="iconfont input-icon icon-shuru" @click="isFocus0 = true" v-if="getShowIconEditSchool"></i>
        <i class="iconfont input-icon icon-shanchu" @click="isFocus0 = true;schoolName=''" v-if="!getShowIconEditSchool"></i>
        <!-- 编辑小图标 -->
        <input @blur='onInputBlur("School")' @focus="activeEleSchool=true" :focus="isFocus0" class="name-rg" type="text" placeholder="请填写" v-model="schoolName">
        <div class="van-cell-text">
          所在学校<span class="red">*</span></div>
        
      </van-cell>
      <van-cell center>
        <!-- 编辑小图标 -->
        <i class="iconfont input-icon icon-shuru" @click="isFocus1 = true" v-if="getShowIconEditMajor"></i>
        <i class="iconfont input-icon icon-shanchu" @click="isFocus1 = true;majorName=''" v-if="!getShowIconEditMajor"></i>
        <!-- 编辑小图标 -->
        <input @blur='onInputBlur("Major")' @focus="activeEleMajor=true" :focus="isFocus1" class="name-rg" type="text" placeholder="请填写" v-model="majorName">
        <div class="van-cell-text">所学专业</div>
        
      </van-cell>
    </van-cell-group>

    <van-cell-group class="margin_t_20">
      <van-cell center>
        
          <div class="van-cell-text">专业描述</div>
        
      </van-cell>
    </van-cell-group>
    <van-cell-group class="pr">
      <van-field @blur='onInputBlur("")' v-model="intro" maxlength="500" type="textarea" placeholder="输入专业描述（500字以内）" />
      <i class="iconfont input-icon pa_icon icon-shuru"></i>
    </van-cell-group>
    <van-popup v-model="isShow" position="bottom" :overlay="true">
      <div v-if="timeState === 1" class="van_datetime_picker">
        <van-picker :columns="columns" @cancel="cancel" @confirm="confirmEducation" :show-toolbar="true" />
      </div>
      <div v-if="timeState === 2">
        <van-datetime-picker v-model="currentDate" type="year-month" :min-date="minDate" :max-date="maxDate" :item-height="44" @cancel="cancel" @confirm="confirmEntranceYear" />
      </div>
      <div v-if="timeState === 3">
        <van-datetime-picker v-model="currentDate" type="year-month" :min-date="minDate" :max-date="maxDate" :item-height="44" @cancel="cancel(true)" @confirm="confirmGraduateYear" />
      </div>
    </van-popup>
    <div class="bottom_btn">
      <div class="bottom_btn_talk van-hairline--right">
        <a href="#" class="bottom_btn_talk">
          <i class="iconfont zx-svg bottom_btn_talk_icon icon-goutong"></i>
          <span class="bottom_btn_talk_txt">客服</span>
        </a>
      </div>
      <div class="bottom_btn_no"><div v-if="queryObj.eduUndergoId != 'undefined'" @click="onDelete">删除</div></div>
      <!-- <div class="bottom_btn_yes" @click="create_edu_undergo" :loading="true"> -->
        <van-button class="bottom_btn_yes" type="primary" :loading="loading" @click="create_edu_undergo">保存</van-button>
      <!-- </div> -->
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import setAddress from "../setAddress/index.vue";
import File from "../../api/modules/userFile";
export default {
  components: { setAddress },
  data() {
    return {
      isFocus0: false,
      isFocus1: false,
      queryObj: {},
      // 控制图标显示--所在学校
      activeEleSchool: false,
      // 控制图标显示--所学专业
      activeEleMajor: false,
      doc: document,
      loading: false,
      minHour: 10,
      maxHour: 20,
      minDate: new Date(1950, 1, 1),
      currentDate: new Date(),
      maxDate: new Date(),
      timeState: 0,
      isShow: false,
      // 学历
      education: "",
      // 入学年份
      startMonth: "",
      // 毕业年份
      endMonth: "至今",
      // 学校
      schoolName: "",
      // 专业
      majorName: "",
      // 专业描述
      intro: "",

      //------------地址
      columns: [
        "初中及以下",
        "高中",
        "中技/中专",
        "大专",
        "本科",
        "硕士",
        "博士"
      ]    
    }
  },
  computed: {
    getShowIconEditSchool() {
      if ( this.schoolName.length > 0 && this.activeEleSchool ) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditMajor() {
      if ( this.majorName.length > 0 && this.activeEleMajor ) {
        return false;
      } else {
        return true;
      }
    }  
  },
  methods: {
    onInputBlur(str) {
      if (str === "School") {
        this.activeEleSchool = false;
      } else if (str === "Major") {
        this.activeEleMajor = false;
      }
    },

    //-------------------------------地址
    // 删除
    onDelete(eduUndergoId) {
      this.$dialog
        .confirm({
          message: "确定删除吗？"
        })
        .then(res => {
          File.delete_edu_undergo({
              eduUndergoId: this.queryObj.eduUndergoId,
              siteHierarchy: this.$store.state.configData.hierarchy,
              token: this.$store.state.userInfo.token
          },(res) => {
            if (res.code === 0) {
              wx.navigateBack({ delta: 1 });
            } else {
              this.$toast(res.msg);
            }
          });
          // instance.close();
        },(error) => {
          // alert("取消");
        });
    },
    // 取消
    cancel(is = false) {
      if (is) {
        this.endMonth = "至今";
      }
      this.timeState = 0;
      this.isShow = false;
    },
    //  选择学历确定
    confirmEducation(e) {
      this.timeState = 0;
      this.isShow = false;
      this.education = e;
    },
    //  入学年份确定
    confirmEntranceYear(e) {
      this.timeState = 0;
      this.isShow = false;
      this.startMonth =
        e.getFullYear() + (e.getMonth() <= 8 ? "-0" : "-") + (e.getMonth() + 1);
    },
    //  入学毕业年份
    confirmGraduateYear(e) {
      this.timeState = 0;
      this.isShow = false;
      this.endMonth =
        e.getFullYear() + (e.getMonth() <= 8 ? "-0" : "-") + (e.getMonth() + 1);
    },
    // 选择学历
    setEducation() {
      this.timeState = 1;
      this.isShow = true;
    },
    // 选择入学年份
    setEntranceYear() {
      this.timeState = 2;
      this.isShow = true;
    },
    // 选择毕业年份
    setGraduateYear() {
      this.timeState = 3;
      this.isShow = true;
    },
    // 保存
    create_edu_undergo() {
      if (
        this.education === "" ||
        this.schoolName === "" ||
        this.startMonth === ""
      ) {
        this.$toast({
          message: "请输入完整的信息"
        });
        return;
      }else if(this.startMonth > this.endMonth){
        this.$toast({
          message: "毕业年份必须大于入学年份"
        });
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      if (this.queryObj.eduUndergoId != "undefined") {
        File.update_edu_undergo({
            startMonth: this.startMonth,
            endMonth: this.endMonth,
            schoolName: this.schoolName,
            majorName: this.majorName,
            intro: this.intro,
            education: this.columns.indexOf(this.education) + 1,
            eduUndergoId: this.queryObj.eduUndergoId,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        },(res) => {
            if (res.code === 0) {
              this.$toast({
                message: "修改成功"
              });
              wx.navigateBack({ delta: 1 });
              // this.$router.push("/education");
            }
          },(error) => {})
          this.loading = false;
      } else {
        File.create_edu_undergo({
            startMonth: this.startMonth,
            endMonth: this.endMonth,
            schoolName: this.schoolName,
            majorName: this.majorName,
            intro: this.intro,
            education: this.columns.indexOf(this.education) + 1,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        },(res) => {
            if (res.code === 0) {
              this.$toast({
                message: "创建成功"
              });
              wx.navigateBack({ delta: 1 });
              // this.$router.push("/education");
            }
          },(error) => {})
          this.loading = false;
      }
    }  
  },
  // 生命周期
  onLoad(e) {
    this.queryObj = e;
    this.$store.commit("setTitle", "教育经历");

    if (this.queryObj.eduUndergoId != "undefined") {
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      File.query_edu_undergo({
          eduUndergoId: this.queryObj.eduUndergoId,
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.$store.state.userInfo.token
      },(res) => {
          if (res.code === 0) {
            this.education = this.columns[res.data.education - 1];
            this.startMonth = res.data.startMonth;
            this.endMonth = res.data.endMonth;
            this.schoolName = res.data.schoolName;
            this.majorName = res.data.majorName;
            this.intro = res.data.intro;
          } else {
            this.$toast(res.msg);
          }
        })
        setTimeout(() => {
          this.$toast.clear();
        }, 500);
    }
  }
}
</script>
<style lang="scss" scoped>
.addEducation {
  background-color: #f2f2f2;
  /deep/ {
    .van-field__body {
      width: 100%;
    }
    .van-cell {
      background: #fff !important;
      color: #666!important;
    }
    .van-cell__value,.van-cell__title > input {
      color: #000!important;
    }
    .van-cell__right-icon{
      margin-left: half(22);
    }
  }
  .unselected{
    color: #999;
    position: absolute;
    right: half(76);
  }
  .pr {
    position: relative;
    top: -1px;
    .pa_icon {
      position: absolute;
      right: half(30);
      bottom: half(30);
    }
  }
  .red {
    color: red;
  }
  .margin_t_20 {
    margin-top: half(20);
  }
  .bottom_btn {
    height: half(98);
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 2;
    display: flex;
    .bottom_btn_yes,
    .bottom_btn_no {
      width: half(300);
      background: #42b983;
      line-height: half(98);
      text-align: center;
      font-size: half(32);
      color: #fff;
    }
    .bottom_btn_no {
      background: #fff;
      color: #42b983;
    }
    .bottom_btn_talk {
      width: half(150);
      height: half(98);
      font-size: half(24);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: half(4) half(0);
      .bottom_btn_talk_icon {
        width: half(48);
        height: half(48);
      }
      .bottom_btn_talk_txt {
        color: #42b983;
      }
    }
  }
}
</style>
