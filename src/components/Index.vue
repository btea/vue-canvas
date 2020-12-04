<template>
    <div class="index">
        <div class="menu-list">
            <span 
                :class="['menu', {disable: menu.disable}]" 
                type="success" 
                v-for="menu in list" :key="menu.name" @click="go(menu)"
            >{{menu.name}}</span>
        </div>
    </div>
</template>
<script>
import {reactive, onMounted, getCurrentInstance} from 'vue'
export default {
    setup() {
        let list = reactive([
            {name: 'canvas', path: '/canvas', disable: false},
            {name: 'vue', path: '/vue', disable: true},
            {name: 'css', path: '/css', disable: true},
            {name: 'html', path: '/html', disable: true},
            {name: 'js', path: '/js', disable: true}
        ])
        // getCurrentInstance() 暴露出来的对象有很多属性
        const it = getCurrentInstance().ctx
        let go = (item) => {
            if (item.disable) {
                return
            }
            let path = item.path
            console.log(it)
            it.$router.push(path)
        }
        return {
            list,
            go
        }
    }
}
</script>
<style lang="less" scoped>
.index{
    height: 100%;
    overflow: hidden;
    background: linear-gradient(-45deg, #2edce29c, transparent);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(https://i0.hdslb.com/bfs/album/cb202244684de733f026240b60ac28bb32ba39fd.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-clip: text; 
    .menu{
        font-size: 86px;
        font-weight: 600;
        margin: 0 15px;
        color: transparent;
        cursor: pointer;
    }
    .disable{
        color: rgba(102, 204, 255, .5);
        cursor: not-allowed;
    }
}
</style>