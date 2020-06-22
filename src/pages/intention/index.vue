/**
*@author chao
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="intention">
    <van-cell-group class="cell-group">
      <van-cell center>
        <!-- 编辑小图标 -->
        <i class="iconfont input-icon icon-shuru" @click="isFocus0=true" v-if="getShowIconEditJob"></i>
        <i class="iconfont input-icon icon-shanchu" @click="isFocus0=true;intentionalJob=''" v-if="!getShowIconEditJob"></i>
        <!-- 编辑小图标 -->
        <input class="name-rg" @blur="activeEleJob=false" @focus="activeEleJob=true" :focus="isFocus0" type="text" v-model="intentionalJob" placeholder="请填写">
        <div class="van-cell-text">
          工作职位<span class="red">*</span></div>
      </van-cell>
      <picker
        mode="selector"
        @change="onFuncWorkNatureState"
        :range="workNatureColumns"
      >
        <van-cell is-link center>
            <div class="van-cell-text">
              工作性质<span class="red">*</span></div>
          <span class="selected">{{workNature}}</span>
        </van-cell>
      </picker>
      <van-cell is-link center :value="jobClassifyArrId.length > 0 ? '已选择' + jobClassifyArrId.length + '个' : ''" @click="isJobClassify = true">
        <div class="van-cell-text">
          工作职能<span class="red">*</span></div>
        <span v-if="jobClassifyArrId.length <= 0" class="unselected">请选择</span>
      </van-cell>
      <picker
        mode="region"
        @change="onAddressPickerClick"
        :value="region"
      >
        <van-cell is-link center>
          <div class="van-cell-text">
            工作地区<span class="red">*</span></div>
          <span class="selected">{{workAddress}}</span>
          <span v-if="!workAddress" class="unselected">请选择</span>
        </van-cell>
      </picker>
      <van-cell center>
        <!-- 编辑小图标 -->
        <i class="iconfont input-icon icon-shuru" @click="isFocus1=true" v-if="getShowIconEditPay"></i>
        <i class="iconfont input-icon icon-shanchu" @click="isFocus1=true;lowSalary=''" v-if="!getShowIconEditPay"></i>
        <!-- 编辑小图标 -->
        
        <input class="name-rg" @blur="onInputBlur" @focus="activeElePay=true" :focus="isFocus1" type="number" v-model="lowSalary" oninput="value=value.replace(/[^\d]/g,'')">
        <span v-if="!lowSalary" class="unselected">{{workNature === '兼职' ? '日薪' : '月薪'}}</span>
        <div class="van-cell-text">
          期望薪资<span class="red">*</span></div>
        
      </van-cell>
    </van-cell-group>
    <div class="evaluation-section">
      <div class="evaluation-header van-hairline--bottom">
        自我评价<span class="asterisk">*</span></div>
      <textarea @blur="onInputBlur" class="evaluation-content" maxlength="500" onchange="this.value=this.value.substring(0, 500)" onkeydown="this.value=this.value.substring(0, 500)" onkeyup="this.value=this.value.substring(0, 500)" v-model="selfEvaluation" placeholder="请输入自我评价（500字以内）"></textarea>
      <i class="iconfont input-icon textarea-input-icon icon-shuru"></i>
    </div>
    
    
    <div class="position-btn-bar  van-hairline--top">
      <div class="position-btn-pending">
        <div class="position-btn-editor van-hairline--right">
          <i class="iconfont customer-service-icon icon-kefuzixun"></i>
          客服</div>
        <div class="position-btn-empty"></div>
        <van-button class="bottom_btn_yes" type="primary" :loading="loading" @click="create_intention">保存</van-button>
        <!-- <div class="position-btn-publish">保存</div> -->
      </div>
    </div>

    <div>
      <transition name="fade">
        <div class="position-area-picker-mask" v-if="showAddressPicker"></div>
      </transition>
      <transition name="fade">
        <van-area class="position-area-picker" value="510100"  :columns-num="2" v-if="showAddressPicker" :area-list="areaList" @confirm="onAddressPickerConfirm" @cancel="onAddressPickerCancel" />
      </transition>
    </div>
    <van-popup v-model="workNatureState" position="bottom">
      <van-picker show-toolbar title="" :columns="workNatureColumns" @cancel="onCancelworkNature" @confirm="onConfirmworkNature" />
    </van-popup>

    <job-classify v-if="isJobClassify" :selectNum="3" :selectPropsData="jobClassifyArrId" @finishSelect="finishSelect"></job-classify>
    <van-toast id="van-toast" />
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
      activeEleJob: false,
      // 控制图标显示--期望薪资
      activeElePay: false,
      doc: document,
      // 工作性质弹出层
      workNatureColumns: ["不限", "全职", "兼职", "实习"],
      workNatureState: false,
      // 工作性质
      workNature: "不限",
      showCategoryChildrenPanel: false,
      // 工作职位
      intentionalJob: "",
      // 最低工资
      lowSalary: "",
      // 自我评价
      selfEvaluation: "",
      region: ['四川省', '成都市'],
      classifyData: [],
      loading: false,
      showAddressPicker: false,
      areaList: areaList,
      workAddress: "",
      province: "",
      city: "",
      // 工作职能
      jobClassifyArrId: [],
      isJobClassify: false
    }
  },
  computed: {
    getShowIconEditJob() {
      if ( this.intentionalJob.length > 0 && this.activeEleJob ) {
        return false;
      } else {
        return true;
      }
    },
    getShowIconEditPay() {
      if ( this.lowSalary.length > 0 && this.activeElePay ) {
        return false;
      } else {
        return true;
      }
    }
  },
  onload(e) {
    this.queryObj = e;
    this.$store.commit("setTitle", "求职意向");
    if(this.queryObj.intentionId != "undefined"){
      this.$toast.loading({
        mask: true,
        message: "加载中..."
      });
      File.query_intention({
          intentionId: this.queryObj.intentionId
      },(res) => {
          if (res.code === 0) {
            this.intentionalJob = res.data.intentionalJob;
            this.lowSalary = res.data.lowSalary;
            this.province = res.data.province;
            this.city = res.data.city;
            // this.district = res.data.district;
            this.workAddress = res.data.province + "-" + res.data.city;
            this.selfEvaluation = res.data.selfEvaluation;
            this.workNature = this.workNatureColumns[res.data.workNature];
            this.jobClassifyArrId = JSON.parse(res.data.jobClassifyIds);
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
  },
  methods: {
    finishSelect(list) {
      this.jobClassifyArrId = list;
      this.isJobClassify = false;
    },
    onInputBlur() {
      this.activeElePay = false;
    },
    // 工作性质
    onFuncWorkNatureState(data) {
      this.workNature = this.workNatureColumns[data.target.value];
    },

    onAddressPickerClick(data) {
      if(data){
        this.province = date.target.value[0];
        this.city = date.target.value[1];
        this.workAddress =
          (this.province ? this.province + "-" : "请") +
          (this.city ? this.city : "选择")
      }
    },
    onAddressPickerConfirm(value) {
      this.province = value[0].name;
      this.city = value[1].name;
      // this.district = value[2].name;
      this.workAddress = this.province + "-" + this.city;
      this.showAddressPicker = false;
    },
    onAddressPickerCancel() {
      this.showAddressPicker = false;
    },

    create_intention() {
      if (
        this.intentionalJob === "" ||
        this.province === "" ||
        this.city === "" ||
        this.jobClassifyArrId.length === 0 ||
        this.selfEvaluation === "" ||
        this.lowSalary === ""
      ) {
        this.$toast({
          message: "请输入完整的信息"
        });
        return;
      } else if(!(new RegExp(/^[0-9]*$/).test(this.lowSalary))) {
        this.$toast("期望薪资不合法!")
        return;
      }
      if (this.loading === true) return;
      this.loading = true;
      let arr = [];
      this.jobClassifyArrId.forEach(e => {
        arr.push(e);
      });
      if (this.queryObj.intentionId != "undefined") {
        File.update_intention({
            intentionalJob: this.intentionalJob,
            jobClassifyIds: JSON.stringify(arr),
            workNature: this.workNatureColumns.indexOf(this.workNature), // 工作性质【0: 不限1：全职；2：兼职；3：实习】
            salaryType: 1, // 薪资类型【1：月薪；2：年薪；3：日薪】
            lowSalary: this.lowSalary,
            province: this.province,
            city: this.city,
            // district: this.district,
            selfEvaluation: this.selfEvaluation,
            intentionId: this.queryObj.intentionId
        },(res) => {
            if (res.code === 0) {
              this.$toast({
                message: "修改成功"
              });
              wx.navigateBack({ delta: 1 });
            } else{
              this.$toast({
                message: res.msg
              });
            }
          },(error) => {})
          this.loading = false;
      } else {
        File.create_intention({
            intentionalJob: this.intentionalJob,
            jobClassifyIds: JSON.stringify(arr),
            workNature: this.workNatureColumns.indexOf(this.workNature), // 工作性质【0: 不限1：全职；2：兼职；3：实习】
            salaryType: 1, // 薪资类型【1：月薪；2：年薪；3：日薪】
            lowSalary: this.lowSalary,
            province: this.province,
            city: this.city,
            // district: this.district,
            selfEvaluation: this.selfEvaluation
        },(res) => {
            if (res.code === 0) {
              this.$toast({
                message: "创建成功"
              });
              wx.navigateBack({ delta: 1 });
              // this.$router.replace("/userDetails");
            } else{
              this.$toast({
                message: res.msg
              });
            }
          },(error) => {})
          this.loading = false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.red {
  color: red;
}
.bottom_btn_yes {
  width: half(300);
  background: #42b983;
  line-height: half(98);
  text-align: center;
  font-size: half(32);
  color: #fff;
}
.intention {
  min-height: 100%;
  background-color: #f2f2f2;
  color: #000;
  /deep/ {
    .van-cell{
      color: #666!important;
    }
    .van-hairline--top-bottom::after{
      border-width: 0;
    }
    .van-cell__value,.van-cell__title > input{
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
  .cell-group {
    margin-bottom: half(20);
    .telephone-rg {
      width: half(240);
    }
  }
  .evaluation-section {
    position: relative;
    font-size: half(32);
    background-color: #fff;
  }
  .evaluation-header{
    color: #666;
  }
  .evaluation-header,
  .evaluation-content {
    padding: half(30);
  }
  .evaluation-content {
    width: 100%;
    height: half(360);
    color: #000;
  }
  .textarea-input-icon {
    position: absolute;
    bottom: half(30);
    right: half(20);
  }
  .position-btn-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: half(32);
    color: #fff;
  }
  .position-btn-publish {
    padding: half(32) 0;
    text-align: center;
  }
  .position-btn-publish {
    background-color: #42b983;
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
    font-size: half(24);
  }
  .position-btn-empty,
  .position-btn-publish {
    flex: 1;
  }
}
</style>
