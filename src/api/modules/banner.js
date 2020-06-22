import IP from "../base/index.js";
var { publics } = IP;
export default {

    // 获取banner列表
    getBannerSwiperList(data, succ, fa) {
        wx.request({
            method: "get",
            url: `${publics}/banner/user/banner_list`,
            data: data,
            success(res) {
                succ(res.data);
            },
            fail(error) {
                fa(error.data);
            }
        });
    }
}