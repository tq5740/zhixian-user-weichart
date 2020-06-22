import IP from "../base/index.js";
var { publics } = IP;
export default {

    //创建评论
    create_comment(data, success, fail) {
        wx.request({
            method: "post",
            url: `${publics}/comment/create_comment`,
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
    },

    //删除主评论
    delete_comment(data, success, fail) {
        wx.request({
            method: "post",
            url: `${publics}/comment/delete_comment`,
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
    },

    //删除回复
    delete_reply(data, success, fail) {
        wx.request({
            method: "post",
            url: `${publics}/comment/delete_reply`,
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
    },

    //回复列表
    reply_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${publics}/comment/reply_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    //主评论列表
    comment_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${publics}/comment/user/comment_list`,
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