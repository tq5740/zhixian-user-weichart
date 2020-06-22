<template>
  <div class="index">
    <home v-if="isShowHome"></home>
    <position-list v-if="isShowPositionList"></position-list>
    <search v-if="isShowSearch"></search>
    <news v-if="isShowNews"></news>
    <mine v-if="isShowMine"></mine>

    <!-- <login v-if="isShowLogin"></login> -->
    <bottom-menu></bottom-menu>
  </div>
</template>

<script>
import Home from '../home/index'
import PositionList from '../positionList/index'
import Search from '../search/index'
import News from '../news/index'
import Mine from '../mine/index'

// import Login from '../login/index'

import BottomMenu from '../../components/BottomMenu/BottomMenu'
export default {
  components: {
    Home,
    PositionList,
    Search,
    News,
    Mine,
    // Login,
    BottomMenu
  },
  computed: {
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
  }
}
</script>
<style lang="scss" scoped>
.index{
  min-height:100%;
  background:#f2f2f2;
}
</style>