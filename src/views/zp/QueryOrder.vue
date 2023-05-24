<template>
  <div>
    <v-row>
      <v-col cols="2">
        <v-card-title>
          {{ $t('zp.queryOrder01') }}
        </v-card-title>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectExcelType"
          :items="orderTypes"
          @update:modelValue="query()"
          density="compact"></v-select>
      </v-col>
      <v-col cols="1">
        <v-btn density="compact" icon="mdi-card-bulleted-settings-outline" size="x-large" color="info" @click="settingDialog = !settingDialog"></v-btn>
      </v-col>
      <v-col>
        <v-text-field
          v-model="orders.search"
          append-icon="search"
          :label="$t('zp.queryOrder02')"
          single-line
          hide-details
          @click:append="query()"
          @keyup.enter="query()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table-server
          :headers="computedHeaders"
          :items="orders.playerRows"
          :search="orders.search"
          :loading="orders.loading"
          :items-per-page="orders.options.itemsPerPage"
          :items-length="orders.totalRows"
          @update:options="onUpdateOptions"
          @update:page="onUpdatePage"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="settingDialog" max-width="800">
      <v-card>
        <v-card-title>
          过滤需要查看的属性
        </v-card-title>
        <v-card-text>
          <v-row>
            <template v-for="header in allOrderHeaders">
              <v-col cols="4">
                <v-checkbox v-model="selected" :label="header" :value="header"></v-checkbox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { BASE_URL, useZpAuthStore } from "@/stores/zpAuthStorage";
import {onMounted} from "vue";
import _ from "lodash";
import { useSnackbarStore } from "@/stores/snackbarStore";

const zpAuthStore = useZpAuthStore();
const snackbarStore = useSnackbarStore();
const route = useRoute();

const selectExcelType = ref('全部');
const orderTypes = ref(['全部']);
const settingDialog = ref<boolean>(false);
const allOrderHeaders = ref([]);
const selected = ref([]);

const orders = reactive({
  search: '',
  loading: true,
  totalRows: 0,
  options: {
    page: 1,
    itemsPerPage: 50
  },
  headers: [],
  playerRows: []
});


const fetchData = async () => {
  orders.loading = true;

  const query = orders.search.trim();
  const page = orders.options.page;
  const itemsPerPage = orders.options.itemsPerPage;
  console.log("------------------" + page)
  const response = await axios.post(BASE_URL + "/api/order/query", {
    query,
    orderType: selectExcelType.value,
    page,
    itemsPerPage
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message);
    return;
  }

  const data = response.data.data;
  console.log(data);
  const serverPage = data.page;
  const result = data.rows;
  const headers = data.headers;
  orders.options = {
    page: serverPage.page,
    itemsPerPage: serverPage.itemsPerPage,
  };
  orders.headers = headers;
  orders.totalRows = serverPage.totalSize
  orders.playerRows = result;
  orders.loading = false;
  snackbarStore.showSuccessMessage(response.data.message);
}

const fetchOrderTypes = async () => {
  const response = await axios.post(BASE_URL + "/api/order/types", {}, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  orderTypes.value = response.data.data.orderTypes;
  allOrderHeaders.value = response.data.data.allOrderHeaders;
  selected.value = response.data.data.allOrderHeaders;
  if (!_.isEmpty(zpAuthStore.selectedHeaders)) {
    selected.value = zpAuthStore.selectedHeaders;
  }
  snackbarStore.showSuccessMessage(response.data.message);
}

async function onUpdateOptions(options) {
  orders.options = options
  await fetchData()
}

function onUpdatePage(page) {
  orders.options.page = page
}

const query = async () => {
  orders.options.page = 1;
  fetchData();
}

onMounted(() => {
  fetchData();
  fetchOrderTypes();
});

watch(
  () => orders.options,
  (newValue, oldValue) => {
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
    console.log(newValue)
    console.log(oldValue)
    if (_.isEqual(newValue, oldValue)) {
      return;
    }
    if (_.isEqual(newValue.page, oldValue.page) && _.isEqual(newValue.itemsPerPage, oldValue.itemsPerPage)) {
      return;
    }
    console.log("----------------------------------------------------------")
    fetchData();
  }
)

watch(
  () => selected.value,
  (newValue, oldValue) => {
    zpAuthStore.setSelectedHeaders(newValue);
  }
)

const computedHeaders = computed(() => {
  const cHeaders = [];
  for (const header of orders.headers) {
    if (_.findIndex(selected.value, it => it == header.title) < 0) {
      continue;
    }
    cHeaders.push(header);
  }
  return cHeaders;
});


</script>
