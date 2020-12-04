<template>
    <div class="canvas">
        <div class="canvas-h">

        </div>
        <div class="canvas-view">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import {onMounted, getCurrentInstance, reactive} from 'vue'
export default {
    setup() {
        const it = getCurrentInstance().ctx
        const menu = reactive([
            {name: '图表', path: '/chart'}
        ])
        const switchMenu = () => {

        }
        onMounted(() => {
            it.$router.push('/canvas/chart')
        })
        return {
            menu,
            switchMenu
        }
    }
}
</script>
<style lang="less" scoped>
@head: 50px;
.canvas{
    height: 100%;
    position: relative;
    .canvas-h{
        height: @head;
        background: linear-gradient(-45deg, #2edce29c, transparent);
    }
    .canvas-view{
        position: absolute;
        left: 0;
        right: 0;
        top: @head;
        bottom: 0;
    }
}
</style>