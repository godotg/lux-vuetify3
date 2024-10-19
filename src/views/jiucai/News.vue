<script setup lang="ts">
import {asyncAsk, isWebsocketReady} from "@/utils/websocket";
import AnimationLeek1 from "@/animation/AnimationLeek1.vue";
import News from "@/protocol/news/News";
import NewsRequest from "@/protocol/news/NewsRequest";
import NewsResponse from "@/protocol/news/NewsResponse";
import NewsLoadMoreRequest from "@/protocol/news/NewsLoadMoreRequest";
import NewsLoadMoreResponse from "@/protocol/news/NewsLoadMoreResponse";
import GaiNian from "@/protocol/gn/GaiNian";
import GnRequest from "@/protocol/gn/GnRequest";
import GnResponse from "@/protocol/gn/GnResponse";
import _ from "lodash";
import {useDisplay} from "vuetify";
import clipboard from "@/utils/clipboardUtils";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useNewsStore} from "@/stores/newsStore";

const snackbarStore = useSnackbarStore();
const newsStore = useNewsStore();
const {mobile, width, height} = useDisplay();


const newsRef = ref<News[]>([]);
const gnRef = ref<GaiNian[]>([]);
const gnHotNoticeRef = ref<string>('');
const loadingRef = ref(true);
let endId = -1;
let startId = -1;


const levelMap = {
  "S": {
    value: 1,
    icon: "mdi-alpha-s-circle-outline",
    color: "error",
    size: "x-large"
  },
  "A": {
    value: 2,
    icon: "mdi-alpha-a-circle-outline",
    color: "warning",
    size: "large"
  },
  "B": {
    value: 3,
    icon: "mdi-alpha-b-circle-outline",
    color: "success",
    size: "default"
  },
  "C": {
    value: 4,
    icon: "mdi-alpha-c-circle-outline",
    color: "info",
    size: "small"
  },
  "D": {
    value: 5,
    icon: "mdi-alpha-d-circle-outline",
    color: "blue-grey",
    size: "x-small"
  },
};

const jokes = [
  "🌴快乐韭菜网，做一个快乐的韭菜，https://jiucai.fun",
  "🌴快乐韭菜网，爱割才会赢，https://jiucai.fun",
  "🌴做韭菜也得快乐哦，https://jiucai.fun",
  "🌴韭菜炒鸡蛋，快乐干饭，https://jiucai.fun",
  "🌴因为run的快，所以是一个快乐的韭菜，https://jiucai.fun",
];

onMounted(() => {
  console.log("news on mounted-----------------------------------------");
  initNews();
  setInterval(() => requestNews(), 15000);
  setInterval(() => requestGn(30), 600000);
});

watch(
  () => newsStore.newsLevelFilterValue,
  async (val) => {
    initNews();
  },
  {
    deep: true,
  }
);

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    requestNews();
  }
});

function initNews() {
  setTimeout(() => {
    doInitNews();
    requestGn(30);
  }, 1000);
}

async function doInitNews() {
  if (!isWebsocketReady()) {
    initNews();
    return;
  }
  const request = new NewsRequest();
  request.endId = -1;
  request.level = newsStore.newsLevelFilterValue;
  console.log("news init ----------------------------------------");
  const response: NewsResponse = await asyncAsk(request);
  loadingRef.value = false;
  newsRef.value = response.news;
  startId = _.last(response.news).id;
  endId = response.endId;
  snackbarStore.showSuccessMessage("情报初始化成功");
}

async function requestNews() {
  if (endId < 0) {
    return;
  }
  const request = new NewsRequest();
  request.endId = endId;
  request.level = newsStore.newsLevelFilterValue;
  const response: NewsResponse = await asyncAsk(request);
  console.log("news request response ----------------------------------");
  if (response.endId == endId) {
    return;
  }
  const newNews = _.concat(response.news, newsRef.value);
  newsRef.value = newNews;
  endId = response.endId;
}

async function loadMoreNews() {
  loadingRef.value = true;
  const request = new NewsLoadMoreRequest();
  request.startId = startId;
  request.level = newsStore.newsLevelFilterValue;
  console.log("news loadMore --------------------------------------");
  const response: NewsLoadMoreResponse = await asyncAsk(request)
  loadingRef.value = false;
  if (_.isEmpty(response.news)) {
    snackbarStore.showErrorMessage("没有更多了");
    return;
  }
  const newNews = _.concat(newsRef.value, response.news);
  newsRef.value = newNews;
  startId = response.startId;
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

// ---------------------------------------------------------------------------------------------------------------------

async function requestGn(num: number, notice: boolean = false) {
  const request = new GnRequest();
  request.num = num;
  const response: GnResponse = await asyncAsk(request)
  gnRef.value = response.gns;
  gnHotNoticeRef.value = response.hotNotice;
  gnRef.value.forEach(it => newsStore.updateGn(it.id));
  if (notice) {
    snackbarStore.showSuccessMessage("加载了更多的新概念");
  }
}

function copyGn(gn: GaiNian, event: Event) {
  let str = "";
  str = str + gn.level + "级电报 " + gn.ctime + "\n";
  str = str + "⚡" + gn.title + "\n\n" + gn.content + "\n\n";
  str = str + gn.url + "\n\n";
  str = str + jokes[_.random(0, jokes.length - 1)];
  clipboard(str, event);
  snackbarStore.showSuccessMessage(gn.content + "复制成功");
}

function copyNews(news: News, event: Event) {
  let str = "";
  str = str + news.level + "级情报 " + news.ctime + "\n";
  if (!_.isEmpty(news.title)) {
    str = str + "⚡" + news.title + "\n\n"
  } else {
    str = str + "\n"
  }
  str = str + news.content + "\n";

  if (!_.isEmpty(news.stocks)) {
    str = str + "\n🎯股票:";
    for (const stock of news.stocks) {
      str = str + " " + stock.name + "#" + stock.price + "(" + stock.rise + ")";
    }
  }
  // 🐳
  if (!_.isEmpty(news.concepts)) {
    str = str + "\n🐠概念:";
    for (const concept of news.concepts) {
      str = str + " " + concept.name + "(" + concept.rise + ")";
    }
  }
  if (!_.isEmpty(news.subjects)) {
    str = str + "\n🐧热词:";
    for (const subject of news.subjects) {
      str = str + " " + subject;
    }
  }
  str = str + "\n" + jokes[_.random(0, jokes.length - 1)];
  clipboard(str, event);
  snackbarStore.showSuccessMessage("复制成功");
}

</script>


<template>
  <v-container>
    <template v-if="mobile">
      <v-card  v-if="!_.isEmpty(gnRef)" class="mt-3">
        <v-card-title>
          <v-icon color="primary" icon="mdi-wind-power" size="x-large"></v-icon>
          &nbsp;
          新概念
          &nbsp;
          <v-icon v-ripple color="primary" icon="mdi-format-list-bulleted" size="small" @click="requestGn(108, true)"></v-icon>
        </v-card-title>
        <v-card-subtitle>
          {{ gnHotNoticeRef }}
        </v-card-subtitle>
        <v-card-item v-for="gnEle in gnRef" :key="gnEle.id" class="text-pre-wrap py-1" v-ripple @click="copyGn(gnEle, $event)">
          <v-row>
            <v-col class="font-weight-bold" cols="4">
              {{ gnEle.ctime }}
            </v-col>
            <v-col class="font-weight-bold px-0 mx-0">
              <a :href="gnEle.url" class="text-blue-lighten-2 font-weight-black" target="_blank">
                {{ gnEle.content }}
              </a>
              <v-icon v-if="newsStore.isNewGn(gnEle.id)" color="primary" icon="mdi-alert-octagram-outline"></v-icon>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
      <template v-for="newsEle in newsRef">
        <v-card class="mt-3" v-ripple @click="copyNews(newsEle, $event)">
          <v-card-title>
            <v-icon :color="levelMap[newsEle.level].color" :icon="levelMap[newsEle.level].icon"></v-icon>
            级情报 {{ newsEle.ctime }}
            <v-icon v-if="newsStore.isNew(newsEle.id)" color="primary" icon="mdi-new-box"></v-icon>
          </v-card-title>
          <v-card-subtitle>
            {{ newsEle.title }}
          </v-card-subtitle>
          <v-card-text class="text-pre-wrap">
            {{ newsEle.content }}
          </v-card-text>
          <v-card-actions
            v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.concepts) || !_.isEmpty(newsEle.subjects)">
            <div>
              <template v-if="!_.isEmpty(newsEle.stocks)">
                <v-chip v-for="stock in newsEle.stocks" color="primary" size="x-small" class="mr-1">
                  {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
                </v-chip>
              </template>
              <template v-if="!_.isEmpty(newsEle.concepts)">
                <v-icon v-if="!_.isEmpty(newsEle.stocks)" icon="mdi-slash-forward" color="primary"></v-icon>
                <v-chip v-for="concept in newsEle.concepts" color="primary" size="x-small" variant="outlined"
                        class="mr-1">
                  {{ concept.name }} {{ concept.rise }}
                </v-chip>
              </template>
              <template v-if="!_.isEmpty(newsEle.subjects)">
                <v-icon v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.concepts)" icon="mdi-slash-forward"
                        color="primary"></v-icon>
                <v-chip v-for="subject in newsEle.subjects" size="x-small" class="mr-1">
                  {{ subject }}
                </v-chip>
              </template>
            </div>
          </v-card-actions>
        </v-card>
      </template>
    </template>
    <v-timeline v-else density="compact" side="end">
      <v-timeline-item v-if="!_.isEmpty(gnRef)" fill-dot dot-color="purple" size="x-large">
        <template v-slot:icon>
          <span>SSR</span>
        </template>
        <v-card min-width="580px">
          <v-card-title>
            <v-icon color="primary" icon="mdi-wind-power" size="x-large"></v-icon>
            &nbsp;
            新概念
            &nbsp;
            <v-icon v-ripple color="primary" icon="mdi-format-list-bulleted" size="small" @click="requestGn(108, true)"></v-icon>
          </v-card-title>
          <v-card-subtitle>
            {{ gnHotNoticeRef }}
          </v-card-subtitle>
          <v-card-item v-for="gnEle in gnRef" :key="gnEle.id" class="text-pre-wrap py-1" v-ripple @click="copyGn(gnEle, $event)">
            <v-row>
              <v-col class="font-weight-bold" cols="3">
                {{ gnEle.ctime }}
              </v-col>
              <v-col class="font-weight-bold">
                <a :href="gnEle.url" class="text-blue-lighten-2 font-weight-black" target="_blank">
                  {{ gnEle.content }}
                </a>
                {{ gnEle.title }}
                <v-icon v-if="newsStore.isNewGn(gnEle.id)" color="primary" icon="mdi-alert-octagram-outline"></v-icon>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-timeline-item>
      <template v-for="newsEle in newsRef">
        <v-timeline-item fill-dot :dot-color="levelMap[newsEle.level].color" :size="levelMap[newsEle.level].size">
          <template v-slot:icon>
            <span>{{ newsEle.level }}</span>
          </template>
          <v-card v-ripple @click="copyNews(newsEle, $event)" max-width="1100px">
            <v-card-title>
              <v-icon :color="levelMap[newsEle.level].color" :icon="levelMap[newsEle.level].icon"></v-icon>
              级情报 {{ newsEle.ctime }}
              <v-icon v-if="newsStore.isNew(newsEle.id)" color="primary" icon="mdi-new-box"></v-icon>
            </v-card-title>
            <v-card-subtitle>
              {{ newsEle.title }}
            </v-card-subtitle>
            <v-card-text class="text-pre-wrap">
              {{ newsEle.content }}
            </v-card-text>
            <v-card-actions
              v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.concepts) || !_.isEmpty(newsEle.subjects)">
              <div>
                <template v-if="!_.isEmpty(newsEle.stocks)">
                  <v-chip v-for="stock in newsEle.stocks" color="primary" size="x-small" class="mr-1">
                    {{ stock.name }} {{ stock.price }} / {{ stock.rise }}
                  </v-chip>
                </template>
                <template v-if="!_.isEmpty(newsEle.concepts)">
                  <v-icon v-if="!_.isEmpty(newsEle.stocks)" icon="mdi-slash-forward" color="primary"></v-icon>
                  <v-chip v-for="concept in newsEle.concepts" color="primary" size="x-small" variant="outlined"
                          class="mr-1">
                    {{ concept.name }} {{ concept.rise }}
                  </v-chip>
                </template>
                <template v-if="!_.isEmpty(newsEle.subjects)">
                  <v-icon v-if="!_.isEmpty(newsEle.stocks) || !_.isEmpty(newsEle.concepts)" icon="mdi-slash-forward"
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

  <AnimationLeek1 v-if="_.isEmpty(newsRef)" :size="width"/>
</template>
