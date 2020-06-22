import IP from "../base/index.js";
var { user } = IP;
export default {

    //查询用户身份认证状态
    query_userauth(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/userAuth/query_userauth`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    //更新用户身份认证状态
    update_userauth(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/userAuth/update_userauth`,
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