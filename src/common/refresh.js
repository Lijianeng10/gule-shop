import Vue from "vue";

// import Scroll from '../components/scroll'
import Scroll from './pull-refresh';
// components: {
//     'v-scroll': Scroll,
// };
const components = {
    Scroll,
};

Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
    Vue.component(`yo-${key.toLowerCase()}`, components[key]); // 用于支持render函数中的组件名称，render函数中使用需要以base-组件名
});

// Vue.prototype.baseUI = {
    // $Header: Header,
    // $Loading: Loading,
    // $Share: Share,
    // $QrCode: QrCode
// };