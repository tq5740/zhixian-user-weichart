//see  https://cn.vuejs.org/v2/guide/plugins.html
import WelfarePanel from "./WelfarePanel.vue";
export default {
    install: function(Vue) {
        Vue.component("WelfarePanel", WelfarePanel);
    }
};