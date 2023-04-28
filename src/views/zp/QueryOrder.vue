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
          :items="excelTypes"
          @update:modelValue="query()"
          density="compact"></v-select>
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
          :headers="orders.headers"
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
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {BASE_URL, httpHeaders} from "@/utils/authUtils";
import {onMounted} from "vue";
import _ from "lodash";

import { useSnackbarStore } from "@/stores/snackbarStore";
const snackbarStore = useSnackbarStore();
const route = useRoute();

const selectExcelType = ref('全部')
const excelTypes = ref(['全部'])

const orders = reactive({
  search: '',
  loading: true,
  totalRows: 0,
  options: {
    page: 1,
    itemsPerPage: 10
  },
  headers: [
    {title: '玩家id', key: 'id'},
    {title: '名称', key: 'name'},
    {title: '头像', key: 'avatar'},
    {title: '经验', key: 'exp'},
    {title: '等级', key: 'level'},
    {title: '注册时间', key: 'registerTime'},
    {title: '最近登录时间', key: 'lastLoginTime'}
  ],
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
    excelType: selectExcelType.value,
    page,
    itemsPerPage
  }, httpHeaders());

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

const fetchExcelTypes = async () => {
  const response = await axios.post(BASE_URL + "/api/order/excelTypes", {}, httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  excelTypes.value = response.data.data.excelTypes;
  console.log(response)
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
  fetchExcelTypes();
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


</script>
