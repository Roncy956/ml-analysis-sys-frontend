<script setup>
import Map from '@/components/echarts/Map.vue'
import {ref, computed, onMounted, watch} from "vue";
import {getMapData} from "@/api/result.js";

const yearValue = ref(2000);
const rangeValue = ref();

const allData = ref([]);
const mapData = ref([]);

// 计算当前年份（数值）
const currentYear = computed(() => {
    return Number(yearValue.value) + Number(rangeValue.value);
});

onMounted(async () => {
    const res = await getMapData();
    if (res.code === 1) {
        allData.value = res.data; // 确保这是 [{year, data}, ...] 格式
    } else {
        console.error('Failed to load map data', res);
    }
    rangeValue.value = 1
});

// 监听 rangeValue 变化，更新 mapData
watch(
    () => rangeValue.value,
    () => {
        const targetYear = currentYear.value;
        const matched = allData.value.find(item => item.year === targetYear);
        mapData.value = matched ? matched.data : [];
    },
);
</script>

<template>

    <div class="hero flex flex-col gap-10 p-10 items-center">
        <div class="flex flex-row w-full px-10 items-center justify-center gap-10">
            <input v-model="rangeValue" type="range" min="1" max="23" value="1" class="range w-full" step="1"/>
            <div class="badge badge-neutral w-25">{{ currentYear }} 年</div>
        </div>
        <div class="card card-body w-full h-full flex flex-row p-0 m-0 shadow-sm">
            <Map :map-data="mapData"/>
        </div>
    </div>
</template>