<script setup>
import {ref, onMounted, onUnmounted, computed} from "vue"; // 新增 ref
import Cube from "@/components/Cube.vue";
import {getEnsembleData} from "@/api/result.js";
import BarHorizontalChart from "@/components/echarts/BarHorizontalChart.vue";
import BarVerticalChart from "@/components/echarts/BarVerticalChart.vue";
import ScatterPredictionChart from "@/components/echarts/ScatterPredictionChart.vue";
import ScatterResidualChart from "@/components/echarts/ScatterResidualChart.vue";

const refreshKey = ref(true);

const randomForestR2 = ref()
const XGBoostR2 = ref()
const lightGBMR2 = ref()
const catBoostR2 = ref()
const simpleAverageR2 = ref()
const simpleAverageRMSE = ref()
const simpleAverageMAE = ref()
const weightedAverageR2 = ref()
const weightedAverageRMSE = ref()
const weightedAverageMAE = ref()
const stackingR2 = ref()
const stackingRMSE = ref()
const stackingMAE = ref()

const r2CompareTitle = ref('R² 对比（小  --> 大）')
const r2CompareXData =ref([])
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

// 特征重要性
const barChartTitle = ref('特征重要性')
const feature = ref([])
const importance = ref([])
const barSeriesName = ref('特征值')

const modelData = computed(() => {
    // 1. 把所有模型名字和 R2 收集成对象数组
    const list = [
        { name: '随机森林', value: randomForestR2.value },
        { name: 'XGBoost', value: XGBoostR2.value },
        { name: 'LightGBM', value: lightGBMR2.value },
        { name: 'CatBoost', value: catBoostR2.value },
        { name: '简单平均', value: simpleAverageR2.value },
        { name: '加权平均', value: weightedAverageR2.value },
        { name: 'Stacking', value: stackingR2.value },
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
    return { names, values }
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
    if (res.code===1){
        randomForestR2.value = res.data.individual_metrics.RandomForest.test_r2;
        XGBoostR2.value = res.data.individual_metrics.XGBoost.test_r2;
        lightGBMR2.value = res.data.individual_metrics.LightGBM.test_r2;
        catBoostR2.value = res.data.individual_metrics.CatBoost.test_r2;
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
        r2CompareSeries.value = modelData.value.values;

        predictList.value = res.data.plot_data.predicted;
        actualList.value = res.data.plot_data.actual;

        residualsList.value = res.data.plot_data.residuals;
        residualsPredictedList.value = res.data.plot_data.predicted;

        feature.value = res.data.feature_importance.map(item => item.feature).reverse();
        importance.value = res.data.feature_importance.map(item => item.importance).reverse();
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<template>
    <div class="flex flex-row w-full h-full m-0 p-10 gap-10">
        <div class=" flex flex-col w-1/3 justify-between gap-5">
            <div class="flex flex-row justify-center items-center gap-10 p-0">
                <!-- 响应式变量变化会触发 v-if 重新判断 -->
                <Cube v-if="isWindowMaximized" class="mx-10 my-8"/>
                <div class="card card-body text-5xl p-5 m-0 justify-center items-center shadow-sm w-auto h-full">
                    集成分析
                </div>
            </div>
            <div class="card card-body flex flex-col justify-center pl-10 shadow-sm gap-5 text-[20px]">
                <div>
                    随机森林：R² ：{{ formatNumber(randomForestR2) }}
                </div>
                <div>
                    XGBoost：R² ：{{ formatNumber(XGBoostR2) }}
                </div>
                <div>
                    LightGBM：R² ：{{ formatNumber(lightGBMR2) }}
                </div>
                <div>
                    CatBoost：R² ：{{ formatNumber(catBoostR2) }}
                </div>
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
            <div class="flex flex-1 gap-8">
                <div class="card card-body shadow-sm p-0 flex-1">
                    <BarVerticalChart
                        :title="r2CompareTitle"
                        :x-data="r2CompareXData"
                        :series="r2CompareSeries"
                        :series-name="r2CompareSeriesName"
                    />
                </div>
                <div class="card card-body shadow-sm p-0 flex-1">
                    <ScatterPredictionChart
                        :title="actualPredictTitle"
                        :xData="actualList"
                        :yData="predictList"
                        :xAxisName="actualListName"
                        :yAxisName="predictListName"
                    />
                </div>
            </div>

            <!-- 第二行：两个等分 -->
            <div class="flex flex-1 gap-8">
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
                <div class="card card-body shadow-sm p-0 flex-1">
                    <BarHorizontalChart
                        :title="barChartTitle"
                        :yData="feature"
                        :series="importance"
                        :series-name="barSeriesName"
                    />
                </div>
            </div>
        </div>
    </div>
</template>