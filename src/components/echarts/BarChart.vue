<template>
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: String,
    xData: Array,
    series: Array,
    seriesName: String
})

const chartRef = ref(null)
let myChart = null

const getOption = () => ({
    title: { text: props.title },
    tooltip: {},
    grid: {
        left: '5%',     // 使用百分比可以更好地适应宽屏
        right: '5%',
        top: 60,
        bottom: 30,
        containLabel: true
    },
    xAxis: { data: props.xData },
    yAxis: {},
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
        myChart.setOption(getOption(), { notMerge: false, lazyUpdate: false })
    }
}

const initChart = () => {
    if (!chartRef.value) return
    myChart = echarts.init(chartRef.value)
    updateChart()
}

watch(() => [props.title, props.xData, props.series, props.seriesName], () => {
    updateChart()
}, { deep: true })

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