<template>
    <div class="bg-cover" v-if="showCover"></div>
    <div class="search">
        <el-row :gutter="20">
      <span style="width: 50px;margin-top: 5px">
          学号 :
      </span>
            <el-input
                v-model="input"
                style="width: 200px"
                placeholder="请输入学号"
                @keyup.enter="search"
            />
            <el-button :icon="Search" class="control" @click="search">
                搜索
            </el-button>
            <el-button :icon="Refresh" class="control" @click="reset">
                重置
            </el-button>

            <el-button :icon="CirclePlus" class="control" @click="addUser">
                新增用户
            </el-button>
            <el-button type="danger" :icon="Delete" style="font-size: 25px;height: 35px" @click="deleteSelect">
                删除所选
            </el-button>

        </el-row>
    </div>

<!--    <el-row style="margin-bottom: 10px">-->
<!--        <el-button :icon="CirclePlus" class="control" @click="addUser">-->
<!--            新增用户-->
<!--        </el-button>-->
<!--        <el-button type="danger" :icon="Delete" style="font-size: 25px;height: 35px" @click="deleteSelect">-->
<!--            删除所选-->
<!--        </el-button>-->
<!--    </el-row>-->

    <el-table stripe="stripe" border="border" :data="tableData"
              style="width: 100%;  display: flex; font-size: 20px"
              :cell-style="{'text-align':'center'}"
              :header-cell-style="{'text-align':'center'}"
              @selection-change="handleSelectionChange"
              :v-loading="loading"
    >
        <el-table-column type="selection" width="40" align="left" />
        <el-table-column property="studentId" label="学号" width="130" />
        <el-table-column property="nickname" label="昵称" width="100" />
        <el-table-column property="password" label="密码" width="100" >
            <template #default="scope">
                <div>
                    ***
                </div>
            </template>
        </el-table-column>
        <el-table-column property="photo" label="头像" width="80">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-image :src="getUrl(scope.row.photo)"/>
                </div>
            </template>
        </el-table-column>
        <el-table-column property="email" label="邮箱" width="290" />
        <el-table-column property="createTime" label="创建时间" width="210" />
        <el-table-column property="updateTime" label="更新时间" width="210" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button
                >
                &nbsp;&nbsp;&nbsp;
                <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
                >
            </template>
        </el-table-column>
    </el-table>


    <div class="demo-pagination-block">
        <el-pagination
                v-model:current-page="pageNum"
                :small = false
                :disabled = false
                :background= true
                layout="->,total, prev, pager, next, jumper"
                :total="dataTotal"
                @current-change="handleCurrentChange"
        />
    </div>
<!--    新增表单or更改表单-->
    <div v-if="addPermit" class="form">
        <el-form
            ref="ruleFormRef"
            label-width="60px"
            label-position="right"
            status-icon
            :model="ruleForm"
            :rules="rules"
            @keyup.enter="submitForm"
        >
            <!-- 头像上传 -->
            <el-form-item label="头像" prop="photo">
<!--                <img v-if="haveImg" :src="imageUrl" class="avatar" />-->
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :auto-upload="false"
                    list-type="picture"
                    :on-change="getFile"
                    ref="upload"
                >
                    <img v-if="haveImg" :src="getUrl(ruleForm.photo)" class="avatar" alt=""/>
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>

            <!-- 学号 -->
            <el-form-item label="学号" prop="studentId">
                <el-input v-model="ruleForm.studentId" placeholder="请输入学号"></el-input>
            </el-form-item>

            <!-- 昵称 -->
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="ruleForm.nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <!-- 提交按钮 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button type="danger" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import { ElTable,ElMessage } from 'element-plus'
import {CirclePlus, Delete, Plus, Refresh, Search} from "@element-plus/icons-vue";
import {request} from "../utils/request.js";
import {urlRequest} from "../utils/request.js";

const input = ref('')
const addPermit = ref(false);
const haveImg = ref(false);
const ruleFormRef = ref(null);
let showCover = ref(false);
const pageNum = ref(1);
const loading=ref(true)
let isEdit = false;

const rules = ref({
        studentId: [
            { required: true, message: '请输入学号', trigger: 'blur' },
        ],
        nickname: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
        ],
    });

interface User {
    id: bigint,
    studentId: string,
    nickname: string,
    password: string,
    photo: string,
    email: string,
    createTime: string,
    updateTime: string,
}
const tableData = ref<User[]>([])
const ruleForm = ref<User>({
    createTime: "", id: 0n, updateTime: "",
    studentId: '',
    nickname: '',
    password: '',
    photo: '',
    email: ''
})

const dataTotal = ref(0);
let userId;
const getDataNum = () => {
    request.get('user/sum').then(response =>{
        console.log("sum: "  + response)
        dataTotal.value = response
    })

}
getDataNum();

const clearRuleForm = () => {
    ruleForm.value.studentId = '';
    ruleForm.value.nickname = '';
    ruleForm.value.password = '';
    ruleForm.value.photo = '';
    ruleForm.value.email = '';
};

const getUser = async () => {
    try {
        loading.value = true;
        // 使用 async/await 来等待请求结果
        const response = await request.get('user/' + pageNum.value);
        // 映射数据
        tableData.value = response.map(item => ({
            id: BigInt(item.id),
            studentId: item.studentId,
            nickname: item.nickname,
            password: item.password,
            photo: item.photo,
            email: item.email,
            createTime: item.createTime,
            updateTime: item.updateTime
        }));
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loading.value = false;
    }
};

getUser();
const handleCurrentChange = (val: number) => {
    console.log('current page:' + val);
    pageNum.value = val;
    refresh()
}

const getFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file.raw);
        console.log(formData)
        const response = await urlRequest.post('image/upload', formData);
        // Parse the returned URL from the response
        console.log(response[0])
        ruleForm.value.photo = response[0];
        haveImg.value = true;  // Adjust the key based on the actual response structure
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    // if(beforeAvatarUpload(file)){
    //     getBase64(file.raw).then(res => {
    //         // console.log(res)
    //         imageUrl.value = res;
    //         ruleForm.photo = res;
    //         haveImg.value = true;
    //         needIcon.value = false;
    //     })
    // }
}

const getBase64 = (file) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
            imgResult = reader.result
        }
        reader.onerror = function (error) {
            reject(error)
        }
        reader.onloadend = function () {
            resolve(imgResult)
        }
    })
}
const beforeAvatarUpload = function (file){
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
    }
    return isLt2M;
}

const submitForm = () => {
    ruleFormRef.value.validate((valid: boolean) => {
        if (valid) {
            console.log(JSON.stringify(ruleForm.value))
            if(isEdit){
                request.put('user/' + userId,ruleForm.value).then(()=>{
                    ElMessage({
                        message: '修改成功',
                        type: 'success',
                    })
                    refresh()
                }).catch(()=>{
                    ElMessage({
                        message: '没有任何修改',
                        type: 'success',
                    })
                })
            }
            else{
                request.post('user', ruleForm.value).then(() => {
                    ElMessage({
                        message: '提交成功',
                        type: 'success',
                    })
                    refresh()
                }).catch(() => {
                    ElMessage({
                        message: '提交失败',
                        type: 'error',
                    })
                })
            }

            cancel();
        } else {
            ElMessage.error('Oops, this is a error message.')
            return false;
        }
        isEdit = false;
    });
};

const multipleSelection = ref<User[]>([])

const getUrl = (url: string) =>{
    if(url == null){
        return null;
    }
    let tmp = url.split('\\');
    if(tmp.length >= 3) {
        return "http://localhost:8082/" + tmp[2] + '/' + tmp[3]
    }
    else{
        return url;
    }
}
let search = ref()
    search.value = async () => {
    console.log(input.value);
    pageNum.value = 1;
    loading.value = true;
    // 发起两个并行的请求
    const [dataTotalResponse, tableDataResponse] = await Promise.all([
        request.get('user/sum/' + input.value),
        request.get('user/' + input.value + '/' + pageNum.value)
    ]);
    dataTotal.value = dataTotalResponse;
    tableData.value = tableDataResponse.map(item => ({
        id: BigInt(item.id),
        studentId: item.studentId,
        nickname: item.nickname,
        password: item.password,
        photo: item.photo,
        email: item.email,
        createTime: item.createTime,
        updateTime: item.updateTime
    }));

    loading.value = false;
}
function reset(){
    console.log("reset")
    input.value = ''
    refresh();
}
// let reset = () =>{
//     input.value = ''
//     refresh();
// }

const refresh = async () =>{
    loading.value = true;
    await getDataNum();
    await getUser();
    loading.value = false;
}

const cancel = () => {
    haveImg.value = false
    addPermit.value = false;
    showCover.value = false;
    document.body.style.overflow = "auto"
    clearRuleForm()
}

const addUser = () =>{
    addPermit.value = true
    showCover.value = true
    document.body.style.overflow = "hidden"
}
const handleEdit = (index: number, row: User) => {
    userId = row.id;
    ruleForm.value.nickname = row.nickname;
    ruleForm.value.photo = row.photo;
    ruleForm.value.studentId = row.studentId;
    ruleForm.value.password = row.password;
    ruleForm.value.email = row.email
    haveImg.value = true;
    isEdit = true;
    addUser();
};

const handleDelete = (index: number, row: User) => {
    console.log(index, row)
    request.delete('user/' + row.id).then(()=>{
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        refresh();
    }).catch(()=>{
        ElMessage.error("删除失败")
    })

}
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val
    console.log("混合数据 " + multipleSelection.value)
    if(val.length !== 0){
        console.log(multipleSelection.value[val.length-1].nickname)
    }
}

const deleteSelect = () =>{
    for(let i = 0; i < multipleSelection.value.length; i++){
        request.delete('user/' + multipleSelection.value[i].id).then(()=>{
            ElMessage({
                message: '删除成功',
                type: 'success'
            })
            refresh();
        }).catch(()=>{
            ElMessage.error("删除失败")
        })
    }
}

</script>

<style scoped>
.el-form-item{
    align-items: center;
}
.avatar {
    width: 200px;
    height: 200px;
    display: block;
}
.el-table{
    width: 100%;
    text-align: center;
    display: flex;
    z-index: 10;
}
.search{
    display: flex;
    height: 30px;
    padding-left: 20px;
    margin-bottom: 20px;
    margin-top: 20px;
}

.control{
    background-color: #009587;
    margin-left: 20px;
    color: white;
    height: 35px;
    font-size: 25px;
}
.control:hover{
    opacity: 0.7;
}
.bg-cover {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    z-index: 49;
}
.form{
    position: fixed;
    right: 0;
    top : 0;
    width: 400px;
    height: 100%;
    padding: 0;
    z-index: 50;
    background-color: white;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.demo-pagination-block {
    margin-top: 10px;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
