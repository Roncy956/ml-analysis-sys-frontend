<script setup>
import BarHorizontalChart from "@/components/echarts/BarHorizontalChart.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import ScatterPredictionChart from "@/components/echarts/ScatterPredictionChart.vue";
import { getRandomForestData } from "@/api/result.js";
import ScatterResidualChart from "@/components/echarts/ScatterResidualChart.vue";
import Cube from "@/components/Cube.vue";

const trainR2 = ref()
const testR2 = ref()
const trainMSE = ref()
const testMSE = ref()
const testMAE = ref()
const testRMSE = ref()

// 特征重要性
const barChartTitle = ref('特征重要性')
const feature = ref([])
const importance = ref([])
const barSeriesName = ref('特征值')

// 散点图
const actualPredictTitle = ref('实际值 VS 预测值')
const predictList = ref([])
const actualList = ref([])
const predictListName = ref('预测值')
const actualListName = ref('实际值')

// 残差分布图
const residualsTitle = ref('残差分布图')
const residualsList = ref([])
const residualsPredictedList = ref([])
const residualsListName = ref('残差')
const residualsPredictedListName = ref('预测值')

const showImportChart = ref(true)
const showScatterChart = ref(true)
const fittedLineChart = ref(true)
const refreshKey = ref(true);

// 监听三个复选框值变化 → 自动刷新
watch(
    [showImportChart, showScatterChart, fittedLineChart],
    () => {
        refreshKey.value = !refreshKey.value;
    }
);

// 检测窗口最大化状态的函数
const checkWindowMaximized = () => {
    // 判断窗口是否最大化（仅在浏览器环境有效）
    return window.outerWidth === screen.availWidth &&
        window.outerHeight === screen.availHeight;
};

// 保存初始最大化状态
let isWindowMaximized = checkWindowMaximized();

// 窗口大小变化监听函数
const handleWindowResize = () => {
    const currentMaxState = checkWindowMaximized();
    // 只有当最大化状态发生变化时才触发刷新
    if (currentMaxState !== isWindowMaximized) {
        isWindowMaximized = currentMaxState;
        refreshKey.value = !refreshKey.value;
    }
};

// 格式化数值为小数点后4位（兼容空值）
const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) {
        return "-"; // 空值时显示短横线
    }
    return Number(num).toFixed(4);
};

// 挂载时添加监听
onMounted(async () => {
    window.addEventListener('resize', handleWindowResize);
    const res = await getRandomForestData()
    if (res.code === 1) {
        feature.value = res.data.feature_importance.map(item => item.feature).reverse();
        importance.value = res.data.feature_importance.map(item => item.importance).reverse();
        predictList.value = res.data.plot_data.predicted;
        actualList.value = res.data.plot_data.actual;
        residualsList.value = res.data.plot_data.residuals;
        residualsPredictedList.value = res.data.plot_data.predicted;
        trainR2.value = res.data.metrics.train_r2;
        testR2.value = res.data.metrics.test_r2;
        trainMSE.value = res.data.metrics.train_mse;
        testMSE.value = res.data.metrics.test_mse;
        testMAE.value = res.data.metrics.test_mae;
        testRMSE.value = res.data.metrics.test_rmse;
    }
});

// 卸载时移除监听（防止内存泄漏）
onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<template>
    <div class="hero flex flex-col gap-10 p-10 items-center">
        <div class="flex gap-10 p-0 w-full h-2/5 justify-center items-center"
             :class="{'h-full': !showImportChart && !showScatterChart && !fittedLineChart,
             'h-2/5': showImportChart || showScatterChart|| fittedLineChart}">
            <div class="flex flex-col w-full h-full card card-body m-0 bg-base-150 shadow-sm justify-between">
                <div class="flex-1 flex flex-row w-full p-0 gap-10">
                    <Cube v-if="isWindowMaximized" class="mx-10 my-8"/>
                    <div class="card card-body px-10 h-full flex flex-row shadow-sm items-center justify-between">
                        <div class="flex flex-col text-4xl">
                            随机森林<br>模型性能评估：
                        </div>
                        <div class="flex flex-col">
                            <div class="text-[20px]">
                                训练集 R²：{{ formatNumber(trainR2) }}
                            </div>
                            <div class="text-[20px]">
                                测试集 R²：{{ formatNumber(testR2) }}
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="text-[20px]">
                                训练集 MSE：{{ formatNumber(trainMSE) }}
                            </div>
                            <div class="text-[20px]">
                                测试集 MSE：{{ formatNumber(testMSE) }}
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="text-[20px]">
                                测试集 MAE：{{ formatNumber(testMAE) }}
                            </div>
                            <div class="text-[20px]">
                                测试集 RMSE：{{ formatNumber(testRMSE) }}
                            </div>
                        </div>
                    </div>
                </div>
                <fieldset
                    class="flex flex-row fieldset bg-base-100 border-base-300 rounded-box justify-between w-full border p-4 gap-5">
                    <legend class="fieldset-legend">选择要显示的图表</legend>
                    <label class="label">
                        <input v-model="showImportChart" type="checkbox" checked="checked" class="checkbox"/>
                        特征重要性
                    </label>
                    <label class="label">
                        <input v-model="showScatterChart" type="checkbox" checked="checked" class="checkbox"/>
                        实际值 VS 预测值
                    </label>
                    <label class="label">
                        <input v-model="fittedLineChart" type="checkbox" checked="checked" class="checkbox"/>
                        残差分布图
                    </label>
                </fieldset>
            </div>
        </div>

        <!-- 移动端垂直排列，桌面端水平排列，间距 gap-10 -->
        <div v-if="showImportChart || showScatterChart|| fittedLineChart" :key="refreshKey"
             class="flex flex-row gap-10 h-3/5 w-full justify-center">

            <!-- 卡片 1：等宽 flex-1，阴影，圆角 -->
            <div v-if="showImportChart" class="card card-body p-0 bg-base-150 shadow-sm h-full w-8/16 max-w-7/16">
                <BarHorizontalChart
                    :title="barChartTitle"
                    :yData="feature"
                    :series="importance"
                    :series-name="barSeriesName"
                />
            </div>

            <!-- 卡片 2：等宽 flex-1，阴影，圆角 -->
            <div v-if=" showScatterChart" class="card card-body p-0 bg-base-150 shadow-sm h-full w-8/16 max-w-7/16">
                <ScatterPredictionChart
                    :title="actualPredictTitle"
                    :xData="actualList"
                    :yData="predictList"
                    :xAxisName="actualListName"
                    :yAxisName="predictListName"
                />
            </div>

            <!-- 卡片 3：同样等宽，高度一致 -->
            <div v-if="fittedLineChart" class="card card-body p-0 bg-base-150 shadow-sm h-full w-8/16 max-w-7/16">
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
</template>