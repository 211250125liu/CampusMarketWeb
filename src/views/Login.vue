<template>
    <div class="wide">
        <div class="login-container">
            <el-card class="login-card">
                <div class="title">
                    <el-icon style="font-size: 35px; top:7px;margin-right: 10px"><Shop /></el-icon>
                    <span>南哪集市管理平台</span>
                </div>
                <el-form  :model="loginForm" :rules="loginRules" label-width="80px" @keyup.enter="login">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="primary" @click="reset" style="margin-left: 40px">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {ElForm, ElFormItem, ElInput, ElButton, ElCard, ElMessage} from 'element-plus';
import {Shop} from "@element-plus/icons-vue";
import router from "../router/index.js"
import {request} from "../utils/request.js"

localStorage.setItem("isLogin","false");

const loginForm = ref({
    username: '',
    password: '',
});

const loginRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const reset = () => {
    loginForm.value.password = '';
    loginForm.value.username = '';
}

const login = () => {
    // 在这里处理登录逻辑
    // 你可以使用 loginForm.username 和 loginForm.password 来获取用户名和密码
    console.log('用户名:', loginForm.value.username);
    console.log('密码:', loginForm.value.password);
    router.push('/user');
    // request.post('admin/login',loginForm.value).then(()=>{
    //     localStorage.setItem("isLogin","true");
    //     setTimeout(() => {
    //         ElMessage({
    //             message: '登录成功',
    //             type: 'success',
    //         });
    //         router.push('/user');
    //     }, 300);
    // }).catch(()=>{
    //         ElMessage({
    //             message:'用户名或密码错误',
    //             type:'error',
    //         })
    // })
};
</script>

<style scoped>
.wide{
    background-image: url("../assets/back2.jpg");
    width: 100vw;
    height: 100vh;
}
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    height: 100vh;
    flex-direction: column;
    align-content: center;
    flex-wrap: wrap;
}

.login-card {
    position: relative;
    width: 400px;
    left: 25%;
    padding: 10px;
}
.title{
    padding-left: 25px;
    padding-bottom: 10px;
    margin-top: -20px;
    margin-bottom: 20px;
    font-size: 30px;
}
</style>
