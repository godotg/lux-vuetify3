import menuCharts from "./menus/charts.menu";


import menuZp from "./menus/zp.menu";

export default {
  menu: [
    {
      text: "",
      key: "",
      items: [
        {
          key: "menu.dashboard",
          text: "Dashboard",
          link: "/dashboard",
          icon: "mdi-view-dashboard-outline",
        },
      ],
    },
    {
      text: "忠平",
      items: menuZp,
    },
    {
      text: "Charts",
      key: "menu.charts",
      items: menuCharts,
    },
  ],
};
