<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useChatStore} from "@/views/app/chat/chatStore";
import AnimationAi from "@/animation/AnimationAI1.vue";
import {Icon} from "@iconify/vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {createCompletionApi} from "@/api/aiApi";

const snackbarStore = useSnackbarStore();
const chatStore = useChatStore();
const route = useRoute();

import AnimationMidjourney from "@/animation/AnimationMidjourney.vue";
import MidImagineRequest from "@/protocol/midjourney/MidImagineRequest";
import GroupHistoryMessageRequest from "@/protocol/chat/GroupHistoryMessageRequest";
import GroupHistoryMessageResponse from "@/protocol/chat/GroupHistoryMessageResponse";
import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import GroupChatNotice from "@/protocol/chat/GroupChatNotice";
import ChatMessage from "@/protocol/chat/ChatMessage";
import {useNewsStore, avatarAutoUrl} from "@/stores/newsStore";
import {parseTime} from "@/utils/timeUtils";
import {useDisplay} from "vuetify";
import _ from "lodash";

const {mobile, width, height} = useDisplay();
const newsStore = useNewsStore();
onMounted(() => {
  registerPacketReceiver(GroupChatNotice.PROTOCOL_ID, groupChatNoticeCompletion);
  initHistory();
});


interface Message {
  id: number;
  type: number;
  sendId: number;
  region: string;
  message: string;
  timestamp: number;

  avatar: string;
  content: string;
}

// Message List
const messages = ref<Message[]>([]);

// User Input Message
const userMessage = ref("");

const isLoading = ref(false);

const onlineUsersRef = ref(0);

function seed(): string{
  const a = _.random(10_0000_0000, 19_0000_0000);
  const b = _.random(1_0000_0000, 1_9000_0000);
  const seed = _.toString(a) + _.toString(b);
  return seed;
}

// Send Messsage
const sendMessage = async () => {
  // Clear the input

  if (userMessage.value) {

    // 自己的韭菜广场的发送
    const request = new MidImagineRequest();
    request.prompt = userMessage.value;
    request.nonce = seed();
    isLoading.value = true;
    send(request);
    userMessage.value = "";
  }
};

// 下面的逻辑都是自己的
const groupChatNoticeCompletion = (packet: GroupChatNotice) => {
  isLoading.value = false;
  updateMessage(packet.messages);
  scrollToBottom();
  if (_.isEqual(route.path, "/square")) {
    refreshMessageNotification();
    return;
  }
};

function refreshMessageNotification() {
  newsStore.chatMessageId = _.maxBy(messages.value, it => it.id).id;
  newsStore.chatMessageIdDiff = 0;
}

function toMessage(chatMessage: ChatMessage): Message {
  return {
    id: chatMessage.id,
    type: chatMessage.type,
    sendId: chatMessage.sendId,
    region: chatMessage.region,
    message: chatMessage.message,
    timestamp: chatMessage.timestamp,
    avatar: avatarAutoUrl(chatMessage.sendId),
    content: chatMessage.message,
  };
}

const updateMessage = (chatMessages: Array<ChatMessage>) => {
  if (_.isEmpty(chatMessages)) {
    return;
  }
  for (const chatMessage of chatMessages) {
    if (_.findIndex(messages.value, it => it.id == chatMessage.id) >= 0) {
      continue;
    }
    messages.value.push(toMessage(chatMessage));
  }
}

async function initHistory() {
  setTimeout(() => doInitHistory(), 1000);
}

async function doInitHistory() {
  if (!isWebsocketReady()) {
    initHistory();
    return;
  }
  const firstMessage = _.first(messages.value);
  const firstMessageId = _.isNil(firstMessage) ? 0 : firstMessage.id;
  const request = new GroupHistoryMessageRequest();
  request.lastMessageId = firstMessageId;
  const response: GroupHistoryMessageResponse = await asyncAsk(request);
  updateMessage(response.messages);
  refreshMessageNotification();
  scrollToBottom();
  onlineUsersRef.value = response.onlineUsers;
  setTimeout(() => scrollToBottom(), 300);
  snackbarStore.showSuccessMessage("聊天记录加载成功");
}

// Scroll to the bottom of the message container
const scrollToBottom = () => {
  const container = document.querySelector(".message-container");
  console.log("container: ", container);

  setTimeout(() => {
    container?.scrollTo({
      top: container?.scrollHeight,
    });
  }, 100);
};

const handleKeydown = (e) => {
  if (e.key === "Enter" && (e.altKey || e.shiftKey)) {
    // 当同时按下 alt或者shift 和 enter 时，插入一个换行符
    e.preventDefault();
    userMessage.value += "\n";
  } else if (e.key === "Enter") {
    // 当只按下 enter 时，发送消息
    e.preventDefault();
    sendMessage();
  }
};
</script>

<template>
  <v-container v-if="messages.length <= 0">
    <v-row>
      <v-col cols="6">
        <AnimationMidjourney :size="height * 0.8"/>
      </v-col>
      <v-col cols="6">
        <AnimationMidjourney :size="height * 0.8" :delay="3000"/>
      </v-col>
    </v-row>
  </v-container>
  <div v-else>
    <template v-for="message in messages">
      <div v-if="message.role === 'user'">
        <div class="pa-4 user-message">
          <v-avatar class="ml-4" rounded="sm" variant="elevated">
            <img :src="message.avatar" alt="alt"/>
          </v-avatar>
          <v-card class="gradient gray" theme="dark">
            <v-card-text>
              <b> {{ message.content }}</b></v-card-text
            >
          </v-card>
        </div>
      </div>
      <div v-else>
        <div class="pa-2 pa-md-5 assistant-message">
          <v-avatar
            class="mr-2 mr-md-4"
            rounded="sm"
            variant="elevated"
          >
            <img
              :src="message.avatar"
              alt="alt"
            />
          </v-avatar>
          <v-card>
            <div>
              <md-editor
                v-model="message.content"
                class="font-1"
                previewOnly
              />
            </div>
          </v-card>
        </div>
        <v-card-subtitle class="ma-0 pa-0 text-center" style="font-size: 1px;color: black">
          {{ parseTime(message.timestamp) }} {{ message.region }}
        </v-card-subtitle>
      </div>
    </template>
    <v-card-subtitle class="ma-0 pa-0 text-center" style="font-size: 1px;color: black">
      online user {{ onlineUsersRef }}
    </v-card-subtitle>
    <div v-if="isLoading">
      <div class="pa-6">
        <div class="message">
          <AnimationAi :size="100"/>
        </div>
      </div>
    </div>
    <div class="no-message-container" v-else>
      <h1 class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold">
        Loading...
      </h1>
      <AnimationMidjourney :size="300"/>
    </div>
  </div>
  <v-footer color="transparent" app>
    <v-textarea
      color="primary"
      type="text"
      variant="solo"
      ref="input"
      v-model="userMessage"
      placeholder="prompt"
      hide-details
      @keydown="handleKeydown"
      rows="1"
      max-rows="9"
      auto-grow
    >
      <template #prepend-inner>
        <v-icon color="primary">mdi-microphone</v-icon>
      </template>
      <template v-slot:append-inner>
        <v-fade-transition leave-absolute>
          <Icon
            v-if="isLoading"
            class="text-primary"
            width="30"
            icon="eos-icons:three-dots-loading"
          />
          <v-icon color="primary" v-else @click="sendMessage"
          >mdi-send
          </v-icon
          >
        </v-fade-transition>
      </template>
    </v-textarea>
  </v-footer>
</template>
