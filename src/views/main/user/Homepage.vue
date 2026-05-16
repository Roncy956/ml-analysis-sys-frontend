<script setup>
import {ref, onMounted, watch} from "vue";
import Cube from "@/components/Cube.vue";
import ScanField from "@/components/ScanField.vue";
import {getTableLen, getTablePage} from "@/api/result.js";

const pageSizeOption = [100, 200, 300, 400, 500]
const pageSize = ref(100)
const totalPage = ref(100)
const page = ref(1)
const tableLength = ref()

const tableData = ref([])

// 模拟获取数据（实际项目中替换为API请求）
onMounted(async () => {
    tableLength.value = (await getTableLen()).data
    totalPage.value = Math.ceil(tableLength.value / pageSize.value)

    const res = await getTablePage(page.value, pageSize.value)
    if (res.code === 1) {
        tableData.value = res.data
    }
});

watch(() => [page.value, pageSize.value], async () => {
    totalPage.value = Math.ceil(tableLength.value / pageSize.value)
    console.log("pageSize变了", pageSize.value)
    const res = await getTablePage(page.value, pageSize.value)
    if (res.code === 1) {
        tableData.value = res.data
    }
})
</script>

<template>
    <div class="bg-base-100 flex-1 flex flex-row p-10 gap-10 w-full h-full box-border">
        <!-- 左侧区域：固定宽度 -->
        <div class="flex flex-col w-80 justify-start items-center gap-20 flex-shrink-0">
            <ScanField/>
            <Cube/>
            <div class="card card-body flex gap-5 py-10 shadow-sm w-full">
                <div class="flex flex-col items-center">
                    <label class="a">训练随机森林</label>
                    <button class="btn btn-neutral btn-soft w-30">Begin</button>
                </div>
                <div class="flex flex-col items-center">
                    <label class="a">训练XGBoost</label>
                    <button class="btn btn-neutral btn-soft w-30">Begin</button>
                </div>
                <div class="flex flex-col items-center">
                    <label class="a">训练LightGBM</label>
                    <button class="btn btn-neutral btn-soft w-30">Begin</button>
                </div>
                <div class="flex flex-col items-center">
                    <label class="a">训练CatBoost</label>
                    <button class="btn btn-neutral btn-soft w-30">Begin</button>
                </div>
                <div class="flex flex-col items-center">
                    <label class="a">训练集成模型</label>
                    <button class="btn btn-neutral btn-soft w-30">Begin</button>
                </div>
                <div class="flex flex-col items-center">
                    <label class="a">导入数据</label>
                    <input type="file" class="file-input"/>
                </div>
            </div>
        </div>

        <!-- 右侧区域：自动填满剩余宽度，不超出 -->
        <div class="card card-body shadow-sm flex flex-col gap-5 flex-grow overflow-hidden h-full">
            <!-- 数据表格区域：仅表格横向滚动，卡片高度自适应 -->
            <div class="flex flex-col items-center w-full h-full">
                <h3 class="text-xl font-bold mb-4">中国大陆沿省份经济出口数据（2000-2023）</h3>
                <!-- 表格容器：仅横向滚动，高度自适应 -->
                <div class="overflow-x-auto overflow-y-auto w-full h-170">
                    <table class="table table-xs table-pin-rows table-pin-cols ">
                        <thead>
                        <tr class="text-[15px]">
                            <th></th>
                            <td>地区</td>
                            <td>产品名称</td>
                            <td>出口额</td>
                            <td>年份</td>
                            <td>多样性</td>
                            <td>普遍性</td>
                            <td>地区—产品比较有时矩阵值</td>
                            <td>经济复杂性指数</td>
                            <td>产品复杂性指数</td>
                            <td>密度</td>
                            <td>复杂性展望指数</td>
                            <td>复杂性机会增益</td>
                            <td>显示性比较优势指数</td>
                            <td>海洋产品类型</td>
                            <td>年度出口总额</td>
                            <td>地区年度出口总额</td>
                            <td>产品年度出口总额</td>
                            <td>产品类型年度出口总额</td>
                            <td>地区—产品类型年度总出口额</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" class="text-[15px]">
                            <th>{{ item.id }}</th>
                            <td>{{ item.location }}</td>
                            <td>{{ item.productName }}</td>
                            <td>{{ item.value }}</td>
                            <td>{{ item.year }}</td>
                            <td>{{ item.diversity }}</td>
                            <td>{{ item.ubiquity }}</td>
                            <td>{{ item.mcp }}</td>
                            <td>{{ item.eci }}</td>
                            <td>{{ item.pci }}</td>
                            <td>{{ item.density }}</td>
                            <td>{{ item.coi }}</td>
                            <td>{{ item.cog }}</td>
                            <td>{{ item.rca }}</td>
                            <td>{{ item.type }}</td>
                            <td>{{ item.totalValueByYear }}</td>
                            <td>{{ item.totalValueByYearLocation }}</td>
                            <td>{{ item.totalValueByYearProduct }}</td>
                            <td>{{ item.totalValueByYearType }}</td>
                            <td>{{ item.totalValueByYearLocationType }}</td>
                        </tr>
                        </tbody>
                    </table>

                    <!-- 空数据提示 -->
                    <div v-if="false" class="text-center py-8 text-gray-500">
                        暂无海洋经济出口数据
                    </div>
                </div>
            </div>
            <div class="flex flex-row justify-center items-center gap-5">
                <select class="select select-neutral w-20" v-model="pageSize">
                    <option
                        v-for="item in pageSizeOption"
                        :key="item"
                        :value="item"
                    >
                        {{ item }}
                    </option>
                </select>
                <div class="join h-10">
                    <button class="join-item btn" :disabled="page === 1" @click="page=1"> Begin</button>
                    <button class="join-item btn" :disabled="page === 1" @click="page--"> «</button>
                    <button v-if="page > 2" class="join-item btn" @click="page = page - 2">
                        {{ page - 2 }}
                    </button>
                    <button v-if="page > 1" class="join-item btn" @click="page = page - 1">
                        {{ page - 1 }}
                    </button>
                    <button class="join-item btn btn-active"> {{ page }}</button>
                    <button v-if="page < totalPage" class="join-item btn" @click="page = page + 1">
                        {{ page + 1 }}
                    </button>
                    <button v-if="page < totalPage - 1" class="join-item btn" @click="page = page + 2">
                        {{ page + 2 }}
                    </button>
                    <button class="join-item btn" :disabled="page === totalPage" @click="page++"> »</button>
                    <button class="join-item btn" :disabled="page === totalPage" @click="page=totalPage"> End</button>
                </div>
                <input
                    type="text"
                    placeholder="选择"
                    class="input w-20"
                    @keyup.enter="page = parseInt($event.target.value) || 1; $event.target.value = ''"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>