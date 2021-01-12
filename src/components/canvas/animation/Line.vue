<template>
    <div class="z-line" ref="lineBox">
        <canvas ref="lineCircle" class="line-circle" @click="addRain"></canvas>
    </div>
</template>
<script>
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
function getStyle(el) {
    return window.getComputedStyle(el);
}
export default {
    setup() {
        let lineCircle = ref(null);
        let lineBox = ref(null);
        let w,
            h,
            raf,
            ctx,
            lines = [];
        let initCanvas = () => {
            let ratio = window.devicePixelRatio || 1;
            let el = lineCircle.value;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            el.width = w * ratio;
            el.height = h * ratio;
            ctx = el.getContext('2d');
            ctx.scale(ratio, ratio);
            createLine(30);
            drawLine();
            raf = window.requestAnimationFrame(ani);
        };
        function ani() {
            drawLine();
            raf = window.requestAnimationFrame(ani);
        }
        function drawLine() {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = 'aqua';
            lines.forEach((line) => {
                if (line.end) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 255, ${line.opacity})`;
                    ctx.ellipse(line.x, line.y + line.h, line.rx, line.ry, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    line.rx += randonmVal(1, 0);
                    line.ry += randonmVal(1, 0);
                    line.opacity -= 0.05;
                    if (line.opacity < 0) {
                        setLineVal(line);
                    }
                } else {
                    line.y += line.speed;
                    if (line.y + line.h + line.endVal > h) {
                        line.end = true;
                    }
                    ctx.beginPath();
                    ctx.moveTo(line.x, line.y);
                    ctx.lineTo(line.x, line.y + line.h);
                    ctx.stroke();
                }
            });
        }
        // 当某一条线完全消失之后，再给该线重新赋值
        function setLineVal(line) {
            line.y = 10;
            line.x = randonmVal(w - 10, 10, true);
            line.h = randonmVal(70, 30, true);
            line.speed = randonmVal(10, 3);
            line.rx = 30;
            line.ry = 10;
            line.end = false;
            line.scale = 1.1;
            line.opacity = 1;
            line.endVal = randonmVal(100, 40, true);
        }

        function createLine(num) {
            while (num--) {
                let obj = {};
                setLineVal(obj);
                lines.push(obj);
            }
        }

        function randonmVal(max, min, isInt) {
            let v = Math.random() * (max - min) + min;
            return isInt ? Math.floor(v) : v;
        }

        // 控制雨是否暂停
        /**
         * 歪打正着，随着鼠标不断点击canvas，速度越来越快，看着像是雨越下越大
         *
         */
        let isStop = false;
        let addRain = () => {
            raf = window.requestAnimationFrame(ani);
        };
        let goRain = () => {
            if (isStop) {
                isStop = false;
                raf = window.requestAnimationFrame(ani);
                return;
            }
            isStop = true;
            window.cancelAnimationFrame(raf);
        };

        onMounted(() => {
            let style = getStyle(lineBox.value);
            w = parseInt(style.width);
            h = parseInt(style.height);
            initCanvas();
        });

        onBeforeUnmount(() => {
            window.cancelAnimationFrame(raf);
        });
        return {
            lineCircle,
            lineBox,
            goRain,
            addRain,
        };
    },
};
</script>
<style lang="less" scoped>
.z-line {
    height: 100%;
    .line-circle {
        background: #000;
    }
}
</style>
