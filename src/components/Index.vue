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
        <div class="right">
            发兴合穷千里目，<br />&nbsp;&nbsp;著书聊寄百年心。<br />&nbsp;&nbsp;&nbsp;&nbsp;翻云覆雨谁能问？<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纳纳乾坤古复今。
        </div>
    </div>
</template>
<script>
import { reactive, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
export default {
    setup() {
        let list = reactive([
            { name: 'canvas', path: '/canvas', disable: false },
            { name: 'vue', path: '/vue', disable: true },
            { name: 'css', path: '/css', disable: true },
            { name: 'html', path: '/html', disable: true },
            { name: 'js', path: '/js', disable: true },
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
    background-image: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Fcb8065380cd79123e7c659f4af345982b2b78008.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612274392&t=53b93a5f97506b2465a498377aebf476');
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
    .right {
        position: absolute;
        right: 50px;
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
