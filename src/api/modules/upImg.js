import IP from "../base/index.js";
var { publics } = IP;
export default {
    // 验证码登录
    upload(data, success, fail) {
        wx.request({
            method: "post",
            url: `${publics}/system/upload`,
            data: data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    }
}