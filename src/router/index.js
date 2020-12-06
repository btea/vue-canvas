import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: "index",
    },
    {
        path: "/index",
        name: "index",
        component: () => import("@/components/Index.vue"),
    },
    {
        path: "/home",
        name: "home",
        // component: () => import('@/components/Index.vue')
        component: () => import("@/components/Scale.vue"),
    },
    {
        path: "/canvas",
        name: "canvas",
        component: () => import("@/components/canvas/Canvas.vue"),
        children: [
            {
                path: "/canvas/chart",
                name: "chart",
                component: () => import("@/components/canvas/Chart.vue"),
            },
            {
                path: "/canvas/image",
                name: "image",
                component: () => import("@/components/canvas/Image.vue"),
            },
            {
                path: "/canvas/animation",
                name: "animation",
                component: () => import("@/components/canvas/Animation.vue"),
            },
            {
                path: "/canvas/text",
                name: "text",
                component: () => import("@/components/canvas/Text.vue"),
            },
            {
                path: "/canvas/audio",
                name: "audio",
                component: () => import("@/components/canvas/Audio.vue"),
            },
            {
                path: "/canvas/video",
                name: "video",
                component: () => import("@/components/canvas/Video.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ y: 0 }),
    routes,
});

export default router;
