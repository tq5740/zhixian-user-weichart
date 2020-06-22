import IP from "../base/index.js";
var { article } = IP;
export default {

    // 获取文章列表
    article_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${article}/article_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 查询文章
    query_article(data, success, fail) {
        wx.request({
            method: "get",
            url: `${article}/query_article`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 创建文章
    create_articleReg(data, success, fail) {
        wx.request({
            method: "post",
            url: `${article}/create_articleReg`,
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