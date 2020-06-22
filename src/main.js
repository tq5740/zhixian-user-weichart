import Vue from 'vue'
import App from './App'
import Toast from '../static/vant-weapp/toast/toast'
import Dialog from '../static/vant-weapp/dialog/dialog'
import Store from '../src/store/index'


Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;
String.prototype.padLeft = function(padchar, num) {
    return padchar.repeat(this.length > num ? 0 : num - this.length) + this;
};
Vue.config.productionTip = false;

// {
//     "/100x100",
//     "/240x150",
//     "/224x126",
//     "/800x450"
// }

App.mpType = 'app'

Vue.prototype.$store = Store;
new Vue(App).$mount()