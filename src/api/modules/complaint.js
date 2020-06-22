import IP from "../base/index.js";
var { publics } = IP;
export default {

    // 查询求职意向
    create_complaint(data, success, fail) {
        wx.request({
            method: "post",
            url: `${publics}/complaint/create_complaint`,
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