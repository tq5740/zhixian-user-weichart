import IP from "../base/index.js";
var { job } = IP;
export default {

    getReservationRecord(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/booking/user/booking_record`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    getInterviewSchedule(data, success, fail) {
        wx.request({
            method: "get",
            url: `${job}/booking/user/interview_schedule`,
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