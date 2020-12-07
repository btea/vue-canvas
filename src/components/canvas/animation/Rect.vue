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
        let rect, ctx, max;
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
        };
        onMounted(() => {
            rect = document.querySelector(".z-rect-can");
            ctx = rect.getContext("2d");
            let style = window.getComputedStyle(rect);
            max = w = parseInt(style.width);
            h = parseInt(style.height);
            rect.style.width = w + "px";
            rect.style.height = h + "px";
            rect.width = ratio * w;
            rect.height = ratio * h;
            ctx.scale(ratio, ratio);
        });
        let clear = () => {
            ctx.clearRect(0, 0, w, h);
        };
        return { start, clear };
    },
};
</script>
<style lang="less" scoped>
@h: 100px;
.z-rect {
    height: 100%;
    position: relative;
    .params {
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
