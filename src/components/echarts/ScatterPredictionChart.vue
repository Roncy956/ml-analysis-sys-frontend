<template>
    <div ref="chartRef" class="w-full h-full"></div>

    <!-- 放大弹窗 -->
    <label v-if="showDialog" for="my_modal_scatter_prediction" class="btn">放大查看</label>
    <input v-if="showDialog" type="checkbox" id="my_modal_scatter_prediction" class="modal-toggle" />
    <div v-if="showDialog" class="modal">
        <div class="modal-box w-11/12 max-w-6xl h-4/5">
            <!-- 弹窗中的图表也传入相同的数据 prop -->
            <ScatterPredictionChart
                :title="title"
                :xData="xData"
                :yData="yData"
                :xAxisName="xAxisName"
                :yAxisName="yAxisName"
                :show-dialog="false"
            />
        </div>
        <label class="modal-backdrop" for="my_modal_scatter_prediction">关闭</label>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: String,
    xData: {
        type: Array,
        required: true,
        validator: (val) => val.every(item => typeof item === 'number')
    },
    yData: {
        type: Array,
        required: true,
        validator: (val) => val.every(item => typeof item === 'number')
    },
    xAxisName: {
        type: String,
        default: '实际值'      // 改为“实际值”，居中显示在横轴中间
    },
    yAxisName: {
        type: String,
        default: '预测值'      // 改为“预测值”，居中显示在纵轴中间
    },
    showDialog: {
        type: Boolean,
        default: true
    }
})

const chartRef = ref(null)
let myChart = null

/**
 * 获取高性能散点图配置（包含 y=x 红线 + 同步缩放的dataZoom）
 * @param {Array} scatterData 散点数据 [[x, y], ...]
 * @param {Array} lineData 红线数据 [[min, min], [max, max]]
 */
const getOption = (scatterData, lineData) => {
    return {
        title: { text: props.title || '散点图', left: 'center' },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                // 只对散点系列显示 tooltip，红线不显示
                if (params.seriesType === 'scatter') {
                    return `(${params.data[0].toFixed(2)}, ${params.data[1].toFixed(2)})`
                }
                return null
            }
        },
        grid: { left: '5%', right: '5%', top: '10%', bottom: '15%', containLabel: true }, // 底部留出更多空间给dataZoom
        xAxis: {
            type: 'value',
            name: props.xAxisName,
            nameLocation: 'center',   // 确保名称居中于横轴中间
            nameTextStyle: { fontSize: 12, fontWeight: 'bold' },
            nameGap: 30,
            axisLabel: { fontSize: 10 },
            scale: true, // 开启缩放适配，配合dataZoom
            // 同步缩放关键：与y轴保持相同的缩放比例
            zoomLock: false
        },
        yAxis: {
            type: 'value',
            name: props.yAxisName,
            nameLocation: 'center',   // 确保名称居中于纵轴中间
            nameTextStyle: { fontSize: 12, fontWeight: 'bold' },
            nameGap: 40,
            axisLabel: { fontSize: 10 },
            scale: true, // 开启缩放适配，配合dataZoom
            zoomLock: false // 不锁定缩放，允许跟随x轴成比例缩放
        },
        // 核心新增：dataZoom组件（横轴放大条 + 同步纵轴缩放）
        dataZoom: [
            {
                type: 'slider', // 滑动条型放大条
                show: true,
                xAxisIndex: 0, // 绑定x轴
                yAxisIndex: 0, // 绑定y轴（实现纵轴同步缩放）
                start: 0, // 初始缩放起始位置（0%）
                end: 20, // 初始缩放结束位置（100%）
                bottom: 50, // 放大条位置（底部）
                height: 20, // 放大条高度
                // 关键配置：同步x/y轴缩放比例
                zoomOnMouseWheel: { enable: true, type: 'scale' }, // 滚轮缩放时按比例缩放
                moveOnMouseMove: { enable: true, type: 'scale' }, // 拖动放大条时按比例缩放
                // 样式优化
                backgroundColor: 'rgba(240,240,240,0.8)',
                dataBackground: { areaStyle: { color: 'rgba(150,180,250,0.2)' }, lineStyle: { color: '#88b7ff' } },
                fillerColor: 'rgba(100,140,255,0.3)',
                handleStyle: { color: '#0c42da', borderColor: '#0831a8' },
                textStyle: { fontSize: 10 }
            },
            {
                type: 'inside', // 内置型（鼠标滚轮/拖拽画布缩放）
                xAxisIndex: 0,
                yAxisIndex: 0,
                zoomOnMouseWheel: 'scale', // 滚轮缩放：按比例缩放x/y轴
                moveOnMouseMove: true, // 拖拽画布平移
                moveOnMouseWheel: true // 滚轮平移
            }
        ],
        series: [
            {
                type: 'scatter',
                name: '数据点',
                data: scatterData,
                // --- 海量数据优化核心配置 ---
                large: true,              // 开启大数据优化模式
                largeThreshold: 2000,     // 数据量超过2000即启用优化
                progressive: 5000,        // 渐进式渲染，每帧渲染5000个点
                progressiveThreshold: 2000, // 启用渐进式渲染的阈值
                symbolSize: 2,            // 大一点的透明圆（原1调整为3）
                itemStyle: {
                    color: '#0c42da',
                    opacity: 0.08,         // 透明圆效果
                    borderWidth: 0
                },
                emphasis: {
                    disabled: true        // 禁用高亮以避免2万数据卡顿
                }
            },
            {
                type: 'line',
                name: 'y = x',
                data: lineData,
                symbol: 'none',           // 不显示数据点标记
                lineStyle: {
                    color: 'red',
                    width: 2,
                    type: 'solid'         // 红色实线 y=x
                },
                tooltip: { show: false }, // 红线不触发提示框
                emphasis: { scale: false },
                smooth: false,
                animation: false,
                large: true               // 虽然只有两个点，但统一优化风格
            }
        ],
        // 关闭整体动画，依靠 progressive 实现流畅加载
        animation: false
    }
}

/**
 * 更新图表（包含加载动画、数据组装、红线计算）
 * 优化至2万条数据流畅渲染
 */
const updateChart = () => {
    if (!myChart) return

    // 显示加载动画，确保大数据量时用户有反馈
    myChart.showLoading({ text: '数据加载中...', maskColor: 'rgba(255, 255, 255, 0.8)' })

    // 使用 setTimeout 异步处理数据组装，防止阻塞 UI 线程
    setTimeout(() => {
        const xVals = props.xData
        const yVals = props.yData
        const len = Math.min(xVals.length, yVals.length)

        // 一次遍历生成散点数据，同时计算全局极值用于红线
        const scatterData = []
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

        for (let i = 0; i < len; i++) {
            const x = xVals[i]
            const y = yVals[i]
            // 过滤无效数值（理论上都是数字，但防御一下）
            if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) continue

            scatterData.push([x, y])
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
        }

        // 计算 y=x 红线的范围（取所有数据的全局最小最大值，确保线条贯穿视图）
        let globalMin = 0, globalMax = 1
        if (scatterData.length > 0) {
            globalMin = Math.min(minX, minY)
            globalMax = Math.max(maxX, maxY)
            // 避免最小最大值相等导致红线不可见
            if (globalMin === globalMax) {
                globalMin = globalMin - 1
                globalMax = globalMax + 1
            }
        } else {
            // 无有效数据时的默认红线范围（不影响展示）
            globalMin = 0
            globalMax = 1
        }

        const lineData = [
            [globalMin, globalMin],
            [globalMax, globalMax]
        ]

        // 设置图表配置，notMerge: true 完全替换，避免旧配置干扰
        myChart.setOption(getOption(scatterData, lineData), { notMerge: true })

        // 数据渲染完成后，隐藏加载动画
        myChart.hideLoading()
    }, 100)
}

// 初始化 ECharts 实例
const initChart = () => {
    if (chartRef.value) {
        myChart = echarts.init(chartRef.value)
        updateChart()
    }
}

// 监听数据变化，更新图表（深度监听确保数组内容变化时触发）
watch(() => [props.xData, props.yData], updateChart, { deep: true })

// 生命周期：挂载时初始化，绑定窗口自适应
onMounted(() => {
    initChart()
    window.addEventListener('resize', () => myChart?.resize())
})

// 销毁时清理资源
onBeforeUnmount(() => {
    window.removeEventListener('resize', () => myChart?.resize())
    myChart?.dispose()
    myChart = null
})
</script>