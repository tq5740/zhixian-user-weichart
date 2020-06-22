/**
*@author leo
*@dateTime 2018/7/31
*@description created
*/
<template>
  <div class="comment-detail">
    <div class="comment-header van-hairline--bottom">全部评论（{{commentListData.length}}）</div>
    <v-scroll ref="vScroll" v-if="isShowList" :loadData="getCommentList" :totalPageNumber="totalPageNumber">
      <ul class="comment-item-ul">
        <li class="comment-item-li" v-for="item in commentListData" :key="item.commentId">
          <img class="user-avatar-icon" src="../../../static/img/mine/yonghutouxiang.png"  v-if="item.fromUserPhoto == null||item.fromUserPhoto == 0||item.fromUserPhoto == 1||item.fromUserPhoto == 2||item.fromUserPhoto == 3||item.fromUserPhoto == 4">
          <img class="user-avatar-icon" :src="imgSrcDomain+item.fromUserPhoto" :key="item.commentId" v-else>
          <div class="comment-user-profile van-hairline--bottom">
            <div class="comment-user-name">{{item.fromUserName}}</div>
            <div class="comment-user-content">{{item.content}}</div>
            <div class="comment-user-toolbar">
              <span class="comment-dateTime">{{item.createTime}}</span>
              <i class="iconfont user-reply-icon icon-huifu" @click="onReplyIconClick(item)"></i>
              <span class="comment-number" v-if="item.replyCount">{{item.replyCount}}</span>
              <i class="iconfont user-delete-icon icon-shanchu_" v-if="userId === item.fromUserId" @click="onDeleteIconClick(item.commentId)"></i>
            </div>
          </div>
        </li>
      </ul>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>
    <transition name="fade">
      <div class="comment-reply-panel-mask" v-if="showReplyPanel"></div>
    </transition>
    <transition name="slide">
      <div class="comment-reply-panel" v-if="showReplyPanel">
        <div class="comment-reply-panel-header">
          <div class="comment-reply-panel-top van-hairline--bottom">
            <div class="comment-reply-panel-subject">全部回复({{commentChildListData.length}})</div>
            <i class="iconfont comment-reply-panel-close-icon icon-guanbi" @click="onReplayCloseIconClick"></i>
          </div>
          <div class="comment-item-li child-main-comment">
            <img class="user-avatar-icon" src="../../../static/img/mine/yonghutouxiang.png"  v-if="childMainCommentObj.fromUserPhoto == null||childMainCommentObj.fromUserPhoto == 0||childMainCommentObj.fromUserPhoto == 1||childMainCommentObj.fromUserPhoto == 2||childMainCommentObj.fromUserPhoto == 3||childMainCommentObj.fromUserPhoto == 4">
            <img class="user-avatar-icon" :src="imgSrcDomain+childMainCommentObj.fromUserPhoto" :key="item.commentId" v-else>

            <div class="comment-user-profile">
              <div class="comment-user-name">{{childMainCommentObj.fromUserName}}</div>
              <div class="comment-user-content">{{childMainCommentObj.content}}</div>
              <div class="comment-user-toolbar">
                <span class="comment-dateTime">{{childMainCommentObj.createTime}}</span>
                <i class="iconfont user-reply-icon icon-huifu" @click="onMainReplyIconClick"></i>
              </div>
            </div>
          </div>
          <div class="comment-reply-split-line"></div>
        </div>

        <v-scroll ref="vChildScroll" v-if="isShowChildList" :loadData="getChildCommentList" :totalPageNumber="totalChildPageNumber">
          <ul class="comment-item-ul comment-item-ul-child">
            <li class="comment-item-li" v-for="item in commentChildListData" :key="item.commentId">
              <img class="user-avatar-icon" src="../../../static/img/mine/yonghutouxiang.png" v-if="item.fromUserPhoto == null||item.fromUserPhoto == 0||item.fromUserPhoto == 1||item.fromUserPhoto == 2||item.fromUserPhoto == 3||item.fromUserPhoto == 4">
              <img class="user-avatar-icon" :src="imgSrcDomain+item.fromUserPhoto" :key="item.commentId" v-else>
              <div class="comment-user-profile van-hairline--bottom">
                <div class="comment-user-name">{{item.fromUserName}}</div>
                <div class="comment-user-content">{{item.content}}<span v-if="item.toCommentId !== childMainCommentObj.commentId" class="to-user-detail"><span class="to-user-name">//@{{item.toUserName}}:</span>{{item.toUserContent}}</span></div>
                <div class="comment-user-toolbar">
                  <span class="comment-dateTime">{{item.createTime}}</span>
                  <i class="iconfont user-reply-icon icon-huifu" @click="onChildReplyIconClick(item)"></i>
                  <span class="comment-number" v-if="item.replyCount">{{item.replyCount}}</span>
                  <i class="iconfont user-delete-icon icon-shanchu_" v-if="userId === item.fromUserId" @click="onChildDeleteIconClick(item.commentId)"></i>
                </div>
              </div>
            </li>
          </ul>
        </v-scroll>
        <no-data :isNoData="isNoChildData" class="no-child-data"></no-data>
      </div>
    </transition>
    <div class="input-bar van-hairline--top">
      <div class="input-bg">
        <div class="replay-tip" v-if="showReplyPanel && isReplyChildComment && replayTipValue">回复<span class="replay-tip-stress">@{{replayTipValue}}</span></div>
        <div class="input-box">
          <input class="input-panel" ref="inputPanel" contenteditable="true" @keyup.8="backSpace" v-model="onInputValue" @input="onInputValueChange" @blur='onInputBlur' @focus="onInputFocus" placeholder="写评论~" />
        </div>
      </div>
      <div class="send-btn" @click="onSendBtnClick">发送</div>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>
<script>
import Comment from "../../api/modules/comment";
import { getTimeSpan } from "../../utils/index";
export default {
  data() {
    return {
      queryObj: {},
      item: "",
      onInputValue: "",
      isFocus: false,
      replayTipValue: "",
      isReplyChildComment: false,
      childMainCommentObj: {},
      showReplyPanel: false,
      getTimeSpan: getTimeSpan,
      isNoData: false,
      isNoChildData: false,
      isShowList: true,
      isShowChildList: true,
      pageSize: 10,
      pageNumber: 1,
      pageChildNumber: 1,
      totalPageNumber: 0,
      totalChildPageNumber: 0,
      commentListData: [],
      commentChildListData: [],
      // inputIconStatus: true,
      childCommentId: "",
      toChildCommentId: "",
      orgId: "",
      orgName: "",
      inputValue: "",
      intervalTimer: null,
      // 是否可以删除@
      lock: false, 
    }
  },
  

  // @Watch("inputValue")
  // clearReplyPanel(a) {
  //   if(a.length === 0){
  //     setTimeout(() => { this.lock = true }, 500);
  //   } else {
  //     this.lock = false;
  //   }
  // },
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    isLogin() {
      return !!this.$store.state.userInfo;
    },
    userId() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.userId : ""
    },
    token() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.token : '';
    }
  },
  onLoad(e) {
    this.$store.commit("setTitle", "评论详情");
    this.queryObj = e;
    this.orgId = this.queryObj.orgId;
    this.orgName = decodeURIComponent(this.queryObj.orgName);
    this.orgId && this.getCommentList(1);
  },
  mounted() {
    this.$nextTick(() => {
      // this.applePhoneTouchMoveHacker();
    });
  },
  methods: {
    initReplyPanelStatus() {
      this.isFocus = false;
      this.showReplyPanel = false;
      this.isNoChildData = false;
      this.isShowChildList = true;
      this.pageChildNumber = 1;
      this.totalChildPageNumber = 0;
      this.childCommentId = "";
      this.commentChildListData = [];
      this.childMainCommentObj = {};
      this.replayTipValue = "";
      this.isReplyChildComment = false;
      this.toChildCommentId = "";
      this.pageNumber = 1;
      this.totalPageNumber = 0;
      this.isShowList = false;
      this.getCommentList(1);
    },
    // applePhoneTouchMoveHacker() {
    //   const $input = document.getElementsByClassName("input-panel")[0];
      
    //   $input.onfocus = () => {
    //     this.intervalTimer = setTimeout(function() {
    //       document.body.scrollTop = document.body.scrollHeight;
    //     }, 400);
    //   };
      
    //   $input.onblur = () => {
    //     this.intervalTimer && clearTimeout(this.intervalTimer);
    //   };
    // },
    getCommentList(_pageNum) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      if (this.isFocus) return;
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          resourcesType: 1,
          resourcesId: this.orgId,
          sortField: "createTime",
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.token
        };
        Comment.comment_list(data, (res) => {
            if (res.code === 0) {
              //没有数据的时候
              if (res.data.result.length === 0) {
                this.isNoData = true;
                this.isShowList = false;
                return;
              } else {
                this.isNoData = false;
              }
              !this.isShowList && (this.isShowList = true);
              // 调用第一页的时候
              if (_pageNum) {
                this.commentListData = [];
                this.pageNumber = _pageNum;
              }
              const resData = res.data.result;
              resData.forEach((item) => {
                item.content = decodeURIComponent(item.content);
                item.createTime = this.getTimeSpan(item.createTime,true);
              });
              this.commentListData = this.commentListData.concat(resData);
              
              this.totalPageNumber = res.data.pages;
              //当前页不等于总页数的时候和 总页数大于0的时候 做++
              if (
                this.pageNumber !== this.totalPageNumber &&
                this.totalPageNumber !== 0
              ) {
                ++this.pageNumber;
              }
            } else {
              this.$toast(res.msg);
            }
            resolve();
          },(error) => {
            if (!error.Cancel) {
              this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
            }
            reject(error);
          })
          setTimeout(() => {
            this.$toast.clear();
          }, 500);
      });
    },
    getChildCommentList(_pageNum) {
      if (this.isFocus) return;
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageChildNumber,
          pageSize: this.pageSize,
          commentId: this.childCommentId,
          sortField: "createTime",
          siteHierarchy: this.$store.state.configData.hierarchy,
          token: this.token
        };
        Comment.reply_list(data, (res) => {
            if (res.code === 0) {
              //没有数据的时候
              if (res.data.result.length === 0) {
                this.isNoChildData = true;
                this.isShowChildList = false;
                return;
              } else {
                this.isNoChildData = false;
              }
              !this.isShowChildList && (this.isShowChildList = true);
              // 调用第一页的时候
              if (_pageNum) {
                this.commentChildListData = [];
                this.pageChildNumber = _pageNum;
              }
              const resData = res.data.result;
              resData.forEach((item) => {
                item.content = decodeURIComponent(item.content);
                item.toUserContent = decodeURIComponent(item.toUserContent);
                item.createTime = this.getTimeSpan(item.createTime,true);
              });
              this.commentChildListData = this.commentChildListData.concat(
                resData
              );
              this.totalChildPageNumber = res.data.pages;
              //当前页不等于总页数的时候和 总页数大于0的时候 做++
              if (
                this.pageChildNumber !== this.totalChildPageNumber &&
                this.totalChildPageNumber !== 0
              ) {
                ++this.pageChildNumber;
              }
            } else {
              this.$toast(res.msg);
            }
            resolve();
          },(error) => {
            if (!error.Cancel) {
              this.$refs.vChildScroll &&
                (this.$refs.vChildScroll).errorLog(error);
            }
            reject(error);
          })
          setTimeout(() => {
            this.$toast.clear();
          }, 500);
      });
    },
    onReplayCloseIconClick() {
      this.initReplyPanelStatus();
    },
    onReplyIconClick(item) {
      if (!this.isLogin) {
        wx.navigateTo({ url: '../login/main' });
        return;
      }
      if (!item.commentId) return;
      this.childCommentId = item.commentId;
      this.childMainCommentObj = item;
      if (this.childMainCommentObj && this.childMainCommentObj.length) {
        this.childMainCommentObj.forEach(item => {
          item.createTime = this.getTimeSpan(item.createTime,true);        
        });
      } else {
        this.childMainCommentObj.createTime = this.getTimeSpan(this.childMainCommentObj.createTime,true);
      }
      
      this.getChildCommentList(1);
      
      this.$refs.inputPanel.innerHTML = "";
      
      this.showReplyPanel = true;
      // this.$nextTick(() => {
      //   const $replyPanelHeader = document.getElementsByClassName(
      //     "comment-reply-panel-header"
      //   )[0];
      //   $replyPanelHeader.addEventListener("touchmove", function(e) {
      //     e.preventDefault();
      //   });
      // });
    },
    onDeleteIconClick(commentId) {
      if (!commentId) return;
      const data = {
        commentId: commentId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      };
      Comment.delete_comment(data, (res) => {
        if (res.code === 0) {
          this.getCommentList(1);
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onChildReplyIconClick(item) {
      if (!this.isLogin) {
        wx.navigateTo({ url: '../login/main' });
        return;
      }
      const toChildCommentId = item.commentId;
      if (!toChildCommentId) return;
      this.replayTipValue = item.fromUserName;
      this.isReplyChildComment = true;
      this.toChildCommentId = toChildCommentId;
      
      this.$refs.inputPanel.focus();
    },
    onMainReplyIconClick() {
      this.replayTipValue = "";
      this.isReplyChildComment = false;
      this.toChildCommentId = "";
      
      this.$refs.inputPanel.focus();
    },
    onChildDeleteIconClick(commentId) {
      if (!commentId) return;
      const data = {
        commentId: commentId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      };
      Comment.delete_reply( data,(res) => {
        if (res.code === 0) {
          this.getChildCommentList(1);
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onSendBtnClick() {
      if (!this.isLogin) {
        wx.navigateTo({ url: '../login/main' });
      }
      const inputValue = this.inputValue;
      if (!inputValue) return;
      const orgId = this.orgId;
      if (!orgId) return;
      const orgName = this.orgName;
      if (!orgName) return;
      // 判断去掉空格和换行之后是否为空
      if (inputValue.replace(/\s+/g, "") === "" || inputValue.replace(/<\/?.+?>/g, "") === ""){
        this.$toast("内容不能为空！");
        return;
      };
      const data = {
        resourcesId: orgId,
        resourcesType: 1,
        resourcesName: orgName,
        content: encodeURIComponent(inputValue),
        fromUserId: this.userId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.token
      };
      const showReplyPanel = this.showReplyPanel;
      if (showReplyPanel) {
        const childCommentId = this.childCommentId;
        if (!childCommentId) return;
        data.primaryCommentId = childCommentId;
        if (!this.isReplyChildComment) {
          data.toCommentId = childCommentId;
        } else {
          const toChildCommentId = this.toChildCommentId;
          if (!toChildCommentId) return;
          data.toCommentId = toChildCommentId;
        }
      }
      Comment.create_comment(data, (res) => {
        if (res.code === 0) {
          
          this.$refs.inputPanel.innerHTML = "";
          this.onInputValue = "";
          if (!showReplyPanel) {
            this.pageNumber = 1;
            this.totalPageNumber = 0;
            this.isShowList = false;
            // this.commentListData = [];
            this.getCommentList(1);
          } else {
            this.pageChildNumber = 1;
            this.totalChildPageNumber = 0;
            this.isShowChildList = false;
            // this.commentChildListData = [];
            this.getChildCommentList(1);
          }
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onInputValueChange($eventObj) {
      const $inputValue = $eventObj.target.value;
      if ($inputValue.length > 100) {
        $eventObj.target.value = $inputValue.substring(0, 50);
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
      this.inputValue = $eventObj.target.value;
    },
    onInputBlur() {
      this.isFocus = false;
    },
    onInputFocus() {
      this.isFocus = true;
    },
    backSpace() {
      if(this.lock){
        if(this.inputValue.length === 0){
          this.isReplyChildComment = false;
        }
      }
    }  
  }
}
</script>
<style lang="scss" scoped>
  .comment-detail {
    padding-bottom: half(98);
    font-size: half(32);
    background-color: #fff;
    ._v-scroll {
      padding-top: half(122) !important;
    }
    .comment-header
                /*.comment-reply-panel-header */
   {
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      right: 0;
      background-color: #fff;
    }
    .comment-header {
      padding: half(30) half(20);
      color: #000;
      font-weight: bold;
    }
    .comment-reply-panel-top {
      height: half(102);
      padding: 0 half(20);
      display: flex;
      align-items: center;
      font-size: half(32);
      font-weight: bold;
    }

    .comment-item-ul {
      padding: 0 half(20);
    }
    .comment-item-ul-child > .comment-item-li:first-child {
      padding-top: half(20);
    }
    .comment-item-li {
      display: flex;
      margin-bottom: half(20);
    }
    .comment-item-li:last-child {
      margin-bottom: 0;
    }
    .user-avatar-icon {
      width: half(80);
      height: half(80);
      margin-right: half(20);
      border-radius: 50%;
    }
    .comment-user-profile {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .comment-user-name,
    .comment-user-content,
    .comment-user-toolbar {
      margin-bottom: half(22);
    }
    .comment-user-name {
      font-size: half(28);
      color: #42b983;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .comment-user-content {
      word-break: break-all;
      color: #333;
    }
    .to-user-name {
      color: #42b983;
    }
    .comment-user-toolbar {
      display: flex;
      align-items: center;
      font-size: half(24);
      color: #999;
    }
    .comment-dateTime {
      flex: 1;
    }
    .user-delete-icon {
      margin-left: half(40);
    }
    .user-delete-icon,
    .user-reply-icon {
      font-size: half(32);
    }
    .comment-number {
      padding-left: half(14);
      font-size: half(28);
      color: #666;
    }
    .input-bar {
      position: fixed;
      z-index: 3;
      bottom: 0;
      left: 0;
      right: 0;
      padding: half(20) half(24);
      display: flex;
      align-items: flex-end;
      background-color: #fff;
      .input-bg{
        padding-left: half(20);
        min-height: half(58);
        background-color: #f5f5f5;
        border-radius: half(10);
        color: #fefefe;
        display: flex;
        align-items: flex-end;
        flex: 1;
      }
    }
    .send-btn {
      width: half(90);
      height: half(58);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-basis: half(120);
      margin-left: half(24);
      border-radius: half(6);
      color: #fff;
      background-color: #42b983;
    }
    .input-box {
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
    }
    .input-panel {
      flex: 1;
      max-height: half(190);
      min-height: half(52);
      user-select: auto;
      word-break: break-all;
      overflow-x: hidden;
      overflow-y: auto;
      outline: none;
      white-space: pre-wrap;
      text-align: left;
      background-color: transparent;
      font-size: half(32);
      color: #000;
      -webkit-user-modify: read-write-plaintext-only;
      user-modify: read-write-plaintext-only;
      &:empty:before {
        content: attr(placeholder);
        display: block;
        color: #999;
      }
      &::-webkit-input-placeholder {
        /* WebKit, Blink, Edge */
        color: #999 !important;
      }
      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #999 !important;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999 !important;
      }
      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #999 !important;
      }
    }
    .replay-tip {
      height: half(54);
      font-size: half(32);
      color: #999;
    }
    // .replay-tip-stress {
    //   color: #42b983;
    // }
    
    .comment-reply-panel-mask,
    .comment-reply-panel {
      position: fixed;
      z-index: 2;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: transform 0.2s ease-out;
      &.slide-enter-to,
      &.slide-leave {
        transform: translate3d(0, 0, 0);
      }
      &.slide-leave-to,
      &.slide-enter {
        transform: translate3d(0, 100%, 0);
      }
    }
    .comment-reply-panel-mask {
      background-color: #000;
      opacity: 0.7;
      transition: opacity 0.2s ease-out;
      &.fade-enter-to,
      &.fade-leave {
        opacity: 0.7;
      }
      &.fade-leave-to,
      &.fade-enter {
        opacity: 0;
      }
    }
    .comment-reply-panel {
      padding-bottom: half(98);
      display: flex;
      flex-direction: column;
      /*overflow-y: scroll;*/
      /*-webkit-overflow-scrolling: touch;*/
      background-color: #fff;
      & > .comment-item-li {
        padding: half(0) half(20);
      }
      ._v-scroll {
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        /*padding-top: half(320) !important;*/
        padding-top: 0 !important;
        flex: 1;
      }
    }
    .comment-reply-panel-subject {
      flex: 1;
    }
    .comment-reply-panel-close-icon {
      font-size: half(32);
    }
    .child-main-comment {
      padding: half(20) half(20) 0;
      margin-bottom: 0;
    }
    /*.no-child-data {*/
    /*padding-top: half(420) !important;*/
    /*}*/
    .comment-reply-split-line {
      height: half(20);
      background-color: #f2f2f2;
    }
  }
</style>
