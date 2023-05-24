export default [
  {
    path: "/order/createFromExcel",
    name: "order-create-from-excel",
    component: () =>
      import(
        /* webpackChunkName: "tank-excel" */ "@/views/zp/CreateOrderFromExcel.vue"
        ),
    meta: {
      title: "Excel",
      layout: "ui",
      category: "zp",
    },
  },
  {
    path: "/order/query",
    name: "order-query",
    component: () =>
      import(
        /* webpackChunkName: "tank-java" */ "@/views/zp/QueryOrder.vue"
        ),
    meta: {
      title: "Order",
      layout: "landing",
      category: "zp",
    },
  },
  {
    path: "/order/queryHistory",
    name: "order-query-history",
    component: () =>
      import(
        /* webpackChunkName: "tank-java" */ "@/views/zp/QueryOrderHistory.vue"
        ),
    meta: {
      title: "OrderHistory",
      layout: "landing",
      category: "zp",
    },
  },
  {
    path: "/signin",
    name: "signin",
    component: () =>
      import(
        /* webpackChunkName: "auth-signin" */ "@/views/zp/SigninPage.vue"
        ),
    meta: {
      auth: true,
      layout: "auth",
      title: "SignIn",
    },
  },
];
