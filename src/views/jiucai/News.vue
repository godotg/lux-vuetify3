<script setup lang="ts">
import {asyncAsk, isWebsocketReady} from "@/utils/websocket";
import AnimationLeek1 from "@/animation/AnimationLeek1.vue";
import News from "@/protocol/news/News";
import NewsRequest from "@/protocol/news/NewsRequest";
import NewsResponse from "@/protocol/news/NewsResponse";
import NewsLoadMoreRequest from "@/protocol/news/NewsLoadMoreRequest";
import NewsLoadMoreResponse from "@/protocol/news/NewsLoadMoreResponse";
import Concept from "@/protocol/concept/Concept";
import ConceptRequest from "@/protocol/concept/ConceptRequest";
import ConceptResponse from "@/protocol/concept/ConceptResponse";
import ThsRank from "@/protocol/rank/ThsRank";
import EastMoneyRank from "@/protocol/rank/EastMoneyRank";
import RankRequest from "@/protocol/rank/RankRequest";
import RankResponse from "@/protocol/rank/RankResponse";
import MarketRequest from "@/protocol/stock/MarketRequest";
import MarketResponse from "@/protocol/stock/MarketResponse";
import _ from "lodash";
import {useDisplay} from "vuetify";
import clipboard from "@/utils/clipboardUtils";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useNewsStore} from "@/stores/newsStore";
import {getFormatDate, getFormatMonth} from "@/utils/timeUtils";
import Chart from 'chart.js/auto';

const snackbarStore = useSnackbarStore();
const newsStore = useNewsStore();
const {mobile, width, height} = useDisplay();


const newsRef = ref<News[]>([]);
const conceptsRef = ref<Concept[]>([]);
const thsRanksRef = ref<ThsRank[]>([]);
const eastMoneyRanksRef = ref<EastMoneyRank[]>([]);
const conceptCoreRef = ref<string>('');
const rankCoreCoreRef = ref<string>('');
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
  init();
  setInterval(() => requestNews(), 15000);
});

watch(
  () => newsStore.newsLevelFilterValue,
  async (val) => {
    init();
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

function init() {
  if (!isWebsocketReady()) {
    setTimeout(() => {
      init();
    }, 100);
  }

  doInitNews();
  requestConcepts(27);
  requestRanks(37);
  requestMarkets();
}

async function doInitNews() {
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


// ---------------------------------------------------------------------------------------------------------------------

async function requestConcepts(num: number, notice: boolean = false) {
  const request = new ConceptRequest();
  request.num = num;
  const response: ConceptResponse = await asyncAsk(request)
  conceptsRef.value = response.concepts;
  conceptCoreRef.value = response.core;
  conceptsRef.value.forEach(it => newsStore.updateConcept(it.id));
  if (notice) {
    snackbarStore.showSuccessMessage("加载了更多的新概念");
  }
}

async function requestRanks(num: number) {
  const request = new RankRequest();
  request.num = num;
  const response: RankResponse = await asyncAsk(request)
  thsRanksRef.value = response.thsRanks;
  eastMoneyRanksRef.value = response.eastMoneyRanks;
  rankCoreCoreRef.value = response.core;
  snackbarStore.showSuccessMessage("股票热度排名");
}

// ---------------------------------------------------------------------------------------------------------------------

async function requestMarkets() {
  if (mobile.value) {
    return;
  }
  const request = new MarketRequest();
  request.num = 90;
  const response: MarketResponse = await asyncAsk(request);

  new Chart(document.getElementById('exchangeChart'), {
    data: {
      labels: response.markets.map(it => getFormatMonth(it.date)),
      datasets: [
        {
          type: 'bar',
          label: '量能（亿）',
          data: response.markets.map(it => it.exchange)
        },
        {
          type: 'bubble',
          label: '总流通市值（百亿）',
          data: response.markets.map(it => it.amount / 100)
        },
      ],
    },
  });

  new Chart(document.getElementById('shChart'), {
    data: {
      labels: response.markets.map(it => getFormatMonth(it.date)),
      datasets: [
        {
          type: 'bar',
          label: '上海主板（亿）',
          data: response.markets.map(it => it.shAmount)
        },
      ],
    },
  });

  new Chart(document.getElementById('kcChart'), {
    data: {
      labels: response.markets.map(it => getFormatMonth(it.date)),
      datasets: [
        {
          type: 'bar',
          label: '科创板（亿）',
          data: response.markets.map(it => it.kcAmount)
        },
      ],
    },
  });
  new Chart(document.getElementById('szChart'), {
    data: {
      labels: response.markets.map(it => getFormatMonth(it.date)),
      datasets: [
        {
          type: 'bar',
          label: '深圳主板（亿）',
          data: response.markets.map(it => it.szAmount)
        },
      ],
    },
  });
  new Chart(document.getElementById('cyChart'), {
    data: {
      labels: response.markets.map(it => getFormatMonth(it.date)),
      datasets: [
        {
          type: 'bar',
          label: '创业板（亿）',
          data: response.markets.map(it => it.cyAmount)
        },
      ],
    },
  });
  new Chart(document.getElementById('bjChart'), {
    data: {
      labels: response.markets.map(it => getFormatMonth(it.date)),
      datasets: [
        {
          type: 'bar',
          label: '北交所（亿）',
          data: response.markets.map(it => it.bjAmount)
        },
      ],
    },
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function formatCode(code: number) {
  let stockCode = _.toString(code);
  switch (stockCode.length) {
    case 0:
      stockCode = "000000";
      break;
    case 1:
      stockCode = `00000${stockCode}`;
      break;
    case 2:
      stockCode = `0000${stockCode}`;
      break;
    case 3:
      stockCode = `000${stockCode}`;
      break;
    case 4:
      stockCode = `00${stockCode}`;
      break;
    case 5:
      stockCode = `0${stockCode}`;
      break;
    case 6:
      break;
    default:
  }
  return stockCode;
}

async function gotToEastMoney(code: number) {
  const stockCode = formatCode(code);
  if (stockCode.startsWith("8")) {
    window.open(`https://quote.eastmoney.com/bj/${stockCode}.html`, '_blank');
  } else if (stockCode.startsWith("688")) {
    window.open(`https://quote.eastmoney.com/kcb/${stockCode}.html`, '_blank');
  } else if (stockCode.startsWith("3") || stockCode.startsWith("0")) {
    window.open(`https://quote.eastmoney.com/sz${stockCode}.html`, '_blank');
  } else if (stockCode.startsWith("6")) {
    window.open(`https://quote.eastmoney.com/sh${stockCode}.html`, '_blank');
  } else {
    snackbarStore.showErrorMessage(`无法识别的代码[${stockCode}]`);
  }
}

async function gotToThs(code: number) {
  const stockCode = formatCode(code);
  window.open(`https://stockpage.10jqka.com.cn/${stockCode}/`, '_blank');
}

function hotRankChange(rankChange: number) {
  if (rankChange > 0) {
    return `+${rankChange}`;
  } else {
    return _.toString(rankChange);
  }
}

function copyConcept(concept: Concept, event: Event) {
  let str = "";
  str = str + concept.level + "级电报 " + concept.ctime + "\n";
  str = str + "⚡" + concept.title + "\n\n" + concept.content + "\n\n";
  str = str + concept.url + "\n\n";
  str = str + jokes[_.random(0, jokes.length - 1)];
  clipboard(str, event);
  snackbarStore.showSuccessMessage(concept.content + "复制成功");
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
      <v-card v-if="!_.isEmpty(conceptsRef)" class="mt-3">
        <v-card-title v-ripple @click="requestConcepts(108, true)">
          <v-icon color="primary" icon="mdi-wind-power" size="x-large"></v-icon>
          &nbsp;
          新概念
          &nbsp;
          <v-icon color="primary" icon="mdi-format-list-bulleted" size="small"></v-icon>
        </v-card-title>
        <v-card-subtitle>
          {{ conceptCoreRef }}
        </v-card-subtitle>
        <v-card-item v-for="concept in conceptsRef" :key="concept.id" class="text-pre-wrap py-1" v-ripple
                     @click="copyConcept(concept, $event)">
          <v-row>
            <v-col class="font-weight-bold" cols="4">
              {{ concept.ctime }}
            </v-col>
            <v-col class="font-weight-bold px-0 mx-0">
              <a :href="concept.url" class="text-blue-lighten-2 font-weight-black" target="_blank">
                {{ concept.content }}
              </a>
              <v-icon v-if="newsStore.isNewConcept(concept.id)" color="primary" icon="mdi-alert-octagram-outline"
                      size="small"></v-icon>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
      <v-card v-if="!_.isEmpty(eastMoneyRanksRef)" class="mt-3">
        <v-card-title v-ripple @click="requestRanks(100)">
          <v-icon color="primary" icon="mdi-chili-hot" size="x-large"></v-icon>
          &nbsp;
          Top排行
          &nbsp;
          <v-icon color="primary" icon="mdi-format-list-bulleted" size="small"></v-icon>
        </v-card-title>
        <v-card-text>
          <v-table density="compact">
            <thead>
            <tr>
              <th>
                排名
              </th>
              <th>
                东方财富
              </th>
              <th>
                升降
              </th>
              <th>
                同花顺
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(rank, i) in eastMoneyRanksRef" :key="i">
              <td>{{ i + 1 }}</td>
              <td class="cursor-pointer" v-tooltip:end="'跳转东方财富'" v-ripple @click="gotToEastMoney(rank.code)">
                {{ rank.name }}
              </td>
              <td>{{ hotRankChange(rank.rankChange) }}</td>
              <td class="cursor-pointer" v-tooltip:end="'跳转同花顺'" v-ripple @click="gotToThs(rank.code)">
                {{ thsRanksRef[i].name }}
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
      <template v-for="newsEle in newsRef">
        <v-card class="mt-3">
          <v-card-title v-ripple @click="copyNews(newsEle, $event)">
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
      <v-timeline-item v-if="!_.isEmpty(conceptsRef)" fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>SSR</span>
        </template>
        <v-card min-width="580px">
          <v-card-title class="cursor-pointer" v-tooltip:start="'更多概念'" v-ripple
                        @click="requestConcepts(108, true)">
            <v-icon color="primary" icon="mdi-wind-power" size="x-large"></v-icon>
            &nbsp;
            新概念
            &nbsp;
            <v-icon color="primary" icon="mdi-format-list-bulleted" size="small"></v-icon>
          </v-card-title>
          <v-card-subtitle class="text-wrap">
            {{ conceptCoreRef }}
          </v-card-subtitle>
          <v-card-item v-for="concept in conceptsRef" :key="concept.id" class="text-pre-wrap py-1" v-ripple
                       @click="copyConcept(concept, $event)">
            <v-row>
              <v-col class="font-weight-bold" cols="3">
                {{ concept.ctime }}
              </v-col>
              <v-col class="font-weight-bold">
                <a :href="concept.url" class="text-blue-lighten-2 font-weight-black" target="_blank">
                  {{ concept.content }}
                </a>
                {{ concept.title }}
                <v-icon v-if="newsStore.isNewConcept(concept.id)" color="primary"
                        icon="mdi-alert-octagram-outline"></v-icon>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-timeline-item>
      <v-timeline-item v-if="!_.isEmpty(eastMoneyRanksRef)" fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>Rank</span>
        </template>
        <v-card>
          <v-card-title class="cursor-pointer" v-tooltip:start="'更多排名'" v-ripple @click="requestRanks(100)">
            <v-icon color="primary" icon="mdi-chili-hot" size="x-large"></v-icon>
            &nbsp;
            Top排行
            &nbsp;
            <v-icon color="primary" icon="mdi-format-list-bulleted" size="small"></v-icon>
          </v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
              <tr>
                <th>
                  排名
                </th>
                <th>
                  东方财富
                </th>
                <th>
                  升降
                </th>
                <th>
                  同花顺列
                </th>
                <th>
                  升降
                </th>
                <th>
                  热度
                </th>
                <th>
                  AI解析
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(rank, i) in eastMoneyRanksRef" :key="i">
                <td>{{ i + 1 }}</td>
                <td class="cursor-pointer" v-tooltip:end="'跳转东方财富'" v-ripple @click="gotToEastMoney(rank.code)">
                  {{ rank.name }}
                </td>
                <td>{{ hotRankChange(rank.rankChange) }}</td>
                <td class="cursor-pointer" v-tooltip:end="'跳转同花顺'" v-ripple @click="gotToThs(rank.code)">
                  {{ thsRanksRef[i].name }}
                </td>
                <td>{{ hotRankChange(thsRanksRef[i].rankChange) }}</td>
                <td>{{ _.ceil(thsRanksRef[i].rate / 1000) }}</td>
                <td>{{ thsRanksRef[i].analyse }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <v-timeline-item fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>量能</span>
        </template>
        <v-card min-width="80vw">
          <v-card-text>
            <canvas id="exchangeChart"></canvas>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <v-timeline-item fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>Data</span>
        </template>
        <v-card min-width="80vw">
          <v-card-text>
            <canvas id="shChart"></canvas>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <v-timeline-item fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>Data</span>
        </template>
        <v-card min-width="80vw">
          <v-card-text>
            <canvas id="kcChart"></canvas>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <v-timeline-item fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>Data</span>
        </template>
        <v-card min-width="80vw">
          <v-card-text>
            <canvas id="szChart"></canvas>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <v-timeline-item fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>Data</span>
        </template>
        <v-card min-width="80vw">
          <v-card-text>
            <canvas id="cyChart"></canvas>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <v-timeline-item fill-dot dot-color="primary" size="x-large">
        <template v-slot:icon>
          <span>Data</span>
        </template>
        <v-card min-width="80vw">
          <v-card-text>
            <canvas id="bjChart"></canvas>
          </v-card-text>
        </v-card>
      </v-timeline-item>
      <template v-for="newsEle in newsRef">
        <v-timeline-item fill-dot :dot-color="levelMap[newsEle.level].color" :size="levelMap[newsEle.level].size">
          <template v-slot:icon>
            <span>{{ newsEle.level }}</span>
          </template>
          <v-card max-width="1100px">
            <v-card-title class="cursor-pointer" v-tooltip:start="'复制'" v-ripple @click="copyNews(newsEle, $event)">
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
