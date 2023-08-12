<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useChatStore} from "@/views/app/chat/chatStore";
import AnimationAi from "@/animation/AnimationBot1.vue";
import {Icon} from "@iconify/vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {createCompletionApi} from "@/api/aiApi";

const snackbarStore = useSnackbarStore();
const chatStore = useChatStore();
const route = useRoute();

import AnimationSquare1 from "@/animation/AnimationSquare1.vue";
import AnimationSquare2 from "@/animation/AnimationSquare2.vue";
import GroupChatRequest from "@/protocol/chat/GroupChatRequest";
import GroupHistoryMessageRequest from "@/protocol/chat/GroupHistoryMessageRequest";
import GroupHistoryMessageResponse from "@/protocol/chat/GroupHistoryMessageResponse";
import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import GroupChatNotice from "@/protocol/chat/GroupChatNotice";
import ChatMessage from "@/protocol/chat/ChatMessage";
import {useNewsStore, avatarAutoUrl} from "@/stores/newsStore";
import {parseTime} from "@/utils/timeUtils";
import {useDisplay} from "vuetify";
import _ from "lodash";
import {isBlank} from "@/utils/stringUtils";

const {mobile, height, width} = useDisplay();
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
  if (isBlank(userMessage.value)) {
    snackbarStore.showErrorMessage("prompt不能为空");
    return
  }

  // 自己的韭菜广场的发送
  isLoading.value = true;

  const request = new GroupChatRequest();
  request.message = userMessage.value;
  send(request);

  userMessage.value = "";
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
  setTimeout(() => {
    window.scrollTo({top: 999999, behavior: "smooth"});
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
    <v-progress-linear indeterminate color="primary"></v-progress-linear>
    <v-row justify="center" align="center">
      <v-col cols="11">
        <AnimationSquare1 :size="mobile ? width * 0.8 : height * 0.6"/>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col v-ripple @click="moreHistory()">
        <div>
          <div class="text-h4 text-md-h4 text-center text-blue-lighten-1 font-weight-bold">
            One more thing
          </div>
          <AnimationSquare2 :size="200"/>
        </div>
      </v-col>
    </v-row>

    <template v-for="message in messages">
      <v-row>
        <v-avatar class="mt-3 mb-1 ml-3" rounded="sm" variant="elevated">
          <img :src="message.avatar" alt="alt"/>
        </v-avatar>
        <v-card class="mt-3 ml-3">
          <md-editor v-model="message.content" previewOnly/>
        </v-card>
      </v-row>
      <v-row justify="center">
        <v-col class="ma-0 pa-0">
          <div class="ma-0 pa-0 text-center text-caption font-weight-thin">
            {{ parseTime(message.timestamp) }} {{ message.region }}
          </div>
        </v-col>
      </v-row>
    </template>
  </v-container>


  <v-footer color="transparent" app>
    <template v-if="mobile">
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
            >mdi-send
            </v-icon
            >
          </v-fade-transition>
        </template>
      </v-textarea>
    </template>
    <v-container v-else>
      <v-row>
        <v-col cols="8" offset="2">
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
                <v-icon color="primary" v-else @click="sendMessage">mdi-send</v-icon>
              </v-fade-transition>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
