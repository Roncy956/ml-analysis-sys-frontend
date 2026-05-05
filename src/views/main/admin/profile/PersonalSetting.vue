<script setup>

</script>

<template>
  <div class="main">
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend class="fieldset-legend">Login</legend>

      <label class="label">Email</label>
      <input type="email" class="input" placeholder="Email" />

      <label class="label">Password</label>
      <input type="password" class="input" placeholder="Password" />

      <button class="btn btn-neutral mt-4">Login</button>
    </fieldset>
  </div>
</template>

<style scoped>
.main {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  font-size: 100px;
}
</style>