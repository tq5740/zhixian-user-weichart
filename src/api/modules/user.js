import IP from "../base/index.js";
var { user } = IP;
export default {

    // 用户注册
    user_reg(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/user_reg`,
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

    // 登录
    user_login(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/user_login`,
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

    // 第三方登录
    OAuth(data, success, fail) {
        wx.request({
            method: "post",
            url: `http://192.168.10.16:8082/user/user/OAuth`,
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

    // 绑定第三方登录
    bind_user_phone(data, success, fail) {
        wx.request({
            method: "post",
            url: `http://192.168.10.16:8082/user/user/bind_user_phone`,
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

    // 根据Token登录
    getUserByToken(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/user/get_userByToken`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 修改用户信息
    update_user(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/update_user`,
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

    // 查询用户信息
    query_user(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/user/query_user`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 验证码登录
    authcode_user_login(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/authcode_user_login`,
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

    // 修改用户密码
    update_userPassword(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/update_userPassword`,
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

    // 修改用户手机
    update_userPhone(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/update_userPhone`,
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

    // 修改用户邮箱
    send_email(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/user/send_email`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 修改密码
    forget_password(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/forget_password`,
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

    // 图片验证码
    imageCode(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/user/imageCode`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    bind_user_phone(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/bind_user_phone`,
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

    OAuth(data, success, fail) {
        wx.request({
            method: "post",
            url: `${user}/user/OAuth`,
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
}