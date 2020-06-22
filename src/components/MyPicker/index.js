//see  https://cn.vuejs.org/v2/guide/plugins.html
import MyPicker from "./MyPicker.vue";
export default {
    install: function(Vue) {
        Vue.component("MyPicker", MyPicker);
    }
};