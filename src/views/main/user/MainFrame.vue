<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import ThemeSelect from "@/components/ThemeSelect.vue"

const router = useRouter()
const route = useRoute()

// 定义 tabs，path 对应子路由路径
const tabs = [
    {name: '主页', path: '/homepage'},
    {name: '数据分析', path: '/data-analysis'},
    {name: '个人信息', path: '/profile'}
]


// 当前激活的路由路径
const activePath = computed(() => route.path)

function setActiveTab(path) {
    router.push(path)
}

function logOut() {
    router.push('/loginTmp')
    console.log('退出登录')
}

// 判断某个 tab 是否应该高亮
function isTabActive(tab) {
    // 对于“数据分析”tab，匹配自身及其所有子路由
    if (tab.path === '/data-analysis') {
        return route.path === '/data-analysis' || route.path.startsWith('/data-analysis/');
    }
    if (tab.path === '/profile') {
        return route.path === '/profile' || route.path.startsWith('/profile/');
    }
    // 其他 tab 保持精确匹配
    return route.path === tab.path;
}

onMounted(() => {
    router.push('/homepage')
})
</script>

<template>
    <div class="navbar bg-base-100 shadow-sm">
        <div class="navbar-start">
            <ThemeSelect/>
        </div>

        <div class="navbar-center">
            <div role="tablist" class="tabs tabs-box">
                <a
                    v-for="tab in tabs"
                    :key="tab.path"
                    role="tab"
                    class="tab"
                    :class="{ 'tab-active': isTabActive(tab) }"
                    @click="setActiveTab(tab.path)"
                >
                    {{ tab.name }}
                </a>
            </div>
        </div>

        <div class="navbar-end" style="gap: 6px">
            <div class="dropdown dropdown-end">
                <!-- 用户信息保持不变 -->
                <div class="flex gap-3">
                    <button class="btn">
                        User
                        <div class="badge badge-sm">用户</div>
                    </button>
                    <div tabindex="0" role="button"
                         class="bg-neutral text-neutral-content btn btn-ghost btn-circle avatar">
                        <span class="text-xl">AI</span>
                    </div>
                </div>
                <ul
                    tabindex="-1"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-45 p-2 shadow">
                    <li>
                        <a @click="logOut" class="justify-between">
                            logout
                            <span class="badge">登出</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 子路由内容渲染区域 -->
    <div style="flex: 1; display: flex; padding: 0; overflow: auto;">
        <RouterView />
    </div>

</template>

<style scoped>
/* 你的样式 */
</style>