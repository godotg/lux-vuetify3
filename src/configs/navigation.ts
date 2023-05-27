import menuUI from "./menus/ui.menu";
import menuApps from "./menus/apps.menu";
import menuPages from "./menus/pages.menu";
import menuCharts from "./menus/charts.menu";
import menuLanding from "./menus/landing.menu";
import menuData from "./menus/data.menu";
import menuAi from "./menus/ai.menu";


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
