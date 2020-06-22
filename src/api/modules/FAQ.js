import IP from "../base/index.js";
var { publics } = IP;
export default {

    // 获取问题列表
    problem_list(data, success, fail) {
        wx.request({
            method: "get",
            url: `${publics}/problem/problem_list`,
            data: data,
            success(res) {
                success(res.data);
            },
            fail(error) {
                fail(error.data);
            }
        });
    },

    // 获取详细问题
    query_problem(data, success, fail) {
        wx.request({
            method: "get",
            url: `${publics}/problem/query_problem`,
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