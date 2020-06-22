/**
*@author leo
*@dateTime 2018/8/1
*@description created
*/
<template>
  <transition name="van-fade">
    <div class="jobClassify" :class="selectNum > 1 ? 'pad_b_100': ''">
      <van-collapse v-model="activeNames" class="main_collapse" v-if="selectNum > 1">
        <van-collapse-item title="已选职能" class="title_van_cell" :border="false" name="1" :value="(this.selectList.length || '0') + '/' + selectNum">
          <div class="activeShow">
            <span v-if="selectList.length" v-for="(item, index) in selectList" :key="index">{{item.text}}
              <i class="iconfont activeShow_icon icon-cha" @click="onDelete(item, index)"></i>
            </span>
            <div class="tip" v-if="selectList <= 0">请选择职能 ...</div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <div v-if="jobClassify.length > 0">
        <van-cell-group class="header-cell-group" :class="selectNum > 1 ? 'mar_t_110': ''">
          <template v-for="(firstItem, firstIndex) in jobClassify">
            <van-cell center :title="firstItem.jobClassifyName" class="main_list" :key="firstItem.jobClassifyId" />
            <template v-for="(secondItem, secondIndex) in firstItem.children">
              <van-cell :value="secondItem.selectSum ? '已选' + secondItem.selectSum + '个' : ''" :key="secondItem.jobClassifyId" center :title="secondItem.jobClassifyName" is-link @click="onSecondItem(firstIndex, secondIndex)" />
            </template>
          </template>
        </van-cell-group>
        
        <van-actionsheet v-model="thirdlyShow" title="" class="actionsheet">
          <div class="content_list">
            <div class="text_list" v-for="(thirdlyItem, thirdlyIndex) in jobClassify[firstIndex].children[secondIndex].children" :key="thirdlyItem.jobClassifyId" @click="onThirdlyItem(thirdlyIndex)">
              <span>{{thirdlyItem.jobClassifyName}}</span>
              <i class="iconfont zx-svg text_list_icon icon-gou"  v-if="thirdlyItem.select"></i>
            </div>
          </div>

        </van-actionsheet>
      </div>

      <van-button v-if="selectNum > 1" class="ok_class" size="large" @click="onOkClick" text="选好了"></van-button>
    </div>
    <van-toast id="van-toast" />
  </transition>
</template>

<script>
import File from "../../api/modules/userFile";
  
export default {
  props: {
    selectNum: {
      type: Number,
      default: 1
    },
    selectPropsData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    selectOnePropsData: {
      type: Object,
      default: function() {
        return { };
      }
    }
  },
  data() {
    return {
      // 显示第三列表
      thirdlyShow: false,
      activeNames: [1],
      // 总数据
      jobClassify: [],
      // 第一层下标
      firstIndex: 0,
      // 第二层下标
      secondIndex: 0,
      // 第三层下标
      thirdlyIndex: 0,
      // 当前选中的数据
      selectList: []
    }
  },
  methods: {
    onDelete(item, i) {
      this.selectList.splice(i, 1);
      this.jobClassify[item.firstIndex].children[item.secondIndex].children[
        item.thirdlyIndex
      ].select = false;
      Vue.set(
        this.jobClassify[item.firstIndex].children[item.secondIndex],
        "selectSum",
        this.setSelectSum(item.firstIndex, item.secondIndex)
      );
    },

    onSecondItem(firstIndex, secondIndex) {
      this.thirdlyShow = true;
      this.firstIndex = firstIndex;
      this.secondIndex = secondIndex;
    },

    onThirdlyItem(thirdlyIndex) {
      this.thirdlyIndex = thirdlyIndex;
      var selectObj = this.jobClassify[this.firstIndex].children[this.secondIndex]
        .children[this.thirdlyIndex];
      if (selectObj.select) {
        Vue.set(selectObj, "select", false);
        this.selectList.forEach((val, i) => {
          if (val.id == selectObj.jobClassifyId) {
            this.selectList.splice(i, 1);
          }
        });
      } else {
        if (this.selectNum <= 1) {
          this.getJobClassifyTree();
          Vue.set(selectObj, "select", true);
          this.selectList = [];
          this.selectList[0] = {
            id: selectObj.jobClassifyId,
            text: selectObj.jobClassifyName,
            firstIndex: this.firstIndex,
            secondIndex: this.secondIndex,
            thirdlyIndex: this.thirdlyIndex
          };
          Vue.set(
            this.jobClassify[this.firstIndex].children[this.secondIndex],
            "selectSum",
            this.setSelectSum(this.firstIndex, this.secondIndex)
          );
          this.onOkClick();
          return;
        }
        if (this.selectList.length >= this.selectNum) {
          this.$toast("选择职能达到上限！");
          return;
        }
        Vue.set(selectObj, "select", true);
        this.selectList.push({
          id: selectObj.jobClassifyId,
          text: selectObj.jobClassifyName,
          firstIndex: this.firstIndex,
          secondIndex: this.secondIndex,
          thirdlyIndex: this.thirdlyIndex
        });
      }
      Vue.set(
        this.jobClassify[this.firstIndex].children[this.secondIndex],
        "selectSum",
        this.setSelectSum(this.firstIndex, this.secondIndex)
      );
    },
    setSelectSum(firstIndex, secondIndex) {
      var selectSum = 0;
      this.jobClassify[firstIndex].children[secondIndex].children.forEach(val => {
        if (val.select) {
          selectSum++;
        }
      });
      return selectSum;
    },
    onOkClick() {
      if (this.selectNum <= 1) {
        let onOneOkClickList = {};
        onOneOkClickList.jobClassifyId = this.selectList[0].id;
        onOneOkClickList.jobClassifyName = this.selectList[0].text;
        this.$emit("finishSelect", onOneOkClickList);
      } else {
        let onOkClickList = [];
        this.selectList.forEach(val => {
          onOkClickList.push(val.id);
        });
        this.$emit("finishSelect", onOkClickList);
      }

      this.thirdlyShow = false;
      this.show = false;
    },
    getJobClassifyTree() {
      let data = {
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.$store.state.userInfo.token
      };
      File.jobclassify_tree(data,(res) => {
        if (res.code === 0) {
          this.jobClassify = res.data;
          this.init();
        } else {
          this.$toast(res.msg);
        }
      });
    },

    init() {
      if (this.selectOnePropsData && this.selectNum <= 1) {
        let item = this.findJobClassify(
          this.jobClassify,
          this.selectOnePropsData.jobClassifyId
        );
        this.initSelect(item);
        return;
      }
      for (let i = 0; i < this.selectPropsData.length; i++) {
        let item = this.findJobClassify(
          this.jobClassify,
          this.selectPropsData[i]
        );
        this.initSelect(item);
      }
    },
    initSelect(item) {
      if (item) {
        Vue.set(
          this.jobClassify[item.firstIndex].children[item.secondIndex].children[
            item.thirdlyIndex
          ],
          "select",
          true
        );
        Vue.set(
          this.jobClassify[item.firstIndex].children[item.secondIndex],
          "selectSum",
          this.setSelectSum(item.firstIndex, item.secondIndex)
        );
        this.selectList.push(item);
      }
    },

    findJobClassify(jobClassify, id) {
      for (let fi = 0; fi < jobClassify.length; fi++) {
        for (let si = 0; si < jobClassify[fi].children.length; si++) {
          for (
            let ti = 0;
            ti < jobClassify[fi].children[si].children.length;
            ti++
          ) {
            if (jobClassify[fi].children[si].children[ti].jobClassifyId == id) {
              return {
                id: jobClassify[fi].children[si].children[ti].jobClassifyId,
                text: jobClassify[fi].children[si].children[ti].jobClassifyName,
                firstIndex: fi,
                secondIndex: si,
                thirdlyIndex: ti
              };
            }
          }
        }
      }
    }
  },
  onLoad() {
    this.getJobClassifyTree();
  }
}
</script>

<style lang="scss" scoped>
  /deep/{
    .van-collapse-item__content{
      padding: half(0);
    }
    .van-cell__title {
      font-size: half(34);
      flex: 2.5;
    }
    .van-cell__value {
      font-size: half(28);
      margin-right: half(20);
      font-weight: 500;
      color: rgb(153, 153, 153);
    }
    .van-cell:not(:last-child)::after {
      left: 0;
    }
    .main_list .van-cell__title {
      color: rgb(66, 185, 131);
      font-weight: bold;
    }
    .title_van_cell .van-cell__title {
      font-weight: bold;
    }
  }
  .main_collapse {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 12;
    width: 100%;
  }
  .tip {
    text-align: center;
    font-size: half(30);
    color: rgb(102, 102, 102);
    padding-bottom: half(25);
  }
  .actionsheet {
    height: half(700);
    .text_list {
      height: half(80);
      line-height: half(80);
      font-size: half(32);
      margin-left: half(30);
      .text_list_icon {
        font-size: half(40);
        float: right;
        margin-right: half(30);
        margin-top: half(17);
      }
    }
    .content_list {
      margin-top: half(15);
    }
  }
  // .actionsheet .text_title {
  //   height: half(87);
  //   font-size: half(32);
  //   line-height: half(87);
  //   font-weight: 400;
  //   position: fixed;
  //   bottom: half(620);
  //   left: 0;
  //   z-index: 15;
  //   width: 100%;
  //   background-color: #ffffff;
  //   .cancel_btn {
  //     color: rgb(153, 153, 153);
  //     margin-left: half(31);
  //   }
  //   .confirm_btn {
  //     float: right;
  //     color: rgb(66, 185, 131);
  //     margin-right: half(31);
  //   }
  // }

  .ok_class {
    position: fixed;
    bottom: 0;
  }
  .mar_t_110 {
    margin-top: half(110);
  }
  .pad_b_100 {
    padding-bottom: half(100);
  }
  .jobClassify {
    min-height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
    background-color: rgb(242, 242, 242);
    overflow: auto;
    .activeShow {
      width: 100%;
      background-color: rgb(242, 242, 242);
      padding: half(30) half(30) half(0) half(0);
      overflow: auto;
      span {
        display: block;
        float: left;
        padding: 0 half(32) 0 half(32);
        height: half(60);
        line-height: half(62);
        border-radius: half(35);
        font-size: half(30);
        background-color: #ffffff;
        margin-left: half(30);
        margin-bottom: half(30);
        color: rgb(102, 102, 102);
        .activeShow_icon {
          font-size: half(20);
          margin-left: half(13);
        }
      }
    }
  }
</style>



