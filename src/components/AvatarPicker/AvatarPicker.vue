/**
*@author leo
*@dateTime 2018/8/14
*@description created
*/
<template>
  
    <div class="avatar-picker">
      
        <div class="avatar-picker-mask" @click="onCancel" v-if="showAvatarPicker"></div>
      
      
        <div class="avatar-picker-box" v-if="showAvatarPicker">
          <div class="avatar-picker-album">从手机相册选取
            <van-uploader :before-read="beforeRead" :after-read="onAvatarFileRead" @oversize="onAvatarOversize" result-type="text" accept="image/gif,image/jpeg,image/jpg,image/png">

              <!--2兆字节(mb)=2097152字节(b) //result-type  文件读取结果类型，可选值为 dataUrl/test-->
            </van-uploader>
          </div>
          <div class="split-line"></div>
          <div class="avatar-picker-cancel-btn" @click="onCancel">取消</div>
        </div>
      <van-toast id="van-toast" />
    </div>
  
</template>

<script>
import UpImg from "../../api/modules/upImg";
import User from "../../api/modules/user";
import { formatDate, checkSize } from "../../utils/index";

export default {
  data() {
    return {
      reader: new FileReader(),
      //创建一个img对象
      img: new Image(),

      // 选择的文件对象
      file: null,

      // 缩放图片需要的canvas
      canvas: document.createElement("canvas"),
      context: this.canvas.getContext("2d"),
      photo: ""
    }
  },
  
  beforeRead() {
    this.$toast.loading({
      mask: true,
      message: "图片上传中..."
    });
    return true;
  },
  //读取完成后的回调函数
  onAvatarFileRead(files) {
    this.reader.readAsDataURL(files.file);
    // this.img.src = a.target.result;
    this.reader.onload = (e) => {
      this.img.src = e.target.result;
    };
    let _this = this;
    _this.img.onload = function() {
      _this.canvas.width = this.width;
      _this.canvas.height = this.height;
      // // 清除画布
      // _this.context.clearRect(0, 0, this.width, this.height);
      // 图片压缩
      _this.context.drawImage(_this.img, 0, 0, this.width, this.height);
      /*第一个参数是创建的img对象；第二个参数是左上角坐标，后面两个是画布区域宽高*/
      //压缩后的图片base64 url
      /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/jpeg';
       * qualityArgument表示导出的图片质量，只要导出为jpg和webp格式的时候此参数才有效果，默认值是0.92*/
      var newUrl = _this.canvas.toDataURL("image/jpeg", 0.8); //base64 格式
      _this.sumitImageFile(newUrl);
    };
  },
  sumitImageFile(base64Codes) {
    var formData = new FormData();
    let binary = this.dataURLtoBlob(base64Codes);
    if (checkSize(binary.size, 2)) {
      this.$toast("图片大小超过2M,请重新上传!");
      return;
    }
    formData.append("file", binary);
    formData.append("uploadType", "1");
    formData.append("token", this.$store.state.userInfo.token);
    // 上传头像
    UpImg.upload(formData,(res) => {
        if (res.code === 0) {
          this.$emit("onAvatarPickerMaskClick");
          this.$toast("上传成功");

          this.photo = res.data.url;
          // 是(我的)页面就主动请求修改用户信息接口
          if (this.$route.path === "/mine") {
            this.update_user(res.data.url);
          }
          this.$emit("photoUrl", this.photo);
        } else {
          this.$toast(res.msg);
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.$toast.clear();
        }, 500);
      });
  },
  // 修改用户头像
  update_user(url) {
    User.update_user({
        userId: this.$store.state.userInfo.userId,
        photo: url,
        sex: this.$store.state.userInfo.sex,
        isHr: false,
        birthDate: formatDate(
          this.$store.state.userInfo.birthDate,
          "YYYY-MM-DD"
        ),
        availableTime: this.$store.state.userInfo.availableTime,
        highestEducation: this.$store.state.userInfo.highestEducation,
        startWorkYear: this.$store.state.userInfo.startWorkYear,
        workState: this.$store.state.userInfo.workState
    },(res) => {
      if (res.code === 0) {
        this.$toast("修改成功");
        this.$store.commit("setUserInfo", res.data);
      } else {
        this.$toast(res.msg);
      }
    });
  },
  // base64转为图片
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },
  // convertBase64UrlToBlob(urlData) {
  //   var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  //   //处理异常,将ascii码小于0的转换为大于0
  //   var ab = new ArrayBuffer(bytes.length);
  //   var ia = new Uint8Array(ab);
  //   for (var i = 0; i < bytes.length; i++) {
  //     ia[i] = bytes.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: "image/png" });
  // }
  //	文件大小超过限制时触发
  onAvatarOversize(files) {
    // const content = files.content.split(",")[1];
    this.$toast("请上传小于2兆的图片");
  },
  onDefaultAvatarClick(type) {
    if (this.$route.path === "/mine") {
      this.update_user(type);
    }
    this.$emit("photoUrl", "" + type);
    this.$emit("onAvatarPickerMaskClick");
  },
  onCancel() {
    this.$emit("onAvatarPickerMaskClick");
  }
}
</script>
<style lang="scss" scoped>
.avatar-picker {
  text-align: center;
  font-size: half(32);
  color: #000;
  .avatar-picker-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transition: all 0.2s ease-out;
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
  .avatar-picker-box {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transition: all 0.2s ease-out;
    &.slide-enter-to,
    &.slide-leave {
      transform: translate3d(0, 0, 0);
    }
    &.slide-leave-to,
    &.slide-enter {
      transform: translate3d(0, 100%, 0);
    }
  }
  .avatar-picker-album {
    position: relative;
  }
  /deep/ .van-uploader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .avatar-picker-header,
  .avatar-picker-album,
  .avatar-picker-cancel-btn {
    background-color: #fff;
  }
  .avatar-picker-header {
    padding: half(40) half(60);
  }
  .split-line {
    height: half(20);
    background-color: #f2f2f2;
  }
  .avatar-picker-sub {
    margin-bottom: half(40);
  }
  .avatar-icon {
    width: 100%;
    height: 100%;
  }
  .avatar-picker-gallery {
    display: flex;
    justify-content: space-between;
  }
  .avatar-picker-avatar {
    width: half(100);
    height: half(100);
  }
  .avatar-picker-album,
  .avatar-picker-cancel-btn {
    padding: half(34) 0;
  }
}
</style>
