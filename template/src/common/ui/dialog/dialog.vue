<style rel="stylesheet/less" lang="less">
    .in-dialog {
        .el-dialog__body {
            padding: 10px 15px 15px;
            .el-dialog__footer {
                padding: 20px 0 0;
            }
        }
    }
    .el-dialog.el-dialog-drawer {
        position: absolute;
        right: 0;
        height: 100%;
        margin: 0;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        .el-dialog__body {
            flex: 1;
            height: 100%;
            overflow-y: auto;
            padding: 0 15px 15px;
        }
    }
    .el-dialog-drawer-wrapper {
        overflow: hidden;
    }
    .el-dialog-drawer-wrapper.dialog-fade-enter-active {
        animation: dialog-drawer-in .3s ease-out;
    }

    .el-dialog-drawer-wrapper.dialog-fade-leave-active {
        animation: dialog-drawer-out .3s ease-in;
    }

    @keyframes dialog-drawer-in {
        0% {
            transform: translate3d(100%, 0, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes dialog-drawer-out {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(100%, 0, 0);
        }
    }
</style>
<script>
export default {
    components: {
        UiDialogContent: {
            template: '<div></div>'
        }
    },
    props: {
        dialog: {
            type: Object,
            default() {
                return {};
            }
        },
        ext: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            dialogVisible: false
        };
    },
    methods: {
        close() {
            this.dialogVisible = false;
        },
        ok() {
            this.$emit('ok', ...arguments);
            this.dialogVisible = false;
        },
        asyncOk() {
            this.$emit('ok', ...arguments, () => {
                this.dialogVisible = false;
            });
        },
        innerClose() {
            this.beforeClose(() => {
                this.dialogVisible = false;
            });
        },
        beforeClose(done) {
            if (typeof this.$refs.view.$options.beforeClose === 'function') {
                this.$refs.view.$options.beforeClose.call(this.$refs.view, done);
            }
            else {
                done();
            }
        },
        tryDestroy() {
            this.$emit('close', this);
            if (!this.ext.cacheKey && !this._isDestroyed && !this._isBeingDestroyed) {
                this.$destroy();
            }
        }
    },
    render() {
        let me = this;
        let append = {};
        if (this.dialog.isDrawer) {
            append.top = '0px';
            append.customClass = 'el-dialog-drawer';
        }
        let options = {
            props: Object.assign(append, {
                closeOnClickModal: this.dialog.isDrawer,
                beforeClose(done) {
                    me.beforeClose(done);
                },
                appendToBody: true,
                visible: this.dialogVisible
            }, this.dialog),
            class: {
                'in-dialog': true,
                'el-dialog-drawer-wrapper': this.dialog.isDrawer
            },
            on: {
                close: this.close,
                closed: this.tryDestroy
            }
        };

        let contentOptions = {
            ref: 'view',
            props: Object.assign(
                {
                    // 需要使用该参数，只需在业务组件中的props中添加isChild属性，默认值为false
                    isChild: true
                },
                this.ext
            ),
            on: {
                close: this.innerClose,
                ok: this.ok,
                asyncOk: this.asyncOk
            }
        };

        return (
            <el-dialog {...options}>
                <div slot="title" class="el-dialog__title">{this.dialog.title}</div>
                <ui-dialog-content {...contentOptions}/>
            </el-dialog>
        );
    }
};
</script>
