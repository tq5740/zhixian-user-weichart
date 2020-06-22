import IP from "../base/index.js";
var { job } = IP;
export default {

    userReservation(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/booking/create_booking`,
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

    getReservationStatus(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/booking/query_booking`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    update_booking(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/booking/update_booking`,
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

    reply_booking(data, success, fail) {
        wx.request({
            method: "post",
            url: `${job}/booking/reply_booking`,
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