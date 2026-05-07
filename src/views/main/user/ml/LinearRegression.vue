<script setup>
import BarChart from "@/components/echarts/BarChart.vue";
import {ref} from "vue";
import LineChart from "@/components/echarts/LineChart.vue";

const barChartTitle = ref('Vue + ECharts 示例')
const barXData = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
const barSeries = ref([5, 20, 36, 10, 10, 20, 7])
const barSeriesName = ref('销量')
</script>

<template>
    <div class="hero flex flex-col gap-10 p-10 items-center">
        <div class="flex flex-row gap-10 h-2/5 w-full justify-center">
            <div class="card card-body bg-bas/e-150 shadow-sm">

            </div>
        </div>

        <!-- 移动端垂直排列，桌面端水平排列，间距 gap-10 -->
        <div class="flex flex-row gap-10 h-3/5 w-full justify-center">

            <!-- 卡片 1：等宽 flex-1，阴影，圆角 -->
            <div class="card card-body p-0 bg-base-150 shadow-sm h-full w-5/16">
                <BarChart
                    :title="barChartTitle"
                    :xData="barXData"
                    :series="barSeries"
                    :series-name="barSeriesName"
                />
            </div>

            <!-- 卡片 2：同样等宽，高度一致 -->
            <div class="card card-body p-0 bg-base-150 shadow-sm h-full w-5/16">
                <LineChart
                    :title="barChartTitle"
                    :xData="barXData"
                    :series="barSeries"
                    :series-name="barSeriesName"
                />
            </div>

            <!-- 卡片 3：等宽 flex-1，阴影，圆角 -->
            <div class="card card-body p-0 bg-base-150 shadow-sm h-full w-5/16">
                <BarChart
                    :title="barChartTitle"
                    :xData="barXData"
                    :series="barSeries"
                    :series-name="barSeriesName"
                />
            </div>
        </div>
    </div>
</template>