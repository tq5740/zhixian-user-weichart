<template>
  <div class="setTimeAddress">
    <div class="setTimeAddress_title van-hairline--bottom">
      <span class="setTimeAddress_title_t1" @click="cancel">取消</span>
      <span class="setTimeAddress_title_t2" @click="confirm">确定</span>
    </div>
    <van-radio-group v-model="radio" class="box">
      <div class="setTimeAddress_cont van-hairline--bottom van-hairline--top margin_t_20" v-for="itme in 8" :key="itme">
        <div class="setTimeAddress_cont_t1 van-hairline--right" @click="editAdd(itme)">
          <img class="img_WH" src="../../../static/img/logo.png" alt="">
          <br>
          <span>编辑</span>
        </div>
        <div class="setTimeAddress_cont_t2"  @click="radio = ''+itme">
          <div class="setTimeAddress_cont_t2_address">四川省成都市高新区天府大道天府大道天府大道天府大道</div>
          <div class="setTimeAddress_cont_t2_info">联系人：张三 联系电话：12312</div>
        </div>
        <div class="setTimeAddress_cont_t3" style="">
          <van-radio :name="''+itme"></van-radio>
        </div>
        <!-- <div>
        </div> -->
      </div>
        <div class="create-new-address" v-if="showNewBar" @click="addAddress">
            <i class="van-icon van-icon-add van-cell__left-icon address-icon"></i>新增地址
        </div>
    </van-radio-group>

  </div>
</template>

<script>
export default {
  props: {
    showNewBar: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      radio: "1"
    }
  },
  methods: {
    //  取消
    cancel() {
      this.$emit("cancel");
    },
    //  确实
    confirm() {
      this.$emit("confirm", this.radio);
    },
    //  编辑
    editAdd(e) {
      this.$emit("editAdd", e);
    },
    //新增地址
    addAddress() {
      this.$emit("addAddress");
    }  
  }
}
</script>
<style lang="scss" scoped>
.setTimeAddress {
  font-size: half(24);
  height: half(800);
  position: relative;
  overflow: hidden;
  .create-new-address {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: half(28) 0;
    color: #999;
    font-size: half(32);
  }
  .address-icon {
    margin-right: half(20);
  }
  .margin_b_30 {
    margin-bottom: half(30);
  }
  .margin_t_20 {
    margin-top: half(20);
  }
  .img_WH {
    width: half(40);
    height: half(40);
  }
  .setTimeAddress_title {
    height: half(88);
    font-size: half(32);
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: fixed;
    top: 0;
    background: #fff;
    z-index: 1;
    .setTimeAddress_title_t1 {
      color: #999;
      padding: half(20) half(30);
    }
    .setTimeAddress_title_t2 {
      color: #42b983;
      padding: half(20) half(30);
    }
  }
  .box {
    padding-top: half(100);
    overflow-y: auto;
    height: 100%;
  }
  .setTimeAddress_cont {
    height: half(120);
    padding: half(20) half(30);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .van-radio {
      overflow: none;
      height: half(46);
      width: half(46);
    }
    .van-radio__input {
      font-size: 10px !important;
    }
    .setTimeAddress_cont_t1 {
      width: half(90);
      height: 100%;
      color: #999;
      // text-align: center;
      margin-left: half(8);
    }
    .setTimeAddress_cont_t2 {
      flex: 1;
      width: half(488);
      height: 100%;
      padding-left: half(20);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .setTimeAddress_cont_t2_address {
        font-size: half(30);
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .setTimeAddress_cont_t2_info {
        color: #999;
      }
    }
    .setTimeAddress_cont_t3 {
      width: half(90);
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: half(8);
    }
  }
}
</style>
