<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import axios from "axios";
import _ from "lodash";
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
import {useSnackbarStore} from "@/stores/snackbarStore";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";

const {mobile, width, height} = useDisplay();
const myStore = useMyStore();
const customizeTheme = useCustomizeThemeStore();
const snackbarStore = useSnackbarStore();

const dialogRef = ref<boolean>(false);
const boardRef = ref<string>("");

const announcementUrl = import.meta.env.VITE_BASE_HTTP_URL + "/config/myconfig.json";
const currentVersion = myStore.announce.version;

onMounted(async () => {
  const response = await axios.get(announcementUrl);
  console.log(response);
  const currentVersion = myStore.announce.version;
  const announcement = response.data;
  myStore.announce = announcement;
  if (_.isEqual(announcement.version, currentVersion)) {
    // 是否要弹出赞赏
    const now = new Date().getTime();
    if (now - myStore.lastForceShow < 3 * 24 * 60 * 60 * 1000) {
      return;
    }
    myStore.rewardTipDialog = true;
    myStore.lastForceShow = now;
    return;
  }

  // 拉取公告
  const boardResponse = await axios.get(import.meta.env.VITE_BASE_HTTP_URL + announcement.board);
  const boardMd = boardResponse.data;
  boardRef.value = boardMd;
  dialogRef.value = true;
});

setInterval(() => checkUpdate(), 3 * 1000);

const checkUpdate = () => {
  if (_.isEmpty(currentVersion)) {
    return;
  }
  if (currentVersion === myStore.announce.version) {
    return;
  }
  snackbarStore.showWarningMessage(`当前版本 ${currentVersion} 低于最新版本 ${myStore.announce.version}，请关闭浏览器并重启。本站使用了 Service Worker 浏览器本地缓存技术来降低网络流量，需要重启浏览器来加载最新的页面。`);
};


</script>
<template>
  <v-dialog transition="dialog-top-transition" max-width="700px" v-model="dialogRef">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-trumpet">
        <template v-slot:title>
          {{ myStore.announce.name }}
        </template>
        <v-card-text>
          <md-preview v-model="boardRef" editor-id="preview-only"/>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
