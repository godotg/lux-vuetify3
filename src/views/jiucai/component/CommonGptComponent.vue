<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import AnimationAI1 from "@/animation/AnimationAI1.vue";
import AnimationAI2 from "@/animation/AnimationAI2.vue";
import AnimationAI4 from "@/animation/AnimationAI4.vue";
import AnimationBot1 from "@/animation/AnimationBot1.vue";
import {isBlank} from "@/utils/stringUtils";
import {Icon} from "@iconify/vue";
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {useChatGPTStore} from "@/stores/chatGPTStore";
import ApiKeyDialog from "@/components/ApiKeyDialog.vue";

const snackbarStore = useSnackbarStore();
const chatGPTStore = useChatGPTStore();


import {sendChatgpt, forceStopChatgpt} from "@/utils/chatgptUtils";
import {registerPacketReceiver} from "@/utils/websocket";
import ChatgptMessageNotice from "@/protocol/chatgpt/ChatgptMessageNotice";
import LlamaMessageNotice from "@/protocol/llama/LlamaMessageNotice";
import {useNewsStore} from "@/stores/newsStore";
import {useDisplay} from "vuetify";
import _ from "lodash";
import AnimationMidjourney from "@/animation/AnimationMidjourney.vue";
import {useMyStore} from "@/stores/myStore";


const myStore = useMyStore();
const {mobile} = useDisplay();
const newsStore = useNewsStore();


const props = defineProps({
  // 1表示chatgpt，2表示讯飞星火，4表示Chatgpt4
  ai: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 300,
  },
});

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
let scrollTime = new Date().getTime();
const scrollToBottomDelay = () => {
  const currentTime = new Date().getTime();
  if (currentTime - scrollTime < 10000) {
    return;
  }
  scrollTime = currentTime;
  scrollToBottomNow();
};
const scrollToBottomNow = () => {
  setTimeout(() => {
    window.scrollTo({top: 999999, behavior: "smooth"});
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

// Message List
const messages = ref<Message[]>([]);

const requestMessages = computed(() => {
  let myMessages = new Array<Message>();
  for (const message of messages.value) {
    if (message.role === "system") {
      continue;
    }
    myMessages.push(message);
  }
  // 取最后10个
  if (messages.value.length >= 10) {
    myMessages = myMessages.slice(-10);
  }
  if (!_.isEmpty(chatGPTStore.propmpt)) {
    const lastMessage = _.last(myMessages);
    if (!_.isNil(lastMessage)) {
      lastMessage.content = chatGPTStore.propmpt + ". " + lastMessage.content;
    }
  }
  return myMessages;
});

const isLoading = ref(false);

// Send Messsage
const sendMessage = async () => {
  if (isBlank(userMessage.value)) {
    snackbarStore.showErrorMessage("prompt不能为空");
    return
  }
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
  sendChatgpt(requestMessages.value, props.ai);
  myStore.account.cost += 1;
  scrollToBottomNow();
};

const createCompletion = (packet: ChatgptMessageNotice) => {
  // Check if the API key is set
  const requestId = packet.requestId;
  const choice = packet.choice;
  const finishReason = packet.finishReason;
  try {
    isLoading.value = false;
    if (finishReason != 0) {
      isGenerating.value = false;
      scrollToBottomNow();
    }

    // Add the bot message
    let message = _.find(messages.value, it => it.requestId == requestId);

    if (_.isNil(message)) {
      const role = requestId < 100000 ? "assistant" : "system";
      message = {
        requestId: requestId,
        rawContent: choice,
        content: choice,
        role: role,
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
      scrollToBottomDelay();
    }
  } catch (error) {
    isLoading.value = false;
    snackbarStore.showErrorMessage(error.message);
  }
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
    <v-row justify="center" align="center">
      <v-col cols="12">
        <AnimationAI1 v-if="props.ai == 1" :size="props.size"/>
        <AnimationAI2 v-else-if="props.ai == 2" :size="props.size"/>
        <AnimationAI4 v-else-if="props.ai == 4" :size="props.size"/>
      </v-col>
    </v-row>
<!--    <vue-qrcode value="weixin://wxpay/bizpayurl?pr=WtgZu2gzz" :options="{ width: 200 }"></vue-qrcode>-->
  </v-container>
  <v-container v-else>
    <template v-for="message in messages">
      <v-row>
        <v-avatar class="mt-3 ml-3 mb-1" rounded="sm" variant="elevated">
          <img v-if="message.role === 'user'" :src="newsStore.myAvatar()" alt="alt"/>
          <img v-else-if="message.role === 'assistant'" :src="newsStore.aiAvatar()" alt="alt"/>
          <img v-else :src="newsStore.aiAvatar2()" alt="alt"/>
        </v-avatar>
        <v-card class="mt-3 mx-3">
          <md-preview v-if="message.role === 'user'" v-model="message.content" editor-id="preview-only"/>
          <md-preview v-else-if="message.role === 'assistant'" v-model="message.content" editor-id="preview-only" theme="dark"/>
          <md-preview v-else v-model="message.content" editor-id="preview-only" theme="dark" preview-theme="mk-cute" showCodeRowNumber/>
        </v-card>
      </v-row>
    </template>
    <v-row v-if="isLoading">
      <v-col>
        <AnimationBot1 :size="100"/>
      </v-col>
    </v-row>
  </v-container>

  <v-footer color="transparent" app>
    <template v-if="mobile">
      <v-textarea
        color="primary"
        type="text"
        variant="solo"
        ref="input"
        v-model="userMessage"
        placeholder="Ask Anything"
        hide-details
        @keydown="handleKeydown"
        rows="1"
        max-rows="9"
        :autofocus="!mobile"
        auto-grow
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
            <v-icon color="primary" v-else @click="sendMessage">mdi-send</v-icon>
          </v-fade-transition>
        </template>
      </v-textarea>
    </template>
    <v-container v-else>
      <v-row>
        <v-col cols="8" offset="2">
          <v-btn v-if="!mobile && ai == 1" size="x-small" class="mb-3 mr-1" variant="elevated" icon
                 @click="chatGPTStore.configDialog = true">
            <v-icon size="30" class="text-primary">mdi-cog-outline</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
              text="ChatGPT Config"
            ></v-tooltip>
          </v-btn>
          <v-textarea
            color="primary"
            type="text"
            variant="solo"
            ref="input"
            v-model="userMessage"
            placeholder="Ask Anything"
            hide-details
            @keydown="handleKeydown"
            rows="1"
            max-rows="9"
            :autofocus="!mobile"
            auto-grow
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
                <v-icon color="primary" v-else @click="sendMessage">mdi-send</v-icon>
              </v-fade-transition>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-container>
    <ApiKeyDialog/>
  </v-footer>
</template>
