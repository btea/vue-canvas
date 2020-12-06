<template>
    <div class="z-text">
        <div class="ope">
            <input class="tx-inp" type="text" v-model="word" />
            <button class="btn-ope" @click="renderText">文字粒子</button>
            <span>字体</span>
            <el-select v-model="lang" @change="languageSwitch">
                <el-option
                    :value="l.val"
                    v-for="l in langList"
                    :key="l.val"
                    :label="l.val"
                ></el-option>
            </el-select>
        </div>
        <div class="t-show">
            <canvas id="text"></canvas>
        </div>
    </div>
</template>
<script>
import { onMounted, reactive, ref } from "vue";
export default {
    emits: ["change", "onUpdate"],
    setup() {
        let canvas, ctx;
        let winWidth = window.innerWidth;
        let winHeight = 240;
        let fontSize = 200;
        let dotList = [];
        onMounted(() => {
            canvas = document.getElementById("text");
            ctx = canvas.getContext("2d");
            canvas.width = winWidth;
            canvas.height = winHeight;
        });

        let word = ref("前端");
        let lang = ref("微软雅黑");
        let langList = reactive([
            { val: "微软雅黑" },
            { val: "宋体" },
            { val: "楷体" },
            { val: "flower" },
        ]);
        let languageSwitch = (v) => {
            init();
        };
        let speed = 10;
        const draw = () => {
            // 判断所有点的 nowX 属性都不小于 x 属性
            // 也就是判断动画效果是否完成
            var flag = true;

            // 画一个和 canvas 一样的大的 渐变色矩形
            var gradient = ctx.createLinearGradient(0, winHeight / 2, winWidth, winHeight / 2);
            gradient.addColorStop(0, "#4facfe");
            gradient.addColorStop(1, "#00f2fe");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, winWidth, winHeight);

            // 遍历 dotList 数组，根据数组里的元素画圆点
            ctx.fillStyle = "#fff";
            for (var i = 0; i < dotList.length; i++) {
                if (dotList[i]["x"] > dotList[i]["nowX"]) {
                    dotList[i]["nowX"] += speed;
                    flag = false;
                } else {
                    dotList[i]["nowX"] = Math.floor(dotList[i]["x"]);
                }

                ctx.beginPath();
                ctx.arc(dotList[i]["nowX"], dotList[i]["y"], 2, 0, 2 * Math.PI);
                ctx.fill();
            }

            if (flag) {
                return;
            }
            window.requestAnimationFrame(draw);
        };
        function Dot(centerX, centerY, radius) {
            this.x = centerX;
            this.y = centerY;
            this.nowX = 0;
        }
        const init = () => {
            var val = word.value || "前端";
            ctx.font =
                fontSize + "px " + `${lang.value},Helvetica Neue, Helvetica, Arial, sans-serif`;
            ctx.textBaseline = "top";
            // 先填充一个和 canvas 一样大的 白色矩形
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, winWidth, winHeight);
            // 在再 canvas 上写红色的字
            ctx.fillStyle = "red";
            ctx.fillText(val, 0, 0);
            // 获取整个 canvas 的像素信息
            var imgData = ctx.getImageData(0, 0, winWidth, winHeight);

            // 获取到像素信息之后清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 清空数组
            dotList = [];

            // 最后实现的效果每个点之间有一定的距离，gap 就是控制这个距离的
            // gap 应该是大于等于1的值，值越大，最后点与点之间的距离就越远
            var gap = 6;

            // 通过 width 和 height 遍历 imgData 对象，每隔 gap 个点取一次像素，找到红色的像素，
            // 每找到一个红色点，就创建一个 Dot 对象，并添加到 dotList 数组中
            for (var x = 0; x < imgData.width; x += gap) {
                for (var y = 0; y < imgData.height; y += gap) {
                    var i = (y * imgData.width + x) * 4;
                    // 判断像素点是不是红色
                    if (
                        imgData.data[i] == 255 &&
                        imgData.data[i + 1] == 0 &&
                        imgData.data[i + 2] == 0 &&
                        imgData.data[i + 3] == 255
                    ) {
                        var dot = new Dot(x, y);
                        dotList.push(dot);
                    }
                }
            }

            // 画出最后的粒子效果
            window.requestAnimationFrame(draw);
        };
        let renderText = () => {
            init();
        };

        return {
            renderText,
            word,
            lang,
            langList,
            languageSwitch,
        };
    },
};
</script>
<style lang="less" scoped>
.z-text {
    .ope {
        text-align: center;
        margin-top: 25px;
    }
    .tx-inp {
        line-height: 30px;
        outline: none;
        border: 1px solid #00f2fe;
    }
    .btn-ope {
        display: inline-block;
        background-color: #ff0081;
        color: #fff;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 10px 20px;
        box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5);
    }
    #text {
        background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
        margin-top: 20px;
    }
}
</style>
