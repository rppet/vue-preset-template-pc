<template>
    <div class="h-text" :class="classes">
        <slot></slot>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
@import "../../css/variable";
.h-text {
    &--inline {
        display: inline-block;
    }
    &--primary {
        color: @color-primary;
    }
    &--success {
        color: @color-success;
    }
    &--warning {
        color: @color-warning;
    }
    &--danger {
        color: @color-danger;
    }
    &--info {
        color: @color-info;
    }
    &--regular {
        color: @color-text-regular;
    }
    &--secondary {
        color: @color-text-secondary;
    }
    &--placeholder {
        color: @color-text-placeholder;
    }
    &--medium {
        font-size: 16px;
    }
    &--small {
        font-size: 14px;
    }
    &--mini {
        font-size: 12px;
    }
}
</style>
<script>
/**!
 * Copyright (c) 2017 hillinsight.com, Inc. All Rights Reserved
 *
 * @author lifayu(fyli@hillinsight.com)
 * @since 2019-03-06 11:04
 * @corporation 瓴域集团
 * @version 1.1.0
 */
'use strict';
export default {
    name: 'HText',
    props: {
        inline: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'primary'
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    data() {
        return {
            classes: []
        };
    },
    created() {
        if (this.inline) {
            this.classes.push('h-text--inline');
        }
        this.classes.push('h-text--' + this.type);
        this.classes.push('h-text--' + this.size);
    }
};
</script>
