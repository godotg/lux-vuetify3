<script setup lang="ts">
import {asyncAsk, isWebsocketReady} from "@/utils/websocket";
import News from "@/protocol/news/News";
import NewsRequest from "@/protocol/news/NewsRequest";
import NewsResponse from "@/protocol/news/NewsResponse";
import GaiNian from "@/protocol/gn/GaiNian";
import GnRequest from "@/protocol/gn/GnRequest";
import GnResponse from "@/protocol/gn/GnResponse";
import _ from "lodash";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useDisplay} from "vuetify";
import clipboard from "@/utils/clipboardUtils";

const snackbarStore = useSnackbarStore();
const {mobile} = useDisplay()


const newsRef = ref<News[]>([]);
const gnRef = ref<GaiNian[]>([]);
const loadingRef = ref(false);


const levelMap = {
  "S": {
    icon: "mdi-alpha-s-circle-outline",
    color: "error",
    size: "x-large"
  },
  "A": {
    icon: "mdi-alpha-a-circle-outline",
    color: "primary",
    size: "large"
  },
  "B": {
    icon: "mdi-alpha-b-circle-outline",
    color: "success",
    size: "default"
  },
  "C": {
    icon: "mdi-alpha-c-circle-outline",
    color: "info",
    size: "small"
  },
  "D": {
    icon: "mdi-alpha-d-circle-outline",
    color: "blue-grey",
    size: "x-small"
  },
};


onMounted(() => {
  console.log("news on mounted-----------------------------------------");
  initNews();
  setInterval(() => requestNews(), 10000);
  setInterval(() => requestGn(), 60000);
});

function initNews() {
  setTimeout(() => {
    doInitNews();
    requestGn();
  }, 1000);
}

async function doInitNews() {
  if (!isWebsocketReady()) {
    initNews();
    return;
  }
  const request = new NewsRequest();
  request.startId = -1;
  request.endId = -1;
  const response: NewsResponse = await asyncAsk(request)
  console.log("news init ----------------------------------------");
  updateNewsRef(response.news)
}

async function requestNews() {
  const firstNews = _.first(newsRef.value);
  if (_.isEmpty(firstNews)) {
    return;
  }
  const request = new NewsRequest();
  request.startId = firstNews.id + 1;
  request.endId = -1;
  const response: NewsResponse = await asyncAsk(request)
  console.log("news request response ----------------------------------");
  updateNewsRef(response.news);
}

async function requestGn() {
  const request = new GnRequest();
  const response: GnResponse = await asyncAsk(request)
  gnRef.value = response.gns;
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
  setTimeout(() => {
    loadingRef.value = false;
  }, 10000);
  console.log("news loadMore --------------------------------------");
  const response: NewsResponse = await asyncAsk(request)
  loadingRef.value = false;
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

function copyGn(gn: GaiNian, event: Event) {
  let str = "";
  str = str + gn.level + "级电报 " + gn.ctime + "\n";
  str = str + "⚡" + gn.title + "\n\n" + gn.content + "\n\n";
  str = str + gn.url + "\n\n";
  str = str + "🌴快乐韭菜网：做一个快乐的韭菜， https://jiucai.fun";
  clipboard(str, event);
  snackbarStore.showSuccessMessage("复制成功");
}

function copyNews(news: News, event: Event) {
  let str = "";
  str = str + news.level + "级情报 " + news.ctime + "\n";
  if (!_.isEmpty(news.title)) {
    str = str + "⚡" + news.title + "\n\n"
  } else {
    str = str + "\n"
  }
  str = str + news.content;
  if (!_.isEmpty(news.stocks) || !_.isEmpty(news.industries) || !_.isEmpty(news.subjects)) {
    str = str + "\n";
  }
  if (!_.isEmpty(news.stocks)) {
    str = str + "\n🎯股票:";
    for (const stock of news.stocks) {
      str = str + " " + stock.name + "#" + stock.price + "(" + stock.rise + ")";
    }
  }
  // 🐳
  if (!_.isEmpty(news.industries)) {
    str = str + "\n🐠概念:";
    for (const industry of news.industries) {
      str = str + " " + industry.name + "(" + industry.rise + ")";
    }
  }
  if (!_.isEmpty(news.subjects)) {
    str = str + "\n🐧热词:";
    for (const subject of news.subjects) {
      str = str + " " + subject;
    }
  }
  str = str + "\n🌴快乐韭菜网：做一个快乐的韭菜， https://jiucai.fun";
  clipboard(str, event);
  snackbarStore.showSuccessMessage("复制成功");
}

</script>


<template>
  <v-container>
    <template v-if="mobile">
      <v-card v-for="gnEle in gnRef" class="mt-3" v-ripple @click="copyGn(gnEle, $event)">
        <v-card-title>
          <v-icon :color="levelMap[gnEle.level].color" :icon="levelMap[gnEle.level].icon"></v-icon>
          级情报 {{ gnEle.ctime }}
        </v-card-title>
        <v-card-subtitle>
          {{ gnEle.title }}
        </v-card-subtitle>
        <v-card-text class="text-pre-wrap">
          {{ gnEle.content }}
        </v-card-text>
        <v-card-text class="text-pre-wrap">
          <a :href="gnEle.url" class="text-blue" target="_blank">
            {{ gnEle.url }}
          </a>
        </v-card-text>
      </v-card>
      <v-card v-for="newsEle in newsRef" class="mt-3" v-ripple @click="copyNews(newsEle, $event)">
        <v-card-title>
          <v-icon :color="levelMap[newsEle.level].color" :icon="levelMap[newsEle.level].icon"></v-icon>
          级情报 {{ newsEle.ctime }}
        </v-card-title>
        <v-card-subtitle>
          {{ newsEle.title }}
        </v-card-subtitle>
        <v-card-text class="text-pre-wrap">
          {{ newsEle.content }}
        </v-card-text>
        <v-card-actions
          v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.industries) || !_.isEmpty(newsEle.subjects)">
          <div>
            <template v-if="!_.isEmpty(newsEle.stocks)">
              <v-chip v-for="stock in newsEle.stocks" color="primary" size="x-small" class="mr-1">
                {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
              </v-chip>
            </template>
            <template v-if="!_.isEmpty(newsEle.industries)">
              <v-icon v-if="!_.isEmpty(newsEle.stocks)" icon="mdi-slash-forward" color="primary"></v-icon>
              <v-chip v-for="industry in newsEle.industries" color="primary" size="x-small" variant="outlined"
                      class="mr-1">
                {{ industry.name }} {{ industry.rise }}
              </v-chip>
            </template>
            <template v-if="!_.isEmpty(newsEle.subjects)">
              <v-icon v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.industries)" icon="mdi-slash-forward"
                      color="primary"></v-icon>
              <v-chip v-for="subject in newsEle.subjects" size="x-small" class="mr-1">
                {{ subject }}
              </v-chip>
            </template>
          </div>
        </v-card-actions>
      </v-card>
    </template>
    <v-timeline v-else density="compact" side="end">
      <template v-for="gnEle in gnRef">
        <v-timeline-item fill-dot :dot-color="levelMap[gnEle.level].color" :size="levelMap[gnEle.level].size">
          <template v-slot:icon>
            <span>{{ gnEle.level }}</span>
          </template>
          <v-card v-ripple @click="copyGn(gnEle, $event)" max-width="1100px">
            <v-card-title>
              <v-icon :color="levelMap[gnEle.level].color" :icon="levelMap[gnEle.level].icon"></v-icon>
              级情报 {{ gnEle.ctime }}
            </v-card-title>
            <v-card-subtitle>
              {{ gnEle.title }}
            </v-card-subtitle>
            <v-card-text class="text-pre-wrap">
              {{ gnEle.content }}
            </v-card-text>
            <v-card-text class="text-pre-wrap">
              <a :href="gnEle.url" class="text-blue" target="_blank">
                {{ gnEle.url }}
              </a>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </template>
      <template v-for="newsEle in newsRef">
        <v-timeline-item fill-dot :dot-color="levelMap[newsEle.level].color" :size="levelMap[newsEle.level].size">
          <template v-slot:icon>
            <span>{{ newsEle.level }}</span>
          </template>
          <v-card v-ripple @click="copyNews(newsEle, $event)" max-width="1100px">
            <v-card-title>
              <v-icon :color="levelMap[newsEle.level].color" :icon="levelMap[newsEle.level].icon"></v-icon>
              级情报 {{ newsEle.ctime }}
            </v-card-title>
            <v-card-subtitle>
              {{ newsEle.title }}
            </v-card-subtitle>
            <v-card-text class="text-pre-wrap">
              {{ newsEle.content }}
            </v-card-text>
            <v-card-actions
              v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.industries) || !_.isEmpty(newsEle.subjects)">
              <div>
                <template v-if="!_.isEmpty(newsEle.stocks)">
                  <v-chip v-for="stock in newsEle.stocks" color="primary" size="x-small" class="mr-1">
                    {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
                  </v-chip>
                </template>
                <template v-if="!_.isEmpty(newsEle.industries)">
                  <v-icon v-if="!_.isEmpty(newsEle.stocks)" icon="mdi-slash-forward" color="primary"></v-icon>
                  <v-chip v-for="industry in newsEle.industries" color="primary" size="x-small" variant="outlined"
                          class="mr-1">
                    {{ industry.name }} {{ industry.rise }}
                  </v-chip>
                </template>
                <template v-if="!_.isEmpty(newsEle.subjects)">
                  <v-icon v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.industries)" icon="mdi-slash-forward"
                          color="primary"></v-icon>
                  <v-chip v-for="subject in newsEle.subjects" size="x-small" class="mr-1">
                    {{ subject }}
                  </v-chip>
                </template>
              </div>
            </v-card-actions>
          </v-card>
        </v-timeline-item>
      </template>
    </v-timeline>
    <v-progress-linear v-if="loadingRef" indeterminate color="primary"></v-progress-linear>
    <v-footer v-else v-ripple class="d-flex flex-column" color="primary" @click="loadMoreNews">
      更多
    </v-footer>
  </v-container>
</template>
