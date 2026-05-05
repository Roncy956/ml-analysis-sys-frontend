<script setup>
import { defineProps, defineEmits } from 'vue'
import RoleSwitch from './RoleSwitch.vue'

// 定义 Props
const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: true
  }
})

// 定义 Emits
const emit = defineEmits(['update:isAdmin', 'register-success'])

// 定义方法 (直接定义，不需要 methods 对象)
const handleRegister = () => {
  // 注册逻辑...
  emit('register-success') // 不需要 this
}
</script>

<template>
  <div :class="$style.panel">
    <div :class="$style.title">
      {{ isAdmin ? 'Admin Sign up' : 'User Sign up' }}
    </div>
    <RoleSwitch
        :modelValue="isAdmin"
        @update:modelValue="$emit('update:isAdmin', $event)"
    />
    <!-- 将注册按钮的点击事件绑定为自定义处理 -->
    <form :class="$style.form" @submit.prevent="handleRegister">
      <input
          :class="$style.input"
          placeholder="Name"
          type="text"
          name="name"
      >
      <input
          :class="$style.input"
          name="email"
          placeholder="Email"
          type="email"
      >
      <input
          :class="$style.input"
          name="password"
          placeholder="Password"
          type="password"
      >
      <input
          v-if="isAdmin"
          :class="$style.input"
          name="inviteCode"
          placeholder="Invite Code"
          type="text"
      >
      <button :class="$style.btn" type="submit">register</button>
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