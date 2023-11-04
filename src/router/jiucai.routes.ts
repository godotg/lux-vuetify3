export default [
  {
    path: "/",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/News.vue"),
  },
  {
    path: "/ai",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/Navigation.vue"),
  },
  {
    path: "/chatgpt",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/Chatgpt.vue"),
  },
  {
    path: "/spark",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/ChatgptSpark.vue"),
  },
  {
    path: "/square",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/Square.vue"),
  },
  {
    path: "/midjourney",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/Midjourney.vue"),
  },
  {
    path: "/diffusion",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/StableDiffusion.vue"),
  },
  {
    path: "/realistic",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/StableDiffusionRealistic.vue"),
  },
  {
    path: "/test",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/jiucai/Test.vue"),
  },
  {
    path: "/ac/:id",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/NewsOne.vue"),
  },

];
