import IP from "../base/index.js";
var { publics } = IP;
export default {
    // 验证码登录
    wechatShare(data, success, fail) {
        wx.request({
            method: "get",
            url: `${publics}/wechat/weixin_share`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    }
}