import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/element-variables.scss";
import vcolorpicker from "vcolorpicker";

Vue.use(require("vue-electron"));
Vue.use(Element);
Vue.use(vcolorpicker);

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
setTimeout(() => {
  new Vue({
    components: { App },
    router,
    store,
    template: "<App/>",
  }).$mount("#app");
}, 1000);
