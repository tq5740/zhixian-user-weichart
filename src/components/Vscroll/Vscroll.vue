
<template>
  <section
    id="v-scroll"
    class="v-scroll"
    ref="vScroll"
  >
    <p
      class="commonTips"
      ref="tips"
      v-if="isCanFresh"
    >{{refreshTips}}</p>
    <slot></slot>
    <p class="commonTips">{{loadMoreTips}}</p>
  </section>
</template>
<script>
import { getScrollY } from "../../utils/index"; // getAppVersion,

export default {
  props: {
    totalPageNumber: {
      default: 0,
      type: Number
    },
    noMoreTips: {
      default: "没有更多数据了...",
      type: String
    },
    loadData: {
      default: function () {
        return new Promise((resolve, reject) => {
          resolve();
        });
      },
      type: Promise
    }
  },
  data() {
    return {
      refreshTips: "松开刷新...",
      loadMoreTips: "加载中...123",
      //定时器用any
      scrollTimer: null,
      upDateTimer: null,
      touchCancelTimer: null,
      rTimer: null,
      currentPageNumber: 1,
      // 判断一页显示不全自动加载第二页flag
      updateFlag: false,
      // 是否正在加载更多
      isLoadMore: false,
      // 是否可以fresh状态
      isCanFresh: false,
      isKeepAlive: false,
      // 是否处于刷新中
      isFreshing: false,
      // 是否为网络异常
      isError: false,
      //滚动的距离
      scrollTop: 0,
      // 初始触摸点
      startPos: Pos = {
        x: 0,
        y: 0
      },
      //
      endPos: Pos = {
        x: 0,
        y: 0
      },
      vScrollDom: null,
      domType: document.documentElement
    }
  },

// location.hostname === "localhost"
//   ? document.documentElement
//   : document.documentElement;
/**
 * 多个tab切换
 */
// @Watch("totalPageNumber")
change(newVal, old) {
  if (newVal || newVal === 0) {
    this.currentPageNumber = 1;
    this.isLoadMore = false;
    this.judgmentEmpty();
  }
},
activated() {
  if (this.isKeepAlive) {
    this.$nextTick(() => {
      this.$$init();
    });
  } else {
    this.isKeepAlive = true;
  }
},
// 生命周期开始
onLoad() {
  this.isKeepAlive = false;
  this.$nextTick(() => {
    this.$$init();
  });
},
methods: {
  updated() {
    // 监听如果第一页没有满屏自动请求下一页
    if (this.upDateTimer) clearTimeout(this.upDateTimer);
    if (!this.updateFlag) {
      this.upDateTimer = setTimeout(() => {
        let _clientHeight = document.documentElement.clientHeight;
        if (this.vScrollDom.clientHeight < _clientHeight) {
          if (this.judgmentEmpty(true)) {
            this.updateFlag = true;
          } else if (
            this.vScrollDom.clientHeight - _clientHeight < -80 &&
            !this.judgmentEmpty(true) &&
            !this.isLoadMore &&
            !this.isFreshing &&
            !this.isError
          ) {
            this._loadData();
          }
        }
      }, 16.7);
    }
  },
  scroll() {
    console.log("scroll")
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
    this.scrollTimer = setTimeout(async () => {
      // // 获取scrollTop与clientHeight
      this.scrollTop = getScrollY();
      let clientHeight = wx.getSystemInfoSync().windowHeight;
      // //判断是否加载中
      if (this.isLoadMore) return;
      // 判断是否到底
      if (
        this.domType.scrollHeight - this.scrollTop === clientHeight &&
        this.scrollTop !== 0 &&
        !this.judgmentEmpty(true) &&
        !this.isFreshing
      ) {
        this._loadData();
      }
    }, 16.7);
  },
  // 加载更多的方法
  _loadData() {
    this.isLoadMore = true;
    this.loadMoreTips = "加载中...";
    this.loadData()
      .then(() => {
        this.currentPageNumber++;
        this.judgmentEmpty();
        this.isError && (this.isError = false);
      })
      .catch(err => {
        // this.errorLog();
      })
      .finally(() => {
        this.isLoadMore = false;
      });
  },
  // 刷新的方法
  reFreshData() {
    this.refreshTips = "加载中...";
    this.isFreshing = true;
    this.loadData(1)
      .then(res => {
        this.currentPageNumber = 1;
        this.isError && (this.isError = false);
        let flag = this.judgmentEmpty(true);
        flag
          ? (this.loadMoreTips = this.noMoreTips)
          : (this.loadMoreTips = "加载中...");
        window.scrollTo(0, 0);
      })
      .catch(() => {
        // this.errorLog();
      })
      .finally(() => {
        let tipsRefs = this.$refs.tips;
        this.refreshTips = "";
        let height = tipsRefs.clientHeight;
        this.rTimer = setInterval(() => {

          tipsRefs.style.height = height-- + "px";

          if (tipsRefs.clientHeight <= 0) {
            this.isFreshing = false;
            this.isCanFresh = false;
            this.refreshTips = "松开刷新...";

            let basePx = parseFloat(document.documentElement.style.fontSize);

            tipsRefs.style.height = 30 / basePx + "rem";
            clearInterval(this.rTimer);
          }
        }, 10);
      });
  },
  errorLog() {
    this.loadMoreTips = "网络错误或未知异常";
    this.isError = true;
  },
  /**
   * @param {isNeed2return} 是否需要return
   * @return {isNeed2return && boolean}
   */
  judgmentEmpty(isNeed2return = false) {
    let _isEmpty =
      this.totalPageNumber === 0 ||
      this.currentPageNumber === this.totalPageNumber;
    if (isNeed2return) {
      if (_isEmpty) {
        this.changeTips();
      }
      return _isEmpty;
    }
    // 暂时不用三元 可能会拓展,
    if (_isEmpty) {
      this.changeTips();
    } else {
      this.loadMoreTips = "加载中...";
    }
  },
  changeTips() {
    if (this.isError) {
      this.loadMoreTips = `网络错误或未知异常`;
    } else {
      this.loadMoreTips = this.noMoreTips;
    }
  },
  //记录初始触摸点
  touchStart(e) {
    // 不能使用阻止默认来兼容安卓不触发end事件 否则scoll会无效
    this.startPos.y = e.changedTouches[0].pageY;
  },
  touchMove(e) {
    this.endPos.y = e.changedTouches[0].pageY;
    let moveY = this.endPos.y - this.startPos.y;

    if (this.scrollTop < 30) {
      if (moveY > 20) {
        if (this.isCanFresh) return;
        this.isCanFresh = true;
      } else {
        this.isCanFresh = false;
      }
    } else {
      this.isCanFresh = false;
    }
  },
  touchEnd(e) {
    if (this.isFreshing) return;

    if (this.isCanFresh && this.scrollTop < 20 && !this.isLoadMore) {
      this.reFreshData();
    }
  },
  touchCancel(e) {
    //使用touchCancel来解决安卓无法触发touchend
    if (this.touchCancelTimer) clearTimeout(this.touchCancelTimer);
    this.touchCancelTimer = setTimeout(() => {
      this.touchEnd(e);
    }, 200);
  },
  $$init() {
    this.vScrollDom = document.getElementById("v-scroll");
    document.addEventListener("scroll", this.scroll, false);
    this.vScrollDom.addEventListener("touchstart", this.touchStart, false);
    this.vScrollDom.addEventListener("touchmove", this.touchMove, false);
    this.vScrollDom.addEventListener("touchend", this.touchEnd, false);
    if (getAppVersion() === "android") {
      this.vScrollDom.addEventListener("touchcancel", this.touchCancel);
    }
  },
  $$destroyed() {
    document.removeEventListener("scroll", this.scroll);
    document.removeEventListener("touchstart", this.touchStart);
    document.removeEventListener("touchmove", this.touchMove);
    document.removeEventListener("touchend", this.touchEnd);
    if (getAppVersion() === "android") {
      this.vScrollDom.removeEventListener("touchcancel", this.touchCancel);
    }
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    if (this.upDateTimer) clearTimeout(this.upDateTimer);
    if (this.touchCancelTimer) clearTimeout(this.touchCancelTimer);
    if (this.rTimer) clearTimeout(this.rTimer);
  }  
},

// beforeDestroy() {
//   this.$$destroyed();
// },

deactivated() {
  this.$$destroyed();
}


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .commonTips {
    font-size: half(26);
    color: #555;
    text-align: center;
    height: half(60);
    line-height: half(60);
    // padding: half(20) 0;
  }
</style>
