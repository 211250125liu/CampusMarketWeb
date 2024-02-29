<template>
    <div class="search">
        <el-row :gutter="20">
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
        <el-table-column property="buyerId" label="买家" width="100" />
        <el-table-column property="sellerId" label="卖家" width="100" />
        <el-table-column property="goodsId" label="商品" width="100" />
        <el-table-column property="status" label="状态" width="130" >
            <template #default="scope">
                {{getStatus(scope.row.status)}}
            </template>
        </el-table-column>
        <el-table-column property="createTime" label="创建时间" width="230" />
        <el-table-column property="updateTime" label="创建时间" width="230" />
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
            layout="->,total, prev, pager, next, jumper"
            :total="dataTotal"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script lang="ts" setup>
import {ElTable,ElMessage} from "element-plus";
import { Delete, Refresh} from "@element-plus/icons-vue";
import {ref} from "vue";
import {request} from "../utils/request.js";

const input = ref('')
const loading = ref(true)

interface Order {
    id: bigint,
    buyerId: bigint,
    sellerId: bigint,
    createTime: string,
    goodsId: bigint,
    status: number,
    updateTime: string,
}
const multipleSelection = ref<Order[]>([])
const tableData = ref<Order[]>([])
const dataTotal = ref(0);
const pageNum = ref(1);

const getSum = () =>{
    request.get('order/sum').then(response=>{
        dataTotal.value = response;
    }).catch(()=>{
        ElMessage.error('获取总数失败')
    })
}
getSum()

const getData = () =>{
    request.get('order/' + pageNum.value).then(response=>{
        tableData.value = response.map(item=>({
            id: BigInt(item.id),
            buyerId: BigInt(item.buyerId),
            sellerId: BigInt(item.sellerId),
            createTime: item.createTime,
            goodsId: BigInt(item.goodsId),
            status: item.status,
            updateTime: item.updateTime,
        }))
    }).catch(()=>{
        ElMessage.error('获取失败')
    })
}
getData()

const handleCurrentChange = (val: number) => {
    pageNum.value = val;
    refresh()
}

const refresh = async () =>{
    loading.value = true;
    await getSum()
    await getData()
    loading.value = false;
}

const getStatus = (status) => {
    switch (status){
        case 0 : return '订单创建';
        case 1 : return '已支付';
        case 2 : return '订单取消';
        default: return '未知状态';
    }
}

const reset = () =>{
    refresh()
}
const selectDelete = () =>{
    for(let i = 0;i < multipleSelection.value.length;i++){
        request.delete('order/' + multipleSelection.value[i].id).then(()=>{
            ElMessage({
                message: '删除成功',
                type: 'success'
            })
            refresh()
        })
    }
}
const handleDelete = (index: number, row: Order) => {
    console.log(index, row)
    request.delete('order/' + row.id).then(()=>{
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        refresh()
    })
}
const handleSelectionChange = (val: Order[]) => {
    multipleSelection.value = val
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
