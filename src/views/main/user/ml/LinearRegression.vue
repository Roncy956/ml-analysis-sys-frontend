<script setup>
import BarChart from "@/components/echarts/BarChart.vue";
import {ref, watch, onMounted, onUnmounted} from "vue";
import LineChart from "@/components/echarts/LineChart.vue";
import ScatterChart from "@/components/echarts/ScatterChart.vue";

const barChartTitle = ref('Vue + ECharts 示例')
const barXData = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
const barSeries = ref([5, 20, 36, 10, 10, 20, 7])
const barSeriesName = ref('销量')
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

// 挂载时添加监听
onMounted(() => {
    window.addEventListener('resize', handleWindowResize);
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
            <div class="flex flex-col w-full h-full card card-body m-0 bg-base-150 shadow-sm justify-end">
                <fieldset class="flex flex-row fieldset bg-base-100 border-base-300 rounded-box justify-between w-full border p-4 gap-5">
                    <legend class="fieldset-legend">选择要显示的图表</legend>
                    <label class="label">
                        <input v-model="showImportChart" type="checkbox" checked="checked" class="checkbox"/>
                        Important Charts
                    </label>
                    <label class="label">
                        <input v-model="showScatterChart" type="checkbox" checked="checked" class="checkbox"/>
                        Scatter Chart
                    </label>
                    <label class="label">
                        <input v-model="fittedLineChart" type="checkbox" checked="checked" class="checkbox"/>
                        Fitted Line Chart
                    </label>
                </fieldset>
            </div>
        </div>

        <!-- 移动端垂直排列，桌面端水平排列，间距 gap-10 -->
        <div v-if="showImportChart || showScatterChart|| fittedLineChart" :key="refreshKey"
             class="flex flex-row gap-10 h-3/5 w-full justify-center">

            <!-- 卡片 1：等宽 flex-1，阴影，圆角 -->
            <div v-if="showImportChart" class="card card-body p-0 bg-base-150 shadow-sm h-full w-8/16 max-w-7/16">
                <BarChart
                    :title="barChartTitle"
                    :xData="barXData"
                    :series="barSeries"
                    :series-name="barSeriesName"
                    :show-dialog="true"
                />
            </div>

            <!-- 卡片 2：同样等宽，高度一致 -->
            <div v-if="showScatterChart" class="card card-body p-0 bg-base-150 shadow-sm h-full w-8/16 max-w-7/16">
                <LineChart
                    :title="barChartTitle"
                    :xData="barXData"
                    :series="barSeries"
                    :series-name="barSeriesName"
                    :show-dialog="true"
                />
            </div>

            <!-- 卡片 3：等宽 flex-1，阴影，圆角 -->
            <div v-if="fittedLineChart" class="card card-body p-0 bg-base-150 shadow-sm h-full w-8/16 max-w-7/16">
                <ScatterChart
                    :title="barChartTitle"
                    :xData="barXData"
                    :series="barSeries"
                    :series-name="barSeriesName"
                    :show-dialog="true"
                />
            </div>
        </div>
    </div>
</template>