//see  https://cn.vuejs.org/v2/guide/plugins.html
import JobClassify from "./JobClassify.vue";
export default {
    install: function(Vue) {
        Vue.component("JobClassify", JobClassify);
    }
};