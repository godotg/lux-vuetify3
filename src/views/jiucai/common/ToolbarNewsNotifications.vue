<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import {useNewsStore} from "@/stores/newsStore";

const newsStore = useNewsStore();

const newNewsRef = ref<number>(0);

onMounted(() => {
  refresh();
  setTimeout(() => refresh(), 1000)
  setTimeout(() => refresh(), 2000)
  setTimeout(() => refresh(), 3000)
  setTimeout(() => refresh(), 5000)
  setTimeout(() => refresh(), 7000)
  setTimeout(() => refresh(), 10000)
});

setInterval(() => refresh(), 15000);

function refresh() {
  newNewsRef.value = newsStore.totalNewNews();
  if (newsStore.newsIdDiff > 0) {
    newNewsRef.value = newsStore.newsIdDiff;
  }
}

</script>

<template>
  <v-btn v-if="newNewsRef > 0" icon to="/">
    <v-badge :content="newNewsRef" color="primary">
      <v-icon>mdi-bell-outline</v-icon>
    </v-badge>
  </v-btn>
  <v-btn v-if="newsStore.chatMessageIdDiff > 0" icon to="/square">
    <v-badge :content="newsStore.chatMessageIdDiff" color="primary">
      <v-icon>mdi-message-processing-outline</v-icon>
    </v-badge>
  </v-btn>
</template>
