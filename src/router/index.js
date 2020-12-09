import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: "index",
    },
    {
        path: "/index",
        name: "index",
        meta: { name: "index" },
        component: () => import("@/components/Index"),
    },
    {
        path: "/home",
        name: "home",
        meta: { name: "home" },
        // component: () => import('@/components/Index.vue')
        component: () => import("@/components/Scale"),
    },
    {
        path: "/canvas",
        name: "canvas",
        meta: { name: "canvas" },
        component: () => import("@/components/canvas/Canvas"),
        children: [
            {
                path: "canvasChart",
                name: "chart",
                meta: { name: "chart" },
                component: () => import("@/components/canvas/Chart"),
            },
            {
                path: "canvasImage",
                name: "image",
                meta: { name: "image" },
                component: () => import("@/components/canvas/Image"),
            },
            {
                path: "canvasAnimation",
                name: "animation",
                meta: { name: "animation" },
                component: () => import("@/components/canvas/Animation"),
                redirect: { name: "rect" },
                children: [
                    {
                        path: "rect",
                        name: "rect",
                        meta: { name: "rect" },
                        component: () => import("@/components/canvas/animation/Rect"),
                    },
                ],
            },
            {
                path: "canvasText",
                name: "text",
                meta: { name: "text" },
                component: () => import("@/components/canvas/Text"),
            },
            {
                path: "canvasAudio",
                name: "audio",
                meta: { name: "audio" },
                component: () => import("@/components/canvas/Audio"),
            },
            {
                path: "canvasVideo",
                name: "video",
                meta: { name: "video" },
                component: () => import("@/components/canvas/Video"),
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
