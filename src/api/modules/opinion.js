import IP from "../base/index.js";
var { publics } = IP;
export default {

    // 创建评论
    create_comment(data, success, fail) {
        wx.request({
            method: "post",
            url: `${publics}/opinion/create_opinion`,
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