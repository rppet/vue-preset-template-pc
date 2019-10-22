/** !
 * Copyright (c) 2017 hillinsight.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"), you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file 弹出框高级封装
 * @author lifayu(fyli@hillinsight.com)
 * @since 13/07/2017
 */

import Dialog from './dialog.vue';

function uuid() {
    return 'uuid_' + Date.now() + Math.ceil(Math.random() * 1000);
}

export default {
    create(Vue, store, router) {
        /**
         * 以抽屉模式展示弹出框
         * @param Child
         * @param extOptions
         * @param dialogOptions
         */
        Vue.prototype.$showDrawer = function (Child, extOptions = {}, dialogOptions = {}) {
            dialogOptions.isDrawer = true;
            return this.$showDialog(Child, extOptions, dialogOptions);
        };

        Vue.prototype.$showDialog = function (Child, extOptions = {}, dialogOptions = {}) {
            const cacheKey = extOptions.cacheKey || uuid();
            if (!this.__dialogCacheQueue__) {
                this.__dialogCacheQueue__ = {};
                this.$on('hook:beforeDestroy', () => {
                    Object.keys(this.__dialogCacheQueue__).forEach(key => {
                        let vm = this.__dialogCacheQueue__[key];
                        vm.$destroy();
                    });
                    this.$off('hook:beforeDestroy');
                });
                router &&
                this.$watch('$route', () => {
                    Object.keys(this.__dialogCacheQueue__ || {}).forEach(key => {
                        let vm = this.__dialogCacheQueue__[key];
                        vm && vm.$destroy();
                        this.__dialogCacheQueue__[key] = null;
                    });
                });
            }

            let vm = null;
            if (cacheKey && this.__dialogCacheQueue__[cacheKey]) {
                vm = this.__dialogCacheQueue__[cacheKey];
                vm.dialogVisible = true;
                // 缓存的实例需要解绑事件，后面由业务重新绑定
                ['ok', 'close'].forEach(item => vm.$off(item));
            }
            else {
                let NewDialog = Object.create(Dialog);
                NewDialog.components = {
                    UiDialogContent: Child
                };
                NewDialog.store = store;
                NewDialog.router = router;
                NewDialog.propsData = {
                    dialog: dialogOptions,
                    ext: extOptions
                };

                vm = new Vue(NewDialog).$mount();

                vm.dialogVisible = true;

                // 1. 将需要缓存的实例进行缓存，方便复用
                // 2. 将不需要缓存的实例也缓存，以便在页面离开时能统一进行销毁
                this.__dialogCacheQueue__[cacheKey] = vm;
            }

            return vm;
        };
    }
};
