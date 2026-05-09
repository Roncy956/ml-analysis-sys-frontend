<script setup>

import Cube from "@/components/Cube.vue";
import ScanField from "@/components/ScanField.vue";
</script>

<template>
    <div class="bg-base-100 flex-1 flex flex-col p-10">
        <div class="flex flex-row w-full gap20 justify-between items-start gap-20">
            <Cube/>
            <ScanField/>
        </div>
    </div>
</template>

<style scoped>

</style>