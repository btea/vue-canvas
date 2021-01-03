<template>
    <div class="z-audio">
        <div class="audio-menu">
            <div
                class="item"
                v-for="item in menus"
                :class="{ active: item.name === activeMenu }"
                :key="item.name"
                @click="switchStyle(item)"
            >
                <img :src="item.val" alt="" />
            </div>
        </div>
        <div class="audio-box">
            <canvas class="canvas" ref="wave" width="600" height="600"></canvas>
            <audio controls autoplay loop ref="audio"></audio>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import audioSource from "@/assets/media/qixiannv.mp3";
import bar from "@/assets/img/bar.png";
import circle from "@/assets/img/circle.png";
export default {
    setup() {
        let wave = ref(null);
        let audio = ref(null);
        let activeMenu = ref("circle");
        let menus = reactive([
            { name: "bar", val: bar },
            { name: "circle", val: circle },
        ]);
        let switchStyle = (item) => {
            activeMenu.value = item.name;
        };
        let ctx = new AudioContext();
        let analyser = ctx.createAnalyser();
        let audioSrc;
        let connect = () => {
            audioSrc.connect(analyser);
            analyser.connect(ctx.destination);
            analyser.fftSize = 512;
        };
        let c_ctx,
            c_w,
            c_h,
            meterWidth = 5,
            gap = 2,
            minHeight = 2,
            meterNum,
            req,
            radius = 200;
        // 绘制圆形动画时的半径
        function render() {
            let array = new Uint8Array(analyser.frequencyBinCount); // lenght 512 / 2 => 256
            analyser.getByteFrequencyData(array);
            let step = Math.round(array.length / meterNum);
            c_ctx.clearRect(0, 0, c_w, c_h);
            let gradient = c_ctx.createLinearGradient(0, 0, 0, c_h);
            gradient.addColorStop(0, "#6cf");
            gradient.addColorStop(0.5, "#66fff8");
            gradient.addColorStop(1, "#66ff80");
            c_ctx.fillStyle = gradient;
            for (let i = 0; i < meterNum; i++) {
                let v = array[i * step];
                let x = i * (meterWidth + gap);
                let y = c_h * (1 - v / 256); // analyser.fftSize(512) / 2 => 256
                c_ctx.fillRect(x, y, meterWidth, c_h || minHeight);
            }
        }
        function initCanvas() {
            audio.value.crossOrigin = "anonymous";
            audio.value.src = audioSource;
            audioSrc = ctx.createMediaElementSource(audio.value);
            connect();
            let el = wave.value;
            c_ctx = el.getContext("2d");
            c_w = window.innerWidth - 300;
            c_h = 600;
            el.width = c_w;
            el.height = c_h;
            meterNum = c_w / (meterWidth + gap);
            renderStyleJudg();
        }

        function renderStyleJudg() {
            if (activeMenu.value === "bar") {
                render();
            }
            if (activeMenu.value === "circle") {
                renderCircle();
            }
            req = requestAnimationFrame(renderStyleJudg);
        }

        function renderCircle() {
            let max = 80;
            let array = new Uint8Array(analyser.frequencyBinCount); // lenght 512 / 2 => 256
            analyser.getByteFrequencyData(array);
            c_ctx.clearRect(0, 0, c_w, c_h);
            let gradient = c_ctx.createLinearGradient(0, -200, 0, 0);
            gradient.addColorStop(0, "#6cf");
            gradient.addColorStop(0.5, "#66fff8");
            gradient.addColorStop(1, "#66ff80");
            c_ctx.fillStyle = gradient;
            for (let i = 0; i < 120; i++) {
                c_ctx.save();
                c_ctx.translate(c_w / 2, c_h / 2);
                let v = array[i];
                v = (v / 256) * max;
                if (v < 5) {
                    v = 5;
                }
                let angle = (Math.PI / 180) * 3 * i;
                c_ctx.rotate(angle);
                c_ctx.fillRect(0, -v - radius, 5, v);
                c_ctx.restore();
            }
            renderCircleBar();
        }

        function renderCircleBar() {
            let x, y;
            x = c_w / 2;
            y = c_h / 2;
            let h = 5;
            c_ctx.save();
            c_ctx.beginPath();
            c_ctx.lineWidth = h;
            c_ctx.strokeStyle = "rgba(255, 255, 255, .5)";
            c_ctx.moveTo(x - radius, y);
            c_ctx.lineTo(x + radius, y);
            c_ctx.stroke();
            c_ctx.restore();
        }

        function bindEvent() {
            let aud = audio.value;
            aud.addEventListener("pause", () => {
                cancelAnimationFrame(req);
                console.log("pause");
            });
            aud.addEventListener("play", () => {
                console.log("play");
                let v = activeMenu.value;
                if (v === "bar") {
                    render();
                } else {
                    renderCircle();
                }
            });
            aud.addEventListener("error", () => {
                console.log("播放失败");
            });
            aud.addEventListener("ended", () => {
                console.log("播放结束");
            });
        }
        onMounted(() => {
            initCanvas();
            bindEvent();
        });
        onBeforeUnmount(() => {
            audio.value.src = "";
            cancelAnimationFrame(req);
        });

        return {
            wave,
            audio,
            menus,
            activeMenu,
            switchStyle,
        };
    },
};
</script>
<style lang="less" scoped>
@w: 300px;
.z-audio {
    height: 100%;
    display: flex;
    .audio-menu {
        width: @w;
        height: 100%;
        box-shadow: -3px 0 5px 0 #6cf;
    }
    .item {
        text-align: center;
        cursor: pointer;
        margin: 20px 0;
        img {
            width: 200px;
        }
        &.active {
            img {
                box-shadow: 0 0 5px 0 #6cf;
            }
        }
    }
    .audio-box {
        height: 100%;
        flex: 1;
        text-align: center;
    }
    .canvas {
        // background: url("https://img2.huashi6.com/images/resource/2020/12/06/h86138640p0.png?imageView2/3/q/100/interlace/1/w/1600/h/1600/format/webp");
        // background: url("https://img2.huashi6.com/images/resource/2019/03/17/737183h66p0.png?imageView2/3/q/100/interlace/1/w/1600/h/1600/format/webp");
        // background-size: cover;
        // background-position-y: center;
    }
}
</style>
