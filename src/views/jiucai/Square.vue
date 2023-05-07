<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useChatStore} from "@/views/app/chat/chatStore";
import AnimationSquare from "@/components/animations/AnimationSquare.vue";
import AnimationAi from "@/components/animations/AnimationBot1.vue";
import {Icon} from "@iconify/vue";
import MdEditor from "md-editor-v3";

const snackbarStore = useSnackbarStore();
const chatStore = useChatStore();


import GroupChatRequest from "@/protocol/chat/GroupChatRequest";
import GroupHistoryMessageRequest from "@/protocol/chat/GroupHistoryMessageRequest";
import GroupHistoryMessageResponse from "@/protocol/chat/GroupHistoryMessageResponse";
import {registerPacketReceiver, send, asyncAsk} from "@/utils/websocket";
import GroupChatNotice from "@/protocol/chat/GroupChatNotice";
import ChatMessage from "@/protocol/chat/ChatMessage";
import {useNewsStore, myAvatarId, aiAvatar} from "@/stores/newsStore";
import {useDisplay} from "vuetify";
import _ from "lodash";

const {mobile} = useDisplay();
const newsStore = useNewsStore();
onMounted(() => {
  registerPacketReceiver(GroupChatNotice.PROTOCOL_ID, groupChatNoticeCompletion);
  setTimeout(() => initHistory(), 2000);
});


interface Message {
  id: number;
  type: number;
  sendId: number;
  message: string;
  timestamp: number;

  prependAvatar: string;
  title: string;
  subtitle: string;
}

// Message List
const messages = ref<Message[]>([]);

// User Input Message
const userMessage = ref("");

const isLoading = ref(false);

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

const groupChatNoticeCompletion = (packet: GroupChatNotice) => {
  isLoading.value = false;
  updateMessage(packet.messages);
  scrollToBottom();
};

function toMessage(chatMessage: ChatMessage): Message {
  const avatarId = chatMessage.sendId % 100 + 1;
  const avatar = "src/assets/avatars/" + avatarId + ".jpg";
  return {
    id: chatMessage.id,
    type: chatMessage.type,
    sendId: chatMessage.sendId,
    message: chatMessage.message,
    timestamp: chatMessage.timestamp,
    prependAvatar: avatar,
    title: "",
    subtitle: chatMessage.message
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
  const firstMessage = _.first(messages.value);
  const firstMessageId = _.isEmpty(firstMessage) ? 0 : firstMessage.id;
  const request = new GroupHistoryMessageRequest();
  request.lastMessageId = firstMessageId;
  const response: GroupHistoryMessageResponse = await asyncAsk(request);
  updateMessage(response.messages);
  scrollToBottom();
}

async function moreHistory() {
  const firstMessage = _.first(messages.value);
  const firstMessageId = _.isEmpty(firstMessage) ? 0 : firstMessage.id;
  const request = new GroupHistoryMessageRequest();
  request.lastMessageId = firstMessageId;
  const response: GroupHistoryMessageResponse = await asyncAsk(request);
  const chatMessages = response.messages;
  if (_.isEmpty(chatMessages)) {
    return;
  }
  messages.value = _.concat(chatMessages.map(it => toMessage(it)), messages.value);
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

</script>

<template>
  <div class="chat-bot">
    <div class="messsage-area">
      <perfect-scrollbar class="message-container">
        <!--        只有这个container里面的内容是我自己写的-->
        <v-container>
          <v-container>
            <div class="no-message-container">
              <AnimationSquare :size="300"/>
              <v-btn
                class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold"
                height="100"
                size="x-large"
                @click="moreHistory()"
              >
                One More
              </v-btn>
            </div>
          </v-container>
          <v-list
            :items="messages"
            item-props
          >
            <template v-slot:subtitle="{ subtitle }">
              <div class="text-wrap">{{ subtitle }}</div>
            </template>
          </v-list>
        </v-container>
      </perfect-scrollbar>
    </div>
    <div class="input-area">
      <v-sheet elevation="0" class="input-panel">
        <v-text-field
          color="primary"
          type="text"
          clearable
          variant="solo"
          ref="input"
          v-model="userMessage"
          placeholder="SendMessage"
          hide-details
          @keyup.enter="sendMessage"
        >
          <template #prepend-inner>
            <v-icon>mdi-microphone</v-icon>
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
        </v-text-field>
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

  .messsage-area {
    flex: 1;
    height: 100%;
  }

  .input-area {
    padding: 1rem;
    height: 90px;

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
