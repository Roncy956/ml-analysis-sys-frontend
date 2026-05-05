<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const showText = ref(false)

const activePath = ref()
const menu = [
  {name: '信息', path: '/profile/personal-homepage'},
  {name: '设置', path: '/profile/personal-setting'},
]
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
    <ul class="menu bg-base-200 rounded-box gap-3">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
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