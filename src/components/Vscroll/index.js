//see  https://cn.vuejs.org/v2/guide/plugins.html
import Vscroll from "./Vscroll.vue";
export default {
    install: function(Vue) {
        Vue.component("v-scroll", Vscroll);
    }
};