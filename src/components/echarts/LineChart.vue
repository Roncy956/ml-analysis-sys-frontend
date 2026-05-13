<template>
    <div ref="chartRef" class="w-full h-full"></div>
    <!-- The button to open modal -->
    <label v-if="showDialog" for="my_modal_line_char" class="btn">放大显示</label>

    <!-- Put this part before </body> tag -->
    <input v-if="showDialog" type="checkbox" id="my_modal_line_char" class="modal-toggle"/>
    <div v-if="showDialog" class="modal" role="dialog">
        <div class="modal-box w-10/12 max-w-4xl h-4/5">
            <LineChart
                :title="title"
                :xData="xData"
                :series="series"
                :series-name="seriesName"
                :show-dialog="false"/>
        </div>
        <label class="modal-backdrop" for="my_modal_line_char">Close</label>
    </div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref, watch} from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: String,
    xData: Array,
    series: Array,
    seriesName: String,
    showDialog: Boolean
})

const chartRef = ref(null)
let myChart = null

const getOption = () => ({
    title: {text: props.title},
    tooltip: {},
    grid: {
        left: '5%',     // 使用百分比可以更好地适应宽屏
        right: '5%',
        top: '20%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {data: props.xData},
    yAxis: {},
    animation: true,
    animationDuration: 1000,
    series: [{
        name: props.seriesName,
        type: 'line',
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