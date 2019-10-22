<template>
    <div class="h-common-listview">
        <div class="query" :class="[`query-${queryType}`]" v-if="$slots.query">
            <slot name="query"></slot>
        </div>
        <hr v-if="$slots.query && $slots.fn"/>
        <div class="fn" v-if="$slots.fn">
            <slot name="fn"></slot>
        </div>
        <div class="list" v-loading="loading">
            <slot name="list" :listData="listData"></slot>
        </div>
        <div class="pager">
            <slot name="pager" :pageData="pageData">
                <el-pagination v-show="pageData.total>0"
                               :current-page.sync="pageData.number"
                               :page-size="+pageData.size"
                               :total="+pageData.total"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange"
                               :pager-count="pagerCount"
                               :layout="pagerLayout">
                </el-pagination>
            </slot>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
.h-common-listview {
    > hr {
        border: none;
        border-bottom: 1px dashed #ddd;
        margin: 0 0 15px;
    }
    .query,
    .fn {
        margin-bottom: 15px;
    }
    .query {
        .el-form {
            margin-bottom: -10px;
        }
        .el-form-item {
            margin-bottom: 10px;
            vertical-align: bottom;
        }
        &-top {
            .el-form-item__label {
                display: block;
                font-size: 12px;
                padding: 0;
                text-align: left;
                line-height: 20px;
                color: #666;
                & + .el-form-item__content {
                    margin-top: 0;
                }
            }
            .el-form-item__content {
                /*margin-top: 20px;*/
            }
        }
    }
    .pager {
        text-align: right;
        margin-top: 15px;
    }
}
</style>
<script>
/**!
 * Copyright (c) 2017 hillinsight.com, Inc. All Rights Reserved
 *
 * @author lifayu(fyli@hillinsight.com)
 * @since 2018-05-04 16:57
 */
'use strict';

const LIST_PLUGINS = {};

export const addListviewPlugin = function (name, options) {
    LIST_PLUGINS[name] = options;
};

addListviewPlugin('default', {
    config: {
        number: 'number',
        size: 'size',
        total: 'total'
    },
    transfer(data) {
        return {
            list: data.list || data.result,
            page: {
                number: data.page.number,
                size: data.page.size,
                total: data.page.total
            }
        };
    }
});

addListviewPlugin('erp', {
    config: {
        number: 'pageIndex',
        size: 'pageSize',
        total: 'total'
    },
    transfer(data) {
        return {
            list: data.list || data.result,
            page: {
                number: data.pageIndex,
                size: data.pageSize,
                total: data.total
            }
        };
    }
});

export default {
    name: 'HListView',
    componentName: 'HListView',
    props: {
        /**
         * 默认查询参数
         */
        defaultQuery: {
            type: Object,
            default() {
                return {};
            }
        },
        /**
         * 数据加载方法
         * @return {Promise}
         */
        loadData: {
            required: true,
            type: Function
        },
        immediately: {
            type: Boolean,
            default: true
        },
        router: {
            type: Boolean,
            default: false
        },
        dataType: {
            type: String,
            default() {
                return 'default';
            }
        },
        queryType: {
            type: String,
            default() {
                return 'left';
            }
        },
        pagerLayout: {
            type: String,
            default: 'total, sizes, prev, pager, next, jumper'
        },
        pagerCount: {
            type: Number,
            default: 7
        }
    },
    data() {
        let dataTypeStr = this.dataType === '2' ? 'erp' : this.dataType;
        if (!LIST_PLUGINS[dataTypeStr]) {
            dataTypeStr = 'default';
        }
        return {
            dataTypeStr: dataTypeStr,
            pageConfig: LIST_PLUGINS[dataTypeStr].config,
            listData: [],
            pageData: {
                number: 1,
                size: 10,
                total: 0
            },
            query: {},
            loading: false
        };
    },
    created() {
        this.query = Object.assign(this.query, this.defaultQuery);
        this.pageData.number = +this.query[this.pageConfig.number] || 1;
        this.pageData.size = +this.query[this.pageConfig.size] || 10;
        if (this.immediately) {
            this.fetchData(this.query[this.pageConfig.number]);
        }
    },
    watch: {
        defaultQuery: {
            deep: true,
            handler: function () {
                this.$nextTick(() => {
                    this.query = this.defaultQuery;
                    if (this.query[this.pageConfig.size]) {
                        this.pageData.size = +this.query[this.pageConfig.size];
                    }
                    this.fetchData(this.query[this.pageConfig.number]);
                });
            }
        }
    },
    methods: {
        search(query, overide = false) {
            let q = {};
            if (overide) {
                q = query;
            }
            else {
                q = Object.assign({}, this.query, query);
            }
            q[this.pageConfig.number] = 1;
            if (this.router) {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, q, {
                        [this.pageConfig.size]: q[this.pageConfig.size] || this.pageData.size,
                        [this.pageConfig.number]: 1,
                        _: Date.now()
                    })
                });
            }
            else {
                this.query = q;
                this.fetchData(1);
            }
        },
        refresh() {
            this.fetchData(this.query[this.pageConfig.number]);
        },
        fetchData(page = 1) {
            this.query[this.pageConfig.number] = page;
            this.query[this.pageConfig.size] = this.pageData.size;
            this.loading = true;
            this.loadData(this.query)
                .then(data => {
                    let res = LIST_PLUGINS[this.dataTypeStr].transfer(data);
                    this.listData = res.list;
                    this.pageData = res.page;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSizeChange(size) {
            this.pageData.size = size;
            if (this.router) {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.$route.query, {
                        [this.pageConfig.size]: this.pageData.size,
                        [this.pageConfig.number]: 1
                    })
                });
            }
            else {
                this.fetchData(1);
            }
        },
        handleCurrentChange(page) {
            if (this.router) {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.$route.query, {
                        [this.pageConfig.size]: this.pageData.size,
                        [this.pageConfig.number]: page
                    })
                });
            }
            else {
                this.fetchData(page);
            }
        }
    }
};
</script>
