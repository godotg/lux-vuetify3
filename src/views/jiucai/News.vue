<script setup lang="ts">
import {asyncAsk} from "@/utils/websocket";
import News from "@/protocol/news/News";
import NewsRequest from "@/protocol/news/NewsRequest";
import NewsResponse from "@/protocol/news/NewsResponse";
import _ from "lodash";
import {useClipboard} from "@vueuse/core";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useDisplay} from "vuetify";
import {searchPhotosApi} from "@/api/unsplashApi";

const {copy} = useClipboard();
const snackbarStore = useSnackbarStore();
const {mobile} = useDisplay()


const newsRef = ref<News[]>([]);
const hasMore = ref(true);
const loading = ref(false);
const scrollBottom = ref(0);


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
});

async function initNews() {
  const request = new NewsRequest();
  request.startId = 1;
  request.endId = -1;
  const response: NewsResponse = await asyncAsk(request)
  console.log("-------------------------");
  console.log(response);
  updateNewsRef(response.news)
}

function updateNewsRef(news: Array<News>) {
  if (_.isEmpty(news)) {
    return;
  }
  news.forEach((value, index) => {
    if (_.findIndex(newsRef.value, (it) => it.id == value.id) < 0) {
      newsRef.value = _.concat(value, newsRef.value)
    }
  });
}

const loadMore = async () => {
  loading.value = true;
  console.log(hasMore.value);

  if (!hasMore.value) {
    loading.value = false;
    snackbarStore.showMessage("没有更多了");
    return;
  }

  // const photosResponse = await searchPhotosApi(queryOptions);
  // const newList = photosResponse.data.results;
  // hasMore.value = newList.length > 0;
  // loading.value = false;
};

const onScroll = (e) => {
  console.log("000000000000000000000000")
  const target = e.target;
  scrollBottom.value =
    target.scrollHeight - target.scrollTop - target.clientHeight;
  if (scrollBottom.value < 100) {
    loadMore();
  }
};

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
  <div style="max-height: 2000px; overflow-y: auto" v-scroll.self="onScroll">
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
    <v-container v-else>
      <v-timeline density="compact" side="end">
        <template v-for="newsEle in newsRef">
          <v-timeline-item fill-dot :dot-color="levelMap[newsEle.level].color" :size="levelMap[newsEle.level].size">
            <template v-slot:icon>
              <span>{{ newsEle.level }}</span>
            </template>
            <v-card v-ripple @click="copyNews(newsEle)">
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
    </v-container>
  </div>
</template>
