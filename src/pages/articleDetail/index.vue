/**
*@author leo
*@dateTime 2018/8/14
*@description created
*/
<template>
  <div class="main-box">
    <div class="article-detail">
      <div class="article-detail-container">
        <header class="article-header">{{articleDetailData.articleTitle || ''}}</header>
        <aside class="article-profile van-hairline--bottom">
          <span class="article-dateTime">{{articleDetailData.updateTime && articleUpdateTime}}</span>
          <span class="article-resource">{{articleDetailData.createUserName ||''}}</span>
        </aside>
        <div
          class="article-content"
        >
          <wxParse v-if="articleDetailData.intro" :content="articleDetailData.intro" />
        </div>

        <van-actionsheet v-if="showFrom">
          <div class="article-enroll-panel">
            <div class="enroll-header">填写报名信息</div>
            <div class="enroll-deadline">截止日期：{{articleDetailData.regEndTime && isRegEndTime}}</div>
            <div class="enroll-item">
              <span class="enroll-item-sub">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
              <span class="enroll-item-split"></span>
              <input
                @blur='onInputBlur'
                v-if="userRegOptions.userName"
                class="enroll-item-input"
                placeholder="请输入姓名"
              >
            </div>
            <div class="enroll-item">
              <span class="enroll-item-sub">手机号码</span>
              <span class="enroll-item-split"></span>
              <input
                @blur='onInputBlur'
                v-if="userRegOptions.mobilePhone"
                class="enroll-item-input"
                placeholder="请输入手机号码"
              >
            </div>
            <div
              class="enroll-item"
              v-if="regInfoStateArr.indexOf('身份证号')>-1"
            >
              <span class="enroll-item-sub">身份证号</span>
              <span class="enroll-item-split"></span>
              <input
                @blur='onInputBlur'
                v-if="userRegOptions.idCard"
                class="enroll-item-input"
                placeholder="请输入身份证号"
              >
            </div>
            <div
              class="enroll-item"
              v-if="regInfoStateArr.indexOf('职务')>-1"
            >
              <span class="enroll-item-sub">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务</span>
              <span class="enroll-item-split"></span>
              <input
                @blur='onInputBlur'
                v-if="userRegOptions.userPost"
                class="enroll-item-input"
                placeholder="请输入职务"
              >
            </div>
            <div
              class="enroll-item"
              v-if="regInfoStateArr.indexOf('公司名称')>-1"
            >
              <span class="enroll-item-sub">所在单位</span>
              <span class="enroll-item-split"></span>
              <input
                @blur='onInputBlur'
                v-if="userRegOptions.userOrgName"
                class="enroll-item-input"
                placeholder="请输入所在单位"
              >
            </div>
            <div
              class="enroll-btn"
              @click="onRegBtnClick"
            >报名</div>
          </div>
        </van-actionsheet>

        <aside class="article-tip">
          <span class="browser-num">浏览量：{{articleDetailData.articleStatistics && articleDetailData.articleStatistics.browseNumber || 0}}</span>
          <span
            class="complain-btn"
            @click="onComplaintBtnClick"
          >投诉</span>
        </aside>
      </div>
      <div
        class="article-comment-container"
        v-if="commentListData.length"
      >
        <div class="article-comment-header van-hairline--bottom">
          评论({{commentListData.length || 0}})
        </div>
        <ul class="article-comment-ul">
          <li
            class="article-comment-li"
            v-for="item in commentListData"
            :key="item.commentId"
          >
            <img
              class="comment-user-avatar"
              src="../../../static/img/mine/yonghutouxiang.png"
              v-if="item.fromUserPhoto == null||item.fromUserPhoto == 0||item.fromUserPhoto == 1||item.fromUserPhoto == 2||item.fromUserPhoto == 3||item.fromUserPhoto == 4"
            >
            <img
              class="comment-user-avatar"
              :src="imgSrcDomain+item.fromUserPhoto"
              v-else
            >
            <div class="comment-profile van-hairline--bottom">
              <div class="comment-user-name">{{item.fromUserName}}</div>
              <div class="comment-content">{{item.content}}</div>
              <div class="comment-toolbar">
                <span class="comment-parent-dateTime">{{item.createTime}}</span>
                <i
                  class="iconfont comment-btn icon-huifu"
                  @click="onReplyIconClick(item)"
                ></i>
                <span
                  class="comment-number"
                  v-if="item.replyCount"
                >{{item.replyCount}}</span>
                <i
                  class="iconfont user-delete-icon icon-shanchu_"
                  v-if="userId === item.fromUserId"
                  @click="onReplyIconClick(item.commentId)"
                ></i>
              </div>
            </div>
          </li>
          <no-data :isNoData="isNoData"></no-data>
        </ul>
      </div>
      <div
        class="comment-reply-panel-mask"
        v-if="showReplyPanel"
      ></div>
      <div
        class="comment-reply-panel"
        v-if="showReplyPanel"
      >
        <div class="comment-reply-panel-header">
          <div class="comment-reply-panel-top van-hairline--bottom">
            <div class="comment-reply-panel-subject">全部回复({{commentChildListData.length}})</div>
            <i
              class="iconfont comment-reply-panel-close-icon icon-guanbi"
              @click="onReplayCloseIconClick"
            ></i>
          </div>
          <div class="comment-item-li child-main-comment">
            <img
              class="user-avatar-icon"
              src="../../../static/img/mine/yonghutouxiang.png"
              v-if="childMainCommentObj.fromUserPhoto == null||childMainCommentObj.fromUserPhoto == 0||childMainCommentObj.fromUserPhoto == 1||childMainCommentObj.fromUserPhoto == 2||childMainCommentObj.fromUserPhoto == 3||childMainCommentObj.fromUserPhoto == 4"
            >
            <img
              class="user-avatar-icon"
              :src="imgSrcDomain+childMainCommentObj.fromUserPhoto"
              :key="childMainCommentObj.commentId"
              v-else
            >
            <div class="comment-user-profile">
              <div class="comment-user-name">{{childMainCommentObj.fromUserName}}</div>
              <div class="comment-user-content">{{childMainCommentObj.content}}</div>
              <div class="comment-user-toolbar">
                <span class="comment-dateTime">{{childMainCommentObj.createTime && childTime}}</span>
                <i
                  class="iconfont user-reply-icon icon-huifu"
                  @click="onMainReplyIconClick"
                ></i>
              </div>
            </div>
          </div>
          <div class="comment-reply-split-line"></div>
        </div>
        <v-scroll
          ref="vChildScroll"
          v-if="isShowChildList"
          :loadData="getChildCommentList"
          :totalPageNumber="totalChildPageNumber"
        >
          <ul class="comment-item-ul comment-item-ul-child">
            <li
              class="comment-item-li"
              v-for="item in commentChildListData"
              :key="item.commentId"
            >
              <img
                class="user-avatar-icon"
                src="../../../static/img/mine/yonghutouxiang.png"
                v-if="item.fromUserPhoto == null||item.fromUserPhoto == 0||item.fromUserPhoto == 1||item.fromUserPhoto == 2||item.fromUserPhoto == 3||item.fromUserPhoto == 4"
              >
              <img
                class="user-avatar-icon"
                :src="imgSrcDomain+item.fromUserPhoto"
                :key="item.commentId"
                v-else
              >
              <div class="comment-user-profile van-hairline--bottom">
                <div class="comment-user-name">{{item.fromUserName}}</div>
                <div class="comment-user-content">{{item.content}}<span
                    v-if="item.toCommentId !== childMainCommentObj.commentId"
                    class="to-user-detail"
                  ><span class="to-user-name">//@{{item.toUserName}}:</span>{{item.toUserContent}}</span></div>
                <div class="comment-user-toolbar">
                  <span class="comment-dateTime">{{item.createTime}}</span>
                  <i
                    class="iconfont user-reply-icon icon-huifu"
                    @click="onChildReplyIconClick(item)"
                  ></i>
                  <span
                    class="comment-number"
                    v-if="item.replyCount"
                  >{{item.replyCount}}</span>
                  <i
                    class="iconfont user-delete-icon icon-shanchu_"
                    v-if="userId === item.fromUserId"
                    @click="onChildReplyIconClick(item.commentId)"
                  ></i>
                </div>
              </div>
            </li>
          </ul>
        </v-scroll>
        <no-data
          :isNoData="isNoChildData"
          class="no-child-data"
        ></no-data>
      </div>

      <div class="input-bar van-hairline--top">
        <div class="input-bg" :class="inputWidth">
          <div
            class="replay-tip"
            v-if="showReplyPanel && isReplyChildComment && replayTipValue"
          >回复<span class="replay-tip-stress">@{{replayTipValue}}</span></div>
          <div class="input-box">
            <textarea
              auto-height
              class="input-panel"
              ref="inputPanel"
              @keyup.8="backSpace"
              v-model="inputValue"
              maxlength="100"
              @input="onInputValueChange"
              placeholder="写评论~"
              @blur='onInputBlur'
              @focus="onInputFocus"
            ></textarea>
          </div>
        </div>
        <div
          class="send-btn"
          @click="onSendBtnClick"
          v-if="sendBtn"
        >发送</div>
        <div
          class="baoming-btn"
          @click="onSendBaoMing"
          v-if="inputBtnShow"
        >
          <i
            class="iconfont baoming"
            :class="activatedBtn ? '#icon-baoming_':'#icon-baoming'"
          ></i>
          <span
            class="baoming-text"
            :style="activatedBtn ? 'color: #CCCCCC':'color: #42B983'"
          >我要报名</span>
        </div>
      </div>

      <complaint
        v-if="showComplaint"
        :complaintTitle="orgName"
        @onComplaintSuccess="onComplaintSuccess"
      ></complaint>
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>
<script>
import complaint from "../complaint/index.vue";
import Article from "../../api/modules/article";
import Comment from "../../api/modules/comment";
import wxParse from 'mpvue-wxparse';
import { formatDate, getTimeSpan, mobileReg, wxShare } from "../../utils/index";
import { setTimeout } from "timers";
export default {
  components: {
    complaint,
    wxParse
  },
  data() {
    return {
      userRegOptions: {
        userName: "",
        userPost: "",
        mobilePhone: "",
        idCard: "",
        userOrgName: ""
      },
      item: "",
      regInfoStateArr: [],
      formatDate: formatDate,
      getTimeSpan: getTimeSpan,
      searchValue: "",
      isNoData: false,
      showReplyPanel: false,
      replayTipValue: "",
      isReplyChildComment: false,
      isFocus: false,
      inputValue: "",
      childCommentId: "",
      toChildCommentId: "",
      orgId: "",
      orgName: "",
      pageSize: 10,
      pageNumber: 1,
      pageChildNumber: 1,
      totalChildPageNumber: 0,
      commentListData: [],
      commentChildListData: [],
      isNoChildData: false,
      childMainCommentObj: {},
      isShowChildList: false,
      // isLogin: !!this.$store.state.userInfo,
      showComplaint: false,
      intervalTimer: null,
      articleDetailData: {},
      // userId: this.$store.state.userInfo
      //   ? this.$store.state.userInfo.userId
      //   : "",
      hierarchy: "",
      // 是否可以删除@
      lock: false,

      // 是否可以发送
      sendBtn: false,

      // 是否可以报名
      applyBtn: false,

      // 是否显示报名按钮
      inputBtnShow: false,

      // 是否超过报名日期
      activatedBtn: false,

      // 是否展开报名表单
      showFrom: false,

      // 是否在回复页面
      isReply: false
    }
  },

  // @Watch("inputValue")
  // clearReplyPanel(a) {
  //   if(a.length === 0){
  //     setTimeout(() => { this.lock = true }, 500);
  //   } else {
  //     this.lock = false;
  //   }
  // }
  computed: {
    imgSrcDomain() {
      return this.$store.state.configData.imgDomain;
    },
    articleUpdateTime() {
      return formatDate(this.articleDetailData.updateTime, "YYYY-MM-DD");
    },
    isRegEndTime() {
      return formatDate(this.articleDetailData.regEndTime, "YYYY-MM-DD");
    },
    childTime() {
      return getTimeSpan(this.childMainCommentObj.createTime, true)
    },
    inputWidth() {
      if (this.onInputValueChange() === 2) {
        return "input-width"
      }
      if (this.onInputValueChange() === 0) {
        return "input-width1"
      }
      if (this.onInputValueChange() === 1) {
        return "input-width2"
      }
    },
    isLogin() {
      return !!this.$store.state.userInfo
    },
    userId() {
      return this.$store.state.userInfo
        ? this.$store.state.userInfo.userId
        : ""
    }
  },
  onLoad(e) {
    this.orgId = e.articleId || "";
    this.getArticleDetail();
    this.$nextTick(() => {
      this.getCommentList(1);
    });
    this.lock = true;
  },
  mounted() {
    this.$nextTick(() => {
      this.applePhoneTouchMoveHacker();
    });
  },
  // beforeRouteLeave(to: object, from: object, next) {
  //   
  //   if (this.showComplaint && to.fullPath !== "/login") {
  //     this.showComplaint = false;
  //     next(false);
  //   } else {
  //     next();
  //   }
  // },
  methods: {
    onSendBaoMing() {
      if (this.activatedBtn) {
        return;
      }
      this.showFrom = true;
    },
    onSendInput() {
      this.inputShow = true;
      this.isFocus = true;
      // var input = document.getElementsByClassName("input-panel")[0];
      // input.focus();
      this.$refs.inputPanel.focus();
    },
    getArticleDetail() {
      const articleId = this.orgId;
      if (!articleId) return;
      const data = {
        articleId
      };
      Article.query_article(data, (res) => {
        if (res.code === 0) {
          // 判断文章是否可以报名
          if (res.data.isOpenReg) {
            this.applyBtn = true;
            this.inputBtnShow = true;
            if (res.data.regEndTime < new Date().getTime()) {
              this.activatedBtn = true;
            } else {
              this.activatedBtn = false;
            }
          } else {
            this.applyBtn = false;
            this.inputBtnShow = false;
            this.inputShow = true;
          }

          // 在这儿改动需要改动的内容
          if (res.data.articleTitle.length > 4) {
            this.$store.commit(
              "setTitle",
              res.data.articleTitle.slice(0, 4) + "..."
            );
          } else {
            this.$store.commit("setTitle", res.data.articleTitle);
          }
          // 在这儿改动需要改动的内容

          const resData = res.data;
          resData && (resData.intro = decodeURIComponent(resData.intro)) && (this.articleDetailData = resData) && (this.orgName = resData.articleTitle);
          this.regInfoStateArr = resData.regInfo ? resData.regInfo.split(",") : [];
          this.hierarchy = resData.hierarchy;
        } else {
          this.$toast(res.msg || "");
        }
      });
    },
    getCommentList(_pageNum) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      if (this.isFocus) return;
      if (!this.orgId) return;
      let data = {
        pageNum: _pageNum || this.pageNumber,
        pageSize: 99,
        resourcesType: 2,
        resourcesId: this.orgId,
        sortField: "createTime"
      };
      Comment.comment_list(data, (res) => {
        if (res.code === 0) {
          const result = res.data.result;
          const len = result.length;
          this.isNoData = !len;
          if (len) {
            result.forEach((item) => {
              item.content = decodeURIComponent(item.content);
            });
            this.commentListData = result;
            const len = this.commentListData.length;
            for (let i = 0; i < len; i++) {
              this.commentListData[i].createTime = getTimeSpan(this.commentListData[i].createTime, true);
            }
          } else {
            this.commentListData = [];
          }
        } else {
          this.$toast(res.msg || "");
        }
      }, (error) => {
        this.isNoData = true;
      });
    },
    getChildCommentList(_pageNum) {
      /**
       * 2种写法都可以 return new Promise  或者return TestReq
       */
      if (this.isFocus) return;
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageChildNumber,
          pageSize: this.pageSize,
          commentId: this.childCommentId,
          sortField: "createTime",
          resourcesType: 2,
          resourcesId: this.orgId
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
            });
            this.commentChildListData = this.commentChildListData.concat(
              resData
            );
            const len = this.commentChildListData.length;
            for (let i = 0; i < len; i++) {
              this.commentChildListData[i].createTime = getTimeSpan(this.commentChildListData[i].createTime, true);
            }
            this.totalChildPageNumber = res.data.pages;
            //当前页不等于总页数的时候和 总页数大于0的时候 做++
            if (
              this.pageChildNumber !== this.totalChildPageNumber &&
              this.totalChildPageNumber !== 0
            ) {
              ++this.pageChildNumber;
            }
          } else {
            this.isShowChildList = true;
            this.$toast(res.msg);
          }
          resolve();
        }, (error) => {
          this.isShowChildList = true;
          // 或者使用ts注释
          if (!error.Cancel) {
            this.$refs.vChildScroll &&
              (this.$refs.vChildScroll).errorLog(error);
          }
          // return Promise.reject(error);
          reject(error);
        })
        setTimeout(() => {
          this.$toast.clear();
        }, 500);
      });
    },

    applePhoneTouchMoveHacker() {
      // const $input = document.getElementsByClassName("input-panel")[0];
      // $input.onfocus = () => {
      //   this.intervalTimer = setTimeout(function() {
      //     document.body.scrollTop = document.body.scrollHeight;
      //   }, 400);
      // };
      // $input.onblur = () => {
      //   this.intervalTimer && clearTimeout(this.intervalTimer);
      // };
    },

    onReplyIconClick(item) {
      if (!this.isLogin) {
        this.$dialog
          .alert({
            title: "温馨提示",
            message: "游客不能评论，请先登录~",
            showCancelButton: true
          })
          .then(() => {
            wx.navigateTo({ url: "../login/main" })
          })
          .catch((error) => { });
        return;
      }
      if (!item.commentId) return;
      this.inputShow = true;
      this.isReply = true;
      this.childCommentId = item.commentId;
      this.childMainCommentObj = item;
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
        commentId: commentId
      };
      Comment.delete_comment(data, (res) => {
        if (res.code === 0) {
          this.getCommentList(1);
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onReplayCloseIconClick() {
      this.initReplyPanelStatus();
      this.isReply = false;
      this.inputShow = false;
    },
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
      this.getCommentList(1);
    },
    onMainReplyIconClick() {
      this.replayTipValue = "";
      this.isReplyChildComment = false;
      this.toChildCommentId = "";

      this.$refs.inputPanel.focus();
    },
    onChildReplyIconClick(item) {
      if (!this.isLogin) {
        this.$dialog
          .alert({
            title: "温馨提示",
            message: "游客不能评论，请先登录~",
            showCancelButton: true
          })
          .then(() => {
            wx.navigateTo({ url: "../login/main" })
          })
          .catch(() => { });
        return;
      }
      const toChildCommentId = item.commentId;
      if (!toChildCommentId) return;
      this.replayTipValue = item.fromUserName;
      this.isReplyChildComment = true;
      this.toChildCommentId = toChildCommentId;
      this.inputShow = true;

      this.$refs.inputPanel.focus();
    },
    onChildDeleteIconClick(commentId) {
      if (!commentId) return;
      const data = {
        commentId: commentId
      };
      Comment.delete_reply(data, (res) => {
        if (res.code === 0) {
          this.getChildCommentList(1);
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onSendBtnClick() {
      if (!this.isLogin) {
        this.$dialog
          .alert({
            title: "温馨提示",
            message: "游客不能评论，请先登录~",
            showCancelButton: true
          })
          .then(() => {
            wx.navigateTo({ url: "../login/main" })
          })
          .catch(() => { });
        return;
      }
      const inputValue = this.inputValue;
      if (!inputValue) return;
      const orgId = this.orgId;
      if (!orgId) return;
      const orgName = this.orgName;
      if (!orgName) return;
      const data = {
        resourcesId: orgId,
        resourcesType: 2,
        resourcesName: orgName,
        content: encodeURIComponent(inputValue),
        fromUserId: this.userId,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.$store.state.userInfo.token
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
          this.inputValue = "";
          if (!showReplyPanel) {
            this.pageNumber = 1;
            this.getCommentList(1);
          } else {
            this.pageChildNumber = 1;
            this.totalChildPageNumber = 0;
            this.isShowChildList = false;
            this.commentChildListData = [];
            this.getChildCommentList(1);
          }
        } else {
          this.$toast(res.msg || "");
        }
      });
    },
    onRegBtnClick() {
      const articleId = this.orgId;
      if (!articleId) return;
      const data = {
        articleId
      };
      const userRegOptions = this.userRegOptions;
      if (!userRegOptions.userName) {
        this.$toast("请输入姓名！");
        return;
      }
      data.realName = userRegOptions.userName;
      if (!userRegOptions.mobilePhone) {
        this.$toast("请输入手机号码！");
        return;
      }
      if (!mobileReg(userRegOptions.mobilePhone)) {
        this.$toast("手机号码不合法！");
        return;
      }
      data.phone = userRegOptions.mobilePhone;
      const regInfoStateArr = this.regInfoStateArr;
      if (regInfoStateArr.indexOf("身份证号") > -1) {
        if (!userRegOptions.idCard) {
          this.$toast("请输入身份证号！");
          return;
        }
        if (
          !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(userRegOptions.idCard)
        ) {
          this.$toast("身份证号不合法！");
          return;
        }
        data.idCard = userRegOptions.idCard;
      }
      if (regInfoStateArr.indexOf("职务") > -1) {
        if (!userRegOptions.userPost) {
          this.$toast("请输入职务！");
          return;
        }
        data.post = userRegOptions.userPost;
      }
      if (regInfoStateArr.indexOf("公司名称") > -1) {
        if (!userRegOptions.userOrgName) {
          this.$toast("请输入所在单位！");
          return;
        }
        data.orgName = userRegOptions.userOrgName;
      }
      const hierarchy = this.hierarchy;
      hierarchy && (data.hierarchy = hierarchy);
      Article.create_articleReg(data, (res) => {
        if (res.code === 0) {
          this.userRegOptions = {
            userName: "",
            userPost: "",
            mobilePhone: "",
            idCard: "",
            userOrgName: ""
          };
          this.showFrom = false;
          this.$dialog
            .alert({
              message: "您的报名申请已提交成功，等待管理员审核~"
            })
            .then(() => { });
        } else {
          this.$toast(res.msg || "");
        }
      });
    },
    onComplaintBtnClick() {
      if (!this.isLogin) {
        this.$dialog
          .alert({
            title: "温馨提示",
            message: "游客不能评论，请先登录~",
            showCancelButton: true
          })
          .then(() => {
            wx.navigateTo({ url: "../login/main" })
          })
          .catch(() => { });
        return;
      }
      this.showComplaint = true;
    },
    onComplaintSuccess() {
      this.showComplaint = false;
    },
    onInputValueChange() {
      const $inputValue = this.inputValue;
      if ($inputValue.length > 0){
        this.inputBtnShow = false;
        this.sendBtn = true;
        return 0;
      } else {
        if (this.applyBtn === true){
          this.sendBtn = false;
          this.inputBtnShow = true;
          return 1;
        } else {
          this.sendBtn = false;
          this.inputBtnShow = false;
          return 2;
        }
      }
      
    },

    onInputBlur() {
      this.isFocus = false;
      if (this.inputBtnShow && !this.isReply) {
        this.inputShow = false;
      }
    },

    onInputFocus() {
      this.isFocus = true;
    },
    backSpace() {
      if (this.lock) {
        if (this.inputValue.length === 0) {
          this.isReplyChildComment = false;
        }
      }
    }
  }

}
</script>
<style lang="scss" scoped>
  /deep/ .van-actionsheet__content {
    padding: half(50) half(20) half(0) half(20);
    overflow: hidden;
  }
  .main-box {
    -webkit-overflow-scrolling: touch;
    .article-detail {
      position: relative;
      min-height: 100%;
      padding-bottom: half(98);
      font-size: half(26);
      color: #000;
      .article-detail-container,
      .article-comment-container {
        background-color: #fff;
      }
      .article-detail-container {
        padding: half(30) half(20);
        margin-bottom: half(20);
      }
      .article-header {
        // height: half(52);
        margin-bottom: half(30);
        font-size: half(40);
        font-weight: bold;
        word-wrap: break-word;
      }
      .article-profile {
        height: half(62);
        font-size: half(28);
        color: #999;
      }
      .article-resource {
        margin-left: half(30);
        color: #42b983;
      }
      .article-content {
        overflow-x: hidden;
        padding: half(27) 0 half(80);
        font-size: half(30);
        display: block;
      }
      .article-enroll-panel {
        margin-bottom: half(60);
      }
      .enroll-deadline {
        margin-bottom: half(30);
        text-align: center;
        color: #999;
      }
      .enroll-header {
        margin-bottom: half(20);
        text-align: center;
        font-size: half(34);
        font-weight: bold;
      }
      .enroll-item {
        height: half(88);
        display: flex;
        align-items: center;
        margin-bottom: half(20);
        font-size: half(32);
        background-color: #f2f2f2;
        border-radius: half(10);
      }
      .enroll-item-sub {
        width: half(184);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .enroll-item-split {
        display: inline-block;
        width: half(2);
        height: half(48);
        background-color: #CCC;
      }
      .enroll-item-input {
        flex: 1;
        padding: 0 half(30);
        background-color: transparent;
      }
      .enroll-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: half(88);
        margin-top: half(30);
        margin-bottom: half(-20);
        font-size: half(32);
        color: #fff;
        background-color: #42b983;
        border-radius: half(10);
      }
      .article-tip {
        display: flex;
        align-items: center;
        color: #999;
        font-size: half(28);
      }
      .browser-num {
        flex: 1;
      }
      .article-comment-header {
        height: half(70);
        padding-left: half(20);
        display: flex;
        align-items: center;
        font-size: half(32);
        color: #121212;
      }
      .article-comment-ul {
        padding: 0 half(20) half(16);
      }
      .article-comment-li {
        display: flex;
        padding-top: half(16);
      }
      .comment-user-avatar {
        width: half(80);
        height: half(80);
        margin-right: half(20);
        border-radius: 50%;
      }
      .comment-profile {
        flex: 1;
        padding-bottom: half(16);
      }
      .comment-user-name {
        margin-bottom: half(18);
        font-size: half(28);
        color: #42b983;
      }
      .comment-content {
        margin-bottom: half(20);
        font-size: half(32);
        color: #333;
        word-break: break-all;
      }
      .comment-toolbar {
        display: flex;
        align-items: center;
        font-size: half(24);
        color: #999;
      }
      .comment-parent-dateTime {
        flex: 1;
      }
      .comment-btn {
        width: half(32);
        height: half(32);
      }
      .input-bar {
        position: fixed;
        z-index: 3;
        bottom: 0;
        left: 0;
        right: 0;
        padding: half(20) half(24);
        display: flex;
        flex: 1;
        justify-content: space-between;
        background: #fff;
        .input-width{
          width: 100%;
        }
        .input-width1{
          width: half(556);
        }
        .input-width2{
          width: half(492);
        }
        .input-bg {
          padding-left: half(20);
          padding-top: half(10);
          min-height: half(58);
          background-color: #f5f5f5;
          border-radius: half(10);
          color: #fefefe;
          .input-box {
            position: relative;
          }
          .input-panel {
            font-size: half(32);
            color: #000;
            width: 100%;
          }
        }
        .baoming-btn {
          height: 100%;
          line-height: half(50);
          .baoming {
            font-size: half(30);
            padding-left: half(22);
            padding-right: half(10);
            display:inline;
          }
          .baoming-text {
            font-size: half(32);
            font-family: PingFang-SC-Regular;
            color: #42b983;
          }
        }
        .send-btn {
          position: absolute;
          bottom: half(20);
          right: half(24);
          flex: 1;
          width: half(120);
          height: half(58);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-basis: half(120);
          margin-left: half(24);
          border-radius: half(6);
          font-size: half(32);
          color: #fff;
          background-color: #42b983;
        }
      }

      .default-plac {
        color: #999;
      }
      .replay-tip {
        height: half(54);
        font-size: half(32);
        color: #999;
      }
      // .replay-tip-stress {
      //   color: #42b983;
      // }
      .input-icon {
        width: half(30);
        height: half(30);
      }
      .complaint {
        z-index: 3;
      }
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
        .v-scroll {
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          /*padding-top: half(320) !important;*/
          padding-top: 0 !important;
          flex: 1;
        }
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
        width: half(32);
        height: half(32);
      }
      .comment-number {
        padding-left: half(14);
        font-size: half(28);
        color: #666;
      }
      .comment-reply-panel-subject {
        flex: 1;
      }
      .comment-reply-panel-close-icon {
        width: half(32);
        height: half(32);
      }
      .child-main-comment {
        padding: half(20) half(20) 0;
        margin-bottom: 0;
      }
      .comment-reply-split-line {
        height: half(20);
        background-color: #f2f2f2;
      }
    }
    .position-btn-publish-inner {
      position: fixed;
      z-index: 2;
      bottom: 0;
      right: 0;
      height: half(98);
      width: half(300);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #42b983;
      font-size: half(32);
      font-family: PingFang-SC-Medium;
      color: rgba(255, 255, 255, 1);
    }
    .position-btn-publish-inner.activated {
      background-color: #CCC;
    }
  }
</style>

<style lang="scss">
  .article-content img {
    max-width: 100%;
  }
</style>

