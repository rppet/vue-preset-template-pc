<template>
    <el-container id="app">
        <el-header id="nav">
            <div class="logo">
                <img src="./assets/logo.png" width="40" height="40" alt="">
                阿闻平台
            </div>
            <el-menu mode="horizontal"
                     router
                     :default-active="activeIndex"
                     text-color="#333"
                     active-text-color="#0f9bfc"
                     class="nav">
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="mp">小程序管理</el-menu-item>
                <el-menu-item index="data">标签管理</el-menu-item>
            </el-menu>
            <div class="user">
                fyli
            </div>
        </el-header>
        <router-view/>
    </el-container>
</template>

<style lang="less" scoped>
    #app {
        height: 100%;
    }
    #nav {
        background: #fff;
        border-bottom: 2px solid #e6e6e6;
        display: flex;
        .logo {
            padding: 0;
            line-height: 60px;
            img {
                vertical-align: middle;
            }
        }
        .nav {
            margin: 0 30px;
            flex: 1;
            border: none;
            &.el-menu--horizontal > .el-menu-item {
                border-bottom-width: 2px;
                &:hover {
                    background: none;
                }
            }
        }
        .user {
            padding: 20px 0;
        }
    }
</style>
<script>
export default {
    data() {
        return {
            activeIndex: 'mp'
        };
    },
    created() {
    }
};
</script>
