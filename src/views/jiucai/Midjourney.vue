<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import AnimationAi from "@/animation/AnimationRun1.vue";
import {Icon} from "@iconify/vue";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const snackbarStore = useSnackbarStore();
const route = useRoute();

import AnimationMidjourney from "@/animation/AnimationMidjourney.vue";
import MidImagineRequest from "@/protocol/midjourney/MidImagineRequest";
import MidImagineNotice from "@/protocol/midjourney/MidImagineNotice";

import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import {useNewsStore, avatarAutoUrl} from "@/stores/newsStore";
import {useDisplay} from "vuetify";
import _ from "lodash";

const {mobile, width, height} = useDisplay();
const newsStore = useNewsStore();
onMounted(() => {
  registerPacketReceiver(MidImagineNotice.PROTOCOL_ID, midjourneyNoticeRefresh);
  messages.value.push(
    {
      id: "111",
      type: "create",
      imageUrl: "",
      content: "aaaaaaa"
    },
    {
      id: "111",
      type: "create",
      imageUrl: "",
      content: "![](https://jiucai.fun/out.png)"
    },
  )
});


interface Message {
  id: string;
  type: string;
  content: string;
  imageUrl: string;
}

// Message List
const messages = ref<Message[]>([]);

// User Input Message
const userMessage = ref("");

const isLoading = ref(false);

function seed(): string {
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
const midjourneyNoticeRefresh = (packet: MidImagineNotice) => {
  const id = packet.nonce;
  const type = packet.type;
  const imageUrl = packet.imageUrl;
  const content = packet.content;
  if (type === "provider") {
    messages.value.push({
      id: packet.nonce,
      type: packet.type,
      imageUrl: packet.imageUrl,
      content: packet.content
    });
  } else if (type === "consumer") {
    const message = _.find(messages.value, it => it.id == id);
    message.content = content;
  } else if (type === "create") {
    const message = _.find(messages.value, it => it.id == id);
    message.content = content;
  } else if (type === "update") {
    const message = _.find(messages.value, it => it.id == id);
    message.content = content;
  } else if (type === "complete") {
    const message = _.find(messages.value, it => it.id == id);
    message.content = content;
    isLoading.value = false;
  } else if (type === "stop") {
    isLoading.value = false;
  }
};

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
  <v-container v-else>
    <v-row v-for="message in messages">
      <v-avatar class="mr-2 mr-md-4" rounded="sm" variant="elevated">
        <img :src="newsStore.myAvatar()" alt="alt"/>
      </v-avatar>
      <v-card :max-width="width * 0.3" class="mb-2">
        <md-editor v-model="message.content" class="font-1" previewOnly/>
      </v-card>
      <v-progress-linear
        model-value="90.5"
        height="25"
      >
        <strong>{{ Math.ceil(knowledge) }}%</strong>
      </v-progress-linear>
    </v-row>

    <v-row v-if="isLoading">
      <v-col cols="12">
        <AnimationAi :size="300"/>
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
</template>
