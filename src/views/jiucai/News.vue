<script setup lang="ts">
import {asyncAsk} from "@/utils/websocket";
import News from "@/protocol/news/News";
import NewsRequest from "@/protocol/news/NewsRequest";
import NewsResponse from "@/protocol/news/NewsResponse";
import _ from "lodash";
import {useClipboard} from "@vueuse/core";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useDisplay} from "vuetify";

const {copy} = useClipboard();
const snackbarStore = useSnackbarStore();
const {mobile} = useDisplay()


const newsRef = ref<News[]>([]);
const loadingRef = ref(false);


const levelMap = {
  "S": {
    icon: "mdi-alpha-s-circle-outline",
    color: "error",
    size: "x-large"
  },
  "A": {
    icon: "mdi-alpha-a-circle-outline",
    color: "warning",
    size: "large"
  },
  "B": {
    icon: "mdi-alpha-b-circle-outline",
    color: "info",
    size: "default"
  },
  "C": {
    icon: "mdi-alpha-c-circle-outline",
    color: "blue-grey",
    size: "small"
  },
  "D": {
    icon: "mdi-alpha-d-circle-outline",
    color: "grey",
    size: "x-small"
  },
};


onMounted(() => {
  console.log("news on mounted");
  setTimeout(() => {
    initNews();
  }, 1000);
  setInterval(() => {
    requestNews();
  }, 5000)
});

async function initNews() {
  const request = new NewsRequest();
  request.startId = -1;
  request.endId = -1;
  const response: NewsResponse = await asyncAsk(request)
  console.log("init:" + response);
  updateNewsRef(response.news)
}

async function requestNews() {
  const firstNews = _.last(newsRef.value);
  if (_.isEmpty(firstNews)) {
    return;
  }
  const request = new NewsRequest();
  request.startId = firstNews.id;
  request.endId = -1;
  const response: NewsResponse = await asyncAsk(request)
  console.log("requestNews:" + response);
  updateNewsRef(response.news);
}

async function loadMoreNews() {
  const lastNews = _.last(newsRef.value);
  if (_.isEmpty(lastNews)) {
    snackbarStore.showErrorMessage("没有更多了");
    return;
  }
  loadingRef.value = true;
  const request = new NewsRequest();
  request.startId = -1;
  request.endId = lastNews.id;
  const response: NewsResponse = await asyncAsk(request)
  loadingRef.value = false;
  console.log("loadMore:" + response);
  updateNewsRef(response.news);
}


function updateNewsRef(news: Array<News>) {
  if (_.isEmpty(news)) {
    return;
  }
  news = _.filter(news, (it) => {
    return _.findIndex(newsRef.value, (it1) => it1.id == it.id) < 0;
  });
  let newNews = _.concat(newsRef.value, news);
  newNews = _.sortBy(newNews, (it) => it.id);
  newNews = _.reverse(newNews);
  newsRef.value = newNews;
}


function copyNews(news: News) {
  let str = "";
  str = str + news.level + "级电报 " + news.ctime + "\n";
  str = str + "💥" + news.title + "\n\n" + news.content;
  if (!_.isEmpty(news.stocks)) {
    str = str + "\n\n💧股票:";
    for (const stock of news.stocks) {
      str = str + " " + stock.name + "#" + stock.price + "(" + stock.rise + ")";
    }
  }
  if (!_.isEmpty(news.industries)) {
    str = str + "\n💧概念:";
    for (const industry of news.industries) {
      str = str + " " + industry.name + "(" + industry.rise + ")";
    }
  }
  if (!_.isEmpty(news.subjects)) {
    str = str + "\n💧热词:";
    for (const subject of news.subjects) {
      str = str + " " + subject;
    }
  }
  copy(str);
  snackbarStore.showSuccessMessage("复制成功");
}

</script>


<template>
  <v-container>
    <template v-if="mobile">
      <v-card v-for="newsEle in newsRef" class="mt-3" v-ripple @click="copyNews(newsEle)">
        <v-card-title>
          <v-icon :color="levelMap[newsEle.level].color" :icon="levelMap[newsEle.level].icon"></v-icon>
          级电报 {{ newsEle.ctime }}
        </v-card-title>
        <v-card-subtitle>
          {{ newsEle.title }}
        </v-card-subtitle>
        <v-card-text>
          {{ newsEle.content }}
        </v-card-text>
        <v-card-actions
          v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.industries) || !_.isEmpty(newsEle.subjects)">
          <template v-if="!_.isEmpty(newsEle.stocks)">
            <v-chip v-for="stock in newsEle.stocks" color="primary" size="x-small">
              {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
            </v-chip>
          </template>
          <template v-if="!_.isEmpty(newsEle.industries)">
            <v-chip v-for="industry in newsEle.industries" color="primary" size="x-small" variant="outlined">
              {{ industry.name }} {{ industry.rise }}
            </v-chip>
          </template>
          <template v-if="!_.isEmpty(newsEle.subjects)">
            <v-chip v-for="subject in newsEle.subjects" size="x-small">
              {{ subject }}
            </v-chip>
          </template>
        </v-card-actions>
      </v-card>
    </template>
    <v-timeline v-else density="compact" side="end">
      <template v-for="newsEle in newsRef">
        <v-timeline-item fill-dot :dot-color="levelMap[newsEle.level].color" :size="levelMap[newsEle.level].size">
          <template v-slot:icon>
            <span>{{ newsEle.level }}</span>
          </template>
          <v-card v-ripple @click="copyNews(newsEle)" max-width="1100px">
            <v-card-title>
              <v-icon :color="levelMap[newsEle.level].color" :icon="levelMap[newsEle.level].icon"></v-icon>
              级电报 {{ newsEle.ctime }}
            </v-card-title>
            <v-card-subtitle>
              {{ newsEle.title }}
            </v-card-subtitle>
            <v-card-text>
              {{ newsEle.content }}
            </v-card-text>
            <v-card-actions
              v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.industries) || !_.isEmpty(newsEle.subjects)">
              <template v-if="!_.isEmpty(newsEle.stocks)">
                <v-chip v-for="stock in newsEle.stocks" color="primary" size="x-small">
                  {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
                </v-chip>
              </template>
              <template v-if="!_.isEmpty(newsEle.industries)">
                <v-chip v-for="industry in newsEle.industries" color="primary" size="x-small" variant="outlined">
                  {{ industry.name }} {{ industry.rise }}
                </v-chip>
              </template>
              <template v-if="!_.isEmpty(newsEle.subjects)">
                <v-chip v-for="subject in newsEle.subjects" size="x-small">
                  {{ subject }}
                </v-chip>
              </template>
            </v-card-actions>
          </v-card>
        </v-timeline-item>
      </template>
    </v-timeline>
    <v-progress-linear v-if="loadingRef" indeterminate color="primary"></v-progress-linear>
    <v-footer v-else v-ripple class="d-flex flex-column primary" @click="loadMoreNews">
      更多
    </v-footer>
  </v-container>
</template>
