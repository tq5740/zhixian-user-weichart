/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
    <div class="news">
        <div class="news-ul">
            <custom-swipe-cell v-for="item in newsListArr" :key="item.msgId" :toUser="item.toUser" :userId="item.userId"
                               @onDelete="onNewsItemDelete">
                <li class="news_box"  @click="toDetails(item)">
                    <div class="news_box_left">
                        <img class="con_img" src="../../../static/img/default/yonghutouxiang.png" v-if="userData.photo == null || userData.photo == 0 || userData.photo == 1||userData.photo == 2||userData.photo == 3||userData.photo == 4 ">
                        <img class="con_img" :src="imgSrcDomain+item.photo"
                             :key="imgSrcDomain+item.photo" v-else>
                    </div>
                    <div class="news_box_right">
                        <div class="news_box_text">
                            <div class="padding_r_20 news_box_text_t1">
                                <div class="user-name">{{item.orgName}}</div>
                            </div>
                            <div class="news_box_text_t3">
                                <div class="message-icon-sp" v-if="item.unread" :class="{'double': item.unread > 9}">
                                    {{item.unread > 99?'99+':item.unread}}
                                </div>
                            </div>
                        </div>
                        <div class="news_box_text2">
                            <p class="news_box_text2_t1">
                                {{item.msg}}
                            </p>
                            <span class="news_box_text2_t2">{{getTimeSpan(item.createTime,true)}}</span>
                        </div>

                    </div>
                </li>

            </custom-swipe-cell>
        </div>
            <div v-if="!newsListArr.length" class="empty-box">暂无聊天信息</div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import NewsApi from "../../api/modules/news";
import CustomSwipeCell from "../../components/CustomSwipeCell/CustomSwipeCell.vue";
import { getTimeSpan } from "../../utils/index";

export default {
  components: {
    CustomSwipeCell
  },
  data(){
    return{
      getTimeSpan: getTimeSpan,
      newsListArr: this.$store.state.newsListArr,
      newsListUserIdArr: this.$store.state.newsListUserIdArr
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    }
  },
  onLoad() {
    this.$store.commit("setTitle", "消息");
    if (!this.$store.state.userInfo) {
      wx.navigateTo({url: '../login/main'})
    }
    this.newsListArr = this.$store.state.newsListArr;
    console.log(this.$store.state.newsListArr);
    console.log(this.$store.state);
    this.newsListArr.forEach(element => {
      if(element.photo == "undefined"){
        element.photo = 0
      }
    });
  },

  methods: {
    onNewsItemDelete(userId, toUser) {
      const newsListArr = this.newsListArr;
      const newsListUserIdArr = this.newsListUserIdArr;
      const currentIndex = newsListUserIdArr.indexOf(toUser);
      const isHave = currentIndex > -1;
      if (userId && toUser && isHave) {
        const data = {
          userId,
          toUser,
          role: "u"
        };
        NewsApi.delete_msg_user( data ,(res) => {
          if (res.code === 0) {
            newsListUserIdArr.splice(currentIndex, 1);
            newsListArr.splice(currentIndex, 1);
          }
        });
      }
    },

    toDetails(item) {
      const isLogin = this.$store.state.userInfo;
      if (!isLogin) {
        wx.navigateTo({url: '../login/main'})
        return;
      }
      if (item.toUser) {
        if (wx.setItem) {
          try {
            wx.setItem({
              key: "newsIntentionalJob",
              data: item.intentionalJob || ""
            });
            wx.navigateTo({url: "/newsDetails?userId=" + item.toUser});
          } catch (e) {
            this.$toast("请关闭浏览器的无痕模式再进行操作！");
          }
        }
      }
    }
  }
  
}
</script>
<style scoped lang="scss">
.bg_dff0e7 {
  background: #E8E8E8 !important;
}

.padding_r_20 {
  padding-right: half(20);
}

.padding_l_20 {
  padding-left: half(20);
}

.v-scroll {
  padding-top: 0 !important;
}

.news {
  position: relative;
  min-height: 100%;
  color: #999;
  background: #fff;
  /*-webkit-overflow-scrolling: touch;*/
  /*  /deep/ {
          .van-swipe-cell__right {
            width: half(180);
            margin: auto auto;
            text-align: center;
            padding-top: half(49);
            font-size: half(32);
            color: #fff;
            background-color: #CCC;
          }
          .van-cell-group.van-hairline--top-bottom::after {
            border-width: 0;
            !*border-bottom-width: half(3);*!
          }
        }*/
  .empty-box {
    position: absolute;
    top: half(300);
    left: 0;
    right: 0;
    text-align: center;
    color: #999;
    font-size: half(32);
    transition: opacity 0.5s ease-out;
    &.fade-enter-to,
    &.fade-leave {
      opacity: 1;
    }
    &.fade-leave-to,
    &.fade-enter {
      opacity: 0;
    }
  }
  .news_box {
    display: flex;
    padding: half(30) half(20);
    font-size: half(32);
    height: half(139.96);
    .news_box_left {
      .con_img {
        width: half(80);
        height: half(80);
        margin-right: half(20);
        border-radius: 50%;
      }
    }
    .news_box_right {
      /*padding: half(10) 0;*/
      display: flex;
      flex: 1;
      flex-direction: column;
      /*height: half(99.94);*/
      /*justify-content: space-between;*/
      overflow: hidden;
      .news_box_text {
        display: flex;
        align-items: center;
        margin-bottom: half(18);
        .user-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .news_box_text_t1 {
          display: flex;
          flex: 1;
          overflow: hidden;
          align-items: center;
          color: #000;
        }

        .news_box_text_t3 {
          display: flex;
          flex-direction: row-reverse;
          margin-left: half(10);
          color: #fff;
          font-size: half(24);
        }
        .message-icon-sp,
        .message-icon-sp-double {
          display: flex;
          align-items: center;
          justify-content: center;
          height: half(36);
          border-radius: 50%;
          background-color: #fc703e;
        }
        .message-icon-sp {
          width: half(36);
        }

        .message-icon-sp-double {
          width: half(48);
        }
      }
      .news_box_text2 {
        display: flex;
        align-items: center;
        overflow: hidden;
        .news_box_text2_t1 {
          flex: 1;
          margin-right: half(30);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: half(26);
        }
        .news_box_text2_t2 {
          font-size: half(24);
        }
      }
    }
  }
}
</style>
