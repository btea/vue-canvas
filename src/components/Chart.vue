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
        let render
        let pointsDeal = options => {
            let box = chart.value
            if (!render) {
                render = new Canvas(box)
            }
            render.clear()
            render.renderAxis()
            render.pointsCalc(options)
        }
        let getOptions = (option) => {
            try {
                option = eval(option)
                pointsDeal(option)
            } catch (error) {
                console.log(error)
            }
        }
        let throttle = (fn, time = 2000) => {
            let timer            
            return () => {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    fn()
                    timer = null
                }, time)
            }
        }
        onMounted(() => {
            let el = code.value
            let editor = monaco.editor.create(el, {
                value: [
                    'option = {',
                    '   xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],',
                    '   yAxis: [820, 932, 901, 934, 1290, 1330, 1320],',
                    '   type: "line",',
                    '   smooth: true',
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
            editor.onDidChangeModelContent(throttle(() => {
                const newValue = editor.getValue()
                getOptions(newValue)
            }))
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