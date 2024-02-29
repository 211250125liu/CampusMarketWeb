<template>
    <div class="search">
        <el-row :gutter="20">
      <span style="width: 70px;margin-top: 5px">
          商品名 :
      </span>
            <el-input
                    v-model="input"
                    style="width: 200px"
                    placeholder="请输入商品名"
                    @keyup.enter="search"
            />
            <el-button :icon="Search" class="control" @click="search">
                搜索
            </el-button>
            <el-button :icon="Refresh" class="control" @click="reset">
                重置
            </el-button>
            <el-button type="danger" :icon="Delete" style="font-size: 25px;height: 35px" @click="selectDelete">
                删除所选
            </el-button>
        </el-row>
    </div>

    <el-table stripe="stripe" border="border" :data="tableData"
              style="width: 100%;  display: flex; font-size: 20px"
              :cell-style="{'text-align':'center'}"
              :header-cell-style="{'text-align':'center'}"
              @selection-change="handleSelectionChange"
              v-loading="loading"
    >
        <el-table-column type="selection" width="40" align="left" />
        <el-table-column property="name" label="商品名" width="100" />
        <el-table-column property="description" label="商品简介" width="250" />
        <el-table-column property="price" label="价格" width="80" />
        <el-table-column property="photos" label="商品图片" width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-image :src="getUrl(scope.row.photos)"/>
                </div>
            </template>
        </el-table-column>
        <el-table-column property="createTime" label="发布时间" width="230" />
        <el-table-column property="status" label="状态" width="100" >
            <template #default="scope">
                {{ getStatusText(scope.row.status)}}
            </template>
        </el-table-column>
        <el-table-column property="updateTime" label="更新时间" width="230" />
        <el-table-column label="Operations">
            <template #default="scope">
                <el-button
                        size="large"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
        <el-pagination
            v-model:current-page="pageNum"
            :small = false
            :disabled = false
            :background= true
            layout="->,total,prev, pager, next, jumper"
            :total="dataTotal"
            @current-change="handleCurrentChange"
            v-loading="loading"
        />
    </div>
</template>

<script lang="ts" setup>
import {ElTable,ElMessage} from "element-plus";
import { Delete, Refresh, Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {request} from "../utils/request.js";

const input = ref('')
const loading = ref(false);

interface Goods {
    id: bigint,
    name: string,
    description: string,
    price: number,
    photos: string[],
    createTime: string,
    status: number,
    updateTime: string,
    userId: bigint,
}
const multipleSelection = ref<Goods[]>([])
const pageNum = ref(1)
const tableData = ref<Goods[]>([]);
const dataTotal = ref(0);

const getDataNum = () =>{
    request.get('/goods/sum').then(response=>{
        dataTotal.value = response;
    })
}
getDataNum()
const getData = () => {
    request.get('goods/' + pageNum.value).then((response)=>{
        tableData.value = response.map(item =>({
            id: BigInt(item.id),
            userId : BigInt(item.userId),
            photos: item.photos,
            name : item.name,
            description: item.description,
            price :item.price,
            status: item.status,
            createTime : item.createTime,
            updateTime : item.updateTime,
        }))
    }).catch(error=>{
        ElMessage.error('获取失败' + error)
    })
}
getData();
const getUrl = (photos: string) =>{
    let url = photos.replace('[','').replace(']','').split(',');
    let tmp = url[0].split('\\');
    return "http://localhost:8082/" + tmp[2] + '/' + tmp[3]
}

const search = async () => {
    console.log(input.value);
    pageNum.value = 1;
    loading.value = true;
    const [dataTotalResponse, tableDataResponse] = await Promise.all([
        request.get('goods/sum/' + input.value),
        request.get('goods/' + input.value + '/' + pageNum.value)
    ]);
    dataTotal.value = dataTotalResponse;
    tableData.value = tableDataResponse.map(item => ({
        id: BigInt(item.id),
        userId : BigInt(item.userId),
        photos: item.photos,
        name : item.name,
        description: item.description,
        price :item.price,
        status: item.status,
        createTime : item.createTime,
        updateTime : item.updateTime,
    }));
    loading.value = false
}

const getStatusText = function (status){
    switch (status){
        case 0:
            return '已售出';
        case 1:
            return '已锁定';
        case 2:
            return '可售出';
        default:
            return '未知状态';
    }
}
const reset = () =>{
    input.value = ''
    refresh()
}
const handleDelete = (index: number, row: Goods) => {
    console.log(index, row)
    request.delete('goods/' + row.id).then(()=>{
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        refresh()
    })
    .catch(()=>{
        ElMessage.error('删除失败')
    })
}
const selectDelete = () =>{
    for(let i = 0;i < multipleSelection.value.length;i++){
        request.delete('goods/' + multipleSelection.value[i].id).then(()=>{
            ElMessage({
                message: '删除成功',
                type: 'success'
            })
            refresh()
        })
            .catch(()=>{
                ElMessage.error('删除失败')
            })
    }
}
const handleSelectionChange = (val: Goods[]) => {
    multipleSelection.value = val
    console.log("混合数据 " + multipleSelection.value)
}
const handleCurrentChange = (val: number) => {
    pageNum.value = val;
    refresh()
}
const refresh = async () =>{
    loading.value = true;
    await getDataNum();
    await getData();
    loading.value = false;
}

</script>

<style scoped>
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
</style>
