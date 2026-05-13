<template>
    <div ref="chartRef" class="w-full h-full"></div>
    <!-- 放大弹窗触发按钮 -->
    <label v-if="showDialog" for="my_modal_scatter_char" class="btn">放大显示</label>

    <!-- 弹窗组件 -->
    <input v-if="showDialog" type="checkbox" id="my_modal_scatter_char" class="modal-toggle"/>
    <div v-if="showDialog" class="modal" role="dialog">
        <div class="modal-box w-10/12 max-w-4xl h-4/5">
            <ScatterChart
                :title="title"
                :xData="xData"
                :series="series"
                :seriesName="seriesName"
                :show-dialog="false"/>
        </div>
        <label class="modal-backdrop" for="my_modal_scatter_char">Close</label>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'

// 定义组件属性
const props = defineProps({
    title: {
        type: String,
        default: '散点图'
    },
    xData: {
        type: Array,
        default: () => []
    },
    series: {
        type: Array,
        default: () => []
    },
    seriesName: {
        type: String,
        default: '数据系列'
    },
    showDialog: {
        type: Boolean,
        default: true
    }
})

const chartRef = ref(null)
let myChart = null

// 构建ECharts配置项
const getOption = () => ({
    title: {
        text: props.title,
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return `${props.seriesName}<br/>X: ${params.name}<br/>Y: ${params.value}`
        }
    },
    grid: {
        left: '5%',
        right: '5%',
        top: '20%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: props.xData,
        axisLabel: {
            rotate: 0
        }
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    animation: true,
    animationDuration: 1000,
    series: [{
        name: props.seriesName,
        type: 'scatter', // 核心：设置为散点图类型
        data: props.series,
        symbolSize: 10, // 散点大小
        itemStyle: {
            color: '#409EFF', // 散点颜色
            borderWidth: 1,
            borderColor: '#fff'
        },
        emphasis: {
            itemStyle: {
                symbolSize: 15, // 高亮时散点大小
                color: '#1989FA'
            }
        }
    }]
})

// 更新图表数据
const updateChart = () => {
    if (myChart) {
        myChart.setOption(getOption(), { notMerge: false, lazyUpdate: false })
    }
}

// 初始化图表
const initChart = () => {
    if (!chartRef.value) return
    myChart = echarts.init(chartRef.value)
    updateChart()
}

// 监听属性变化，更新图表
watch(() => [props.title, props.xData, props.series, props.seriesName], () => {
    updateChart()
}, { deep: true })

// 窗口大小变化时重绘图表
const handleResize = () => {
    myChart?.resize()
}

// 生命周期：挂载时初始化
onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
})

// 生命周期：卸载时销毁
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    myChart?.dispose()
    myChart = null
})
</script>