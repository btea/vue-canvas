<template>
    <div class="z-animation">
        <div class="menu">
            <div
                class="m"
                v-for="m in list"
                :key="m.val"
                :class="{ act: m.val === active }"
                @click="switchMenu(m)"
            >
                <i class="icon"></i>
                <span class="tx">{{ m.name }}</span>
            </div>
        </div>
        <div class="show-area">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, reactive, ref } from "vue";
import { useRouter } from "vue-router";
export default {
    setup() {
        let list = reactive([
            { val: "rect", name: "矩形" },
            { val: "circle", name: "圆形" },
        ]);
        let { ctx } = getCurrentInstance();
        let active = ref("rect");
        const router = useRouter();
        let switchMenu = (item) => {
            active.value = item.val;
            router.push({ name: item.val });
        };
        return {
            list,
            active,
            switchMenu,
        };
    },
};
</script>
<style lang="less" scoped>
@h: 35px;
@padding: 20px;
.z-animation {
    height: 100%;
    display: flex;
    .menu {
        width: 300px;
        box-shadow: 0 0 5px -1px aqua;
        .m {
            padding: 0 @padding;
            height: @h;
            font-size: 16px;
            font-family: flower;
            display: flex;
            align-items: center;
            cursor: pointer;
            &:hover {
                background: #66ccff42;
            }
            &.act {
                color: #6cf;
            }
        }
    }
    .show-area {
        flex: 1;
    }
}
</style>
