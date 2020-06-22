import Org from "../api/modules/org";
const actions = {
    getConfigData({ commit }, data) {
        return new Promise((resolve, reject) => {
            Org.querySiteName(data, res => {
                if (res.code === 0) {
                    commit("setConfigData", res.data);
                }
                resolve(res.data);
            }, (error) => {
                const errorData = {
                    orgSiteId: "4006006186",
                    orgId: "4006006186",
                    siteName: "成都就业",
                    siteLogo: "/org/logo/logo.png",
                    siteSlogan: "就近就业",
                    siteKeyword: "招聘，就业",
                    siteDescription: "互联网+就业",
                    serviceQq: "3126754",
                    serviceTel: "4006006186",
                    twoDomain: "www",
                    selfDomain: "cdwork.cn",
                    updateUser: "4006006186",
                    updateTime: "2018-01-01 00:00:00",
                    hierarchy: "A1-",
                    imgDomain: "http://image.zhixianren.com",
                    vodDomain: "http://vod.zhixianren.com",
                    fileDomain: "http://file.zhixianren.com",
                    isOpenReg: true,
                    isOpenGuide: true
                };
                commit("setConfigData", errorData);
                resolve(errorData);
            });
        })
    },
    getuserInfo({ commit }, data) {
        return Org.querySiteName(data, res => {
            if (res.code === 0) {
                commit("setConfigData", res.data);
            }
        });
    }
};
export default actions;