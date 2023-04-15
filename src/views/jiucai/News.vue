<script setup lang="ts">
import {asyncAsk} from "@/utils/websocket";
import News from "@/protocol/news/News";
import NewsRequest from "@/protocol/news/NewsRequest";
import NewsResponse from "@/protocol/news/NewsResponse";


onMounted(() => {
  console.log("news on mounted")
});

async function requestNews() {
  const request = new NewsRequest();
  request.startId = 0;
  request.endId = -1;
  const response = await asyncAsk(request)
}

</script>


<template>
  <v-container>
    <v-timeline density="compact" side="end">
      <v-timeline-item fill-dot class="mb-12" dot-color="orange" size="large">
        <template v-slot:icon>
          <span>JL</span>
        </template>
        <div>
          <div class="text-h6">Content title</div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <v-divider/>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>
