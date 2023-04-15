export default [
  {
    path: "/",
    redirect: "/news",
    meta: {},
  } as any,
  {
    path: "/news",
    meta: {
      layout: "landing",
    },
    component: () => import("@/views/jiucai/News.vue"),
  },
];
