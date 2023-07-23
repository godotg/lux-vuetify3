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
import JsFileDownloader from "js-file-downloader";

import AnimationStableDiffusion from "@/animation/AnimationStableDiffusion.vue";
import AnimationMidjourney from "@/animation/AnimationMidjourney.vue";
import SdSimulateRequest from "@/protocol/sdiffusion/SdSimulateRequest";
import SdSimulateResponse from "@/protocol/sdiffusion/SdSimulateResponse";
import SdSimulateNotice from "@/protocol/sdiffusion/SdSimulateNotice";
import SdHistoryRequest from "@/protocol/sdiffusion/SdHistoryRequest";
import ImageDownloadRequest from "@/protocol/sdiffusion/ImageDownloadRequest";
import ImageDownloadResponse from "@/protocol/sdiffusion/ImageDownloadResponse";

import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import {useNewsStore} from "@/stores/newsStore";
import {useImageStore} from "@/stores/imageStore";
import {useDisplay} from "vuetify";
import _ from "lodash";

const snackbarStore = useSnackbarStore();
const route = useRoute();

const {mobile, width, height} = useDisplay();
const newsStore = useNewsStore();
const imageStore = useImageStore();

const MAX_HISTORY = 10;
let animationRunIndex = 1;

onMounted(() => {
  registerPacketReceiver(SdSimulateNotice.PROTOCOL_ID, sdSimulateNoticeRefresh);
  messages.value = imageStore.sdPrompts;
  initHistory();
  setInterval(() => initHistory(), 10 * 1000);
  setTimeout(() => scrollToBottomDelay(), 100);
  loadConfigs();
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
    if (!_.isEmpty(message.sdIds)) {
      continue;
    }
    const request = new SdHistoryRequest();
    request.nonce = message.id;
    send(request);
  }
}

async function download(url) {
  if (_.findIndex(imageStore.downloads, it => it === url) >= 0) {
    snackbarStore.showErrorMessage("已经下载过该图片");
    return;
  }
  const request: ImageDownloadRequest = new ImageDownloadRequest();
  request.url = url;
  const response: ImageDownloadResponse = await asyncAsk(request);
  const realUrl = response.realUrl;
  new JsFileDownloader({
    url: realUrl
  }).then(function () {
    // Called when download ended
    imageStore.downloads.push(url);
    imageStore.downloads = _.takeRight(imageStore.downloads, 100);
  }).catch(function (error) {
    // Called when an error occurred
    snackbarStore.showErrorMessage(error);
  });
}

// Scroll to the bottom of the message container
const scrollToBottomDelay = () => {
  setTimeout(() => {
    window.scrollTo({top: 999999, behavior: "smooth"});
  }, 200);
};


interface Message {
  id: number;
  content: string;
  costTime: number;
  sdIds: Array<number>;
  imageUrl: string;
  imageUrlLow: string;
  imageUrlMiddle: string;
  imageUrlHigh: string;
}

const styleInfos = [
  {
    image: "aa/style/0.png",
    style: 0,
    description: "二次元"
  },
  {
    image: "aa/style/1.png",
    style: 0,
    description: "二次元"
  },
  {
    image: "aa/style/2.png",
    style: 0,
    description: "二次元"
  },
  {
    image: "aa/style/3.png",
    style: 0,
    description: "二次元"
  },
  {
    image: "aa/style/4.png",
    style: 0,
    description: "二次元"
  },
  {
    image: "aa/style/5.png",
    style: 0,
    description: "二次元"
  },
  {
    image: "aa/style/6.png",
    style: 0,
    description: "二次元"
  },
];

const dimensionInfos = [
  {
    dimension: 0,
    description: "768 x 768"
  },
  {
    dimension: 1,
    description: "768 x 1024"
  },
];

// Message List
const messages = ref<Message[]>([]);
const dialogRef = ref<boolean>(false);
const dialogSettingRef = ref<boolean>(false);
const imageUrlRef = ref<string>("");
const imageUrlLowRef = ref<string>("");
const imageUrlMiddleRef = ref<string>("");
const imageUrlHighRef = ref<string>("");

const promptRef = ref<string>("");
const negativePromptRef = ref<string>("");
const styleRef = ref<number>(0);
const stepsRef = ref<number>(20);
const batchSizeRef = ref<number>(1);
const dimensionRef = ref<number>(0);

function styleInfo(style) {
  const ele = _.find(styleInfos, it => it.style == style);
  if (_.isNil(ele)) {
    return _.first(styleInfos);
  }
  return ele;
}

function loadConfigs() {
  const sdParameters = imageStore.sdParameters;
  if (_.isNil(sdParameters)) {
    return;
  }
  promptRef.value = sdParameters.prompt;
  negativePromptRef.value = sdParameters.negativePrompt;
  styleRef.value = sdParameters.style;
  stepsRef.value = sdParameters.step;
  batchSizeRef.value = sdParameters.batchSize;
  dimensionRef.value = sdParameters.dimension;
}

function saveConfigs() {
  imageStore.sdParameters = {
    prompt: promptRef.value,
    negativePrompt: negativePromptRef.value,
    style: styleRef.value,
    step: stepsRef.value,
    batchSize: batchSizeRef.value,
    dimension: dimensionRef.value
  };
}

watch(
  () => dialogSettingRef.value,
  (val) => {
    if (val) {
      return;
    }
    // 持久化到本地
    saveConfigs();
  },
  {
    deep: true,
  }
);


const isLoading = ref(false);

function openImage(message) {
  dialogRef.value = true;
  imageUrlRef.value = message.imageUrl;
  imageUrlLowRef.value = message.imageUrlLow;
  imageUrlMiddleRef.value = message.imageUrlMiddle;
  imageUrlHighRef.value = message.imageUrlHigh;
  console.log(height.value)
}

// Send Messsage
const sendMessage = async () => {
  // Clear the input
  if (promptRef.value) {
    saveConfigs();
    isLoading.value = true;
    animationRunIndex = _.random(1, 5);

    const request = new SdSimulateRequest();
    request.nonce = _.random(0, 10_0000_0000);
    request.prompt = promptRef.value;
    request.negativePrompt = negativePromptRef.value;
    request.steps = stepsRef.value;
    request.batchSize = batchSizeRef.value;
    request.style = styleRef.value;
    request.dimension = dimensionRef.value;
    request.ignores = imageStore.sds;
    const response: SdSimulateResponse = await asyncAsk(request);
    messages.value.push({
      id: response.nonce,
      content: request.prompt,
      costTime: response.costTime,
      sdIds: [],
      imageUrl: "",
      imageUrlLow: "",
      imageUrlMiddle: "",
      imageUrlHigh: ""
    });
    console.log(response);
  }
};


// 下面的逻辑都是自己的
const sdSimulateNoticeRefresh = (packet: SdSimulateNotice) => {
  const id = packet.nonce;

  isLoading.value = false;
  snackbarStore.showErrorMessage("aaaaaaaaaaaaaaaa")
};


const handleKeydown = (e) => {
  if (e.key === "Enter" && (e.altKey || e.shiftKey)) {
    // 当同时按下 alt或者shift 和 enter 时，插入一个换行符
    e.preventDefault();
    promptRef.value += "\n";
  } else if (e.key === "Enter") {
    // 当只按下 enter 时，发送消息
    e.preventDefault();
    sendMessage();
  }
};

</script>

<template>
  <v-container v-if="messages.length <= 0">
    <v-row v-if="mobile" class="mt-12">
      <v-col align-self="center">
        <AnimationStableDiffusion :size="width * 0.9"/>
        <AnimationMidjourney :size="width * 0.7"/>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <AnimationStableDiffusion :size="height * 0.8"/>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <template v-for="message in messages">
      <v-row class="justify-start">
        <v-avatar class="mt-3 mb-1 ml-3" rounded="sm" variant="elevated">
          <img :src="newsStore.myAvatar()" alt="alt"/>
        </v-avatar>
        <v-col cols="12" md="11">
          <v-card>
            <md-editor v-model="message.content" class="font-1" previewOnly/>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="!_.isEmpty(message.imageUrl)">
        <v-avatar v-if="!mobile" class="mt-3 mb-1 ml-3">
        </v-avatar>
        <v-col cols="12" md="11">
          <v-card max-width="500px">
            <v-img :src="message.imageUrlLow" @click="openImage(message)" alt="alt">
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-if="message.type === 'provider' || message.type === 'consumer' || message.type === 'create' || message.type === 'update'">
        <v-col cols="12" md="11">
          <v-progress-linear
            v-model="message.progress"
            height="8"
            color="primary"
            class="mb-2"
            buffer-value="0"
            rounded
            :indeterminate="message.type === 'provider' || message.type === 'consumer'"
            :stream="message.type === 'create'"
            :striped="message.type === 'update'"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </template>

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

  <v-footer color="transparent" app>
    <v-textarea
      color="primary"
      type="text"
      variant="solo"
      ref="input"
      v-model="promptRef"
      placeholder="prompt"
      hide-details
      @keydown="handleKeydown"
      rows="1"
      max-rows="9"
      auto-grow
    >
      <template #prepend-inner>
        <v-icon color="primary" @click="dialogSettingRef=!dialogSettingRef">mdi-cog-outline</v-icon>
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

  <v-dialog v-model="dialogRef" @click="dialogRef=!dialogRef">
    <v-row v-if="mobile">
      <v-col cols="12">
        <v-img :src="imageUrlMiddleRef" :lazy-src="imageUrlLowRef" :max-width="width * 0.8" :max-height="height * 0.95">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>
      <v-col cols="3" offset="9">
        <v-btn color="primary" icon="mdi-cloud-download-outline" @click="download(imageUrlRef)"></v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col offset="1">
        <v-img :src="imageUrlMiddleRef" :lazy-src="imageUrlLowRef" :max-height="height * 0.95">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>
      <v-col cols="1" align-self="end">
        <v-btn color="primary" icon="mdi-cloud-download-outline" @click="download(imageUrlRef)"></v-btn>
      </v-col>
    </v-row>
  </v-dialog>

  <v-dialog v-model="dialogSettingRef" :max-width="mobile ? width : width * 0.7">
    <v-card>
      <v-container>
        <v-row>
          <v-col>
            <v-slide-group
              v-model="styleRef"
              center-active
              show-arrows
            >
              <v-slide-group-item
                v-for="(styleInfo, index) in styleInfos"
                :key="index"
                v-slot="{ isSelected, toggle }"
              >
                <v-img
                  :src="styleInfo.image"
                  cover
                  width="300"
                  max-width="300"
                  class="ma-2 text-right"
                  @click="toggle"
                >
                  <v-btn v-if="isSelected" icon="mdi-check" color="cyan" size="small"></v-btn>
                </v-img>
              </v-slide-group-item>
            </v-slide-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-chip color="primary" label size="large">
              <v-icon start icon="mdi-heart-circle-outline"></v-icon>
              {{ styleInfo(styleRef).description }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              v-model="stepsRef"
              thumb-color="primary"
              thumb-label
              step="1"
              min="20"
              max="150"
              label="步数(Sampling steps)"
            ></v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              v-model="batchSizeRef"
              thumb-color="primary"
              thumb-label
              step="1"
              min="1"
              max="4"
              label="张数(Batch size)"
            ></v-slider>
          </v-col>
          <v-col>
            <v-select
              v-model="dimensionRef"
              :items="dimensionInfos"
              item-title="description"
              item-value="dimension"
              single-line
              chips
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              color="primary"
              type="text"
              variant="solo"
              ref="input"
              v-model="negativePromptRef"
              placeholder="negative prompt"
              hide-details
              rows="1"
              max-rows="9"
              auto-grow
            >
            </v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
