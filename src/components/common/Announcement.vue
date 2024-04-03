<script setup lang="ts">
import {useMyStore} from "@/stores/myStore";
import {useDisplay} from "vuetify";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";

import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import axios from "axios";
import _ from "lodash";
import AnimationThanks1 from "@/animation/AnimationThanks1.vue";
import AnimationThanks from "@/animation/AnimationThanks.vue";
const myStore = useMyStore();
const customizeTheme = useCustomizeThemeStore();
const {mobile, width, height} = useDisplay();


const dialogRef = ref<boolean>(false);

const announcementUrl = import.meta.env.VITE_BASE_HTTP_URL + "/aa/config/myconfig.json";

onMounted(async () => {
  const response = await axios.get(announcementUrl);
  console.log(response);
  const announcement = response.data;
  if (_.isEqual(announcement.version, myStore.announce.version)) {
    // 是否要弹出赞赏
    const now = new Date().getTime();
    if (now - myStore.lastForceShow < 7 * 24 * 60 * 60 * 1000) {
      return;
    }
    myStore.isShowReward = true;
    myStore.lastForceShow = now;
    return;
  }
  myStore.announce = announcement;
  dialogRef.value = true;
});



// 赞赏逻辑----------------------------------------------------------------------------------------------------------------
const thanksRef = ref(false);
const randomThanks = _.random(0,10) > 5;

watch(
  () => myStore.isShowReward,
  (val) => {
    if (!val) {
      setTimeout(() => {
        thanksRef.value = false;
      }, 1000);
    }
  },
  {
    deep: true,
  }
);

function reject() {
  customizeTheme.darkTheme = true;
  myStore.isShowReward = false;
  myStore.account.cost += 10;
}

function wait() {
  myStore.isShowReward = false;
}

function complete() {
  customizeTheme.darkTheme = false;
  myStore.account.cost = 0;
  thanksRef.value = true;
}


</script>
<template>
  <v-dialog transition="dialog-top-transition" max-width="700px" v-model="dialogRef">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-trumpet">
        <template v-slot:title>
          {{ myStore.announce.title }}
        </template>
        <v-card-text>
          <md-preview v-model="myStore.announce.content" editor-id="preview-only"/>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>

<!--  下面是赞赏dialog  -->
  <v-dialog transition="dialog-top-transition" max-width="500px" v-model="myStore.isShowReward">
    <template v-slot:default="{ isActive }">
      <v-card v-if="thanksRef">
        <AnimationThanks v-if="randomThanks" :size="mobile ? width * 0.7 : width * 0.2"/>
        <AnimationThanks1 v-else :size="mobile ? width * 0.7 : width * 0.2"/>
      </v-card>
      <v-card v-else prepend-icon="mdi-gift-outline">
        <template v-slot:title>
          请站长喝杯咖啡
        </template>
        <v-card-text>
          <img
            src="@/assets/my/caffe.jpg"
            alt="alt"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn variant="outlined" @click="complete()">
            充电完成
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="wait()">
            稍后
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="reject()">
            残忍拒绝
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
