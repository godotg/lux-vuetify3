<script setup lang="ts">
import 'md-editor-v3/lib/preview.css';
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
const {mobile, width, height} = useDisplay();
const myStore = useMyStore();

</script>
<template>
  <!--  下面是赞赏dialog  -->
  <v-dialog transition="dialog-top-transition" max-width="500px" v-model="myStore.browserNotifyDialog">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-google-chrome">
        <template v-slot:title>
          提示：打开通知权限，及时收到消息提醒
        </template>
        <v-card-text>
          <v-img src="aa/image/browser-notify.png"/>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
