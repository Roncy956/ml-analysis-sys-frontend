<script setup>
import {ref, onMounted, onUnmounted, computed} from "vue"; // 新增 ref
import Cube from "@/components/Cube.vue";
import {getEnsembleData} from "@/api/result.js";
import BarHorizontalChart from "@/components/echarts/BarHorizontalChart.vue";
import BarVerticalChart from "@/components/echarts/BarVerticalChart.vue";
import ScatterPredictionChart from "@/components/echarts/ScatterPredictionChart.vue";
import ScatterResidualChart from "@/components/echarts/ScatterResidualChart.vue";

const isSimpleAverage = ref(true)
const refreshKey = ref(true);
const activeStrategy = ref('简单平均')
const activeStrategyNames = ref(['简单平均', '加权平均', 'Stacking'])

const simpleAverageR2 = ref()
const simpleAverageRMSE = ref()
const simpleAverageMAE = ref()
const weightedAverageR2 = ref()
const weightedAverageRMSE = ref()
const weightedAverageMAE = ref()
const stackingR2 = ref()
const stackingRMSE = ref()
const stackingMAE = ref()

// 简单平均策略
const simplePredicted = ref([])
const simpleResiduals = ref([])
// 加权平均策略
const weightedPredicted = ref([])
const weightedResiduals = ref([])
const weightedWeights= ref()
// Stacking策略
const stackedPredicted = ref([])
const stackedResiduals = ref([])
const stackedWeights= ref()

// R2对比图
const r2CompareTitle = ref('R² 对比（小  --> 大）')
const r2CompareXData = ref([])
const r2CompareSeries = ref([])
const r2CompareSeriesName = ref('R²')

// 散点图
const actualPredictTitle = ref('实际值 VS 预测值')
const predictList = ref([])
const actualList = ref([])
const predictListName = ref('预测值')
const actualListName = ref('实际值')

// 残差图
const residualsTitle = ref('残差分布图')
const residualsList = ref([])
const residualsPredictedList = ref([])
const residualsListName = ref('残差')
const residualsPredictedListName = ref('预测值')

// 权重图
const barChartTitle = ref('模型权重')
const model = ref([])
const importance = ref([])
const barSeriesName = ref('权重')

function handleClick(strategy) {
    if (strategy === '简单平均') {
        isSimpleAverage.value=false;
        predictList.value = simplePredicted.value
        residualsList.value = simpleResiduals.value
        residualsPredictedList.value = simplePredicted.value
    } else if (strategy === '加权平均') {
        isSimpleAverage.value=true
        predictList.value = weightedPredicted.value
        residualsList.value = weightedResiduals.value
        residualsPredictedList.value = weightedPredicted.value
        const [modelNames, modelValues] = processWeights(weightedWeights.value);
        model.value = modelNames
        importance.value = modelValues
    } else if (strategy === 'Stacking') {
        isSimpleAverage.value=true
        predictList.value = stackedPredicted.value
        residualsList.value = stackedResiduals.value
        residualsPredictedList.value = stackedPredicted.value
        const [modelNames, modelValues] = processWeights(stackedWeights.value);
        model.value = modelNames
        importance.value = modelValues
    }
    activeStrategy.value = strategy
}

function processWeights(weights) {
    // 1. 转成 [ {name, value}, ... ] 格式
    const weightArr = Object.entries(weights).map(([name, value]) => ({
        name,
        value
    }));
    // 2. 按 value 从小到大排序
    weightArr.sort((a, b) =>  a.value-b.value);
    // 3. 拆分出两个数组
    const names = weightArr.map(item => item.name);
    const values = weightArr.map(item => item.value);
    return [names, values];
}

const modelData = computed(() => {
    // 1. 把所有模型名字和 R2 收集成对象数组
    const list = [
        {name: '简单平均', value: simpleAverageR2.value},
        {name: '加权平均', value: weightedAverageR2.value},
        {name: 'Stacking', value: stackingR2.value},
    ]
    // 2. 只保留有数值的数据（过滤 undefined / null）
    const validList = list.filter(item =>
        item.value !== undefined && item.value !== null && !isNaN(item.value)
    )
    // 3. 从小到大排序（升序）
    validList.sort((a, b) => a.value - b.value)
    // 4. 拆成 名字数组 + 数值数组
    const names = validList.map(item => item.name)
    const values = validList.map(item => item.value)
    return {names, values}
})

// 格式化数值为小数点后4位（兼容空值）
const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) {
        return "-"; // 空值时显示短横线
    }
    return Number(num).toFixed(4);
};


// 检测窗口最大化状态的函数
const checkWindowMaximized = () => {
    // 判断窗口是否最大化（仅在浏览器环境有效）
    return window.outerWidth === screen.availWidth &&
        window.outerHeight === screen.availHeight;
};

// 改为响应式变量 ✨
const isWindowMaximized = ref(checkWindowMaximized());

// 窗口大小变化监听函数
const handleWindowResize = () => {
    const currentMaxState = checkWindowMaximized();
    // 只有当最大化状态发生变化时才更新响应式变量
    if (currentMaxState !== isWindowMaximized.value) {
        isWindowMaximized.value = currentMaxState; // 修改响应式变量的值
        refreshKey.value = !refreshKey.value;
    }
};

onMounted(async () => {
    window.addEventListener('resize', handleWindowResize);
    const res = await getEnsembleData();
    if (res.code === 1) {
        simpleAverageR2.value = res.data.simple_average.test_r2;
        simpleAverageRMSE.value = res.data.simple_average.test_rmse;
        simpleAverageMAE.value = res.data.simple_average.test_mae;
        weightedAverageR2.value = res.data.weighted_average.test_r2;
        weightedAverageRMSE.value = res.data.weighted_average.test_rmse;
        weightedAverageMAE.value = res.data.weighted_average.test_mae;
        stackingR2.value = res.data.stacking.test_r2;
        stackingRMSE.value = res.data.stacking.test_rmse;
        stackingMAE.value = res.data.stacking.test_mae;

        r2CompareXData.value = modelData.value.names
        r2CompareSeries.value = modelData.value.values

        actualList.value = res.data.plot_data.actual_data;
        simplePredicted.value = res.data.plot_data.simple_average.predicted;
        simpleResiduals.value = res.data.plot_data.simple_average.residuals;
        weightedWeights.value = res.data.weighted_average.weights;
        weightedPredicted.value = res.data.plot_data.weighted_average.predicted;
        weightedResiduals.value = res.data.plot_data.weighted_average.residuals;
        stackedWeights.value = res.data.stacking.weights;
        stackedPredicted.value = res.data.plot_data.stacking.predicted;
        stackedResiduals.value = res.data.plot_data.stacking.residuals;

        handleClick(activeStrategy.value)
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<template>
    <div class="flex flex-row w-full h-full m-0 p-10 gap-10">
        <div class=" flex flex-col w-1/3 justify-between gap-10">
            <div class="flex flex-row justify-center items-center gap-10 p-0">
                <!-- 响应式变量变化会触发 v-if 重新判断 -->
                <Cube v-if="isWindowMaximized" class="mx-10 my-8"/>
                <div class="card card-body text-5xl p-5 m-0 justify-center items-center shadow-sm w-auto h-full">
                    集成策略
                </div>
            </div>
            <div class="card card-body flex flex-col justify-begin pl-10 shadow-sm gap-5 text-[20px]">
                <div class="w-full flex flex-row items-center justify-center">
                    <div role="tablist" class="tabs tabs-box">
                        <a
                            v-for="item in activeStrategyNames"
                            :key="item"
                            role="tab"
                            class="tab"
                            :class="{'tab-active': activeStrategy === item}"
                            @click="handleClick(item)"
                        >{{ item }}
                        </a>
                    </div>
                </div>
                <br/>


                <div>
                    简单平均：
                    <br/>R² ：{{ formatNumber(simpleAverageR2) }}
                    <br/>RMSE ：{{ formatNumber(simpleAverageRMSE) }}
                    <br/>MAE ：{{ formatNumber(simpleAverageMAE) }}
                </div>
                <div>
                    加权平均：
                    <br/>R² ：{{ formatNumber(weightedAverageR2) }}
                    <br/>RMSE ：{{ formatNumber(weightedAverageRMSE) }}
                    <br/>MAE ：{{ formatNumber(weightedAverageMAE) }}
                </div>
                <div>
                    Stacking：
                    <br/>R² ：{{ formatNumber(stackingR2) }}
                    <br/>RMSE ：{{ formatNumber(stackingRMSE) }}
                    <br/>MAE ：{{ formatNumber(stackingMAE) }}
                </div>
            </div>
        </div>
        <div class="card card-body p-0 flex flex-col w-2/3 h-full gap-8" :key="refreshKey">
            <!-- 第一行：两个等分 -->
            <div class="flex flex-1 gap-8 justify-center">
                <div class="card card-body shadow-sm p-0 flex-1 max-w-1/2">
                    <BarVerticalChart
                        :title="r2CompareTitle"
                        :x-data="r2CompareXData"
                        :series="r2CompareSeries"
                        :series-name="r2CompareSeriesName"
                    />
                </div>
                <div v-if="isSimpleAverage" class="card card-body shadow-sm p-0 flex-1 w-1/2">
                    <BarHorizontalChart
                        :title="barChartTitle"
                        :yData="model"
                        :series="importance"
                        :series-name="barSeriesName"
                    />
                </div>
            </div>

            <!-- 第二行：两个等分 -->
            <div class="flex flex-1 gap-8">
                <div class="card card-body shadow-sm p-0 flex-1">
                    <ScatterPredictionChart
                        :title="actualPredictTitle"
                        :xData="actualList"
                        :yData="predictList"
                        :xAxisName="actualListName"
                        :yAxisName="predictListName"
                    />

                </div>
                <div class="card card-body shadow-sm p-0 flex-1">
                    <ScatterResidualChart
                        :title="residualsTitle"
                        :xData="residualsPredictedList"
                        :yData="residualsList"
                        :xAxisName="residualsPredictedListName"
                        :yAxisName="residualsListName"
                        :start-zoom="0"
                        :end-zoom="20"
                    />
                </div>
            </div>
        </div>
    </div>
</template>