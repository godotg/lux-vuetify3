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
];
