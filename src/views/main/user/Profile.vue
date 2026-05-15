<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {processSvg} from "@/utils/SvgUtil.js";
import HeadSvgRaw from "@/assets/head.svg?raw";
import SettingSvgRaw from "@/assets/setting.svg?raw";

const HeadSvgHtml = processSvg(HeadSvgRaw);
const SettingSvgHtml = processSvg(SettingSvgRaw);

const menu = [
    {name: '个人信息', path: '/profile/personal-homepage', iconHtml: HeadSvgHtml},
    {name: '修改信息', path: '/profile/personal-setting', iconHtml: SettingSvgHtml},
]

const showText = ref(false)

const activePath = ref()

const router = useRouter()
const handleClick = (item) => {
    activePath.value = item.path
    router.push(item.path)
}

onMounted(() => {
    activePath.value = '/profile/personal-homepage'
    router.push('/profile/personal-homepage')
})
</script>

<template>
    <div class="layout">
        <ul class="menu bg-base-200 gap-3 p-2 shadow-[1px_0_2px_rgba(0,0,0,0.2)]">
            <input v-model="showText" type="checkbox" checked="checked" class="toggle" style="margin-left: 2px"/>
            <li v-for="item in menu" :key="item.path">
                <a class="tooltip tooltip-right"
                   :data-tip="showText ? '' : item.name"
                   :class="{ 'menu-active' : activePath === item.path }"
                   @click="handleClick(item)">
                    <span v-html="item.iconHtml"></span>
                    {{ showText ? item.name : '' }}
                </a>
            </li>
        </ul>
        <!--    主显示区域-->
        <div style="flex: 1; display: flex; margin: 5px; padding: 0">
            <RouterView/>
        </div>
    </div>
</template>

<style scoped>
.layout {
    flex: 1;
    display: flex;
}

</style>