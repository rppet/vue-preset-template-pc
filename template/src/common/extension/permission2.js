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
 * @file 权限判定模块
 * @usage
 *  注册权限
 *  Vue.use(permission, permission.fixPrivilege(operation, resource = null));
 *  Vue.use(permission, {action: {struct: [1, 2], chain: [1, 2]}}, true); // 多中资源混合权限
 *  使用权限
 *  <el-button v-if="hasPrivilege('actionCode', 1)">button</button>
 *  <el-button v-if="hasPrivilege('actionCode', 'chain', 1)">button</button> // 多中资源混合权限
 * @author lifayu(fyli@hillinsight.com)
 * @since 2018-03-28 13:05
 */
'use strict';

import ForbiddenView from '../components/forbidden.vue';
function install(Vue, privilege, multiple = false) {
    if (install.installed || Vue.hasOwnProperty('$allow')) {
        return;
    }
    install.installed = true;

    Object.defineProperty(Vue.prototype, '$allow', {
        get() {
            return privilege;
        }
    });

    Object.defineProperty(Vue.prototype, 'hasPrivilege', {
        get() {
            return function (action, type, value) {
                if (multiple) {
                    if (typeof type !== 'undefined') {
                        if (typeof value !== 'undefined') {
                            if (Array.isArray(value)) {
                                return privilege[action] && privilege[action][type] && value.some(item => {
                                    return privilege[action][type].indexOf(item) !== -1;
                                });
                            }
                            return privilege[action] && privilege[action][type] && privilege[action][type].indexOf(value) !== -1;
                        }
                        return privilege[action] && privilege[action][type] && privilege[action][type].length > 0;
                    }
                }
                else {
                    if (typeof type !== 'undefined') {
                        if (Array.isArray(type)) {
                            return privilege[action] && type.some(item => {
                                return privilege[action].indexOf(item) !== -1;
                            });
                        }
                        return privilege[action] && privilege[action].indexOf(type) !== -1;
                    }
                }
                let ret = privilege[action];
                return ret ? (Array.isArray(ret) ? ret.length > 0 : ret) : false;
            };
        }
    });

    function check(array, vm) {
        if (array[0] === 'or') {
            return array.slice(1).some(item => check(item, vm));
        }
        else if (array[0] === 'and') {
            return array.slice(1).every(item => check(item, vm));
        }
        else {
            return vm.hasPrivilege.apply(vm, array);
        }
    }

    /**
     * @see https://stackoverflow.com/questions/43003976/a-custom-directive-similar-to-v-if-in-vuejs#43543814
     * <div v-auth.not="['edit', 'struct', '1']">edit</div>
     * <div v-auth="['or', ['edit', 'struct', '1'], ['edit', 'chain', '2']]">edit</div>
     * <div v-auth="['and', ['edit', '1'], ['edit', '2']]">edit</div>
     * <div v-auth:edit="['struct', '1']">edit</div>
     * <div v-auth="edit">edit</div>
     * <div v-auth:edit>edit</div>
     * <div v-auth:edit.page>edit</div>
     * <div v-auth:edit.disable>edit</div>
     * <div v-auth:edit.hide>edit</div>
     */
    Vue.directive('auth', (el, binding, vnode, oldVnode) => {
        const behaviour = binding.modifiers.page ? 'page' : (binding.modifiers.disable ? 'disable' : 'hide');
        const not = binding.modifiers.not;
        const value = binding.value;
        const arg = binding.arg;
        const vm = vnode.context;

        if (vnode.parent && vnode.parent.data.routerView) {
            throw new Error('不能在VueRouter根节点添加权限判定');
        }

        if (binding.value === binding.oldValue) {
            return;
        }
        let key = el.dataset.key || Date.now() + '_' + Math.random() * 100000;
        vnode.key = oldVnode ? oldVnode.key : (vnode.key || key);
        el.dataset.key = key;

        let ok = false;
        if (arg) {
            if (Array.isArray(value)) {
                ok = vm.hasPrivilege(arg, [...value]);
            }
            else {
                ok = vm.hasPrivilege(arg, value);
            }
        }
        else if (typeof value === 'string') {
            ok = vm.hasPrivilege(value);
        }
        else if (Array.isArray(value)) {
            ok = check(value, vm);
        }

        ok = not ? !ok : ok;

        if (ok) {
            if (behaviour === 'disable') {
                el.setAttribute('disabled', false);
            }
            return;
        }
        if (behaviour === 'disable') {
            el.setAttribute('disabled', true);
        }
        else {
            let div = null;
            if (behaviour === 'hide') {
                div = document.createComment(' 403 Forbidden ');
            }
            else {
                const f = new Vue(ForbiddenView);
                f.$mount();
                div = f.$el;
            }

            Object.defineProperty(div, 'setAttribute', {
                value: () => undefined
            });

            vnode.elm = div;
            vnode.isComment = true;
            vnode.context = undefined;
            vnode.tag = undefined;
            vnode.data.directives = undefined;

            if (vnode.componentInstance) {
                vnode.componentInstance.$el = div;
            }

            if (el.parentNode) {
                el.parentNode.replaceChild(div, el);
            }
        }
    });
}

install.fixPrivilege = function (operation, resource, multiple = false) {
    let map = {};
    if (!multiple) {
        Object.keys(operation).forEach(key => {
            let role = operation[key];
            map[key] = resource ? resource[role] : true;
        });
    }
    else {
        Object.keys(operation).forEach(key => {
            let value = operation[key];
            map[key] = {
                struct: resource.struct[value].map(item => +item),
                userGroup: resource.userGroup[value],
                roleGroup: resource.roleGroup[value],
                chain: resource.chain[value]
            };
            if (resource) {
                let item = {};
                Object.keys(resource).forEach(rkey => {
                    item[rkey] = resource[rkey][value];
                });
                map[key] = item;
            }
            else {
                map[key] = true;
            }
        });
    }
    return map;
};

export default install;
