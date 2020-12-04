import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: 'index'
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('@/components/Index.vue')
    },
    {
        path: '/home',
        name: 'home',
        // component: () => import('@/components/Index.vue')
        component: () => import('@/components/Scale.vue')
    },
    {
        path: '/canvas',
        name: 'canvas',
        component: () => import('@/components/canvas/Canvas.vue'),
        children: [
            {
                path: '/canvas/chart',
                name: 'chart',
                component: () => import('@/components/canvas/Chart.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({y: 0}),
    routes
})

export default router