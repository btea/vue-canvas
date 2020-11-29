import {createRouter, createWebHistory} from 'vue-router'

console.log(createWebHistory)
console.log(createRouter)
const routes = [
    {
        path: '/',
        redirect: 'home'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/Index.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router