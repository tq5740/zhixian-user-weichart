// public getOrgGuestList(data: any) {
//   return this.get(`/org/org_list_guest`, data)
//     .then((res: any) => Promise.resolve(res))
//     .catch((e: any) => Promise.reject(e));
// }
// public getOrgDetail(data: any) {
//   return this.get(`/org/query_org`, data)
//     .then((res: any) => Promise.resolve(res))
//     .catch((e: any) => Promise.reject(e));
// }
// public update_msg_state(data: any) {
//   return this.post(`msg/update_msg_state`, data)
//     .then((res: any) => Promise.resolve(res))
//     .catch((e: any) => Promise.reject(e));
// }
import IP from "../base/index.js";
var { job } = IP;
export default {

    query_msg_historical(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/msg/query_msg_historical`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    delete_msg_user(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/msg/delete_msg_user`,
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