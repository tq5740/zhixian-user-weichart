const qs = require("qs");
const deepClone = require("lodash.clonedeep");
export const detailApiData = {
    isAddSiteHierarchy: false,
    siteHierarchy: "",
    isAddToken: false,
    token: "",
    excludesSite: ["/query_site_name", "/system/upload"],
    excludesToken: ["/user/get_userByToken", "/system/upload"],
    uploadUrl: ["/system/upload"],
    checkUpload(url) {
        for (let i of this.uploadUrl) {
            if (url.includes(i)) {
                return true;
            }
        }
    },
    checkToken(userInfo, apiUrl) {
        if (userInfo) {
            for (let i of this.excludesToken) {
                if (!apiUrl.includes(i)) {
                    this.isAddToken = true;
                } else {
                    this.isAddToken = false;
                    break;
                }
            }
            this.token = userInfo.token;
        } else {
            this.isAddToken = false;
        }
        return this;
    },
    setToken(data) {
        if (this.isAddToken && this.token) {
            data.token = this.token;
        }
        return this;
    },
    checkSite(configData, apiUrl) {
        if (configData) {
            for (let i of this.excludesSite) {
                if (!apiUrl.includes(i)) {
                    this.isAddSiteHierarchy = true;
                } else {
                    this.isAddSiteHierarchy = false;
                    break;
                }
            }
            this.siteHierarchy = configData.hierarchy;
        } else {
            this.isAddSiteHierarchy = false;
        }
        return this;
    },
    setSite(data) {
        if (this.isAddSiteHierarchy) {
            data.siteHierarchy = this.siteHierarchy;
        }
        return this;
    },
    qsData(config) {
        if (config.method === "get") {
            for (let i in config.data.data) {
                if (config.data.data[i] === "") {
                    delete config.data.data[i];
                }
            }
            config.url = config.url + "?" + qs.stringify(config.data.data);
        } else {
            if (!this.checkUpload(config.url)) {
                config.data = qs.stringify(config.data.data);
            }
        }
    },
    cloneData(config) {
        let cloneData = null;
        if (!this.checkUpload(config.url)) {
            if (config.method === "get") {
                cloneData = deepClone(config.data);
            } else {
                cloneData = deepClone(config.data.data);
            }
            config.data = {
                data: cloneData
            };
        }
        return this;
    }
};
export const detailPending = {
    pending: [],
    removePending(config) {
        this.pending.forEach((i, k) => {
            if (i.u === config.url + "&" + config.method) {
                //当当前请求在数组中存在时执行函数体
                i.f(); //执行取消操作
                this.pending.splice(k, 1); //把这条记录从数组中移除
            }
        });
    },
    setPending(config, cancelToken) {
        config.cancelToken = new cancelToken((c) => {
            this.pending.push({ u: config.url + "&" + config.method, f: c });
        });
    }
};