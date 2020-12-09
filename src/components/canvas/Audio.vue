<template>
    <div class="z-audio">
        <canvas ref="wave" width="600" height="600"></canvas>
        <audio controls autoplay loop ref="audio"></audio>
    </div>
</template>
<script>
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import audioSource from "@/assets/media/audio.mp3";
export default {
    setup() {
        let wave = ref(null);
        let audio = ref(null);

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
            c_w = window.innerWidth;
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
        onMounted(() => {
            initCanvas();
        });
        onBeforeUnmount(() => {
            audio.value.src = "";
            cancelAnimationFrame(req);
        });

        return {
            wave,
            audio,
        };
    },
};
</script>
<style lang="less" scoped>
.z-audio {
    text-align: center;
}
</style>
