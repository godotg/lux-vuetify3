<script setup lang="ts">
import {useSnackbarStore} from "@/stores/snackbarStore";
import 'md-editor-v3/lib/preview.css';
import JsFileDownloader from "js-file-downloader";

import AnimationAILlama from "@/animation/AnimationAILlama.vue";

import OssPolicyResponse from "@/protocol/auth/OssPolicyResponse";
import OssPolicyRequest from "@/protocol/auth/OssPolicyRequest";
import OssPolicyVO from "@/protocol/auth/OssPolicyVO";
import AnimationRequest from "@/protocol/animation/AnimationRequest";
import AnimationNotice from "@/protocol/animation/AnimationNotice";

import {registerPacketReceiver, isWebsocketReady, send, asyncAsk} from "@/utils/websocket";
import {useNewsStore} from "@/stores/newsStore";
import {useImageStore} from "@/stores/imageStore";
import {useImageSdStore} from "@/stores/imageSdStore";
import {useDisplay} from "vuetify";
import _ from "lodash";
import {useMyStore} from "@/stores/myStore";
import axios from "axios";


const myStore = useMyStore();
const snackbarStore = useSnackbarStore();
const route = useRoute();

const {mobile, width, height} = useDisplay();
const newsStore = useNewsStore();
const imageStore = useImageStore();
const imageSdStore = useImageSdStore();


const imageFileRef = ref(null);
const imageFileUploadingRef = ref<boolean>(false);
const imageFileUploadValueRef = ref<number>(0);


onMounted(() => {
  registerPacketReceiver(AnimationNotice, atAnimationNotice);
  messages.value = imageSdStore.animations;
});

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

async function share(url) {
  const imagePromptMd = `**${imagePromptRef.value}**`;
  const imageUrlMd = `<img src="${url}" alt="${imagePromptRef.value}" width="300">`;
  const request = new GroupChatRequest();
  request.message = imagePromptMd + "\n" + imageUrlMd;
  request.type = 1;
  send(request);
  snackbarStore.showSuccessMessage("成功分享图片到广场");
}


interface Message {
  id: number;
  originImageUrl: string;
  imageUrls: number[];
  prompts: number[];
  refreshTime: number;
}

// Message List
const isLoading = ref(false);
const messages = ref<Message[]>([]);
const dialogRef = ref<boolean>(false);
const imageUrlRef = ref<string>("");

function openImage(imageUrl) {
  dialogRef.value = true;
  imageUrlRef.value = imageUrl;
}


// 下面的逻辑都是自己的
const atAnimationNotice = (packet: AnimationNotice) => {

  const nonce = packet.nonce;
  const images = packet.images;
  const message = _.find(messages.value, it => it.id == nonce);
  if (_.isNil(message)) {
    console.error("找不到消息", packet);
    return;
  }
  message.sdImages = images;
  images.forEach(it => imageSdStore.sds.push(it.id));
  imageSdStore.sds = _.takeRight(imageSdStore.sds, 2000);
  if (isFinished(message)) {
    message.refreshTime = message.costTime + 3000;
    isLoading.value = false;
  } else {
    const progressRatio = images.length / message.batchSize;
    const progress = progressRatio * 100;
    if (message.progress < progress) {
      message.progress = progress;
      message.refreshTime = message.costTime * progressRatio;
    }
  }
};


// Send Messsage
const sendMessage = (imageUrl) => {
  isLoading.value = true;
  animationRunIndex = _.random(1, 5);

  const request = new AnimationRequest();
  request.requestId = _.random(0, 10_0000_0000);
  request.imageUrl = imageUrl;
  send(request);
}

const img2Animation = async () => {
  if (imageFileRef.value == null) {
    snackbarStore.showErrorMessage("图片不能为空");
    return
  }

  // 先获得oss policy
  const response: OssPolicyResponse = await asyncAsk(new OssPolicyRequest());
  const ossPolicy: OssPolicyVO | null = response.ossPolicy;
  if (ossPolicy == null) {
    snackbarStore.showErrorMessage("图片上传策略异常");
    return
  }

  // 上传图片
  const formData = new FormData();
  formData.append('key', ossPolicy.dir);
  formData.append('policy', ossPolicy.policy);
  formData.append('OSSAccessKeyId', ossPolicy.accessKeyId);
  formData.append('success_action_status', "200");
  formData.append('callback', '');
  formData.append('signature', ossPolicy.signature);
  formData.append('file', imageFileRef.value);

  imageFileUploadingRef.value = true;
  imageFileUploadValueRef.value = 0;

  const uploadImageResponse = await axios.postForm("https://jiucai.fun", formData, {
    onUploadProgress: (progressEvent) => {
      const complete = progressEvent.loaded / progressEvent.total * 100 | 0;
      imageFileUploadValueRef.value = complete;
    }
  });

  imageFileUploadingRef.value = false;
  imageFileUploadValueRef.value = 0;
  imageFileRef.value = null;

  const imageUrl = "https://jiucai.fun/" + ossPolicy.dir + " " + userMessage.value;
  sendMessage(imageUrl);
};

</script>

<template>
  <v-container v-if="messages.length <= 0">
    <v-row justify="center" align="center">
      <v-col cols="12">
        <AnimationAILlama :size="mobile ? width * 0.8 : height * 0.6"/>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <template v-for="message in messages">
      <v-row v-if="message.imageUrls">
        <v-col md="3" lg="2" cols="6" v-for="(imageUrl, index) in message.imageUrls" :key="index">
          <v-card max-width="500px">
            <v-img :src="imageUrl" @click="openImage(imageUrl)" alt="alt">
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
      <v-row v-if="message.imageUrls.length < 4">
        <v-col>
          <v-progress-linear
            v-model="message.progress"
            height="8"
            color="primary"
            class="mb-2"
            buffer-value="0"
            rounded
            striped
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </template>

    <v-progress-circular
      v-if="imageFileUploadingRef"
      :rotate="-90"
      :size="100"
      :width="15"
      :model-value="imageFileUploadValueRef"
      color="primary"
    >
      {{ imageFileUploadValueRef }}
    </v-progress-circular>
  </v-container>

  <v-footer color="transparent" app>
    <template v-if="mobile">
      <v-file-input
        v-model="imageFileRef"
        label="image to animation"
        variant="solo-filled"
        append-icon="mdi-send"
        accept="image/*"
        color="primary"
        chips
        show-size
        counter
        @click:append="img2Animation"
        @keyup.enter="img2Animation"
      ></v-file-input>
    </template>
    <v-container v-else>
      <v-row>
        <v-col cols="8" offset="2">
          <v-file-input
            v-model="imageFileRef"
            label="image to animation"
            variant="solo-filled"
            append-icon="mdi-send"
            accept="image/*"
            color="primary"
            chips
            show-size
            counter
            @click:append="img2Animation"
            @keyup.enter="img2Animation"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>

</template>
