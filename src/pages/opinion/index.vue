/**
*@author chao
*@dateTime 2018/8/16
*@description created
*/
<template>
  <div class="opinion">
    <van-cell-group>
      <van-cell center>
          <div class="van-cell-text">
            <span class="red">*</span>建议内容</div>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="pr">
      <!-- <van-field v-model="content" class="textHeight" maxlength="50" type="textarea" placeholder="限50字以内" /> -->
      <textarea rows="10" v-model="content" class="textHeight" maxlength="50" placeholder="限50字以内"></textarea>
      <i class="iconfont input-icon pa_icon icon-shuru"></i>
    </van-cell-group>
    <van-cell-group class="margin_t_20">
      <van-cell center>
          <div class="van-cell-text">
            描述</div>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="pr">
      <textarea rows="10" v-model="describes" class="textHeight" maxlength="500" placeholder="请输入建议描述"></textarea>
      <i class="iconfont input-icon pa_icon icon-shuru"></i>
    </van-cell-group>
    <div class="upload">
      <div class="upload_txt">
        上传图片（最多上传3张）
      </div>
      <div class="padding_t_30 flex">
        <div class="not_yet"></div>
        <div v-for="(itme,key) in fileData" :key="itme" @click="clickImg(key)">
          <img class="init_img" alt="" :id="'img'+key" />&nbsp;
          <!-- <input type="file"/> -->
        </div>
        <div class="clear"></div>
        <div class="upImg margin_t_30" @click="upImgRestriction">
          <i class="iconfont input-icon pa_icons icon-shangchuantupian"></i>
          <img alt="" />
          <input type="file" @click="upLoadFunc" v-if="fileData.length != 3" />
        </div>
      </div>
    </div>
    <van-button type="default" class="saveStyle" @click="saveBtn" :loading="loading">保存</van-button>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import areaList from "../../utils/area";
import File from "../../api/modules/userFile";
import UpImg from "../../api/modules/upImg";
import Opinions from "../../api/modules/opinion";
export default {
  data () {
    return {
      loading: false,
      describes: "",
      content: "",
      areaList: areaList,
      fileData: [],
      file: ""
    }
  },
  // 生命周期
  onLoad() {
    this.$store.commit("setTitle", "建议反馈");
  },
  methods: {
    saveBtn() {
      if (this.content === "") {
        this.$toast("请填写建议内容");
        return;
      }
      this.loading = true;
      let data = {
        type: 1,
        content: this.content,
        describes: this.describes,
        imgUrl: "" + this.fileData,
        siteHierarchy: this.$store.state.configData.hierarchy,
        token: this.$store.state.userInfo.token
      };
      Opinions.create_comment(data, (res) => {
          if (res.code === 0) {
            var toastMsg = this.$toast({
              duration: 0,
              message: "谢谢您给我们提出宝贵的建议~"
            });
            setTimeout(() => {
              this.$router.replace("/setting");
              this.$toast.clear();
            }, 1000);
          } else {
            this.$toast(res.msg);
          }
        })
        this.loading = false;
    },
    upImgRestriction() {
      if (this.fileData.length == 3) {
        this.$toast("最多上传三张");
        return;
      }
    },
    clickImg(k) {
      this.$dialog
        .confirm({
          message: "确定删除吗？"
        })
        .then(() => {
          this.fileData.splice(k, 1);
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    upLoadFunc(e) {
      // wx.chooseImage({
      //   count: 1,
      //   sizeType: ['original', 'compressed'],
      //   sourceType: ['album', 'camera'],
      //   success(res) {
      //     // tempFilePath可以作为img标签的src属性显示图片
      //     const tempFilePaths = res.tempFilePaths
      //   }
      // })
      this.file = e.target.files[0];
      if (this.file.size > 2097152) {
        this.$toast("请上传2兆以内的图片");
        return;
      }
      var formData = new FormData();
      formData.append("file", this.file);
      formData.append("uploadType", "2");
      formData.append("token", this.$store.state.userInfo.token);
      formData.append("path", "/publics/opinion/img");
      // 上传头像
      UpImg.upload(formData,(res) => {
        if (res.code === 0) {
          // this.$toast("上传成功");

          console.log(this.fileData);
          this.fileData.unshift(res.data.url);
          setTimeout(() => {
            let img = document.getElementById("img0");
            img.src = URL.createObjectURL(this.file);
          });
        } else {
          this.$toast(res.msg);
        }
      });
    }  
  }
}
</script>
<style lang="scss" scoped>
.opinion {
  padding-bottom: half(98);
  .textHeight{
    max-height: half(300);
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .fl {
    float: left;
    overflow: hidden;
  }
  .clear {
    clear: both;
  }
  .saveStyle {
    width: 100%;
    height: half(98);
    line-height: half(98);
    color: #fff;
    background: #42b983;
    font-size: half(34);
    text-align: center;
    position: fixed;
    bottom: 0;
  }
  /deep/ .van-field__body {
    width: 100%;
  }
  /deep/ .van-cell {
    background: #fff !important;
  }
  .pr {
    background-color: #fff;
    position: relative;
    top: -1px;
    /deep/ .van-cell-group{
      padding: half(30);
    }
    .pa_icon {
      position: absolute;
      right: half(30);
      bottom: half(30);
    }
  }
  .red {
    color: red;
  }
  .margin_t_20 {
    margin-top: half(20);
  }
  .padding_t_30 {
    padding-top: half(30);
  }
  .upload {
    padding: half(30);
    .upload_txt {
      font-size: half(32);
    }
    .not_yet {
      height: half(120);
      width: half(120);
      display: inline-block;
    }
    .init_img {
      height: half(120);
      overflow: hidden;
    }
    #img0 {
      padding-left: half(15);
    }
    .upImg {
      height: half(120);
      width: half(120);
      position: absolute;
      .pa_icons {
        font-size: half(120) !important;
        width: half(120) !important;
        height: half(120) !important;
        position: absolute;
        left: half(-16);
        // bottom: half(28);
      }
      input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 0 solid;
        opacity: 0;
      }
    }
  }
}
</style>
