<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { useSnackbarStore } from "@/stores/snackbarStore";
import AnimationChat from "@/animation/AnimationChat1.vue";
import AnimationAi from "@/animation/AnimationBot1.vue";
import { read, countAndCompleteCodeBlocks } from "@/utils/aiUtils";
import { scrollToBottom } from "@/utils/common";
import { Icon } from "@iconify/vue";
import MdEditor from "md-editor-v3";
import { useChatGPTStore } from "@/stores/chatGPTStore";
import "md-editor-v3/lib/style.css";
import ApiKeyDialog from "@/components/ApiKeyDialog.vue";
const snackbarStore = useSnackbarStore();
const chatGPTStore = useChatGPTStore();




import {sendChatgpt, forceStopChatgpt} from "@/utils/chatgptUtils";
import {registerPacketReceiver} from "@/utils/websocket";
import ChatgptMessageNotice from "@/protocol/chatgpt/ChatgptMessageNotice";
import {useNewsStore} from "@/stores/newsStore";
import {useDisplay} from "vuetify";
import _ from "lodash";
const {mobile} = useDisplay();
const newsStore = useNewsStore();
onMounted(() => {
  registerPacketReceiver(ChatgptMessageNotice.PROTOCOL_ID, createCompletion);
});
const forceStop = async () => {
  forceStopChatgpt();
}
const clearChatHistory = async () => {
  userMessage.value = "";
  messages.value = [];
  isLoading.value = false;
}
const isGenerating = ref(false);

// Scroll to the bottom of the message container
const scrollToBottomDelay = () => {
  setTimeout(() => {
    scrollToBottom(document.querySelector(".message-container"));
  }, 100);
};


interface Message {
  requestId: number;
  rawContent: string;
  content: string;
  role: "user" | "assistant" | "system";
}
// User Input Message
const userMessage = ref("");

// Prompt Message
const promptMessage = computed(() => {
  console.log("chatGPTStore.propmpt", chatGPTStore.propmpt);

  return [
    {
      content: chatGPTStore.propmpt,
      role: "system",
    },
  ];
});

// Message List
const messages = ref<Message[]>([]);

const requestMessages = computed(() => {
  if (messages.value.length <= 10) {
    return [...promptMessage.value, ...messages.value];
  } else {
    // 截取最新的10条信息
    const slicedMessages = messages.value.slice(-10);
    return [...promptMessage.value, ...slicedMessages];
  }
});

const isLoading = ref(false);

// Send Messsage
const sendMessage = async () => {
  if (userMessage.value) {
    // Add the message to the list
    messages.value.push({
      requestId: 0,
      rawContent: "",
      content: userMessage.value,
      role: "user",
    });

    // Clear the input
    userMessage.value = "";

    isLoading.value = true;
    isGenerating.value = true;
    // Create a completion
    sendChatgpt(requestMessages.value);
  }
};

const createCompletion = (packet: ChatgptMessageNotice) => {
  // Check if the API key is set

  try {
    isLoading.value = false;
    if (packet.finishReason != 0) {
      isGenerating.value = false;
    }

    // Add the bot message
    let message = _.find(messages.value, it => it.requestId == packet.requestId);
    const choice = packet.choice;

    if (_.isNil(message)) {
      message = {
        requestId: packet.requestId,
        rawContent: choice,
        content: choice,
        role: "assistant",
      };
      messages.value.push(message);
    } else {
      // 记录一个原始的字符串返回，判断这个原始的字符串包含多少个  ``` 符号md的符号，奇数手动补齐md文档的格式就行了
      message.rawContent = message.rawContent + choice;
      const mdEnd = "\n```\n";
      const count = message.rawContent.split("```").length - 1;
      if (count % 2 == 0) {
        message.content = message.rawContent;
      } else {
        message.content = message.rawContent + mdEnd;
      }
    }
  } catch (error) {
    isLoading.value = false;
    snackbarStore.showErrorMessage(error.message);
  }
};

watch(
  () => messages.value,
  (val) => {
    if (val) {
      scrollToBottomDelay();
    }
  },
  {
    deep: true,
  }
);

const displayMessages = computed(() => {
  const messagesCopy = messages.value.slice(); // 创建原始数组的副本
  const lastMessage = messagesCopy[messagesCopy.length - 1];
  const updatedLastMessage = {
    ...lastMessage,
    content: countAndCompleteCodeBlocks(lastMessage.content),
  };
  messagesCopy[messagesCopy.length - 1] = updatedLastMessage;
  return messagesCopy;
});

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
        <template v-for="message in messages">
          <div v-if="message.role === 'user'">
            <div class="pa-4 user-message">
              <v-avatar class="ml-4" rounded="sm" variant="elevated">
                <img :src="newsStore.myAvatar()" alt="alt" />
              </v-avatar>
              <v-card class="gradient gray text-pre-wrap" theme="dark">
                <v-card-text>
                  <b> {{ message.content }}</b></v-card-text>
              </v-card>
            </div>
          </div>
          <div v-else>
            <div v-if="mobile">
              <div class="pa-2 pa-md-5 assistant-message">
                <v-avatar class="mr-2 mr-md-4" rounded="sm" variant="elevated">
                  <img :src="newsStore.aiAvatar()" alt="alt"/>
                </v-avatar>
              </div>
              <div class="pa-2 pa-md-5 assistant-message">
                <v-card>
                  <div>
                    <md-editor v-model="message.content" class="font-1" previewOnly/>
                  </div>
                </v-card>
              </div>
            </div>
            <div v-else class="pa-2 pa-md-5 assistant-message">
              <v-avatar
                class="d-none d-md-block mr-2 mr-md-4"
                rounded="sm"
                variant="elevated"
              >
                <img
                  :src="newsStore.aiAvatar()"
                  alt="alt"
                />
              </v-avatar>
              <v-card>
                <div>
                  <md-editor v-model="message.content" class="font-1" previewOnly />
                </div>
              </v-card>
            </div>
          </div>
        </template>
        <div v-if="isLoading">
          <div class="pa-6">
            <div class="message">
              <AnimationAi :size="100" />
            </div>
          </div>
        </div>
      </perfect-scrollbar>
      <div class="no-message-container" v-else>
        <h1 class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold">
          Chat With Me
        </h1>
        <AnimationChat :size="300" />
      </div>
    </div>
    <div class="input-area">
      <v-sheet color="transparent" elevation="0" class="input-panel d-flex align-end pa-1">
        <v-btn size="x-small" class="mb-3" variant="elevated" icon @click="chatGPTStore.configDialog = true">
          <v-icon size="30" class="text-primary">mdi-cog-outline</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
            text="ChatGPT Config"
          ></v-tooltip>
        </v-btn>

        <v-textarea
          class="ml-1"
          color="primary"
          type="text"
          clearable
          variant="solo"
          ref="input"
          v-model="userMessage"
          placeholder="SendMessage"
          hide-details
          @keydown="handleKeydown"
          rows="1"
          max-rows="21"
          auto-grow
          no-resize
        >
          <template v-slot:prepend-inner>
            <v-icon v-if="isGenerating" v-ripple color="error" @click="forceStop">mdi-stop-circle-outline</v-icon>
            <v-icon v-else v-ripple color="primary" @click="clearChatHistory">mdi-broom</v-icon>
          </template>
          <template v-slot:append-inner>
            <v-fade-transition leave-absolute>
              <Icon
                v-if="isGenerating"
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
      <ApiKeyDialog />
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
