<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const showText = ref(false)

const activePath = ref()
const menu = [
    {name: '线性回归 Linear Regression', path: '/data-analysis/linear-regression'},
    {name: '逻辑回归 Logistic Regression', path: '/data-analysis/logistic-regression'},
    {name: '决策树 Decision Tree', path: '/data-analysis/decision-tree'},
    {name: '随机森林 Random Forest', path: '/data-analysis/random-forest'},
    {name: '支持向量机 SVM', path: '/data-analysis/svm'},
    {name: 'K-最近邻 KNN', path: '/data-analysis/knn'},
    {name: '朴素贝叶斯 Naive Bayes', path: '/data-analysis/naive-bayes'},
    {name: '梯度提升 Gradient Boosting', path: '/data-analysis/gradient-boosting'}
]
const router = useRouter()
const handleClick = (item) => {
    activePath.value = item.path
    router.push(item.path)
}

onMounted(() => {
    activePath.value = '/data-analysis/linear-regression'
    router.push('/data-analysis/linear-regression')
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
        <!--    主显示区域-->
        <div style="flex: 1; display: flex; margin: 5px; padding: 0;">
            <RouterView/>
        </div>
    </div>
</template>

<style scoped>
.layout {
    flex: 1;
    display: flex;
    border-radius: 0;
}

</style>