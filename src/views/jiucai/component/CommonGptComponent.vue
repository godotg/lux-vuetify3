<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import AnimationAI1 from "@/animation/AnimationAI1.vue";
import AnimationAI2 from "@/animation/AnimationAI2.vue";
import AnimationAI4 from "@/animation/AnimationAI4.vue";
import AnimationAILlama from "@/animation/AnimationAILlama.vue";
import AnimationBot1 from "@/animation/AnimationBot1.vue";
import {isBlank} from "@/utils/stringUtils";
import {Icon} from "@iconify/vue";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import clipboard from "@/utils/clipboardUtils";
import {sendChatgpt, forceStopChatgpt} from "@/utils/chatgptUtils";
import {registerPacketReceiver} from "@/utils/websocket";
import ChatgptMessageNotice from "@/protocol/chatgpt/ChatgptMessageNotice";
import ChatgptMessage from "@/protocol/chatgpt/ChatgptMessage";
import {useNewsStore} from "@/stores/newsStore";
import {useDisplay} from "vuetify";
import {useMyStore} from "@/stores/myStore";
import _ from "lodash";


const myStore = useMyStore();
const {mobile} = useDisplay();
const newsStore = useNewsStore();
const snackbarStore = useSnackbarStore();

const props = defineProps({
  // 1表示chatgpt，4表示Chatgpt4，100表示讯飞星火，200表示百度，300表示llama
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
  registerPacketReceiver(ChatgptMessageNotice.PROTOCOL_ID, atChatgptMessageNotice);
});
const forceStop = async () => {
  forceStopChatgpt();
  isGenerating.value = false;
  isLoading.value = false;
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
  chatAI: number;
}

// User Input Message
const userMessage = ref("");
const userMessageLast = ref("");

// Message List
const messages = ref<Message[]>([]);

const requestMessages = computed(() => {
  let myMessages = new Array<ChatgptMessage>();

  // 寻找第一个user
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const message = messages.value[i];
    if (message.role === "user") {
      myMessages.push(messageToChatgptMessage(message));
      break;
    }
  }

  // 寻找第一个assistant，chatgpt优先
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const message = messages.value[i];
    if (message.role !== "assistant") {
      continue;
    }

    if (isChatgpt(message)) {
      myMessages.push(messageToChatgptMessage(message));
      break;
    }

    if (i - 2 >= 0) {
      const message1 = messages.value[i - 1];
      if (isChatgpt(message1)) {
        myMessages.push(messageToChatgptMessage(message1));
        break;
      }
      const message2 = messages.value[i - 2];
      if (isChatgpt(message2)) {
        myMessages.push(messageToChatgptMessage(message2));
        break;
      }
    }

    if (i - 1 >= 0) {
      const message1 = messages.value[i - 1];
      if (isChatgpt(message1)) {
        myMessages.push(messageToChatgptMessage(message1));
        break;
      }
    }

    myMessages.push(messageToChatgptMessage(message));
    break;
  }

  // 寻找第二个user
  let first = false;
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const message = messages.value[i];
    if (message.role === "user") {
      if (first) {
        myMessages.push(messageToChatgptMessage(message));
        break;
      }
      first = true;
    }
  }

  if (!_.isEmpty(myStore.propmpt)) {
    const chatgptMessage = new ChatgptMessage();
    chatgptMessage.role = "system";
    chatgptMessage.content = myStore.propmpt;
    myMessages.push(chatgptMessage);
  }

  return myMessages.reverse();
});

const isLoading = ref(false);

// Send Messsage
const sendMessage = async () => {
  if (isBlank(userMessage.value)) {
    snackbarStore.showErrorMessage("prompt不能为空");
    return
  }
  const userInputMessage = userMessage.value;
  // Add the message to the list
  messages.value.push({
    requestId: 0,
    rawContent: "",
    content: userInputMessage,
    role: "user",
    chatAI: -1
  });

  // Clear the input
  userMessageLast.value = userMessage.value;
  userMessage.value = "";

  isLoading.value = true;
  isGenerating.value = true;
  // Create a completion
  sendChatgpt(requestMessages.value, props.ai);
  myStore.account.cost += 1;
  scrollToBottomNow();
};

const atChatgptMessageNotice = (packet: ChatgptMessageNotice) => {
  // Check if the API key is set
  try {
    const requestId = packet.requestId;
    const chatAI = packet.chatAI;
    const choice = packet.choice;
    const finishReason = packet.finishReason;
    isLoading.value = false;
    if (finishReason != 0) {
      isGenerating.value = false;
      scrollToBottomNow();
    }

    // Add the bot message
    let message = _.find(messages.value, it => it.requestId == requestId);
    if (_.isNil(message)) {
      message = {
        requestId: requestId,
        rawContent: choice,
        content: choice,
        role: "assistant",
        chatAI: chatAI
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
}


const copyText = (txt, event) => {
  clipboard(txt, event);
  snackbarStore.showSuccessMessage("Markdown文档已复制到剪贴板");
}

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

// ---------------------------------------------------------------------------------------------------------------------
const roleAvatarMap = new Map<number, string>();
roleAvatarMap.set(1, "aa/map/chat.openai.com.png");
roleAvatarMap.set(1000, "aa/map/xunfei.png");
roleAvatarMap.set(2000, "aa/map/baidu.png");
roleAvatarMap.set(14000, "aa/map/llama.jpg");
roleAvatarMap.set(300, "aa/map/hunyuan.tencent.com.png");
roleAvatarMap.set(400, "aa/map/qianwen.aliyun.com.png");
roleAvatarMap.set(1500, "aa/map/gemini.google.com.png");
const avatarFrom = (chatAI: number) => {
  if (roleAvatarMap.has(chatAI)) {
    return roleAvatarMap.get(chatAI);
  }
  if (chatAI < 0) {
    return newsStore.myAvatar();
  }
  return newsStore.aiAvatar();
}

const isChatgpt = (message: Message) => {
  return message.chatAI == 1 || message.chatAI == 4;
}

const messageToChatgptMessage = (message: Message) => {
  const chatgptMessage = new ChatgptMessage();
  chatgptMessage.role = message.role;
  chatgptMessage.content = message.content;
  return chatgptMessage;
}

const searchOnline = (url: string) => {
  // hello::dsf sdfsfd 说的话覅 // 第三方
  const encodedStr = encodeURIComponent(userMessageLast.value);
  window.open(url + encodedStr, '_blank');
}

// ------------------------------------------------------------------------------------------------------------------------
const dialogRef = ref(false);

</script>

<template>
  <v-container v-if="messages.length <= 0">
    <v-row justify="center" align="center">
      <v-col cols="12">
        <AnimationAI1 v-if="props.ai == 1" :size="props.size"/>
        <AnimationAI2 v-else-if="props.ai == 2" :size="props.size"/>
        <AnimationAI4 v-else-if="props.ai == 4" :size="props.size"/>
        <AnimationAILlama v-else-if="props.ai == 6" :size="props.size"/>
      </v-col>
    </v-row>
    <!--    <vue-qrcode value="weixin://wxpay/bizpayurl?pr=WtgZu2gzz" :options="{ width: 200 }"></vue-qrcode>-->
  </v-container>
  <v-container v-else>
    <v-row v-for="message in messages">
      <v-hover close-delay="500">
        <template v-slot:default="{ isHovering, props }">
          <v-avatar v-bind="props" class="mt-3 ml-3 mb-1"
                    :rounded="isHovering ? 'lg' : 'sm'"
                    :variant="isHovering ? 'outlined' : 'elevated'" v-ripple
                    @click="copyText(message.content, $event)">
            <img :src="avatarFrom(message.chatAI)" alt="alt"/>
          </v-avatar>
        </template>
      </v-hover>
      <v-card class="mt-3 mx-3">
        <md-preview v-if="message.role === 'user'" v-model="message.content" editor-id="preview-only"/>
        <md-preview v-else v-model="message.content" editor-id="preview-only" theme="dark"/>
      </v-card>
    </v-row>
    <v-row v-if="isLoading">
      <v-col>
        <AnimationBot1 :size="100"/>
      </v-col>
    </v-row>
    <v-row v-if="!isLoading && !mobile">
      <v-col cols="1">
        <v-chip color="indigo" prepend-icon="mdi-google" @click="searchOnline('https://www.google.com/search?q=')">
          google
        </v-chip>
      </v-col>
      <v-col cols="1">
        <v-chip color="blue" prepend-icon="mdi-microsoft-bing" @click="searchOnline('https://www.bing.com/search?q=')">
          bing搜索
        </v-chip>
      </v-col>
      <v-col cols="1">
        <v-chip color="teal" prepend-icon="mdi-paw" @click="searchOnline('https://www.baidu.com/s?wd=')">
          百度一下
        </v-chip>
      </v-col>
      <v-col cols="1">
        <v-chip prepend-icon="mdi-music-note" @click="searchOnline('https://www.douyin.com/search/')">
          抖音
        </v-chip>
      </v-col>
      <v-col cols="1">
        <v-chip color="blue-grey" prepend-icon="mdi-television-pause" @click="searchOnline('https://search.bilibili.com/all?keyword=')">
          B站
        </v-chip>
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
                 @click="dialogRef = true">
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
  </v-footer>

  <v-dialog v-model="dialogRef" width="600">
    <v-card>
      <v-card-title class="font-weight-bold pa-5">{{ $t("chatgpt.config.title") }}</v-card-title>
      <v-divider/>
      <v-card-text>
        <v-switch v-model="myStore.baidu" label="文心一言" hide-details color="teal" inset></v-switch>
        <v-switch v-model="myStore.xunfei" label="讯飞星火大模型" hide-details color="teal" inset></v-switch>
        <v-switch v-model="myStore.llama" label="meta llama" hide-details color="teal" inset></v-switch>

        <v-label class="font-weight-medium mb-2 ml-2 mt-5">角色扮演</v-label>

        <v-textarea
            v-model="myStore.propmpt"
            placeholder="如：我要让你来充当英语翻译，你的目标是把任何语言翻译成英文，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式。"
            auto-grow
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="dialogRef = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
