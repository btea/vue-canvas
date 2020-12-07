<template>
    <div class="chart-render">
        <div class="head">
            <el-link
                type="primary"
                href="https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html"
                target="_blank"
                >editor Api接口</el-link
            >
            <span class="theme">
                <span class="tx">切换主题</span>
                <el-select v-model="theme" @change="switchTheme">
                    <el-option v-for="t in themeList" :key="t" :value="t" :label="t"></el-option>
                </el-select>
            </span>
        </div>
        <div class="area">
            <div class="code" ref="code"></div>
            <div class="chart" ref="chart"></div>
        </div>
    </div>
</template>
<script>
import * as monaco from "monaco-editor";
import { onMounted, reactive, ref } from "vue";
import Canvas from "@/method/line";

export default {
    setup() {
        let chart = ref(null);
        let code = ref(null);
        let render;
        let pointsDeal = (options) => {
            let box = chart.value;
            if (!render) {
                render = new Canvas(box);
            }
            render.clear();
            render.renderAxis();
            render.pointsCalc(options);
        };
        let getOptions = (option) => {
            try {
                option = eval(option);
                pointsDeal(option);
            } catch (error) {
                console.log(error);
            }
        };
        let throttle = (fn, time = 2000) => {
            let timer;
            return () => {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    fn();
                    timer = null;
                }, time);
            };
        };
        let theme = ref("vs");
        const themeList = reactive(["vs", "vs-dark", "hc-black"]);
        let switchTheme = (v) => {
            monaco.editor.setTheme(theme.value);
        };
        onMounted(() => {
            let el = code.value;
            let editor = monaco.editor.create(el, {
                value: [
                    "option = {",
                    '   xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],',
                    "   yAxis: [820, 932, 901, 934, 1290, 1330, 1320],",
                    '   type: "line",',
                    "   smooth: true",
                    "}",
                ].join("\n"),
                language: "javascript",
                minimap: {
                    enabled: false,
                },
                selectOnLineNumbers: true,
                roundedSelection: false,
                cursorStyle: "line", // 光标样式
                automaticLayout: false, // 自动布局
                glyphMargin: true, // 字形边缘
                useTabStops: false,
                fontSize: 16, // 字体大小
                autoIndent: false, //自动布局
            });
            getOptions(editor.getValue());
            editor.onDidChangeModelContent(
                throttle(() => {
                    const newValue = editor.getValue();
                    getOptions(newValue);
                })
            );
        });
        return {
            chart,
            code,
            theme,
            themeList,
            switchTheme,
        };
    },
};
</script>
<style lang="less" scoped>
@head: 80px;
.chart-render {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .head {
        padding-left: 100px;
        height: @head;
        max-width: 1200px;
        display: flex;
        align-items: center;
        .theme {
            margin-left: 20px;
        }
        .tx {
            margin-right: 10px;
        }
    }
    .area {
        flex: 1;
        display: flex;
    }
    .code,
    .chart {
        flex: 1;
    }
}
</style>
