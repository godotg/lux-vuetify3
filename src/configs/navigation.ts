import menuUI from "./menus/ui.menu";
import menuApps from "./menus/apps.menu";
import menuPages from "./menus/pages.menu";
import menuCharts from "./menus/charts.menu";
import menuLanding from "./menus/landing.menu";
import menuData from "./menus/data.menu";
import menuAi from "./menus/ai.menu";

export default {
  menu: [
    {
      text: "",
      key: "",
      items: [
        {
          key: "jiucai.news",
          text: "News",
          link: "/",
          icon: "mdi-format-font-size-increase",
        },
        {
          key: "jiucai.chatgpt",
          text: "ChatGpt",
          link: "/chatgpt",
          icon: "mdi-robot-confused-outline",
        },
        {
          key: "jiucai.square",
          text: "Square",
          link: "/square",
          icon: "mdi-gamepad-square-outline",
        }
      ],
    },
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
  ],
};
