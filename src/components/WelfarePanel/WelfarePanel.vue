<template>
  <div class="welfare-panel-wrapper">
          <div class="welfare-mask"  v-if="show"></div>
          <div class="welfare-panel"  v-if="show">
              <div class="welfare-header van-hairline--bottom">
                  <div class="welfare-left-btn" @click="onWelfareCancel">取消</div>
                  <div class="welfare-right-btn" @click="onWelfareConfirm">确定</div>
              </div>
              <ul class="welfare-body">
                  <li class="welfare-item-li" :class="{'active': tempArr.indexOf(key) > -1}" v-for="(item, key) in welfareItemsArr" :key="item" @click="clickWelfareItem(key)">{{item}}</li>
              </ul>
          </div>
  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      welfareItemsArr: [
        "五险一金",
        "六险一金",
        "免费班车",
        "专业培训",
        "绩效奖金",
        "年终奖金",
        "定期体检",
        "餐饮补贴",
        "节日福利",
        "生日福利",
        "员工旅游",
        "股票期权",
        "交通补贴",
        "通讯补贴"
      ],
      tempArr: []
    }
  },
  
  // 生命周期
  onWelfareCancel() {
    this.tempArr = [];
    this.$emit("cancel");
  },
  onWelfareConfirm() {
    this.$emit("confirm", this.tempArr.slice(0));
  },
  clickWelfareItem(key) {
    const tempArr = this.tempArr;
    const hasValue = tempArr.indexOf(key);
    if (hasValue > -1) {
      tempArr.splice(hasValue, 1);
    } else {
      if (tempArr.length > 7) return;
      tempArr.push(key);
    }
  }
}
</script>
