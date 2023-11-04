<script setup lang="ts">
import AnimationThanks from "@/animation/AnimationThanks.vue";
import AnimationThanks1 from "@/animation/AnimationThanks1.vue";

import {useDisplay} from "vuetify";
import {useMyStore} from "@/stores/myStore";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import MdEditor from "md-editor-v3";
import axios from "axios";
import _ from "lodash";
const myStore = useMyStore();
const customizeTheme = useCustomizeThemeStore();
const {mobile, width, height} = useDisplay();

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
