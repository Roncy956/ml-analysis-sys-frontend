<script setup>

import Cube from "@/components/Cube.vue";
import {ref} from "vue";

const name = ref('张三')
const createTime = ref('2026-4-1')
const uid = ref('1')

</script>

<template>
    <div class="hero flex-1">
        <div class="hero-content flex flex-row items-center gap-20" style="display: flex">
            <div class="flex flex-col gap-20 items-center">
                <div class="text-5xl font-bold flex flex-col" style="color: #323232">Profile</div>
                <Cube/>
            </div>

            <div>
                <a href="#" class="hover-3d my-12 mx-2 cursor-pointer">

                    <!-- content -->
                    <div
                        class="card w-96 bg-black text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
                        <div class="card-body">
                            <div class="text-5xl flex justify-between mb-10">
                                <div class="font-bold">{{ name }}</div>
                                <div class="text-5xl opacity-20">❁</div>
                            </div>
                            <div class="text-2xl mb-4 opacity-40">UID: {{ uid }}</div>
                            <div class="flex justify-between">
                                <div>
                                    <div class="text-xs opacity-60">最后一次修改时间</div>
                                    <div>{{ createTime }}</div>

                                </div>
                                <div class="flex flex-col justify-end items-end">
                                    <div class="text-xs opacity-60">注册时间</div>
                                    <div>{{ createTime }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 8 empty divs needed for the 3D effect -->
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
}
</style>