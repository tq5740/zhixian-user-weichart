<template>
  <div class="height_98">
    <div class="bottom_menu height_98 van-hairline--top">
      <div class="bottom_menu_home" @click="homeTo('/')">

        <i class="iconfont home_icon_N_select icon-shouye_xuanzhong" v-if="isShowHome"></i>
        <i class="iconfont home_icon_N icon-shouye" v-if="!isShowHome"></i>

        <span class="home_icon_T" :class="{primary: isShowHome}">首页</span>
      </div>
      <div class="bottom_menu_home" @click="homeTo('/positionList')">
        <i class="iconfont home_icon_N_select icon-zhiwei_xuanzhong" v-if="isShowPositionList"></i>
        <i class="iconfont home_icon_N icon-zhiwei" v-if="!isShowPositionList"></i>
        <span class="home_icon_T" :class="{primary: isShowPositionList}">职位</span>
      </div>
      <div class="bottom_menu_seek" @click="homeTo('/search')">
        <i class="iconfont home_icon_N_select icon-sousuo_xuanzhong" v-if="isShowSearch"></i>
        <i class="iconfont home_icon_N icon-sousuo1" v-if="!isShowSearch"></i>
        <span class="home_icon_T" :class="{primary: isShowSearch}">搜索</span>
      </div>
      <div class="bottom_menu_info" @click="homeTo('/news')">
        <div class="news-bar-container">
          <i class="iconfont home_icon_N_select icon-xiaoxi_xuanzhong" v-if="isShowNews"></i>
          <i class="iconfont home_icon_N icon-xiaoxi" v-if="!isShowNews"></i>
          <div class="news-active-icon" v-if="isShowNewsActiveIcon"></div>
        </div>
        <span class="home_icon_T news-text" :class="{primary: isShowNews}">消息</span>
      </div>
      <div class="bottom_menu_mi" @click="homeTo('/mine')">
        <i class="iconfont home_icon_N_select icon-wode_xuanzhong" v-if="isShowMine || isShowLogin"></i>
        <i class="iconfont home_icon_N icon-wode" v-if="!isShowMine && !isShowLogin"></i>
        <span class="home_icon_T" :class="{primary: isShowMine || isShowLogin}">我的</span>
      </div>
      <div class="mine-active-icon" v-if="isNewShow">
        {{mineNewsWrods}}
        <i class="iconfont newsClose icon-cha" @click="newsClose"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { create } from 'domain';
export default {
  data() {
    return {
      isActive: "",
      mineNewsWrods: "您有新的面试邀请",
      isNewShow: false
    }
  },
  computed: {
    isShowNewsActiveIcon() {
      let temp = 0;
      const newsListArr = this.$store.state.newsListArr;
      const len = newsListArr.length;
      for (let i = 0; i < len; i++) {
        temp += newsListArr[i].unread;
      }
      return !!temp;
    },
    isShowHome() {
      return this.$store.state.active === "/" ? true : false;
    },
    isShowPositionList() {
      return this.$store.state.active === "/positionList" ? true : false;
    },
    isShowSearch() {
      return this.$store.state.active === "/search" ? true : false;
    },
    isShowNews() {
      return this.$store.state.active === "/news" ? true : false;
    },
    isShowMine() {
      return this.$store.state.active === "/mine" ? true : false;
    }
    // isShowLogin() {
    //   return this.$store.state.active === "/login" ? true : false;
    // }
  },
  methods: {
    homeTo(url) {
      // if (url === "/mine") {
      //   if (!this.$store.state.userInfo) {
      //     this.$store.commit("setMenu", "/login");
      //     return;
      //   }
      // }
      this.$store.commit("setMenu", url);
    }
  }
}
</script>
<style lang="scss" scoped>
  .home_icon_N_select {
    color: rgb(66, 185, 131);
  }
  .bottom_menu {
    position: fixed;
    z-index: 1;
    bottom: 0;
    height: half(98);
    width: 100%;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    .news-text {
      position: relative;
      top: half(-3);
    }
    .news-bar-container {
      position: relative;
      top: half(2);
    }
    .news-active-icon {
      position: absolute;
      top: 0;
      right: half(-4);
      width: half(18);
      height: half(18);
      border-radius: 50%;
      background-color: #fc703e;
    }
    .mine-active-icon {
      position: absolute;
      background: rgba($color: #000, $alpha: 0.7);
      background-size: contain;
      width: half(300);
      height: half(74);
      right: half(6);
      border-radius: half(10);
      top: half(-84);
      color: #fff;
      font-size: half(26);
      line-height: half(72);
      text-align: center;
    }
    .mine-active-icon::after {
      content: "";
      width: 0;
      height: 0;
      border: half(10) transparent solid;
      border-top: half(10) rgba($color: #000, $alpha: 0.7) solid;
      position: absolute;
      bottom: half(-20);
      right: half(58);
    }
    .primary {
      color: #42b983;
    }
    .bottom_menu_home,
    .bottom_menu_info,
    .bottom_menu_seek,
    .bottom_menu_mi {
      flex: 1;
      display: flex;
      justify-content: center;
      font-size: half(20);
      align-items: center;
      flex-direction: column;
      height: 100%;
      .home_icon_N,
      .home_icon_N_select {
        font-size: half(45);
      }
    }
    .bottom_menu_home {
      align-items: center;
      flex-direction: column;
    }

    .newsClose {
      width: half(20);
      height: half(20);
      padding-left: half(12);
    }
    .margin_t_20 {
      margin-top: half(20);
    }
  }
</style>
