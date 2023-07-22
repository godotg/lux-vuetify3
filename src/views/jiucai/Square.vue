<script setup lang="ts">
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useChatStore } from "@/views/app/chat/chatStore";
import AnimationAi from "@/animation/AnimationBot1.vue";
import { Icon } from "@iconify/vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { createCompletionApi } from "@/api/aiApi";
const snackbarStore = useSnackbarStore();
const chatStore = useChatStore();
const route = useRoute();

import AnimationSquare from "@/animation/AnimationSquare.vue";
import GroupChatRequest from "@/protocol/chat/GroupChatRequest";
import GroupHistoryMessageRequest from "@/protocol/chat/GroupHistoryMessageRequest";
import GroupHistoryMessageResponse from "@/protocol/chat/GroupHistoryMessageResponse";
import {registerPacketReceiver,isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import GroupChatNotice from "@/protocol/chat/GroupChatNotice";
import ChatMessage from "@/protocol/chat/ChatMessage";
import {useNewsStore, avatarAutoUrl} from "@/stores/newsStore";
import {parseTime} from "@/utils/timeUtils";
import {useDisplay} from "vuetify";
import _ from "lodash";

const {mobile} = useDisplay();
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

// Send Messsage
const sendMessage = async () => {
  // Clear the input

  if (userMessage.value) {

    // 自己的韭菜广场的发送
    const request = new GroupChatRequest();
    request.message = userMessage.value;
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
  if (_.isEqual(route.path,"/square")) {
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

async function moreHistory() {
  const firstMessage = _.first(messages.value);
  const firstMessageId = _.isNil(firstMessage) ? 0 : firstMessage.id;
  const request = new GroupHistoryMessageRequest();
  request.lastMessageId = firstMessageId;
  const response: GroupHistoryMessageResponse = await asyncAsk(request);
  const chatMessages = response.messages;
  if (_.isEmpty(chatMessages)) {
    return;
  }
  messages.value = _.concat(chatMessages.map(it => toMessage(it)), messages.value);
  snackbarStore.showSuccessMessage("加载成功");
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
  <div class="chat-bot">
    <div class="messsage-area">
      <perfect-scrollbar v-if="messages.length > 0" class="message-container">

<!--        自己的加载历史聊天记录的逻辑-->
        <v-container @click="moreHistory()">
          <v-row>
            <v-col v-ripple>
              <div class="no-message-container">
                <h1 class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold">
                  One more thing
                </h1>
                <AnimationSquare :size="300"/>
              </div>
            </v-col>
          </v-row>
        </v-container>


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
      </perfect-scrollbar>
      <div class="no-message-container" v-else>
        <h1 class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold">
          Loading...
        </h1>
        <AnimationSquare :size="300"/>
      </div>
    </div>
    <div class="input-area">
      <v-sheet color="transparent" elevation="0" class="input-panel d-flex align-end pa-1">
        <v-textarea
          color="primary"
          type="text"
          variant="solo"
          ref="input"
          v-model="userMessage"
          placeholder="Send Message"
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
                >mdi-send</v-icon
              >
            </v-fade-transition>
          </template>
        </v-textarea>
      </v-sheet>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-bot {
  background-image: url("@/assets/images/chat-bg-2.png");
  background-repeat: repeat;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .messsage-area {
    flex: 1;
    height: 100%;
  }

  .input-area {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 1rem;
    align-items: center;

    .input-panel {
      border-radius: 5px;
      max-width: 1200px;
      margin: 0 auto;
    }
  }
}

.user-message {
  display: flex;
  align-content: center;
  justify-content: end;
  flex-direction: row-reverse;
}

.assistant-message {
  display: flex;
  align-content: center;
  justify-content: start;
  flex-direction: row;
}

.message {
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
}

.message-container {
  height: calc(100vh - 154px);
  background-image: url("@/assets/images/chat-bg-2.png");
  background-repeat: repeat;
}

.no-message-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 2rem;
    font-weight: 500;
  }
}

:deep(.md-editor-preview-wrapper) {
  padding: 5px 15px;
}

.font-1 {
  font-size: 13px !important;
}

@media screen and (max-width: 768px) {

  :deep(#md-editor-v3-preview),
  .user-message {
    font-size: 14px !important;
  }
}
</style>
