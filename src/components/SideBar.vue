<template>
    <div>
        <h2 class="logo">南哪集市管理平台</h2>
    </div>
    <div class="ve_el_menu">
        <el-menu
            class="el-menu"
            :default-active="active"
            mode="vertical"
            router
        >
            <el-menu-item index="/user" class="item">
                <el-icon ><User style="width: 30px;"/></el-icon>
                <span style="padding-left: 20px">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/order" class="item">
                <el-icon :size="30"><Shop/></el-icon>
                <span style="padding-left: 20px">订单管理</span>
            </el-menu-item>
            <el-menu-item index="/goods" class="item">
                <el-icon :size="30"><Present/></el-icon>
                <span style="padding-left: 20px">商品管理</span>
            </el-menu-item>
            <el-menu-item index="/review" class="item">
                <el-icon :size="30"><ChatDotRound/></el-icon>
                <span style="padding-left: 20px">评价管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>

import {ChatDotRound, Present, Shop, User} from "@element-plus/icons-vue"
const active = window.location.pathname;


</script>

<style scoped>
.logo {
    top: 18px;
    left: 30px;
    font-size: 30px;
    background-color: #009587;
    text-align: center;
    color: #fff;
}
a:active {
    color: #009587;
}
.ve_el_menu {
    background-color: #8c939d;
    height: 100%;
    overflow-y: auto;
}
.item{
    font-size: 20px;
}
.el-menu{
    background-color: #8c939d;
    color: white;
}
</style>
