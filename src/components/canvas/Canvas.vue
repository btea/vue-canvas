<template>
    <div class="canvas">
        <div class="canvas-h">
            <span
                class="menu"
                v-for="m in menu"
                :key="m.path"
                :class="{ active: activeMenu === m.path }"
                @click="switchMenu(m)"
                >{{ m.name }}</span
            >
        </div>
        <div class="canvas-view">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { onMounted, getCurrentInstance, reactive, ref } from "vue";
import { useRouter } from "vue-router";
export default {
    setup() {
        const it = getCurrentInstance().ctx;
        const menu = reactive([
            { name: "图表", path: "chart" },
            { name: "图片", path: "image" },
            { name: "动画", path: "animation" },
            { name: "文字", path: "text" },
            { name: "音频", path: "audio" },
            { name: "视频", path: "video" },
        ]);
        let activeMenu = ref("chart");

        const router = useRouter();
        const switchMenu = (item) => {
            activeMenu.value = item.path;
            go(item.path);
        };
        let go = (name) => {
            router.push({ name: name });
        };
        let a = 10;
        onMounted(() => {
            let route = router.currentRoute.value.matched;
            if (route[1]) {
                activeMenu.value = route[1].name;
            }
            // console.log(route);
        });
        return {
            menu,
            switchMenu,
            activeMenu,
        };
    },
};
</script>
<style lang="less" scoped>
@head: 100px;
.canvas {
    height: 100%;
    position: relative;
    background: url("https://img2.huashi6.com/images/resource/2019/03/17/737183h66p0.png?imageView2/3/q/100/interlace/1/w/1600/h/1600/format/webp");
    background-size: cover;
    background-position-y: center;
    .canvas-h {
        height: @head;
        // background: linear-gradient(-45deg, #2edce29c, transparent);
        background: url("../../assets/img/banner.png");
        background-size: conver;
        background-position: center center;
        padding-left: 100px;
        display: flex;
        align-items: center;
        background-clip: text;
        box-shadow: 1px 1px 1px 1px #6cf;
    }
    .menu {
        margin-right: 30px;
        cursor: pointer;
        font-family: flower;
        color: transparent;
        font-size: 30px;
        font-weight: 600;
        &.active {
            color: #6cf;
        }
    }
    .canvas-view {
        position: absolute;
        left: 0;
        right: 0;
        top: @head;
        bottom: 0;
    }
}
</style>
