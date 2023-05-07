<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import {useNewsStore} from "@/stores/newsStore";

const newsStore = useNewsStore();

const totalNewsRef = ref<number>(0);

onMounted(() => {
  refreshTotalNews();
  setTimeout(() => refreshTotalNews(), 1000)
  setTimeout(() => refreshTotalNews(), 2000)
  setTimeout(() => refreshTotalNews(), 3000)
  setTimeout(() => refreshTotalNews(), 5000)
  setTimeout(() => refreshTotalNews(), 7000)
  setTimeout(() => refreshTotalNews(), 10000)
});

setInterval(() => refreshTotalNews(), 15000);

function refreshTotalNews() {
  totalNewsRef.value = newsStore.totalNewNews();
}

</script>

<template>
  <v-btn v-if="totalNewsRef > 0" icon>
    <v-badge :content="totalNewsRef" color="error">
      <v-icon>mdi-bell-outline</v-icon>
    </v-badge>
  </v-btn>
</template>
