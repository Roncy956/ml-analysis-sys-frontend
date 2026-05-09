<template>
    <div
        class="cube-loader"
        :style="{ '--cube-size': size + 'px' }"
    >
        <div class="cube-top"></div>
        <div class="cube-wrapper">
            <span style="--i:0" class="cube-span"></span>
            <span style="--i:1" class="cube-span"></span>
            <span style="--i:2" class="cube-span"></span>
            <span style="--i:3" class="cube-span"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CubeLoader',
    props: {
        size: {
            type: Number,
            default: 100
        }
    }
}
</script>

<style scoped>
.cube-loader {
    position: relative;
    width: var(--cube-size);
    height: var(--cube-size);
    transform-style: preserve-3d;
    transform: rotateX(-30deg);
    animation: animate 4s linear infinite;
}

@keyframes animate {
    0% {
        transform: rotateX(-30deg) rotateY(0);
    }
    100% {
        transform: rotateX(-30deg) rotateY(360deg);
    }
}

.cube-loader .cube-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
}

/* 自然顺滑的双色渐变 · 数据分析系统专用蓝 */
.cube-loader .cube-wrapper .cube-span {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotateY(calc(90deg * var(--i))) translateZ(calc(var(--cube-size) / 2));
    background: linear-gradient(
        to bottom,
        #555555 0%, /* 深海军蓝（沉稳） */ #d8d8d8 100% /* 明亮主蓝（数据系统标准色） */
    );
}

.cube-top {
    position: absolute;
    width: var(--cube-size);
    height: var(--cube-size);
    background: #555555; /* 与渐变统一 */
    transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2));
    transform-style: preserve-3d;
}

/* 柔和光晕 · 不刺眼更自然 */
.cube-top::before {
    content: '';
    position: absolute;
    width: var(--cube-size);
    height: var(--cube-size);
    background: #555555;
    transform: translateZ(calc(-1.2 * var(--cube-size)));
    filter: blur(calc(8 / 75 * var(--cube-size)));
    box-shadow: 0 0 20px #000000,
    0 0 40px #555555;
}
</style>