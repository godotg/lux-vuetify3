<script setup lang="ts">
import {asyncAsk, isWebsocketReady} from "@/utils/websocket";
import NewsOneRequest from "@/protocol/news/NewsOneRequest";
import NewsOneResponse from "@/protocol/news/NewsOneResponse";
import News from "@/protocol/news/News";
import _ from "lodash";
import {useSnackbarStore} from "@/stores/snackbarStore";

const snackbarStore = useSnackbarStore();
const route = useRoute();

const newsRef = ref<News | null>(null);
const keywordsRef = ref<string>();
const descriptionRef = ref<string>();
const commentRef = ref<string>();

onMounted(() => {
  initNews();
});


function initNews() {
  setTimeout(() => {
    doInitNews();
  }, 1000);
}

async function doInitNews() {
  if (!isWebsocketReady()) {
    initNews();
    return;
  }

  const id = route.params.id;
  const newsId = _.toNumber(id);

  const request = new NewsOneRequest();
  request.id = newsId;
  const response: NewsOneResponse = await asyncAsk(request)
  newsRef.value = response.news;
  keywordsRef.value = response.keywords;
  descriptionRef.value = response.description;
  commentRef.value = response.comment;
}

</script>

<template>
  <v-container>
    <v-card v-if="newsRef != null" class="mt-3" v-ripple>
      <v-card-title>
        {{ newsRef.level }}级情报 {{ newsRef.ctime }}
        <v-icon color="primary" icon="mdi-broadcast mdi-spin"></v-icon>
      </v-card-title>
      <v-card-subtitle>
        {{ newsRef.title }}
      </v-card-subtitle>
      <v-card-text class="text-pre-wrap">
        {{ newsRef.content }}
      </v-card-text>
      <v-card-actions
        v-if="!_.isEmpty(newsRef.stocks) || !_.isEmpty(newsRef.industries) || !_.isEmpty(newsRef.subjects)">
        <div>
          <template v-if="!_.isEmpty(newsRef.stocks)">
            <v-chip v-for="stock in newsRef.stocks" color="primary" size="x-small" class="mr-1">
              {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
            </v-chip>
          </template>
          <template v-if="!_.isEmpty(newsRef.industries)">
            <v-icon v-if="!_.isEmpty(newsRef.stocks)" icon="mdi-slash-forward" color="primary"></v-icon>
            <v-chip v-for="industry in newsRef.industries" color="primary" size="x-small" variant="outlined"
                    class="mr-1">
              {{ industry.name }} {{ industry.rise }}
            </v-chip>
          </template>
          <template v-if="!_.isEmpty(newsRef.subjects)">
            <v-icon v-if="!_.isEmpty(newsRef.stocks) || !_.isEmpty(newsRef.industries)" icon="mdi-slash-forward"
                    color="primary"></v-icon>
            <v-chip v-for="subject in newsRef.subjects" size="x-small" class="mr-1">
              {{ subject }}
            </v-chip>
          </template>
        </div>
      </v-card-actions>
    </v-card>

    <v-card v-if="descriptionRef != null" class="mt-3" v-ripple>
      <v-card-title>
        摘要
        <v-icon color="primary" icon="mdi-auto-mode mdi-spin"></v-icon>
      </v-card-title>
      <v-card-text class="text-pre-wrap">
        {{ descriptionRef }}
      </v-card-text>
    </v-card>

    <v-card v-if="commentRef != null" class="mt-3" v-ripple>
      <v-card-title>
        点评
        <v-icon color="primary" icon="mdi-eye-circle-outline mdi-spin"></v-icon>
      </v-card-title>
      <v-card-text class="text-pre-wrap">
        {{ commentRef }}
      </v-card-text>
    </v-card>

    <v-card v-if="keywordsRef != null" class="mt-3" v-ripple>
      <v-card-title>
        关键词
        <v-icon color="primary" icon="mdi-radioactive-circle-outline mdi-spin"></v-icon>
      </v-card-title>
      <v-card-text class="text-pre-wrap">
        {{ keywordsRef }}
      </v-card-text>
    </v-card>
  </v-container>
</template>
