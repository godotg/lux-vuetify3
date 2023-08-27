<script setup lang="ts">
import CommonGptComponent from "./component/CommonGptComponent";
import {useDisplay} from "vuetify";
const {mobile, width} = useDisplay();
</script>

<template>
  <CommonGptComponent :ai="2" :size="mobile ? width*0.8 : 500" />
</template>
