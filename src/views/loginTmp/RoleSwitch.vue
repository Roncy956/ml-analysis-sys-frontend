<script setup>
// 1. 定义 Props
// defineProps 是编译器宏，无需导入，直接在 <script setup> 中使用
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

// 2. 定义 Emits
// defineEmits 也是编译器宏，用于定义组件可以触发的事件
const emit = defineEmits(['update:modelValue'])

// 3. 定义方法
// 使用 emit 函数来触发事件，替代 this.$emit
const setRole = (isAdmin) => {
  emit('update:modelValue', isAdmin)
}
</script>

<template>
  <div :class="$style.roleSwitch">
    <button
        :class="[$style.roleBtn, { [$style.active]: !modelValue }]"
        @click.prevent="setRole(false)"
    >
      User
    </button>
    <button
        :class="[$style.roleBtn, { [$style.active]: modelValue }]"
        @click.prevent="setRole(true)"
    >
      Admin
    </button>
  </div>
</template>

<style module>
.roleSwitch {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 5px;
}
.roleBtn {
  background: var(--bg-color, #fff);
  border: 2px solid var(--main-color, #323232);
  border-radius: 5px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--font-color, #323232);
  cursor: pointer;
  box-shadow: 3px 3px var(--main-color, #323232);
  transition: all 0.1s;
}
.roleBtn.active {
  background: var(--input-focus, #2d8cf0);
  color: white;
  border-color: var(--input-focus, #2d8cf0);
}
.roleBtn:active {
  box-shadow: 0px 0px var(--main-color, #323232);
  transform: translate(3px, 3px);
}
</style>