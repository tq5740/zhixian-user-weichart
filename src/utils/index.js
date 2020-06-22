/*
 module:
    utils index.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-18 add some func
 */

export function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}


/**
 *
 * @param data 微信签名配置
 * @param debug 是否开始debug
 * @param jsApiList 需要功能的列表
 */
export function wxConfig(
    data,
    debug = false,
    jsApiList = [
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "onMenuShareQQ",
        "onMenuShareWeibo",
        "onMenuShareQZone"
    ]
) {
    wx.config({
        debug: debug,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList
    });
}

/**
 *
 * @param name 缓存的名字
 * @param data 缓存的值
 */
export function setStorage(name, data) {
    try {
        wx.setStorage({ key: "local_test", value: "ok" });
    } catch (_) {
        alert("请关闭无痕模式以便正常使用功能");
        return false;
    }
    if (!name) return;
    wx.setStorage({ name: name, data: JSON.stringify(data) });
}
/**
 *
 * @param name 缓存的名字
 * @param isPure 师傅需要 JSONParse
 */
export function getStorage(name, isPure = false) {
    if (!name) return;
    if (isPure) return wx.getStorage({ key: name });
    var data = wx.getStorage({ key: name });
    return data ? JSON.parse(data) : null;
}

/**
 *
 * @param timeStr yyyy-mm-dd hh:mm:ss
 *
 */
export function getTimeStamp(timeStr) {
    var dateStr = timeStr.replace(/-/g, "/");
    return +new Date(dateStr);
}

/**
 *
 * @param time 时间戳
 * @param format 需要格式的类型 `YYYY-MM-DD h:m:s` `YYYY-MM-DD` `h:m:s`等
 */
export function formatDate(time, fmt) {
    var date = new Date(time);
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    var o = {
        "M+": date.getMonth() + 1,
        "D+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };

    for (var i in o) {
        if (new RegExp("(" + i + ")").test(fmt)) {
            var str = o[i] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : str.padLeft("0", 2)
            );
        }
    }
    return fmt;
}
/**
 *
 * @param str 手机号
 */
export function mobileReg(str) {
    return /^[0-9]\d{10}$/.test(str);
}

/**
 * 获取类型
 */
const _toString = Object.prototype.toString;

export function toRawType(value) {
    return _toString.call(value).slice(8, -1);
}

export function isPlainObject(obj) {
    return _toString.call(obj) === "[object Object]";
}
export function isEmptyObject(e) {
    if (!isPlainObject(e)) {
        throw new Error(
            "you have to pass in an object like {},{a:1}. not array or null or other"
        );
    }
    var t;
    for (t in e) return !1;
    return !0;
}
export function getScrollY() {
    var s = 0;
    s =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    return s;
}

/**
 *
 * @param config {title,link,imgUrl,desc}
 */
// export function wxShare(config) {
//     const _config = {
//         title: config.title,
//         link: config.link,
//         imgUrl: config.imgUrl,
//         desc: config.desc
//     };
//     wx.ready(function() {
//         console.log(_config);
//         //分享到朋友圈
//         wx.onMenuShareTimeline(_config);
//         wx.onMenuShareAppMessage(_config);
//         wx.onMenuShareQQ(_config);
//         wx.onMenuShareWeibo(_config);
//         wx.onMenuShareQZone(_config);
//     });
// }
export const getTimeSpan = (data, closer) => {
    // data = parseInt(data, 10);
    // let getTimepan = parseInt((Date.now() - data) / 1000);
    let getTimepan = (Date.now() - data) / 1000;
    let day = Math.floor(getTimepan / 86400);
    let hour = Math.floor((getTimepan - day * 86400) / 3600);
    let minute = Math.floor((getTimepan - day * 86400 - hour * 3600) / 60);
    let second = Math.floor(getTimepan - day * 86400 - hour * 3600 - minute * 60);
    let str = "";
    if (closer) {
        if (day < 0) {
            return "刚刚";
        }
        if (day > 9) {
            return formatDate(data, "YYYY-MM-DD");
        }
        if (day > 0) {
            return day + "天前";
        }
        if (hour > 0) {
            return hour + "小时前";
        }
        if (minute > 0) {
            return minute + "分钟前";
        }
        return "刚刚";
    } else {
        return formatDate(data, "YYYY-MM-DD");
    }
};

function toDecimal2NoZero(x) {
    var f = Math.round(x * 10) / 10;
    var s = f.toString();
    return s;
}

//格式化薪资
export function formatSalary(lowSalary, highSalary, salaryType) {
    if (salaryType == 3) {
        return toDecimal2NoZero(lowSalary) + "元/天";
    }
    const lowSalaryVal = lowSalary / 1000;
    const highSalaryVal = highSalary / 1000;
    if (highSalaryVal && !lowSalaryVal) {
        return `0-${toDecimal2NoZero(highSalaryVal)}k`;
    }

    if (!highSalaryVal && lowSalaryVal) {
        return `${toDecimal2NoZero(lowSalaryVal)}k以上`;
    }

    if (toDecimal2NoZero(lowSalaryVal) == toDecimal2NoZero(highSalaryVal)) {
        return toDecimal2NoZero(lowSalaryVal) + "k";
    }

    return `${toDecimal2NoZero(lowSalaryVal)}k-${toDecimal2NoZero(highSalaryVal)}k`;
}

export function checkSize(size, mb) {
    return 1024 * 1024 * mb < size;
}
//数字四舍五入（保留n位小数）
export function getFloat(num, n = 0) {
    if (n <= 0) return num;
    num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
    return num;
}
//格式化出生年龄
export function getParseAge(birthDateTime) {
    if (!birthDateTime) return;
    const nowDateTime = +new Date();
    let hours = (nowDateTime - birthDateTime) / 3600000;
    return Math.floor(hours / 8640);
    // const year = Math.floor(hours / 8640);
    // hours = hours % (24 * 30 * 12);
    // const months = Math.floor(hours / (24 * 30));
    // hours = hours % (24 * 30);
    // const days = Math.floor(hours / 24);
}
//格式化工作经验
export function getParseExperience(startWorkYear) {
    if (!startWorkYear) return;
    const parseStartWorkYear = +startWorkYear;
    const nowYear = +new Date().getFullYear();
    return nowYear >= parseStartWorkYear ? nowYear - parseStartWorkYear : 0;
}
export const wxLogin = (router = "/login") => {
    location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb24e95ae402e1d19&redirect_uri=http://www.cdwork.cn/wxLogin&response_type=code&scope=snsapi_userinfo&state=weixin";
};