export default [
  {
    path: "/",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/Chatgpt.vue"),
  }
];
