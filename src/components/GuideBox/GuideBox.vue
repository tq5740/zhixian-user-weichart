/**
*@author leo
*@dateTime 2018/8/14
*@description created
*/
<template>
      
          <div class="guide-box" v-if="showGuideBox">
              <div class="guide-mask"  @click="onGuideBtnClick" ></div>
              <div class="tip-box">
                  <div class="tip-circle" ></div>
                  <div class="tip-subject-panel">
                      <div class="tip-subject" v-html="tipContent"></div>
                      <div class="guide-btn" @click="onGuideBtnClick" >{{btnValue}}</div>
                  </div>
              </div>
          </div>
</template>

<script>

export default{
  methods: {
    handleStatus(newVal) {
      if (!newVal) {
        document.getElementById("app").className = "";
      }
    },
    overFlowBodyTag() {
      if (this.showGuideBox) {
        document.getElementById("app").className = "overflow";
      }
    },
    onGuideBtnClick() {
      this.$emit("onGuideBtnClick");
    }
  },
  onLoad() {
    this.overFlowBodyTag();
  }
}
</script>
<style lang="scss" scoped>
.guide-panel {
}
</style>
