<script setup lang="ts">
import 'md-editor-v3/lib/preview.css';
import AnimationThanks1 from "@/animation/AnimationThanks1.vue";
import AnimationThanks from "@/animation/AnimationThanks.vue";
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useCustomizeThemeStore} from "@/stores/customizeTheme";
import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import LoginByWeChatRequest from "@/protocol/auth/LoginByWeChatRequest";
import LoginByWeChatResponse from "@/protocol/auth/LoginByWeChatResponse";
import UserProfileNotice from "@/protocol/user/UserProfileNotice";

const {mobile, width, height} = useDisplay();
const myStore = useMyStore();
const customizeTheme = useCustomizeThemeStore();
const snackbarStore = useSnackbarStore();

const authUrlRef = ref<string>("");

onMounted(() => {
  registerPacketReceiver(UserProfileNotice, atUserProfileNotice);
});

function atUserProfileNotice(packet: UserProfileNotice) {
  myStore.token = packet.token;
  myStore.user.id = packet.user.id;
  myStore.user.name = packet.user.name;
  myStore.user.ctime = packet.user.ctime;
  myStore.loginDialog = false;
}

watch(
  () => myStore.loginDialog,
  async (val) => {
    if (val) {
      if (!isWebsocketReady()) {
        snackbarStore.showWarningMessage("服务器尚未连接，请等待")
        return;
      }
      const response: LoginByWeChatResponse = await asyncAsk(new LoginByWeChatRequest());
      authUrlRef.value = response.authUrl;
      myStore.loginDialog = true;
    }
  },
  {
    deep: true,
  }
);


</script>
<template>
  <v-dialog transition="dialog-top-transition" max-width="500px" v-model="myStore.loginDialog">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-line-scan">
        <template v-slot:title>
          微信扫码登录
        </template>
        <v-card-text v-if="authUrlRef">
          <vue-qrcode :value="authUrlRef" :options="{ width: 450 }" tag="img"></vue-qrcode>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
