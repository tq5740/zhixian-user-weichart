/**
*@author chao
*@dateTime 2018/8/16
*@description created
*/
<template>
  <div class="addTrainExperience">
    <van-cell-group>
      <van-cell :value="startMonth" is-link @click="setEntranceYear">
        
          <span class="van-cell-text">
            开始时间<span class="red">*</span></span>
          <span v-if="!startMonth" class="unselected">请选择</span>
        
      </van-cell>
      <van-cell is-link @click="setGraduateYear">
        
          <span class="van-cell-text">
            截止时间<span class="red">*</span></span>
        <span class="selected">{{endMonth}}</span>
      </van-cell>
      <van-cell center>
        <!-- 编辑小图标 -->
        <i class="iconfont input-icon icon-shuru" @click="isFocus0=true" v-if="getShowIconEditOrgan"></i>
        <i class="iconfont input-icon icon-shanchu" @click="isFocus0=true;institutionName=''" v-if="!getShowIconEditOrgan"></i>
        <!-- 编辑小图标 -->
        <input @blur='onInputBlur("Organ")' @focus="activeEleOrgan=true" :focus="isFocus0" class="name-rg" type="text" placeholder="请填写" v-model="institutionName">
        <div class="van-cell-text">
          培训机构<span class="red">*</span></div>
        
      </van-cell>
      <van-cell center>
        <!-- 编辑小图标 -->
          <i class="iconfont input-icon icon-shuru" @click="isFocus1=true" v-if="getShowIconEditProject"></i>
          <i class="iconfont input-icon icon-shanchu" @click="isFocus1=true;project=''" v-if="!getShowIconEditProject"></i>
          <!-- 编辑小图标 -->
          
          <input @blur='onInputBlur("Project")' @focus="activeEleProject=true" :focus="isFocus1" class="name-rg" type="text" placeholder="请填写" v-model="project">
          <div class="van-cell-text">
           培训项目 <span class="red">*</span></div>
        
      </van-cell>
    </van-cell-group>

    <van-cell-group class="margin_t_20">
      <van-cell center>
        
          <div class="van-cell-text">
              培训描述<span class="red">*</span></div>
        
      </van-cell>
    </van-cell-group>
    <van-cell-group class="pr">
      <van-field @blur='onInputBlur("")' v-model="intro"  maxlength="500" type="textarea" placeholder="输入培训描述（500字以内）" />
      <i class="iconfont input-icon pa_icon icon-shuru"></i>
    </van-cell-group>
    <van-popup v-model="isShow" position="bottom" :overlay="true">
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
      <div class="bottom_btn_no"><div v-if="queryObj.trainUndergoId != 'undefined'" @click="onDelete">删除</div></div>
      <!-- <div class="bottom_btn_yes">保存</div> -->
      <van-button class="bottom_btn_yes" type="primary" :loading="loading" @click="create_train_undergo">保存</van-button>
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
  data () {
    return {
      queryObj: {},
      isFocus0: false,
      isFocus1: false,
      // 控制图标显示--培训机构
      activeEleOrgan: false,
      // 控制图标显示--培训项目
      activeEleProject: false,
      doc: document,
      // 生命周期
      minHour: 10,
      maxHour: 20,
      minDate: new Date(1950, 1, 1),
      currentDate: new Date(),
      maxDate: new Date(),
      timeState: 0,
      isShow: false,
      // 开始时间
      startMonth: "",
      // 截止年份
      endMonth: "至今",
      // 培训机构
      institutionName: "",
      // 培训项目
      project: "",
      // 培训描述
      intro: "",
      loading: false
    }
  },
  computed: {
    getShowIconEditOrgan() {
      if ( this.institutionName.length > 0 && this.activeEleOrgan ) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditProject() {
      if ( this.project.length > 0 && this.activeEleProject ) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    onInputBlur(str) {
      if (str === "Organ") {
        this.activeEleOrgan = false;
      } else if (str === "Project") {
        this.activeEleProject = false;
      }
    },
    //-------------------------------地址
    // 删除
    onDelete(trainUndergoId) {
      this.$dialog
        .confirm({
          message: "确定删除吗？"
        })
        .then(res => {
          File.delete_train_undergo({
              trainUndergoId: this.queryObj.trainUndergoId,
              siteHierarchy: this.$store.state.configData.hierarchy,
              token: this.$store.state.userInfo.token
          }).then(res => {
            if (res.code === 0) {
              wx.navigateBack({ delta: 1 });
            } else {
              this.$toast(res.msg);
            }
          });
          // instance.close();
        })
        .catch(() => {
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
    //  开始时间确定
    confirmEntranceYear(e) {
      this.timeState = 0;
      this.isShow = false;
      this.startMonth =
        e.getFullYear() + (e.getMonth() <= 8 ? "-0" : "-") + (e.getMonth() + 1);
    },
    //  截止时间年份
    confirmGraduateYear(e) {
      this.timeState = 0;
      this.isShow = false;
      this.endMonth =
        e.getFullYear() + (e.getMonth() <= 8 ? "-0" : "-") + (e.getMonth() + 1);
    },
    // 选择开始时间
    setEntranceYear() {
      this.timeState = 2;
      this.isShow = true;
    },
    // 选择截止年份
    setGraduateYear() {
      this.timeState = 3;
      this.isShow = true;
    },
    // 保存
    create_train_undergo() {
      if (
        this.endMonth === "请选择" ||
        this.startMonth === "请选择" ||
        this.institutionName === "" ||
        this.project === "" ||
        this.intro === ""
      ) {
        this.$toast({
          message: "请输入完整的信息"
        });
        return;
      }else if(this.startMonth > this.endMonth){
        this.$toast({
          message: "截止日期必须大于开始日期"
        });
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      if (this.queryObj.trainUndergoId != "undefined") {
        File.update_train_undergo({
            startMonth: this.startMonth,
            endMonth: this.endMonth,
            institutionName: this.institutionName,
            project: this.project,
            intro: this.intro,
            trainUndergoId: this.queryObj.trainUndergoId,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        },(res) => {
            if (res.code === 0) {
              this.$toast({
                message: "修改成功"
              });
              wx.navigateBack({ delta: 1 });
            }
          },(error) => {})
          this.loading = false;
      } else {
        File.create_train_undergo({
            startMonth: this.startMonth,
            endMonth: this.endMonth,
            institutionName: this.institutionName,
            project: this.project,
            intro: this.intro,
            siteHierarchy: this.$store.state.configData.hierarchy,
            token: this.$store.state.userInfo.token
        },(res) => {
            if (res.code === 0) {
              this.$toast({
                message: "创建成功"
              });
              wx.navigateBack({ delta: 1 });
            }
          },(error) => {})
          this.loading = false;
      }
    }  
  },
  onLoad(e) {
    this.queryObj = e;
    this.$store.commit("setTitle", "培训经历");
    if (this.queryObj.trainUndergoId != "undefined") {
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      File.query_train_undergo({
          trainUndergoId: this.queryObj.trainUndergoId,
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.$store.state.userInfo.token
      },(res) => {
          if (res.code === 0) {
            this.startMonth = res.data.startMonth;
            this.endMonth = res.data.endMonth;
            this.institutionName = res.data.institutionName;
            this.project = res.data.project;
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
.addTrainExperience {
  background-color: #f2f2f2;
  /deep/{
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
        font-size: half(48);
      }
      .bottom_btn_talk_txt {
        color: #42b983;
      }
    }
  }
}
</style>
