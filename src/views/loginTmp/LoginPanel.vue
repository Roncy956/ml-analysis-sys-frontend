<script setup>
import RoleSwitch from './RoleSwitch.vue'
import { useRouter } from "vue-router"

const router = useRouter()

// ✅ 在 setup 作用域中直接定义函数
function loginIn() {
  console.log('abc')
  router.push('/homepage')
}

// 注意：使用 <script setup> 时，props 和 emits 需要使用 defineProps 和 defineEmits
const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:isAdmin'])
</script>

<template>
  <div :class="$style.panel">
    <div :class="$style.title">
      {{ isAdmin ? 'Admin Log in' : 'User Log in' }}
    </div>
    <RoleSwitch
        :modelValue="isAdmin"
        @update:modelValue="$emit('update:isAdmin', $event)"
    />
    <form :class="$style.form" @submit.prevent>
      <input
          :class="$style.input"
          name="name"
          placeholder="Name"
          type="name"
      >
      <input
          :class="$style.input"
          name="password"
          placeholder="Password"
          type="password"
      >
      <button @click="loginIn" :class="$style.btn">login</button>
    </form>
  </div>
</template>

<style module>
.panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  margin: 10px 0 5px 0;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--main-color, #323232);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.input {
  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color, #323232);
  background-color: var(--bg-color, #fff);
  box-shadow: 4px 4px var(--main-color, #323232);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color, #323232);
  padding: 5px 10px;
  outline: none;
}

.input::placeholder {
  color: var(--font-color-sub, #666);
  opacity: 0.8;
}

.input:focus {
  border: 2px solid var(--input-focus, #2d8cf0);
}

.btn {
  margin: 15px 0 10px 0;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color, #323232);
  background-color: var(--bg-color, #fff);
  box-shadow: 4px 4px var(--main-color, #323232);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color, #323232);
  cursor: pointer;
}

.btn:active {
  box-shadow: 0px 0px var(--main-color, #323232);
  transform: translate(3px, 3px);
}
</style>