/**
*@author leo
*@dateTime 2018/8/14
*@description created
*/
<template>
        <div class="custom-swipe-cell">
            <div class="swipe-cell-box ">
                <div class="swipe-cell-main van-hairline--bottom"
                     @touchstart='onTouchStart'
                     @touchmove='onTouchMove'
                     @touchend='onTouchEnd'
                     :style="deleteSlider"
                >
                    <slot></slot>
                </div>
                <div class="delete-btn" ref='removeBtn' @click="onDeleteBtnClick(userId, toUser)">
                    删除
                </div>
            </div>

        </div>

</template>

<script>

export default {
  props: {
    toUser: {
      default: ""
    },
    userId: {
      default: ""
    }
  },
  data() {
    return {
      startX: 0, //触摸位置
      moveX: 0, //滑动时的位置
      disX: 0, //移动距离
      deleteSlider: "" //滑动时的效果,使用v-bind:style="deleteSlider"
    }
  },
  
  onDeleteBtnClick(userId, toUser) {
    if (userId && toUser) {
      this.$emit("onDelete", userId, toUser);
    }
  },

  onTouchStart(ev) {
    ev = ev || event;
    //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
    if (ev.touches.length == 1) {
      // 记录开始位置
      this.startX = ev.touches[0].clientX;
    }
  },

  onTouchMove(ev) {
    ev = ev || event;
    //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
    let wd = this.$refs.removeBtn.offsetWidth;
    if (ev.touches.length == 1) {
      // 滑动时距离浏览器左侧实时距离
      this.moveX = ev.touches[0].clientX;
      //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
      this.disX = this.startX - this.moveX;
      // 如果是向右滑动或者不滑动，不改变滑块的位置
      if (this.disX < 0 || this.disX == 0) {
        this.deleteSlider = "transform:translateX(0px)";
        // 大于0，表示左滑了，此时滑块开始滑动
      } else if (this.disX > 0) {
        //具体滑动距离我取的是 手指偏移距离*5。
        this.deleteSlider = "transform:translateX(-" + this.disX + "px)";
        // 最大也只能等于删除按钮宽度
        if (this.disX >= wd) {
          this.deleteSlider = "transform:translateX(-" + wd + "px)";
        }
      }
    }
  },

  onTouchEnd(ev) {
    ev = ev || event;
    let wd = this.$refs.removeBtn.offsetWidth;
    if (ev.changedTouches.length == 1) {
      let endX = ev.changedTouches[0].clientX;
      this.disX = this.startX - endX;
      //如果距离小于删除按钮一半,强行回到起点
      if (this.disX < wd / 2) {
        this.deleteSlider = "transform:translateX(0px)";
      } else {
        //大于一半 滑动到最大值
        this.deleteSlider = "transform:translateX(-" + wd + "px)";
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-swipe-cell {
  margin-bottom: half(1);
  transition: opacity 0.5s ease-out;
  &.fade-enter-to,
  &.fade-leave {
    opacity: 1;
  }
  &.fade-leave-to,
  &.fade-enter {
    opacity: 0;
  }
  .swipe-cell-box {
    position: relative;
    width: 100%;
    height: half(140);
    user-select: none;
    .swipe-cell-main,
    .delete-btn {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
    }
    .swipe-cell-main {
      z-index: 1;
      left: 0;
      background: #fff;
      transition: transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1) 0s;
    }
    .delete-btn {
      width: half(180);
      height: half(140);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: half(32);
      color: #fff;
      background-color: #fc703e;
    }
  }
}
</style>
