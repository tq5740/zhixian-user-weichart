import Vue from 'vue';
import Vuex from 'vuex';
import actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        configData: {},
        active: "/",
        //图片大小规则
        imgTypes: {},
        scrollPos: {
            default: {
                y: 0
            }
        },
        userInfo: null,
        title: "",
        newsListArr: [], //消息列表数据
        newsListUserIdArr: [], //消息userId列表数据
        webSocketInstance: null, //消息webSocket实例
        pos: {
            lng: 104.065837, //经度
            lat: 30.657349, //纬度
            posString: "成都市天府广场", //地址
            adcode: 510105
        },
    },
    mutations,
    actions
})

export default store;