<script setup lang="ts">
import 'md-editor-v3/lib/preview.css';
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useCustomizeThemeStore} from "@/stores/customizeTheme";
import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import AdminInfoRequest from "@/protocol/admin/AdminInfoRequest";
import AdminInfoResponse from "@/protocol/admin/AdminInfoResponse";
import Broadcast from "@/protocol/admin/Broadcast";
import DoBroadcastRequest from "@/protocol/admin/DoBroadcastRequest";
import DoBroadcastResponse from "@/protocol/admin/DoBroadcastResponse";
import DeleteBroadcastRequest from "@/protocol/admin/DeleteBroadcastRequest";
import DeleteBroadcastResponse from "@/protocol/admin/DeleteBroadcastResponse";


const {mobile, width, height} = useDisplay();
const myStore = useMyStore();
const customizeTheme = useCustomizeThemeStore();
const snackbarStore = useSnackbarStore();
import _ from "lodash";

const broadcastsRef = ref<Broadcast[]>([]);

watch(
  () => myStore.adminDialog,
  async (val) => {
    if (val) {
      const answer: AdminInfoResponse = await asyncAsk(new AdminInfoRequest());
      broadcastsRef.value = answer.broadcasts;
    }
  },
  {
    deep: true,
  }
);

async function doBroadcast(id: number) {
  const request = new DoBroadcastRequest();
  request.id = id;
  const answer: DoBroadcastResponse = await asyncAsk(request);
  snackbarStore.showSuccessMessage("开始广播消息，请查收信息");
}

async function deleteBroadcast(id: number) {
  const request = new DeleteBroadcastRequest();
  request.id = id;
  const answer: DeleteBroadcastResponse = await asyncAsk(request);
  broadcastsRef.value = answer.broadcasts;
  snackbarStore.showSuccessMessage("删除了无用的广播");
}


</script>
<template>
  <v-dialog transition="dialog-top-transition" max-width="600px" v-model="myStore.adminDialog">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-skull-crossbones-outline">
        <template v-slot:title>
          后台管理
        </template>

        <v-card-text>
          <v-list density="compact">
            <v-list-subheader>广播消息</v-list-subheader>
            <v-list-item v-for="broadcast in broadcastsRef" :key="broadcast.id">
              <template v-slot:prepend>
                <v-icon v-ripple icon="mdi-bullhorn-variant-outline" @click="doBroadcast(broadcast.id)"></v-icon>
              </template>
              <v-list-item-title v-text="broadcast.content"></v-list-item-title>
              <template v-slot:append>
                <v-icon v-ripple icon="mdi-delete-alert-outline" @click="deleteBroadcast(broadcast.id)"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
