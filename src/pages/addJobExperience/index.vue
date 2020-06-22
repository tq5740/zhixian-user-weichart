/**
*@author chao
*@dateTime 2018/8/16
*@description created
*/
<template>
  <div class="addJobExperiences">
    <div class="addJobExperiences-box">
      <van-cell center>
        <!-- 编辑小图标 -->
        <i class="iconfont input-icon icon-shuru" @click="isFocus0=true" v-if="getShowIconEditName"></i>
        <i class="iconfont input-icon icon-shanchu" @click="isFocus0=true;companyName=''" v-if="!getShowIconEditName"></i>
        <!-- 编辑小图标 -->
        <input class="name-rg" type="text" @blur="activeEleName=false" @focus="activeEleName=true" :focus="isFocus0" placeholder="请填写" v-model="companyName">
        <div class="van-cell-text">
          公司名称<span class="red">*</span></div>
        
      </van-cell>
      <van-cell-group class="margin_t_20">
        <van-cell :value="startMonth" is-link @click="setEntranceYear">
          
            <span class="van-cell-text">
              入职日期<span class="red">*</span></span>
            <span v-if="!startMonth" class="unselected">请选择</span>
          
        </van-cell>
        <van-cell is-link @click="setGraduateYear">
          
            <span class="van-cell-text">
              离职日期<span class="red">*</span></span>
            <span class="selected">{{endMonth}}</span>
          
        </van-cell>
        <van-cell :value="jobClassifyObj.jobClassifyName" is-link  @click="isJobClassify = true">
          
            <span class="van-cell-text">
            工作职能<span class="red">*</span></span>
            <span v-if="!jobClassifyObj.jobClassifyName" class="unselected">请选择</span>
          
        </van-cell>
        <van-cell center>
          <!-- 编辑小图标 -->
          <i class="iconfont input-icon icon-shuru" @click="isFocus1=true" v-if="getShowIconEditPoat"></i>
          <i class="iconfont input-icon icon-shanchu" @click="isFocus1=true;orientation=''" v-if="!getShowIconEditPoat"></i>
          <!-- 编辑小图标 -->
          <input @blur="onInputBlur('Post')" @focus="activeElePost=true" :focus="isFocus1" class="name-rg" type="text" placeholder="请填写" v-model="orientation">
          <div class="van-cell-text">
            所在职位<span class="red">*</span></div>

        </van-cell>
        <van-cell center>
          <!-- 编辑小图标 -->
          <i class="iconfont input-icon icon-shuru" @click="isFocus2=true" v-if="getShowIconEditSection"></i>
          <i class="iconfont input-icon icon-shanchu" @click="isFocus2=true;department=''" v-if="!getShowIconEditSection"></i>
          <!-- 编辑小图标 -->
          <input @blur="onInputBlur('Section')" @focus="activeEleSection=true" :focus="isFocus2" class="name-rg" type="text" placeholder="请填写" v-model="department">
          <div class="van-cell-text">所在部门</div>
          
        </van-cell>
      </van-cell-group>

      <van-cell-group class="margin_t_20">
        <van-cell center>
          
            <div class="van-cell-text">
              工作描述<span class="red">*</span></div>
          
        </van-cell>
      </van-cell-group>
      <van-cell-group class="pr">
        <van-field @blur="onInputBlur('')" v-model="intro" maxlength="500" type="textarea" placeholder="输入工作描述（500字以内）" />
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
        <div class="bottom_btn_no"><div v-if="queryObj.workUndergoId != 'undefined'" @click="onDelete">删除</div></div>
        <van-button class="bottom_btn_yes" type="primary" :loading="loading" @click="create_work_undergo">保存</van-button>
      </div>
    </div>
    <job-classify v-if="isJobClassify" :selectNum="1" :selectOnePropsData="jobClassifyObj" @finishSelect="finishSelect"></job-classify>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import areaList from "../../utils/area";
import File from "../../api/modules/userFile";
import JobClassify from "../../components/JobClassify/JobClassify.vue";

export default {
  components: { JobClassify },
  data() {
    return {
      queryObj: {},
      isFocus0: false,
      isFocus1: false,
      isFocus2: false,
      // 控制图标显示--公司名称
      activeEleName: false,

      // 控制图标显示--所在职位
      activeElePost: false,

      // 控制图标显示--所在部门
      activeEleSection: false,

      doc: document,

      // 生命周期
      minHour: 10,
      maxHour: 20,
      minDate: new Date(1950, 1, 1),
      currentDate: new Date(),
      maxDate: new Date(),
      timeState: 0,
      isShow: false,
      // 入职日期
      startMonth: "",
      // 离职日期
      endMonth: "至今",
      // 公司名称
      companyName: "",
      // 工作职能
      jobClassifyObj: {},
      isJobClassify: false,
      // 所在职位
      orientation: "",

      // 所在部门
      department: "",
      // 工作描述
      intro: "",
      loading: false
    }
  },
  
  computed: {
    getShowIconEditName() {
      if ( this.companyName.length > 0 && this.activeEleName ) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditPoat() {
      if ( this.orientation.length > 0 && this.activeElePost ) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditSection() {
      if ( this.department.length > 0 && this.activeEleSection ) {
        return false;
      } else {
        return true;
      }
    }  
  },
  methods: {
    finishSelect(data) {
      this.jobClassifyObj = data;
      this.isJobClassify = false;
      this.jobClassifyId = data.jobClassifyId;
    },
    onInputBlur(str) {
      if (str === "Post") {
        this.activeElePost = false;
      } else if (str === "Section") {
        this.activeEleSection = false;
      }
    },

    // 删除
    onDelete(workUndergoId) {
      this.$dialog
        .confirm({
          message: "确定删除吗？"
        })
        .then(res => {
          File.delete_work_undergo({
            workUndergoId: this.queryObj.workUndergoId,
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
    //  入职日期确定
    confirmEntranceYear(e) {
      this.timeState = 0;
      this.isShow = false;
      this.startMonth =
        e.getFullYear() + (e.getMonth() <= 8 ? "-0" : "-") + (e.getMonth() + 1);
    },
    //  入学离职日期
    confirmGraduateYear(e) {
      this.timeState = 0;
      this.isShow = false;
      this.endMonth =
        e.getFullYear() + (e.getMonth() <= 8 ? "-0" : "-") + (e.getMonth() + 1);
    },
    // 选择入职日期
    setEntranceYear() {
      this.timeState = 2;
      this.isShow = true;
    },
    // 选择离职日期
    setGraduateYear() {
      this.timeState = 3;
      this.isShow = true;
    },

    // 保存
    create_work_undergo() {
      console.log(this.jobClassifyObj.jobClassifyName);
      if (
        !this.companyName ||
        !this.startMonth ||
        !this.endMonth ||
        !this.jobClassifyObj.jobClassifyName ||
        !this.orientation ||
        !this.intro
      ) {
        this.$toast({
          message: "请输入完整的信息"
        });
        return;
      }else if(this.startMonth > this.endMonth){
        this.$toast({
          message: "离职日期必须大于入职日期"
        });
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      if (this.queryObj.workUndergoId != "undefined") {
        File.update_work_undergo({
            companyName: this.companyName,
            startMonth: this.startMonth,
            endMonth: this.endMonth,
            jobClassifyId: this.jobClassifyObj.jobClassifyId,
            orientation: this.orientation,
            department: this.department,
            intro: this.intro,
            workUndergoId: this.queryObj.workUndergoId,
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
        File.create_work_undergo({
            companyName: this.companyName,
            startMonth: this.startMonth,
            endMonth: this.endMonth,
            jobClassifyId: this.jobClassifyObj.jobClassifyId,
            orientation: this.orientation,
            department: this.department,
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
    this.$store.commit("setTitle", "工作经历");

    if (this.queryObj.workUndergoId != "undefined") {
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      File.query_work_undergo({
        workUndergoId: this.queryObj.workUndergoId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.$store.state.userInfo.token
      },(res) => {
          if (res.code === 0) {
            this.companyName = res.data.companyName;
            this.startMonth = res.data.startMonth;
            this.endMonth = res.data.endMonth;
            this.jobClassifyObj.jobClassifyName = res.data.jobClassifyName;
            this.jobClassifyObj.jobClassifyId = res.data.jobClassifyId;
            this.orientation = res.data.orientation;
            this.department = res.data.department;
            this.intro = res.data.intro;
          } else {
            this.$toast(res.msg);
          }
        })
        setTimeout(() => {
          this.$toast.clear();
        }, 500);
  }

  },
  onShow() {
    this.isJobClassify = false;
  }
}
</script>
<style lang="scss" scoped>
.addJobExperiences {
  background-color: #f2f2f2;
  .addJobExperiences-box{
    /deep/ {
      .van-field__body {
        width: 100%;
      }
      .van-cell {
        background: #fff !important;
        color: #666!important;
      }
      .van-cell__value{
        color: #000!important;
      }
      .van-cell__title > input{
        color: #000!important;
      }
      .van-cell__right-icon{
        margin-left: half(22);
      }
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
  .position-category-panel,
  .position-category-children-panel {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background-color: #fff;
    transition: all 0.2s ease-out;
  }
  .position-category-children-panel {
    z-index: 2;
  }
  .position-category-panel {
    z-index: 2;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .position-category-wrap .top-btn-bar {
    padding-top: half(30);
  }
  .position-category-wrap {
    padding-left: half(30);
  }
  .top-btn {
    display: inline-block;
    padding: half(24) half(48);
    font-size: half(34);
    border: 1px solid #c7c7c7;
    border-radius: half(8);
  }
  .position-category-header {
    font-size: half(40);
    padding: half(30) half(30) half(30) 0;
  }
  .chosen-item-panel {
    padding: half(40) 0 0 0;
    margin-bottom: half(-20);
    font-size: half(32);
  }
  .chosen-item-header {
    padding-bottom: half(40);
  }
  .chosen-item-ul {
    display: flex;
    flex-wrap: wrap;
    font-size: half(28);
  }
  .chosen-item-li {
    position: relative;
    padding: half(14) half(30);
    margin: 0 half(40) half(30) 0;
    border-radius: half(30);
    background-color: #f2f2f2;
  }
  .close-icon {
    position: absolute;
    right: half(-10);
    top: half(-10);
    width: half(30);
    height: half(30);
    border-radius: 50%;
  }
}
</style>
