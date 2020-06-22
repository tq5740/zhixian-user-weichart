import IP from "../base/index.js";
var { job } = IP;
export default {

    queryPositionDetail(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/job/query_job`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    my_address(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/address/my_address`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    reply(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/booking/user/reply`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

}