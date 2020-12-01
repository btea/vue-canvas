import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: 'chart'
    },
    {
        path: '/home',
        name: 'home',
        // component: () => import('@/components/Index.vue')
        component: () => import('@/components/Scale.vue')
    },
    {
        path: '/chart',
        name: 'chart',
        component: () => import('@/components/Chart.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router