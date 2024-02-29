<template>
    <div class="common-layout">
        <el-container class="el-container">
            <el-aside class="el-aside">
                <SideBar></SideBar>
            </el-aside>
            <el-main class="el-main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";

export default {
    name: "Home",
    components: {SideBar}
}
</script>

<style scoped>
.el-main{
    /*background-color: whitesmoke;*/
    padding: 0 !important;
    width: 83%;
}
.el-aside{
    width: 17%;
    height: 100%;
    overflow-y: hidden;
}
.el-container{
    height: 100vh;
    width: 100vw;
    padding: 0 !important;
    display: flex;
}
.common-layout{
    left: 0;
}
</style>
