<template>
    <div ref="mapRef" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import chinaJson from '@/json/ChinaMapData.json'

const mapRef = ref(null)
let myChart = null

const props = defineProps({
    mapData: {
        type: Array,
        required: true
    }
})

onMounted(() => {
    // 初始化 ECharts
    myChart = echarts.init(mapRef.value)
    echarts.registerMap('china', chinaJson)

    // 初始配置（data 先设为空）
    const baseOption = {
        title: {
            text: '中国大陆沿海各省份数据分布',
            left: 'center',
            top: 20
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>数值: {c}'
        },
        visualMap: {
            min: 50000000,
            max: 35000000000,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
                color: ['#e0ffff', '#006edd']
            }
        },
        series: [{
            name: '数据名称',
            type: 'map',
            map: 'china',
            roam: false,
            label: {
                show: true,
                color: '#333',
                fontSize: 10
            },
            itemStyle: {
                areaColor: '#eee',
                borderColor: '#999',
                borderWidth: 1
            },
            emphasis: {
                label: { show: true, color: '#fff' },
                itemStyle: { areaColor: '#ffd700' }
            },
            data: [] // 初始为空
        }]
    }

    myChart.setOption(baseOption)

    // 👇 监听 mapData 变化，动态更新 series.data
    watch(
        () => props.mapData,
        (newData) => {
            console.log('Map.vue received new data:', newData)
            myChart.setOption({
                series: [{
                    data: newData
                }]
            })
        },
        { immediate: true, deep: false } // 不需要 deep，因为是替换整个数组
    )

    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (myChart) myChart.dispose()
})

const handleResize = () => {
    myChart?.resize()
}
</script>