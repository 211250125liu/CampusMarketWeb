<template>
    <div class="touxiang">
<!--        //把存放头像单独拿出来，放到一个div中，通过css布局来调整位置-->
        <div class="pic">
            <img v-if="imageUrl" :src="imageUrl ? '' + imageUrl : '@/assets/avatar.gif'" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <el-upload
                class="avatar-uploader"
                list-type="picture"
                ref="upload"
                accept=".jpg, .png"
                :limit="1"
                :auto-upload="false"
                :show-file-list="false"
                :file-list="fileList"
                :on-change="getFile">

<!--            //点击上传的按钮一定要在el-upload内部才可以实现-->
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-upload>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 上传头像地址
            imageUrl: '',
            //接收上传的文件
            fileList:[],
        };
    },
    methods: {
        // 头像上传
        getFile(file, fileList) {
            if(this.beforeAvatarUpload(file)){
                this.getBase64(file.raw).then(res => {
                    this.imageUrl = res;
                    //ruleForm是我接收后端传过来的数据，此处可以忽略
                    this.ruleForm.imagePath=res
                })
            }
        },

//这里是文件转base64
        getBase64(file) {
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
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
    }
}
</script>

<style scoped>
.touxiang {
    margin: 30px auto 30px 150px;
    display: flex;
    .avatar-uploader {
        ::v-deep .el-upload {
            margin-top: 5px;
            height: 45px;
            display: flex;
            flex-direction: column;
            align-content: space-between;
        }
        ::v-deep .el-button {
            width: 90px;
            height: 35px;
            font-size: 15px;
        }
    }
    .pic {
        margin-right: 20px;
        border-radius: 50%;
        border: 1px dashed gray;
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 80px;
            height: 80px;
            line-height: 80px;
            text-align: center;
        }
        .avatar {
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: block;
        }
    }
}
</style>
