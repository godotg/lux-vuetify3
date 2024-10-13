<script setup lang="ts">
import 'md-editor-v3/lib/preview.css';
import {getFormatDate} from "@/utils/timeUtils";
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useCustomizeThemeStore} from "@/stores/customizeTheme";
import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import AdminInfoRequest from "@/protocol/admin/AdminInfoRequest";
import AdminInfoResponse from "@/protocol/admin/AdminInfoResponse";
import Broadcast from "@/protocol/admin/Broadcast";
import SystemStatics from "@/protocol/admin/SystemStatics";
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
const staticsRef = ref<SystemStatics[]>([]);

watch(
  () => myStore.adminDialog,
  async (val) => {
    if (val) {
      const response: AdminInfoResponse = await asyncAsk(new AdminInfoRequest());
      broadcastsRef.value = response.broadcasts;
      staticsRef.value = response.statics;
    }
  },
  {
    deep: true,
  }
);

async function doBroadcast(id: number, type: string) {
  const request = new DoBroadcastRequest();
  request.id = id;
  request.type = type;
  const answer: DoBroadcastResponse = await asyncAsk(request);
  broadcastsRef.value = answer.broadcasts;
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
  <v-dialog transition="dialog-top-transition" max-width="80%" v-model="myStore.adminDialog">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-skull-crossbones-outline">
        <template v-slot:title>
          后台管理
        </template>

        <v-card-text>
          <v-list density="compact">
            <v-list-subheader>广播消息</v-list-subheader>
            <template v-for="broadcast in broadcastsRef" :key="broadcast.id">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-bullhorn-variant-outline"></v-icon>
                </template>
                <v-list-item-title>
                  {{ broadcast.content }}
                </v-list-item-title>
                <v-list-item-subtitle>微信->{{ broadcast.weChatResult }}</v-list-item-subtitle>
                <v-list-item-subtitle>短信->{{ broadcast.smsResult }}</v-list-item-subtitle>
                <v-list-item-action>
                  <v-btn icon="mdi-delete-alert-outline" size="x-small" class="mx-1" color="error" @click="deleteBroadcast(broadcast.id)" />
                  <v-btn icon="mdi-wechat" color="primary" size="x-small" class="mx-1" @click="doBroadcast(broadcast.id, 'wechat')" />
                  <v-btn icon="mdi-cellphone-nfc" color="primary" size="x-small" class="mx-1" @click="doBroadcast(broadcast.id, 'sms')" />
                </v-list-item-action>
              </v-list-item>
              <hr>
            </template>
          </v-list>
        </v-card-text>

        <v-card-text>
          <v-table>
            <thead>
            <tr>
              <th>
                时间
              </th>
              <th>
                ips
              </th>
              <th>
                tcp active
              </th>
              <th>
                v2ray
              </th>
              <th>
                chatgpt
              </th>
              <th>
                midjourney
              </th>
              <th>
                stable diffusion
              </th>
              <th>
                新闻总数
              </th>
              <th>
                S级
              </th>
              <th>
                A级
              </th>
              <th>
                B级
              </th>
              <th>
                C级
              </th>
              <th>
                D级
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="statics in staticsRef" :key="statics.id">
              <td>{{ getFormatDate(statics.time) }}</td>
              <td>{{ statics.ips }}</td>
              <td>{{ statics.active }}</td>
              <td>{{ statics.v2raySwitch }}</td>
              <td>{{ statics.chatgptRequest }}</td>
              <td>{{ statics.midImagineRequest }}</td>
              <td>{{ statics.sdSimulateRequest }}</td>
              <td>{{ statics.newsStatics.newsS + statics.newsStatics.newsA + statics.newsStatics.newsB + statics.newsStatics.newsC + statics.newsStatics.newsD }}</td>
              <td>{{ statics.newsStatics.newsS }}</td>
              <td>{{ statics.newsStatics.newsA }}</td>
              <td>{{ statics.newsStatics.newsB }}</td>
              <td>{{ statics.newsStatics.newsC }}</td>
              <td>{{ statics.newsStatics.newsD }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
