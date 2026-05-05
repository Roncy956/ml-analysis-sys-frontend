<script setup>
import BarChart from "@/components/echarts/BarChart.vue";
import { ref } from "vue";
import LineChart from "@/components/echarts/LineChart.vue";

const barChartTitle = ref('Vue + ECharts 示例')
const barXData = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
const barSeries = ref([5, 20, 36, 10, 10, 20, 7])
const barSeriesName = ref('销量')
</script>

<template>
    <div class="hero">
        <!-- 移动端垂直排列，桌面端水平排列，间距 gap-10 -->
        <div class="hero-content text-center flex flex-col md:flex-row gap-10">

            <!-- 卡片 1：等宽 flex-1，阴影，圆角 -->
            <div class="card bg-base-150 shadow-sm flex-1">
                <!-- 关键：给 card-body 一个固定高度（例如 h-80），并移除内边距 -->
                <div class="card-body p-0 h-80 w-120">
                    <BarChart
                        :title="barChartTitle"
                        :xData="barXData"
                        :series="barSeries"
                        :series-name="barSeriesName"
                    />
                </div>
            </div>

            <!-- 卡片 2：同样等宽，高度一致 -->
            <div class="card bg-base-150 shadow-sm flex-1">
                <div class="card-body p-0 h-80 w-120">
                    <LineChart
                        :title="barChartTitle"
                        :xData="barXData"
                        :series="barSeries"
                        :series-name="barSeriesName"
                    />
                </div>
            </div>

        </div>
    </div>
</template>