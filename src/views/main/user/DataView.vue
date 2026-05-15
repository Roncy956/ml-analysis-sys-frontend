<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import mapSvgRaw from "@/assets/map.svg?raw";
import forestSvgRaw from "@/assets/forest.svg?raw";
import xgboostSvgRaw from "@/assets/XGBoost.svg?raw";
import LightGBMSvgRaw from "@/assets/LightGBM.svg?raw";
import CatBoostSvgRaw from "@/assets/CatBoost.svg?raw";
import {processSvg} from "@/utils/SvgUtil.js";

// 预处理 SVG 图标（只在组件初始化时执行一次，性能友好）
const mapSvgHtml = processSvg(mapSvgRaw);
const forestSvgHtml = processSvg(forestSvgRaw);
const xgboostSvgHtml = processSvg(xgboostSvgRaw)
const LightGBMSvgHtml = processSvg(LightGBMSvgRaw);
const CatBoostSvgHtml = processSvg(CatBoostSvgRaw);

const showText = ref(false);
const activePath = ref();
const menu = [
    {name: "中国沿海各省数据分布", path: "/data-analysis/value-map", iconHtml: mapSvgHtml},
    {name: "随机森林 Random Forest", path: "/data-analysis/random-forest", iconHtml: forestSvgHtml},
    {name: "XGBoost", path: "/data-analysis/xgboost", iconHtml: xgboostSvgHtml},
    {name: "LightGBM", path: "/data-analysis/light-gbm", iconHtml: LightGBMSvgHtml},
    {name: "CatBoost", path: "/data-analysis/cat-boost", iconHtml: CatBoostSvgHtml}
];

const router = useRouter();
const route = useRoute();

const handleClick = (item) => {
    activePath.value = item.path;
    router.push(item.path);
};

// 监听 showText 刷新路由（保留原有逻辑）
watch(showText, () => {
    if (route.fullPath) {
        router.push({path: route.fullPath, query: {...route.query, t: Date.now()}}).catch(() => {
        });
    }
});

onMounted(() => {
    activePath.value = "/data-analysis/value-map";
    router.push("/data-analysis/value-map");
});
</script>

<template>
    <div class="flex flex-1">
        <ul class="menu bg-base-200 gap-3 p-2 shadow-[1px_0_2px_rgba(0,0,0,0.2)]">
            <!-- 折叠开关 -->
            <input v-model="showText" type="checkbox" checked="checked" class="toggle" style="margin-left: 2px"/>
            <li v-for="item in menu" :key="item.path">
                <a
                    class="tooltip tooltip-right"
                    :data-tip="showText ? '' : item.name"
                    :class="{ 'menu-active': activePath === item.path, 'w-55': showText === true }"
                    @click="handleClick(item)"
                >
                    <!-- 动态渲染 SVG 图标 -->
                    <span v-html="item.iconHtml"></span>
                    {{ showText ? item.name : "" }}
                </a>
            </li>
        </ul>
        <div style="flex: 1; display: flex; margin: 5px; padding: 0">
            <RouterView :key="route.fullPath + (showText ? '1' : '0')"/>
        </div>
    </div>
</template>
