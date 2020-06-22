import IP from "../base/index.js";
var { user } = IP;
export default {

    querySiteName(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/org/query_site_name`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    getOrgGuestList(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/org/org_list_guest`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    getOrgDetail(data, success, fail) {
        wx.request({
            method: "get",
            url: `${user}/org/query_org`,
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