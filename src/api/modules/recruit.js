import IP from "../base/index.js";
var { job } = IP;
export default {

    // 获取列表
    venue_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/venue/user/venue_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 招聘会详情
    query_venue(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/venue/query_venue`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 招聘会企业报名
    create_venue_reg(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/venue/create_venue_reg`,
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

    // 参会企业列表
    venue_org_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/venue/venue_org_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 在招职位列表
    venue_job_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/venue/venue_job_list`,
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