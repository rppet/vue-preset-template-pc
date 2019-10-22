import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import { api } from './config';

import '@common/element-ui';
import '@assets/css/element-ui-theme.scss';
import '@assets/css/main.less';

import MyUI from '@common/ui/index';
import VueAxios from '@common/extension/http';
import Console from '@common/extension/console';

Vue.prototype.$ELEMENT.size = 'small';

Object.defineProperty(Vue.prototype, '$api', {
    get() {
        return api;
    }
});

Vue.use(VueAxios, router, {
    auth() {
        const url = '/login?url=' + encodeURIComponent(window.location.href);
        window.location.replace(url);
    }
});
Vue.use(Console);
Vue.use(MyUI, store, router);

Vue.config.productionTip = process.env.NODE_PATH === 'development';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
