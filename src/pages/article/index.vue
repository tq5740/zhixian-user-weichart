/**
*@author leo
*@dateTime 2018/8/14
*@description created
*/
<template>
  <div class="main-box">
    
  </div>
</template>
<script>

export default {

  
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
      .input-h226 {
        width: half(750);
        position: fixed;
        z-index: 3;
        bottom: 0;
        left: 0;
        right: 0;
        padding: half(20) half(31) half(20) half(30);
        display: flex;
        align-items: flex-end;
        color: #fefefe;
        background-color: rgba(255, 255, 255, 1);
      }
      .input-bar {
        position: fixed;
        z-index: 3;
        bottom: 0;
        left: 0;
        right: 0;
        padding: half(20) half(30) half(20) half(20);
        display: flex;
        align-items: flex-end;
        color: #fefefe;
        height: half(98);
        background-color: rgba(255, 255, 255, 1);
        .shurukuang {
          width: half(490);
          height: half(60);
        }
        .baoming-btn {
          height: 100%;
          line-height: half(50);
          .baoming {
            width: half(30);
            height: half(30);
            margin-left: half(37);
            margin-right: half(12);
            margin-top: half(16);
          }
          .baoming-text {
            font-size: half(32);
            font-family: PingFang-SC-Regular;
            color: rgba(66, 185, 131, 1);
          }
        }
      }
      .send-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: half(31);
        font-size: half(30);
        color: rgba(66, 185, 131, 1);
      }
      .input-box {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
      }
      .input-panel {
        flex: 1;
        box-sizing: border-box;
        padding: half(13) half(20);
        border-radius: half(10);
        max-height: half(166);
        min-height: half(46);
        user-select: auto;
        word-break: break-all;
        overflow-x: hidden;
        overflow-y: auto;
        outline: none;
        white-space: pre-wrap;
        text-align: left;
        background-color: #f2f2f2;
        font-size: half(28);
        color: #333333;
        -webkit-user-modify: read-write-plaintext-only;
        // user-modify: read-write-plaintext-only;
        &:empty:before {
          content: attr(placeholder);
          display: block;
          color: #CCC;
        }
        &::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          color: #CCC !important;
        }
        &:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #CCC !important;
        }
        &::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #CCC !important;
        }
        &:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #CCC !important;
        }
      }
      .replay-tip {
        height: half(46);
        padding-bottom: half(2);
        font-size: half(32);
        color: #CCC;
      }
      .replay-tip-stress {
        color: #42b983;
      }
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
