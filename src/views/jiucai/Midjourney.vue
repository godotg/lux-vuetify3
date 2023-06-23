<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import AnimationRun1 from "@/animation/AnimationRun1.vue";
import AnimationRun2 from "@/animation/AnimationRun2.vue";
import AnimationRun3 from "@/animation/AnimationRun3.vue";
import AnimationRun4 from "@/animation/AnimationRun4.vue";
import AnimationRun5 from "@/animation/AnimationRun5.vue";
import {Icon} from "@iconify/vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const snackbarStore = useSnackbarStore();
const route = useRoute();

import AnimationMidjourney from "@/animation/AnimationMidjourney.vue";
import MidImagineRequest from "@/protocol/midjourney/MidImagineRequest";
import MidRerollRequest from "@/protocol/midjourney/MidRerollRequest";
import MidHistoryRequest from "@/protocol/midjourney/MidHistoryRequest";
import MidImagineNotice from "@/protocol/midjourney/MidImagineNotice";

import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import {useNewsStore} from "@/stores/newsStore";
import {useImageStore} from "@/stores/imageStore";
import {useDisplay} from "vuetify";
import _ from "lodash";
import {scrollToBottom} from "@/utils/common";
import GroupHistoryMessageRequest from "@/protocol/chat/GroupHistoryMessageRequest";
import GroupHistoryMessageResponse from "@/protocol/chat/GroupHistoryMessageResponse";
import MidSelectRequest from "@/protocol/midjourney/MidSelectRequest";
import ImageBot from "@/views/chatgpt/ImageBot.vue";

const {mobile, width, height} = useDisplay();
const newsStore = useNewsStore();
const imageStore = useImageStore();

let animationRunIndex = 1;

onMounted(() => {
  registerPacketReceiver(MidImagineNotice.PROTOCOL_ID, midjourneyNoticeRefresh);
  messages.value = imageStore.midPrompts;
  initHistory();
  setInterval(() => initHistory(), 5 * 1000);
  // messages.value.push(
  //   {
  //     id: "111",
  //     type: "create",
  //     imageUrl: "",
  //     content: "aaaaaaa",
  //     progress: 33
  //   },
  //   {
  //     id: "111",
  //     type: "create",
  //     imageUrl: "",
  //     content: "![](https://jiucai.fun/out.png)",
  //     progress: 88
  //   },
  //   {
  //     id: "111",
  //     type: "create",
  //     imageUrl: "",
  //     content: "![](https://jiucai.fun/out.png)",
  //     progress: 88
  //   },
  // );
  setTimeout(() => scrollToBottomDelay(), 1500);
});

async function initHistory() {
  setTimeout(() => doInitHistory(), 1000);
}

async function doInitHistory() {
  if (!isWebsocketReady()) {
    initHistory();
    return;
  }
  if (_.isEmpty(messages.value)) {
    messages.value = [];
    return;
  }
  for (const message of messages.value) {
    if (message.type === 'complete') {
      continue;
    }
    const request = new MidHistoryRequest();
    request.nonce = message.id;
    send(request);
  }
}


// Scroll to the bottom of the message container
const scrollToBottomDelay = () => {
  setTimeout(() => {
    window.scrollTo({top: 999999, behavior: "smooth"});
  }, 200);
};


interface Message {
  id: string;
  type: string;
  content: string;
  imageUrl: string;
  progress: number;
  reroll: boolean;
  midjourneyId: number;
}

// Message List
const messages = ref<Message[]>([]);
const dialogRef = ref<boolean>(false);
const imageUrlRef = ref<string>("");

// User Input Message
const userMessage = ref("");

const isLoading = ref(false);

function seed(): string {
  const a = _.random(10_0000_0000, 20_0000_0000);
  const b = _.random(1_0000_0000, 2_0000_0000);
  const seed = _.toString(a) + _.toString(b);
  return seed;
}

function openImage(imageUrl) {
  dialogRef.value = true;
  imageUrlRef.value = imageUrl + "!middle";
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
    userMessage.value = "";
    animationRunIndex = _.random(1, 5);
    send(request);
  }
};

const reroll = async (midjourneyId) => {
  const request = new MidRerollRequest();
  request.midjourneyId = midjourneyId;
  request.nonce = seed();
  isLoading.value = true;
  userMessage.value = "";
  animationRunIndex = _.random(1, 5);
  send(request);
};

const select = async (midjourneyId, index, category) => {
  const request = new MidSelectRequest();
  request.midjourneyId = midjourneyId;
  request.index = index;
  request.category = category;
  request.nonce = seed();
  isLoading.value = true;
  userMessage.value = "";
  animationRunIndex++;
  send(request);
};

// 下面的逻辑都是自己的
const midjourneyNoticeRefresh = (packet: MidImagineNotice) => {
  const id = packet.nonce;
  const type = packet.type;
  const imageUrl = packet.imageUrl;
  const content = packet.content;
  const progress = packet.progress;
  const midjourneyId = packet.midjourneyId;
  if (type === "provider") {
    const message = _.find(messages.value, it => it.id == id);
    if (message == null) {
      messages.value.push({
        id: packet.nonce,
        type: packet.type,
        imageUrl: packet.imageUrl,
        content: packet.content,
        progress: packet.progress,
        reroll: false,
        midjourneyId: midjourneyId,
      });
    }
    updateMessage(packet);
    scrollToBottomDelay();
  } else if (type === "consumer") {
    updateMessage(packet);
    scrollToBottomDelay();
  } else if (type === "create") {
    updateMessage(packet);
    scrollToBottomDelay();
  } else if (type === "update") {
    updateMessage(packet);
  } else if (type === "complete") {
    updateMessage(packet);
    setTimeout(() => scrollToBottomDelay(), 1000);
    setTimeout(() => scrollToBottomDelay(), 2000);
    setTimeout(() => scrollToBottomDelay(), 3000);
    isLoading.value = false;
  } else if (type === "stop") {
    updateMessage(packet);
    isLoading.value = false;
  } else if (type === "expire") {
    // 过期给一个提示
    isLoading.value = false;
    snackbarStore.showErrorMessage(content)
  }
};

function updateMessage(packet: MidImagineNotice) {
  const id = packet.nonce;
  const type = packet.type;
  const imageUrl = packet.imageUrl;
  const content = packet.content;
  const progress = packet.progress;
  const reroll = packet.reroll;
  const midjourneyId = packet.midjourneyId;
  const message = _.find(messages.value, it => it.id == id);
  if (message == null) {
    return;
  }
  message.type = type;
  message.imageUrl = imageUrl;
  message.content = content;
  message.progress = progress;
  message.reroll = reroll;
  message.midjourneyId = midjourneyId;
  // 保存到本地
  imageStore.midPrompts = _.takeRight(messages.value, 5);
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
  <v-container v-else>
    <v-row v-for="message in messages">
      <v-avatar class="mr-2 mr-md-4 mb-1" rounded="sm" variant="elevated">
        <img :src="newsStore.myAvatar()" alt="alt"/>
      </v-avatar>
      <v-card max-width="500px" class="mb-2">
        <md-editor v-model="message.content" class="font-1" previewOnly/>
        <v-img v-if="!_.isEmpty(message.imageUrl)"
               :src="message.imageUrl + '!low'"
               @click="openImage(message.imageUrl)" class="mb-1" alt="alt">
        </v-img>
        <v-btn-toggle v-if="message.reroll" color="primary" variant="outlined" multiple rounded divided class="ml-1">
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 1, 'upsample')">U1</v-btn>
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 2, 'upsample')">U2</v-btn>
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 3, 'upsample')">U3</v-btn>
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 4, 'upsample')">U4</v-btn>
          <v-btn icon="mdi-reload" @click="reroll(message.midjourneyId)"></v-btn>
        </v-btn-toggle>
        <v-btn-toggle v-if="message.reroll" color="primary" variant="outlined" multiple rounded divided class="ml-1 mb-1">
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 1, 'variation')">V1</v-btn>
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 2, 'variation')">V2</v-btn>
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 3, 'variation')">V3</v-btn>
          <v-btn class="font-weight-bold" @click="select(message.midjourneyId, 4, 'variation')">V4</v-btn>
        </v-btn-toggle>
      </v-card>
      <v-progress-linear
        v-if="message.type === 'provider' || message.type === 'consumer' || message.type === 'create' || message.type === 'update'"
        v-model="message.progress"
        height="15"
        color="primary"
        class="mb-2"
        buffer-value="0"
        rounded
        :indeterminate="message.type === 'provider' || message.type === 'consumer'"
        :stream="message.type === 'create'"
        :striped="message.type === 'update'"
      >
      </v-progress-linear>
    </v-row>

    <v-row v-if="isLoading">
      <v-col cols="12">
        <AnimationRun1 v-if="animationRunIndex === 1" :size="300"/>
        <AnimationRun2 v-else-if="animationRunIndex === 2" :size="300"/>
        <AnimationRun3 v-else-if="animationRunIndex === 3" :size="300"/>
        <AnimationRun4 v-else-if="animationRunIndex === 4" :size="300"/>
        <AnimationRun5 v-else :size="300"/>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
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
  </v-container>

  <v-dialog v-model="dialogRef" width="auto">
    <v-card>
      <v-img :src="imageUrlRef"></v-img>
    </v-card>
  </v-dialog>
</template>
