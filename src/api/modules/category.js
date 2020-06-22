import IP from "../base/index.js";
var { publics } = IP;
export default {

    // 查询求职意向
    category_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${publics}/category/category_list`,
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