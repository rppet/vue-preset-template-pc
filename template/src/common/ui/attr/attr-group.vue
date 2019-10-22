<template>
    <div :class="['h-attr-group', 'h-attr-group-' + size]">
        <div class="h-attr-group-title">
            <slot name="title">{{title}}</slot>
        </div>
        <div class="h-attr-group-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
@import '../../css/variable';
.h-attr-group-value(@height, @fontSize, @width) {
    .h-attr-group-title {
        height: @height;
        line-height: @height;
        padding-left: 6px + @width;
        position: relative;
        font-size: @fontSize;
        &:before {
            content: '';
            position: absolute;
            height: @fontSize;
            top: (@height - @fontSize) / 2;
            left: 0;
            width: @width;
            border-radius: 2px;
            background: @color-primary;
        }
    }
}
.h-attr-group {
    &-content {
        padding: 10px 0 20px;
    }
    &-medium {
        .h-attr-group-value(36px, 22px, 4px);
    }
    &-small {
        .h-attr-group-value(30px, 16px, 2px);
    }
    &-mini {
        .h-attr-group-value(28px, 14px, 2px);
    }
}
</style>
<script>
/**!
 * Copyright (c) 2017 hillinsight.com, Inc. All Rights Reserved
 *
 * @author lifayu(fyli@hillinsight.com)
 * @since 2018-05-26 17:12
 */
'use strict';
export default {
    name: 'HAttrGroup',
    props: {
        // medium, small, mini
        size: {
            type: String,
            default() {
                return 'small';
            }
        },
        title: {
            type: String
        }
    },
    data() {
        return {};
    }
};
</script>
