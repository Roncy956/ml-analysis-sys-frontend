<script setup>
import {ref} from 'vue'
import LoginPanel from './LoginPanel.vue'
import RegisterPanel from './RegisterPanel.vue'

// 1. 定义响应式数据 (替代 data)
const isAdmin = ref(false)

// 2. 定义 DOM 引用 (替代 this.$refs)
// 注意：需要在模板中对应的元素上绑定 ref="flipToggle"
const flipToggle = ref(null)

// 3. 定义方法 (替代 methods)
const handleRegisterSuccess = () => {
    // 将 checkbox 设为未选中状态，触发翻转动画回到登录页
    if (flipToggle.value) {
        flipToggle.value.checked = false
    }
    // 可在此处添加其他成功后的操作，例如弹出提示
    console.log('注册成功，已返回登录页')
}
</script>

<template>
    <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">{{ isAdmin ? "" : '' }}</h1>
                <p class="py-6">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
            </div>
            <div class="w-full ">
                <div :class="$style.wrapper">
                    <div :class="$style.cardSwitch">
                        <label :class="$style.switch">
                            <!-- 添加 ref -->
                            <input type="checkbox" :class="$style.toggle" ref="flipToggle">
                            <span :class="$style.slider"></span>
                            <span :class="$style.cardSide"></span>
                            <div :class="$style.flipCardInner">
                                <div :class="$style.flipCardFront">
                                    <LoginPanel
                                        :isAdmin="isAdmin"
                                        @update:isAdmin="isAdmin = $event"
                                    />
                                </div>
                                <div :class="$style.flipCardBack">
                                    <RegisterPanel
                                        :isAdmin="isAdmin"
                                        @update:isAdmin="isAdmin = $event"
                                        @register-success="handleRegisterSuccess"
                                    />
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<style module>

/* 保留原有的所有样式（与问题中完全一致） */
.wrapper {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.switch {
    transform: translateY(-200px);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 50px;
    height: 20px;
}

.cardSide::before {
    position: absolute;
    content: 'Log in';
    left: -70px;
    top: 0;
    width: 100px;
    text-decoration: underline;
    color: var(--font-color);
    font-weight: 600;
}

.cardSide::after {
    position: absolute;
    content: 'Sign up';
    left: 70px;
    top: 0;
    width: 100px;
    text-decoration: none;
    color: var(--font-color);
    font-weight: 600;
}

.toggle {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-color);
    transition: 0.3s;
}

.slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
}

.toggle:checked + .slider {
    background-color: var(--input-focus);
}

.toggle:checked + .slider:before {
    transform: translateX(30px);
}

.toggle:checked ~ .cardSide:before {
    text-decoration: none;
}

.toggle:checked ~ .cardSide:after {
    text-decoration: underline;
}

.flipCardInner {
    width: 300px;
    height: 350px;
    position: relative;
    background-color: transparent;
    perspective: 1000px;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.toggle:checked ~ .flipCardInner {
    transform: rotateY(180deg);
}

.toggle:checked ~ .flipCardFront {
    box-shadow: none;
}

.flipCardFront,
.flipCardBack {
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: lightgrey;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    width: 100%;
    box-sizing: border-box;
}

.flipCardBack {
    transform: rotateY(180deg);
}

/* 其余表单、按钮样式已移至子组件，此处可移除 */
</style>