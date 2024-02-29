<template>
    <div class="search">
        <el-row :gutter="20">
      <span style="width: 70px;margin-top: 5px">
          内容 :
      </span>
            <el-input
                    v-model="input"
                    style="width: 200px"
                    placeholder="请输入评论内容"
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
    >
        <el-table-column type="selection" width="40" align="left" />
        <el-table-column property="reviewer" label="评价人" width="100" />
        <el-table-column property="reviewee" label="卖家" width="100" />
        <el-table-column property="positive" label="评价" width="80" >
            <template #default="scope">
                {{getReview(scope.row.positive)}}
            </template>
        </el-table-column>
        <el-table-column property="content" label="评价内容" width="380" />
        <el-table-column property="createTime" label="评价时间" width="230" />
        <el-table-column label="Operations">
            <template #default="scope">
                <el-button
                        size="large"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
                >
            </template>
        </el-table-column>

    </el-table>
    <div style="margin-top: 10px">
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
</template>

<script lang="ts" setup>
import {ElTable,ElMessage} from "element-plus";
import {Delete, Refresh, Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {request} from "../utils/request.js";

const input = ref('')

interface Review {
    id: bigint,
    content: string,
    createTime: string,
    positive: number,
    reviewee: string,
    reviewer: string,
}

const multipleSelection = ref<Review[]>([])
const tableData = ref<Review[]>([])
const dataTotal = ref(0);
const pageNum = ref(1);
const loading = ref(true)
const getDataNum = () =>{
    request.get('comment/sum').then(response=>{
        dataTotal.value = response;
    })
}
getDataNum()

const getData = async() =>{
    loading.value = true;
    await request.get('comment/' + pageNum.value).then(response=>{
        tableData.value = response.map(item=>({
            id: BigInt(item.id),
            content: item.content,
            createTime: item.createTime,
            positive: item.positive,
            reviewee: item.reviewee,
            reviewer: item.reviewer,
        }))
    }).catch(()=>{
        ElMessage.error('获取数据失败')
    })
    loading.value = true
}
getData();
const getReview = (status) => {
    switch (status){
        case false : return '差评';
        case true : return '好评';
        default: return '未知评价';
    }
}

const handleCurrentChange = (val: number) => {
    pageNum.value = val;
    refresh()
}

const search = async () => {
    loading.value = true;
    console.log(input.value);
    pageNum.value = 1;
    const [dataTotalResponse, tableDataResponse] = await Promise.all([
        request.get('comment/sum/' + input.value),
        request.get('comment/' + input.value + '/' + pageNum.value)
    ]);
    dataTotal.value = dataTotalResponse;
    tableData.value = tableDataResponse.map(item => ({
        id: BigInt(item.id),
        content: item.content,
        createTime: item.createTime,
        positive: item.positive,
        reviewee: item.reviewee,
        reviewer: item.reviewer,
    }));
    loading.value = false;
}
const refresh = async () =>{
    loading.value = true;
    await getDataNum()
    await getData()
    loading.value = false;
}
const reset = () =>{
    input.value = ''
    refresh()
}
const handleDelete = async (index: number, row: Review) => {
    console.log(index, row)
    await request.delete('comment/' + row.id).then(()=>{
        ElMessage({
            message:'删除成功',
            type: 'success',
        })
    })
    await refresh()
}
const handleSelectionChange = (val: Review[]) => {
    multipleSelection.value = val
}
const selectDelete = () =>{
    for(let i = 0;i < multipleSelection.value.length;i++){
        request.delete('comment/' + multipleSelection.value[i].id).then(()=>{
            ElMessage({
                message:'删除成功',
                type: 'success',
            })
        })
        refresh()
    }
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
