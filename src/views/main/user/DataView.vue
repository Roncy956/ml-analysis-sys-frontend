<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const showText = ref(false);

const activePath = ref();
const menu = [
    { name: '线性回归 Linear Regression', path: '/data-analysis/linear-regression' },
    { name: '逻辑回归 Logistic Regression', path: '/data-analysis/logistic-regression' },
    { name: '决策树 Decision Tree', path: '/data-analysis/decision-tree' },
    { name: '随机森林 Random Forest', path: '/data-analysis/random-forest' },
    { name: '支持向量机 SVM', path: '/data-analysis/svm' },
    { name: 'K-最近邻 KNN', path: '/data-analysis/knn' },
    { name: '朴素贝叶斯 Naive Bayes', path: '/data-analysis/naive-bayes' },
    { name: '梯度提升 Gradient Boosting', path: '/data-analysis/gradient-boosting' }
];
const router = useRouter();
const route = useRoute(); // 新增：获取当前路由

const handleClick = (item) => {
    activePath.value = item.path;
    router.push(item.path);
};

// 新增：监听 showText 变化，刷新路由
watch(showText, (newVal, oldVal) => {
    // 方式1：通过 router.go(0) 刷新当前页面（简单粗暴，会刷新整个页面）
    // router.go(0);

    // 方式2：重新跳转当前路由（仅刷新路由组件，不刷新整个页面，推荐）
    if (route.fullPath) {
        router.push({
            path: route.fullPath,
            query: { ...route.query, t: Date.now() } // 加时间戳避免缓存
        }).catch(() => {}); // 捕获重复跳转的警告
    }
});

onMounted(() => {
    activePath.value = '/data-analysis/linear-regression';
    router.push('/data-analysis/linear-regression');
});
</script>

<template>
    <div class="flex flex-1">
        <ul class="menu bg-base-200 gap-3 p-2 shadow-[1px_0_2px_rgba(0,0,0,0.2)]">
            <!-- 点击 toggle 时修改 showText，触发监听 -->
            <input v-model="showText" type="checkbox" checked="checked" class="toggle" style="margin-left: 2px"/>
            <li v-for="item in menu" :key="item.path">
                <a class="tooltip tooltip-right"
                   :data-tip="showText ? '' : item.name"
                   :class="{ 'menu-active' : activePath === item.path, 'w-65': showText === true }"
                   @click="handleClick(item)">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-7 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    {{ showText ? item.name : '' }}
                </a>
            </li>
        </ul>
        <!-- 主显示区域 -->
        <div style="flex: 1; display: flex; margin: 5px; padding: 0;">
            <RouterView :key="route.fullPath + (showText ? '1' : '0')" />
            <!-- 额外优化：给 RouterView 加 key，强制重新渲染 -->
        </div>
    </div>
</template>