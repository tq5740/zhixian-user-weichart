<template>
  <div class="index">
    <div class="GPS_box van-hairline--bottom">
      <div class="left_box" @click="onLocationClick">
        <i class="iconfont zx-svg home_icon_N icon-dingwei_1"></i>
        <span class="left_box_t">{{locationName}}</span>
      </div>
      <div class="search-box van-hairline--left" @click="onSearchClick">
        <i class="iconfont search-icon icon-sousuo"></i>
      </div>
    </div>

    <van-button type="primary">按钮</van-button>
    <van-search class="van-hairline--bottom" v-model="searchValue" placeholder="请输入关键词进行搜索" use-action-slot @search="onSearch">
      <div slot="action" @click="onSearch">搜搭嘎大概索</div>
    </van-search>

    <i aria-hidden="true" class="iconfont icon-kefurexian"></i>
  </div>
</template>


<style lang="scss" scoped>
.GPS_box {
    position: fixed;
    top: 0;
    z-index: 1;
    width: half(750);
    height: half(88);
    background: #fff;
    font-size: half(30);
    display: flex;
    justify-content: space-between;
    .left_box {
      display: flex;
      align-items: center;
      height: half(88);
      padding-left: half(20);
      flex: 1;
      overflow: hidden;
      .left_box_t {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .icon-kefurexian {
    font-size: half(160);
    color: #42b983;
  }
</style>
