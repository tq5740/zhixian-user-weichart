/**
*@author leo
*@dateTime 2018/8/14
*@description created
*/
<template>
  <div id="articleList">
    <ul class="article-top-bar van-hairline--bottom">
      <li
        class="article-item"
        :class="{'active':currentCategoryId === ''}"
        @click="onCategoryItemClick('')"
      >全部</li>
      <li
        class="article-item"
        :class="{'active':currentCategoryId === item.categoryId}"
        v-for="item in categoryListData"
        :key="item.categoryId"
        @click="onCategoryItemClick(item.categoryId)"
      >{{item.categoryTitle}}</li>
    </ul>
    <van-search
      class="van-hairline--bottom"
      :value="searchValue"
      @change="searchChange"
      placeholder="请输入关键词进行搜索"
      use-action-slot
      @click="onSearch"
    >
      <div
        slot="action"
        @click="onSearch"
      >搜索</div>
    </van-search>
    <v-scroll
      ref="vScroll"
      v-if="isShowList"
      :loadData="getArticleList"
      :totalPageNumber="totalPageNumber"
    >
      <ul class="article-ul">
        <li
          class="article-li van-hairline--bottom"
          v-for="item in articleListData"
          :key="item.articleId"
          @click="onArticleItemClick(item.articleId)"
        >
          <img
            lazy-load="configData.imgDomain+item.articleImg"
            class="article-li-avatar"
          >
          <div class="article-li-profile">
            <div class="article-subject">{{item.articleTitle}}</div>
            <div class="article-tip">
              <span class="article-dateTime">{{item.updateTime && getTimeSpan(item.updateTime,true)}}</span>
              <span class="article-browser-num">
                <i class="iconfont browser-icon icon-liulan"></i>{{item.articleStatistics && item.articleStatistics.browseNumber || 0}}</span>
            </div>
          </div>
        </li>
      </ul>
    </v-scroll>
    <no-data :isNoData="isNoData"></no-data>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Article from "../../api/modules/article";
import Category from "../../api/modules/category";
import { getTimeSpan } from "../../utils/index";
export default {
  data() {
    return {
      getTimeSpan: getTimeSpan,
      totalPageNumber: 0,
      pageSize: 10,
      pageNumber: 1,
      searchValue: "",
      isNoData: false,
      isShowList: true,
      articleListData: [],
      categoryListData: [],
      currentCategoryIds: "",
      currentCategoryId: "",
      orgId: configData.orgId
    }
  },

  onLoad() {
    this.$store.commit("setTitle", "资讯");
    this.getCategoryList();
    this.getArticleList(1);
  },
  methods: {
    searchChange(e) {
      if(typeof e.mp.detail === "object"){
        this.searchValue = e.mp.detail.value;
      } else {
        this.searchValue = e.mp.detail;
      }
    },
    onArticleItemClick(articleId) {
      this.$router.push({
        path: "/b",
        query: {
          articleId: articleId
        }
      });
      // wx.navigateTo({url: 'pages/articleDetail/main?articleId=" + articleId'});
      // articleId && this.$router.push("/articleDetail?articleId=" + articleId);
    },
    onSearch() {
      this.getArticleList(1);
    },
    getCategoryList() {
      const data = {
        type: 2,
        orgId: configData.orgId
      };
      Category.category_list(data, (res) => {
        if (res.code === 0) {
          const resData = res.data;
          resData && resData.length && (this.categoryListData = resData);
        }
      });
    },
    onCategoryItemClick(categoryId) {
      this.currentCategoryId = categoryId;
      this._handleCurrentCategoryIds(categoryId);
      this.getArticleList(1);
    },
    _handleCurrentCategoryIds(categoryId) {
      if (categoryId === "") {
        this.currentCategoryIds = "";
        return;
      }
      const categoryListData = this.categoryListData;
      const len = categoryListData.length;
      for (let i = 0; i < len; i++) {
        const currentParent = categoryListData[i];
        if (currentParent.categoryId === categoryId) {
          let tempStr = [currentParent.categoryId];
          const children = currentParent.children;
          const childLen = children.length;
          for (let k = 0; k < childLen; k++) {
            tempStr.push(children[k].categoryId);
          }
          this.currentCategoryIds = tempStr.join();
          return;
        }
      }
    },
    getArticleList(_pageNum) {
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: _pageNum || this.pageNumber,
          pageSize: this.pageSize,
          sortField: "updateTime",
          query: this.searchValue,
          categoryIds: this.currentCategoryIds,
          orgId: this.orgId
        };
        Article.article_list(data, (res) => {
          if (res.code === 0) {
            //没有数据的时候
            const result = res.data.result;
            if (result.length === 0) {
              this.isNoData = true;
              this.isShowList = false;
              return;
            } else {
              this.isNoData = false;
            }
            !this.isShowList && (this.isShowList = true);
            // 调用第一页的时候
            if (_pageNum) {
              this.articleListData = [];
              this.pageNumber = _pageNum;
            }
            this.articleListData = this.articleListData.concat(result);
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
          this.isShowList = true;
        }, error => {
          this.isShowList = true;
          if (!error.Cancel) {
            this.$refs.vScroll && (this.$refs.vScroll).errorLog(error);
          }
        });
      });
    }
  },
  computed: {
    configData() {
      return this.$store.state.configData;
    }
  }
}
</script>
<style lang="scss" scoped>
  #articleList {
    position: relative;
    min-height: 100%;
    
    font-size: half(26);
    .article-top-bar {
      position: fixed;
      z-index: 3;
      top: 0;
      left: 0;
      right: 0;
      height: half(88);
      padding-left: half(20);
      display: flex;
      align-items: center;
      overflow-x: auto;
      white-space: nowrap;
      font-size: half(32);
      color: #000;
      background-color: #fff;
    }
    .browser-icon {
      width: half(28);
      height: half(18);
      font-size: half(18);
      margin-right: half(8);
    }
    .article-item {
      margin-right: half(50);
    }
    .article-item.active {
      color: #42b983;
    }
    .article-item:last-child {
      margin-right: 0;
      padding-right: half(20);
    }
    .van-search {
      margin-top: half(88);
      background-color: #f2f2f2 !important;
    }
    /deep/ {
      .van-cell {
        background-color: #fff;
      }
      .van-field__body {
        width: 100%;
      }
      .van-cell__value {
        flex-direction: row !important;
        font-size: half(28) !important;
      }
      .van-search__action {
        padding: 0 half(30);
        color: #333;
      }
    }
    .v-scroll {
      padding-top: half(180);
    }
    .article-ul {
      padding: 0 half(20);
      background-color: #fff;
      margin-bottom: half(38);
    }
    .article-li {
      display: flex;
      padding: half(30) 0;
    }
    .article-li:last-child:after {
      border: none;
    }
    .article-dateTime {
      flex: 1;
    }
    .article-tip {
      font-size: half(24);
      color: #999;
    }
    .article-tip {
      display: flex;
      align-items: center;
    }
    .article-subject {
      margin-bottom: half(18);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: half(32);
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    .article-li-avatar {
      width: half(240);
      height: half(136);
      margin-right: half(20);
    }
    .article-li-profile {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .article-subject {
      flex: 1;
    }
  }
</style>
