export default [
  {
    path: "/",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/News.vue"),
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
    path: "/ac/:id",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/NewsOne.vue"),
  },

];
