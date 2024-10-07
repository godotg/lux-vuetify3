<script setup lang="ts">
import 'md-editor-v3/lib/preview.css';
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useCustomizeThemeStore} from "@/stores/customizeTheme";
import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";

const {mobile, width, height} = useDisplay();
const myStore = useMyStore();
const customizeTheme = useCustomizeThemeStore();
const snackbarStore = useSnackbarStore();



</script>
<template>
  <v-dialog transition="dialog-top-transition" max-width="500px" v-model="myStore.profileDialog">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-shield-account-outline">
        <template v-slot:title>
          我的主页
        </template>
        <v-card-text>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
