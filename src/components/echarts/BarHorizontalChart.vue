<template>
    <div ref="chartRef" class="w-full h-full"></div>
    <!-- The button to open modal -->
    <label v-if="showDialog" for="my_modal_horizontal_bar_char" class="btn">放大显示</label>

    <!-- Put this part before </body> tag -->
    <input v-if="showDialog" type="checkbox" id="my_modal_horizontal_bar_char" class="modal-toggle"/>
    <div v-if="showDialog" class="modal" role="dialog">
        <div class="modal-box w-11/12 max-w-6xl h-4/5">
            <BarHorizontalChart
                :title="title"
                :yData="yData"
                :series="series"
                :series-name="seriesName"
                :show-dialog="false"/>
        </div>
        <label class="modal-backdrop" for="my_modal_horizontal_bar_char">Close</label>
    </div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref, watch} from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: String,
    yData: Array,
    series: Array,
    seriesName: String,
    showDialog: {
        type: Boolean,
        default: true
    }
})

const chartRef = ref(null)
let myChart = null

const getOption = () => ({
    title: {text: props.title},
    tooltip: {},
    grid: {
        left: '5%',     // 使用百分比可以更好地适应宽屏
        right: '5%',
        top: '10%',
        bottom: '5%',
        containLabel: true
    },
    // 原 xAxis 改为 yAxis（类目轴，承载原X轴的分类数据）
    yAxis: {type: 'category', data: props.yData},
    // 原 yAxis 改为 xAxis（数值轴，承载数值）
    xAxis: {type: 'value'},
    animation: true,
    animationDuration: 1000,
    series: [{
        name: props.seriesName,
        type: 'bar',
        data: props.series
    }]
})

const updateChart = () => {
    if (myChart) {
        myChart.setOption(getOption(), {notMerge: false, lazyUpdate: false})
    }
}

const initChart = () => {
    if (!chartRef.value) return
    myChart = echarts.init(chartRef.value)
    updateChart()
}

watch(() => [props.title, props.xData, props.series, props.seriesName], () => {
    updateChart()
}, {deep: true})

const handleResize = () => {
    myChart?.resize()
}

onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    myChart?.dispose()
})
</script>