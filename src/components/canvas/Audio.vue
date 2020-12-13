<template>
    <div class="z-audio">
        <div class="audio-menu">
            <div
                class="item"
                v-for="item in menus"
                :class="{ active: item.name === activeMenu }"
                :key="item.name"
            >
                <img :src="item.val" alt="" />
            </div>
        </div>
        <div class="audio-box">
            <canvas ref="wave" width="600" height="600"></canvas>
            <audio controls autoplay loop ref="audio"></audio>
        </div>
    </div>
</template>
<script>
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import audioSource from "@/assets/media/qixiannv.mp3";
import bar from "@/assets/img/bar.png";
export default {
    setup() {
        let wave = ref(null);
        let audio = ref(null);
        let activeMenu = ref("bar");
        let menus = reactive([{ name: "bar", val: bar }]);

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
            req;
        function render() {
            let array = new Uint8Array(analyser.frequencyBinCount); // lenght 512 / 2 => 256
            analyser.getByteFrequencyData(array);
            let step = Math.round(array.length / meterNum);
            c_ctx.clearRect(0, 0, c_w, c_h);
            for (let i = 0; i < meterNum; i++) {
                let v = array[i * step];
                let x = i * (meterWidth + gap);
                let y = c_h * (1 - v / 256); // analyser.fftSize(512) / 2 => 256
                c_ctx.fillRect(x, y, meterWidth, c_h || minHeight);
            }
            req = requestAnimationFrame(render);
        }
        function initCanvas() {
            audio.value.crossOrigin = "anonymous";
            audio.value.src = audioSource;
            audioSrc = ctx.createMediaElementSource(audio.value);
            connect();
            let el = wave.value;
            c_ctx = el.getContext("2d");
            c_w = window.innerWidth - 300;
            c_h = 300;
            el.width = c_w;
            el.height = c_h;
            meterNum = c_w / (meterWidth + gap);

            let gradient = c_ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "#6cf");
            gradient.addColorStop(0.5, "#66fff8");
            gradient.addColorStop(1, "#66ff80");
            // c_ctx.fillStyle = "rgba(255, 255, 255, .5)";
            c_ctx.fillStyle = gradient;
            render();
        }
        function bindEvent() {
            let aud = audio.value;
            aud.addEventListener("pause", () => {
                cancelAnimationFrame(req);
                console.log("pause");
            });
            aud.addEventListener("play", () => {
                console.log("play");
                render();
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
}
</style>
