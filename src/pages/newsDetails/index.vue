/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="news-detail">
    <div class="news-header van-hairline--bottom">
      <div class="hr-avatar-box">
        <img class="user-avatar" src="../../../static/img/default/yonghutouxiang.png" v-if="sendMeUserData.photo == null||sendMeUserData.photo == 0||sendMeUserData.photo == 1||sendMeUserData.photo == 2||sendMeUserData.photo == 3||sendMeUserData.photo == 4">
        <img class="hr-avatar" :src="imgSrcDomain + sendMeUserData.photo" :key="imgSrcDomain + sendMeUserData.photo" v-else>
      </div>
      <div class="hr-profile">
        <div class="hr-profile-detail">
          <div class="hr-name-box">
            <span class="hr-name">{{sendMeUserData.name}}</span>
            <svg aria-hidden="true" v-show="sendMeUserData.sex === 1" class="hr-sex-icon" v-if="sendMeUserData.sex">
              <use xlink:href="#icon-nan-">
              </use>
            </svg>
            <svg aria-hidden="true" v-show="sendMeUserData.sex === 2" class="hr-sex-icon" v-if="sendMeUserData.sex">
              <use xlink:href="#icon-nv-">
              </use>
            </svg>
          </div>
        </div>
        <div class="hr-profile-position">{{sendMeUserData.orgUser ? ((sendMeUserData.orgUser.orgName || '')+((sendMeUserData.orgUser.orgName && sendMeUserData.orgUser.postName)?'-': '')+(sendMeUserData.orgUser.postName|| '')):''}}</div>
      </div>
    </div>
    <v-top-scroll class="message-box" :loadData="getMsgListData" :totalPageNumber="totalPageNumber">
      <ul class="message-ul">
        <li class="message-li" :class="{'mine':item.role  === 'u'}" v-for="(item,key) in  msgListData" :key="item.msgId">
          <div class="dateTime-gap" v-if="key && (item.createTime >= (msgListData[key-1].createTime+600000))">{{formatDate(item.createTime,'MM-DD YYYY hh:mm')}}</div>
          <div class="message-detail">
            <img class="user-avatar" src="../../../static/img/default/yonghutouxiang.png" v-if="item.photo == null||item.photo == 0 || item.photo == 1||item.photo == 2||item.photo == 3||item.photo == 4">
            <img class="user-avatar" :src="(item.userId  === 'u'?imgSrcDomain + ourselfUserPhoto:imgSrcDomain +item.photo)" :key="item.userId  === 'u'?imgSrcDomain + ourselfUserPhoto:imgSrcDomain +item.photo" v-show="item.userId  === 'u'?ourselfUserPhoto:item.photo" v-else>
            <div class="user-profile">
              <!--<div class="user-name">{{item.userId  === 'u'?'我':item.name}}</div>-->
              <p class="user-message">{{decodeURIComponent(item.msg)}}</p>
            </div>
          </div>

        </li>
      </ul>
    </v-top-scroll>
    <div class="input-bar van-hairline--top">
      <div class="input-btn" @click="onCommonLangClick">常用语</div>
      <div class="input-box">
        <div class="input-panel" ref="inputPanel" contenteditable="true" @input="onInputValueChange" @blur='onInputBlur' placeholder=" ">
        </div>
      </div>
      <div class="send-btn" @click="onSendBtnClick">发送</div>
    </div>
    <div class="common-language-box">
      <transition name="fade">
        <div class="common-language-mask" v-show="showCommonLangBox" @click="onCommonLangMaskClick"></div>
      </transition>
      <transition name="fade">
        <ul class="common-language-wrap" v-show="showCommonLangBox">
          <li class="common-language-li van-hairline--bottom" v-for="(item,key) in commonLanguageArr" :key="key" @click="onCommonLangItemClick(key)">{{item}}</li>
          <li class="common-language-split"></li>
          <li class="common-language-cancel-btn" @click="onCommonLangMaskClick">取消</li>
        </ul>

      </transition>
    </div>
  </div>
</template>

<script>
import NewsApi from "../../api/modules/news";
import UserApi from "../../api/modules/user";
import { wsConfig } from "../../api/base/ws";
import { formatDate } from "../../utils/index";

export default {
  data() {
    return {
      queryObj: {},
      decodeURIComponent: decodeURIComponent,
      showCommonLangBox: false,
      commonLanguageArr: [
        "您好，请问贵公司还在招人吗？",
        "您好，我非常希望能够加入贵公司，可以进一步聊聊吗？",
        "您好，我对您发布的职位很感兴趣，希望您能查看我的简历。期待您的回复！",
        "当前不再考虑新机会了，感谢您的关注。"
      ],
      formatDate: formatDate,
      totalPageNumber: 0,
      inputValue: "",
      inputIconStatus: true,
      sendMeUserId: "",
      // newsDetailObj: {},
      chatWS: null,
      timer: null,
      pageNumber: 1,
      pageSize: 10,
      newsListArrIndex: -1,
      msgListData: [],
      sendMeUserData: {},
      isGetRecipientData: false,
      interval: null
    }
  },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    ourselfUserId() {
      return this.$store.state.userInfo.userId;
    },
    ourselfUserPhoto() {
      return this.$store.state.userInfo.photo;
    }
  },
  onLoad(e) {
    this.queryObj = e;
    if (!this.$store.state.userInfo) {
      wx.navigateTo({ url: '../login/main' });
      return;
    }
    if (this.$store.state.userInfo.userId === this.queryObj.userId) {
      wx.navigateBack({ delta: 1 });
      return;
    }
    this.$store.commit("setTitle", "消息详情");
    this._initWS();
    this._clearUnreadStateNumber();
    // this.updateMsgState();
    this.getSendMeUserProfile();
  },
  mounted() {
    this.$nextTick(() => {
      this.applePhoneTouchMoveHacker();
    });
  },
  methods: {
    _initWS() {
      console.log("_initWS");
      const $state = this.$store.state;
      const $stateUserInfo = $state.userInfo;
      const userId = $stateUserInfo && "/" + $stateUserInfo.userId;
      const toUserId = this.queryObj.userId;
      if (userId && !this.chatWS && toUserId) {
        const webSocketUrl =
          wsConfig.wsProtocol +
          wsConfig.wsBaseURL +
          wsConfig.wsChatUrl +
          userId +
          "/" +
          toUserId +
          "/h/room";
        wx.connectSocket({url: webSocketUrl});
        wx.onSocketOpen(this.onWSOpen);
        wx.onSocketMessage(this.onWSMessage);
        wx.onSocketError(this.onWSError);
        wx.onSocketClose(this.onWSClose)
      }
    },
    onWSOpen() {
      this.getMsgListData(1);
      this.timer = setInterval(() => {
        const chatWS = this.chatWS;
        if (chatWS && chatWS.readyState === 1) {
          chatWS.send(JSON.stringify("chat"));
          console.log("send chat");
        } else {
          this._clearIntervalTimerAndInstance();
          this._initWS();
        }
      }, 20000);
    },
    _clearIntervalTimerAndInstance() {
      console.log("_clearIntervalTimerAndInstance", this.chatWS);
      clearInterval(this.timer);
      this.timer = null;
      const chatWS = this.chatWS;
      chatWS && chatWS.close();
      this.chatWS = null;
    },

    onWSMessage() {
      console.log("onWSMessage");
    },
    onWSError() {
      console.log("onWSError");
    },
    onWSClose() {
      console.log("onWSClose");
      this._clearIntervalTimerAndInstance();
      this._initWS();
    },
    showToastTip() {
      this.$toast("服务器连接失败，请尝试刷新页面或重新连接网络！");
    },
    applePhoneTouchMoveHacker() {
      const $input = wx.createSelectorQuery().select('.input-panel').boundingClientRect();
      
      $input.onfocus = () => {
        this.interval = setTimeout(function() {
          document.body.scrollTop = document.body.scrollHeight;
        }, 400);
      };
      
      $input.onblur = () => {
        this.interval && clearTimeout(this.interval);
      };
    },
    getSendMeUserProfile() {
      console.log("this.sendMeUserId", this.sendMeUserId);
      const sendMeUserId = this.queryObj.userId;
      if (sendMeUserId) {
        const data = {
          userId: sendMeUserId
        };
        console.log("getSendMeUserProfile");
        UserApi.query_user(data, (res) => {
          if (res.code === 0) {
            if(res.data){
              this.sendMeUserData = res.data;
            }
            this.isGetRecipientData = true;
          }
        });
      }
    },
    _clearUnreadStateNumber() {
      const sendMeUserId = this.queryObj.userId;
      const $state = this.$store.state;
      const $newsListUserIdArr = $state.newsListUserIdArr;
      this.newsListArrIndex = $newsListUserIdArr.indexOf(sendMeUserId);
      const newsListArrIndex = this.newsListArrIndex;
      if (newsListArrIndex > -1) {
        $state.newsListArr[newsListArrIndex].unread = 0;
      }
    },
    getMsgListData(_pageNum) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      return new Promise((resolve, reject) => {
        const toUserUserId = this.queryObj.userId;

        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          toUser: toUserUserId,
          userId: this.ourselfUserId
        };
        NewsApi.query_msg_historical(data, (res) => {
          console.log("api");
          if (res.code === 0) {
            // 调用第一页的时候
            console.log("outer _pageNum", _pageNum);
            if (_pageNum) {
              this.msgListData = [];
              this.pageNumber = _pageNum;
            }
            this.msgListData.unshift(...res.data.result.reverse());
            console.log("msgListData", this.msgListData);
            this.totalPageNumber = res.data.pages;
            //当前页不等于总页数的时候和 总页数大于0的时候 做++
            if (
              this.pageNumber !== this.totalPageNumber &&
              this.totalPageNumber !== 0
            ) {
              ++this.pageNumber;
            }
          }
          if (_pageNum === 1) {
            this.forceMessageBoxScrollBottom();
          }
          resolve();
        });
      });
    },
    forceMessageBoxScrollBottom() {
      this.$nextTick(() => {
        const query = wx.createSelectorQuery();
        const $messageUl = query.select('.message-box').boundingClientRect();
        $messageUl && query.selectViewport().scrollOffset() === 0;
      });
    },
    onSendBtnClick() {
      console.log(this.$parent)
      const $parentWS = this.$parent.ws;
      const sendMeUserId = this.queryObj.userId;
      const sendMeUserData = this.sendMeUserData;
      const ourselfUserId = this.ourselfUserId;
      const userInfo = this.$store.state.userInfo;
      if (
        this.isGetRecipientData &&
        this.inputValue.replace(/^\s*$/g, "") &&
        userInfo &&
        sendMeUserId &&
        ourselfUserId &&
        sendMeUserId !== ourselfUserId
      ) {
        if ($parentWS && $parentWS.readyState === 1) {
          let newsIntentionalJob = "";
          if (window.localStorage) {
            try {
              newsIntentionalJob = window.localStorage.getItem(
                "newsIntentionalJob"
              );
            } catch (e) {
              this.$toast("请关闭浏览器的无痕模式再进行操作！");
              return;
            }
          } else {
            return;
          }
          // if (newsIntentionalJob) {
          const messageParamsObj = {
            userId: ourselfUserId,
            name: userInfo.name || "",
            photo: userInfo.photo || "",
            role: "u",
            orgName: "",
            toName: sendMeUserData.name || "",
            toPhoto: sendMeUserData.photo || "",
            intentionalJob: newsIntentionalJob || "",
            toUser: sendMeUserId,
            content: encodeURIComponent(this.inputValue)
          };
          
          this.$parent._sendMessage(messageParamsObj);
          // }
        } else {
          this.showToastTip();
          
          this.$parent._clearIntervalTimerAndInstance();
          
          this.$parent._initNewsWebSocket();
        }
      }
    },
    _appendUserSelfMsg(
      toUserId,
      type,
      resData
    ) {
      const sendMeUserId = this.queryObj.userId;
      const ourselfUserId = this.ourselfUserId;
      if (
        toUserId == sendMeUserId &&
        ourselfUserId !== sendMeUserId &&
        (type === "ok" ? this.inputValue : resData.content)
      ) {
        this.$nextTick(() => {
          this.msgListData.push({
            userId: type === "ok" ? ourselfUserId : resData.toUser,
            photo: type === "ok" ? resData.userPhoto : resData.toPhoto,
            msgId: Math.random(),
            role: type === "ok" ? "u" : "h",
            msg: type === "ok" ? this.inputValue : resData.content,
            createTime: resData.date
          });
          
          this.$refs.inputPanel.innerHTML = "";
          this.inputValue = "";
          this.forceMessageBoxScrollBottom();
          this.showCommonLangBox = false;
        });
      }
    },
    onInputValueChange($eventObj) {
      const $inputValue = $eventObj.target.innerText;
      if ($inputValue.length > 100) {
        $eventObj.target.innerText = $inputValue.substring(0, 100);
        if (
          typeof window.getSelection !== "undefined" &&
          typeof document.createRange !== "undefined"
        ) {
          let selection = window.getSelection();
          let range = document.createRange();
          range.selectNodeContents($eventObj.target);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          
        } else if (typeof document.body.createTextRange !== "undefined") {
          
          let textRange = document.body.createTextRange();
          textRange.moveToElementText($eventObj.target);
          textRange.collapse(false);
          textRange.select();
        }
      }
      this.inputValue = $eventObj.target.innerText;
    },
    onCommonLangItemClick(key) {
      this.inputValue = this.commonLanguageArr[key];
      this.onSendBtnClick();
    },
    onCommonLangClick() {
      this.showCommonLangBox = true;
    },
    onCommonLangMaskClick() {
      this.showCommonLangBox = false;
    }
  }
}
</script>
<style scoped lang="scss">
  .padding_r_20 {
    padding-right: half(20);
  }
  .padding_l_20 {
    padding-left: half(20);
  }

  .news-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #fff;
    font-size: half(32);
    .common-language-mask,
    .common-language-wrap {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      transition: all 0.2s ease-out;
    }
    .common-language-mask {
      z-index: 1;
      top: 0;
      background-color: #000;
      opacity: 0.7;
      &.fade-enter-to,
      &.fade-leave {
        opacity: 0.7;
      }
      &.fade-leave-to,
      &.fade-enter {
        opacity: 0;
      }
    }
    .common-language-wrap {
      z-index: 3;
      font-size: half(28);
      color: #000;
      background-color: #fff;
      &.fade-enter-to,
      &.fade-leave {
        transform: translate3d(0, 0, 0);
      }
      &.fade-leave-to,
      &.fade-enter {
        transform: translate3d(0, 100%, 0);
      }
    }
    .common-language-li,
    .common-language-cancel-btn {
      padding: half(30);
    }
    .common-language-cancel-btn{
      text-align: center;
    }
    .common-language-li:nth-of-type(4):after {
      border: none;
    }
    .common-language-split {
      background-color: #E8E8E8;
      height: half(20);
    }
    .user-avatar {
      width: half(80);
      height: half(80);
      border-radius: 50%;
      margin-right: half(26);
    }
    .hr-sex-icon {
      width: half(24);
      height: half(24);
      flex-shrink: 0;
    }
    .hr-name-box {
      display: flex;
      flex: 1;
      margin-right: half(10);
      align-items: center;
      overflow: hidden;
    }
    .hr-name {
      margin-right: half(6);
    }
    .hr-name,
    .hr-recruit-position,
    .hr-profile-position {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hr-recruit-position {
      font-size: half(24);
      max-width: 4.5rem;
    }
    .hr-avatar-box {
      width: half(100);
      height: half(100);
      margin-right: half(20);
      border-radius: 50%;
    }
    .hr-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .hr-profile {
      display: flex;
      flex: 1;
      height: half(99.94);
      overflow: hidden;
      flex-direction: column;
    }
    .hr-profile-position {
      height: half(38);
      color: #999;
      font-size: half(28);
    }
    .hr-profile-detail {
      display: flex;
      align-items: center;
      height: half(42);
      overflow: hidden;
      margin-bottom: half(18);
    }
    .news-header {
      position: fixed;
      z-index: 1;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      padding: half(20);
      background-color: #fff;
    }
    .input-bar {
      position: fixed;
      z-index: 3;
      bottom: 0;
      left: 0;
      right: 0;
      padding: half(20) half(26) half(20) half(20);
      display: flex;
      align-items: flex-end;
      color: #666;
      background-color: #fff;
    }

    .message-box {
      flex: 1;
      padding: half(139.94) 0 half(98) 0;
      background-color: #fff;
    }
    .message-ul {
      padding: half(40) half(20) 0 half(20);
    }
    .message-li {
      margin-bottom: half(40);
    }
    .message-detail {
      display: flex;
    }
    .dateTime-gap {
      padding: half(20) 0;
      font-size: half(24);
      color: #999;
      text-align: center;
    }
    .user-message {
      position: relative;
      max-width: half(510);
      padding: half(19) half(30);
      letter-spacing: half(2);
      color: #000;
      word-break: break-all;
      background-color: #f2f2f2;
      border-radius: half(16);
    }
    .user-message:before {
      content: "";
      position: absolute;
      top: half(26);
      left: half(-30);
      width: 0;
      height: 0;
      font-size: 0;
      line-height: 0;
      border-width: half(16);
      overflow: hidden;
      border-style: dashed solid dashed dashed;
      border-color: transparent #f2f2f2 transparent transparent;
    }
    .mine {
      .message-detail {
        flex-direction: row-reverse;
      }
      .user-avatar {
        margin: 0 0 0 half(26);
      }
      .user-name {
        text-align: right;
      }
      .user-message {
        color: #fff;
        background-color: #42b983;
      }
      .user-message:before {
        left: auto;
        right: half(-30);
        border-color: transparent transparent transparent #42b983;
      }
    }

    .input-btn,
    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-basis: half(120);
      margin-left: half(22);
      border-radius: half(6);
    }
    .input-btn {
      width: half(120);
      height: half(58);
      flex-shrink: 0;
      margin-right: half(24);
      margin-left: half(8);
      background-color: #f5f5f5;
      font-size: half(28);
      font-weight: bold;
    }

    .send-btn {
      height: half(58);
      background: #42b983;
      color: #fff;
    }
    .input-box {
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
    }
    .input-panel {
      padding: half(10) half(26);
      min-height: half(40);
      border-radius: half(10);
      flex: 1;
      max-height: half(190);
      // min-height: half(46);
      user-select: auto;
      word-break: break-all;
      overflow-x: hidden;
      overflow-y: auto;
      outline: none;
      white-space: pre-wrap;
      text-align: left;
      background-color: #f5f5f5;
      font-size: half(28);
      color: #333;
      -webkit-user-modify: read-write-plaintext-only;
      user-modify: read-write-plaintext-only;
      &:empty:before {
        content: attr(placeholder);
        display: block;
        color: #CCC;
      }
    }

    .input-panel {
      ::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #CCC !important;
      }
      :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #CCC !important;
      }
      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #CCC !important;
      }
      :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #CCC !important;
      }
    }
  }
</style>
