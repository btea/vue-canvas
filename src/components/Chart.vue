<template>
    <div class="chart-render">
        <div class="code" ref="code"></div>
        <div class="chart" ref="chart"></div>
    </div>
</template>
<script>
import * as monaco from 'monaco-editor'
import { onMounted, ref } from 'vue'
import Canvas from '../method/line'

export default {
    setup() {
        let chart = ref(null)
        let code = ref(null)
        let pointsDeal = options => {
            let box = chart.value
            let c = new Canvas(box)
            c.pointsCalc(options)
        }
        let getOptions = (option) => {
            option = eval(option)
            pointsDeal(option)
        }
        onMounted(() => {
            let el = code.value
            let editor = monaco.editor.create(el, {
                value: [
                    'option = {',
                    '   xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],',
                    '   yAxis: [820, 932, 901, 934, 1290, 1330, 132],',
                    '   type: "line"',
                    '}'
                ].join('\n'),
                language: 'javascript',
                minimap:{
                    enabled:false
                },
                selectOnLineNumbers: true,
                roundedSelection: false,
                cursorStyle: 'line', // 光标样式
                automaticLayout: false, // 自动布局
                glyphMargin: true, // 字形边缘
                useTabStops: false,
                fontSize: 16, // 字体大小
                autoIndent: false //自动布局
            })
            getOptions(editor.getValue())
        }) 
        return {
            chart,
            code
        }
    }
}
</script>
<style lang="less" scoped>
.chart-render{
    height: 100vh;
    display: flex;
    .code,.chart{
        flex: 1;
    }
}
</style>