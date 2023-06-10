<!--
* @Component:
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
const props = defineProps({
  size: {
    type: Number,
    default: 400,
  },
});
</script>

<template>
  <h1 class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold mb-9">
    OpenAI
  </h1>
  <Vue3Lottie
    animationLink="/aa/ai-animation-1.json"
    :height="props.size"
    :width="props.size"
  />
</template>

<style scoped lang="scss"></style>
