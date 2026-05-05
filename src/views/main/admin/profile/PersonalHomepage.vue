<script setup>

import Cube from "@/components/Cube.vue";
</script>

<template>
  <div class="hero bg-base-200 flex-1">
    <div class="hero-content flex-col lg:flex-row gap-20" style="display: flex">
      <div>
        <Cube/>
      </div>

      <div>
        <h1 class="text-5xl font-bold">Box Office News!</h1>
        <p class="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
          quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <button class="btn btn-primary">Get Started</button>
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