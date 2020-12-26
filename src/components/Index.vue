<template>
    <div class="index">
        <div class="menu-list">
            <span
                :class="['menu', { disable: menu.disable }]"
                type="success"
                v-for="menu in list"
                :key="menu.name"
                @click="go(menu)"
                >{{ menu.name }}</span
            >
        </div>
        <div class="left">细看不是雪五香，天风吹得香零落</div>
    </div>
</template>
<script>
import { reactive, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
export default {
    setup() {
        let list = reactive([
            { name: "canvas", path: "/canvas", disable: false },
            { name: "vue", path: "/vue", disable: true },
            { name: "css", path: "/css", disable: true },
            { name: "html", path: "/html", disable: true },
            { name: "js", path: "/js", disable: true },
        ]);
        // getCurrentInstance() 暴露出来的对象有很多属性
        // const it = getCurrentInstance().ctx;
        const router = useRouter();

        let go = (item) => {
            if (item.disable) {
                return;
            }
            let path = item.path;
            router.push(path);
        };
        return {
            list,
            go,
        };
    },
};
</script>
<style lang="less" scoped>
.index {
    height: 100%;
    overflow: hidden;
    background: linear-gradient(-45deg, #2edce29c, transparent);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("https://i0.hdslb.com/bfs/album/dd0d051ecedb59a421ebbe57bf8b262cc8e0370a.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    // background-clip: text;
    .left {
        position: absolute;
        left: 50px;
        top: 100px;
        font-size: 30px;
        font-weight: 600;
        font-family: flower;
        writing-mode: tb;
        color: #00d0ffb8;
    }
    .menu {
        font-size: 40px;
        font-weight: 600;
        margin: 0 15px;
        color: #6cf;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
    .disable {
        color: rgba(102, 204, 255, 0.5);
        cursor: not-allowed;
    }
}
</style>
