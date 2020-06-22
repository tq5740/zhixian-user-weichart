//see  https://cn.vuejs.org/v2/guide/plugins.html
import PositionListItem from "./PositionListItem.vue";
export default {
    install: function(Vue) {
        Vue.component("PositionListItem", PositionListItem);
    }
};