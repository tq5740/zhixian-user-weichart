import IP from "../base/index.js";
var { job } = IP;
export default {

    // 用户档案
    user_archives(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/user_archives`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 职能分类列表（树）
    jobclassify_tree(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/classify/jobclassify_tree`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 教育列表
    edu_undergo_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/edu_undergo_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 创建教育经历
    create_edu_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/create_edu_undergo`,
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

    // 删除教育经历
    delete_edu_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/delete_edu_undergo`,
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

    // 查询教育经历
    query_edu_undergo(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/query_edu_undergo`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 修改教育经历
    update_edu_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/update_edu_undergo`,
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

    // 培训列表
    train_undergo_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/train_undergo_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 查询培训经历
    query_train_undergo(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/query_train_undergo`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 创建培训经历
    create_train_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/create_train_undergo`,
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

    // 修改培训经历
    update_train_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/update_train_undergo`,
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

    // 删除培训经历
    delete_train_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/delete_train_undergo`,
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

    // 工作列表
    work_undergo_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/work_undergo_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 创建工作经历
    create_work_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/create_work_undergo`,
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

    // 查询工作经历
    query_work_undergo(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/archives/query_work_undergo`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 修改工作经历
    update_work_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/update_work_undergo`,
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

    // 删除工作经历
    delete_work_undergo(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/archives/delete_work_undergo`,
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

    // 创建求职意向
    create_intention(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/intention/create_intention`,
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

    // 修改求职意向
    update_intention(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/intention/update_intention`,
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

    // 查询求职意向
    query_intention(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/intention/query_intention`,
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