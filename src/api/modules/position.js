import IP from "../base/index.js";
var { job } = IP;
export default {

    getPositionList(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/job/user/job_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

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

    // 获取我的地址
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

    // 用经纬度获取地址
    get_addr_lng_lat(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/address/get_addr_lng_lat`,
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