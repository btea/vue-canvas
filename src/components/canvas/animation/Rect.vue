<template>
    <div class="z-rect">
        <div class="params">
            <el-button @click="clear" type="primary">清空</el-button>
        </div>
        <div class="box">
            <canvas class="z-rect-can" ref="rect" @click="start"></canvas>
        </div>
    </div>
</template>
<script>
import { onMounted, ref } from "vue";
export default {
    setup() {
        let rect = ref(null),
            ctx,
            max;
        let speed = 10,
            width = 0,
            req,
            x,
            y,
            color,
            ratio = window.devicePixelRatio,
            w,
            h;
        let draw = () => {
            width += speed;
            if (width > max) {
                cancelAnimationFrame(req);
                return;
            }
            // 一条很重要的注释说明：
            // 在开始绘制图形时，如果没有调用 beginPath 方法，那么即使画布被清空，当再次绘制新的
            // 图形时，历史绘制的图形都会出现在画布上
            // 这似乎也是一个很有意思的功能，可以用来做什么？回顾历史？
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.rect(x - width / 2, y - width / 2, width, width);
            ctx.stroke();
            req = requestAnimationFrame(draw);
        };
        function randomColor() {
            return `#${random().toString(16)}${random().toString(16)}${random().toString(16)}`;
        }
        function random(max = 255, min = 0) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        let start = (e) => {
            (x = e.layerX), (y = e.layerY), (width = 0);
            color = randomColor();
            requestAnimationFrame(draw);
            draw();
        };
        onMounted(() => {
            let el = rect.value;
            ctx = el.getContext("2d");
            let style = window.getComputedStyle(el);
            max = w = parseInt(style.width);
            h = parseInt(style.height);
            el.style.width = w + "px";
            el.style.height = h + "px";
            el.width = ratio * w;
            el.height = ratio * h;
            ctx.scale(ratio, ratio);
        });
        let clear = () => {
            ctx.clearRect(0, 0, w, h);
        };
        return { start, clear, rect };
    },
};
</script>
<style lang="less" scoped>
@h: 60px;
.z-rect {
    height: 100%;
    position: relative;
    .params {
        padding-top: 10px;
        padding-left: 10px;
        height: @h;
    }
    .box {
        position: absolute;
        left: 0;
        width: 100%;
        top: @h;
        bottom: 0;
    }
    .z-rect-can {
        height: 100%;
        width: 100%;
    }
}
</style>
