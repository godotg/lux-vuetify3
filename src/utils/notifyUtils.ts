import Notify from "@wcjiang/notify";
import _ from "lodash";
import {useCustomizeThemeStore} from "@/stores/customizeTheme";

let notify: Notify = null;

// https://emoji6.com/emojiall/
const jokes = [
  "🌱割韭菜啦！🌱",
  "打雷啦，下雨啦...👽️👽️👽️",
  "⚔️打起来了⚔️",
  "号外号外☘️☘️☘️",
  "某某爱豆塌房🍃",
  "重磅新闻🌱",
  "🌲滴~系统小秘密",
  "😜嘘！笑点高的不要笑！😘",
  "神秘情报！🙃",
  "报告长官，发现UFO !!!🐶",
  "喂喂喂🌷",
  "☁️前方高能！一大波消息正在靠近！",
  "别装了，快来摸鱼🌪️🌪️🌪️",
  "哈哈哈哈哈哈😇",
  "🌼夺命连环call即将抵达战场！🌼",
  "🃏XXX正在疯狂输出中...🃏",
  "收到一条彩虹屁，快去看看是谁吹的！🌠",
  "⚽️社死现场",
  "XXX已破防🗻",
  "爷青回🎆",
  "🌏️打雷啦，下雨啦...🌏️",
  "🔔外星人来了",
  "世界末日了！！！✌️",
  "📣地球沦陷了",
  "🚀怪兽出没",
];

let count = 0;

function initNotify() {
  if (notify != null) {
    return;
  }
  const customizeTheme = useCustomizeThemeStore();
  notify = new Notify({
    message: "There is message.", // page title.
    effect: "flash", // flash | scroll, Flashing or scrolling
    openurl: "https://github.com/jaywcjlove/iNotify", // Click on the pop-up window to open the connection address
    onclick: () => {
      // Click on the pop-up window trip event
      // Programmatically closes a notification.
      // notify.close();
      console.log("---");
    },
    // Optional playback sound
    audio: {
      // You can use arrays to pass sound files in multiple formats.
      file: "aa/music/msg.mp3",
      // The following is also work.
      // file: 'msg.mp4'
    },
    // Title flashing, or scrolling speed
    interval: 1000,
    disableFavicon: false, // Optional, default false, if true, No longer overwrites the original favicon
    // Optional, default green background white text. Favicon
    updateFavicon: {
      // favicon font color
      textColor: "#fff",
      // Background color, set the background color to be transparent, set the value to "transparent"
      backgroundColor: customizeTheme.primaryColor.colorValue,
    },
    // Optional chrome browser notifications，
    // The default is not to fill in the following content
    notification: {
      title: "Notification!", // Set notification title
      icon: "", // Set notification icon, The default is Favicon
      body: "You have a new message!", // Set message content
    },
  });
}

export async function newNotify(desktopTitle: string, desktopBody: string) {
  ++count;
  initNotify();
  console.log("推送消息");
  const joke = jokes[_.random(0, jokes.length - 1)];
  if (_.isEmpty(desktopBody)) {
    desktopBody = joke;
  }
  // 浏览器左下角弹窗推送
  notify.notify({
    title: desktopTitle,
    body: desktopBody,
    openurl: "https://jiucai.fun",
    onclick: function () {
      console.log("on click");
    },
    onshow: function () {
      console.log("on show");
    },
  });
  notify.setTitle(joke); // Flashing new title
  notify.setFavicon(count);
  // 播放声音
  notify.player();
}


export async function closeNotify() {
  if (notify == null) {
    return;
  }
  count = 0;
  notify.faviconClear();
  notify.setTitle(); // Clear Blinking Show original title
  notify.close();
}


export async function hasPermissionNotify() {
  initNotify();
  return notify.isPermission();
}
