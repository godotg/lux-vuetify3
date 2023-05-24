<template>
  <div>
    <v-container>
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
          <v-btn density="compact" icon="mdi-card-bulleted-settings-outline" size="x-large" color="info"
                 @click="settingDialog = !settingDialog"></v-btn>
        </v-col>
        <v-col>
          <v-combobox v-model="startDate" label="开始日期" :items="startDates"/>
        </v-col>
        <v-col>
          <v-combobox v-model="endDate" label="结束日期" :items="endDates"/>
        </v-col>
        <v-col cols="1">
          <v-btn density="compact" icon="mdi-cloud-download-outline" size="x-large" color="primary"
                 @click="downloadData"></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-row>
      <v-col>
        <v-data-table-server
          :headers="computedHeaders"
          :items="orders.playerRows"
          :loading="orders.loading"
          :items-per-page="orders.options.itemsPerPage"
          :items-length="orders.totalRows"
          @update:options="onUpdateOptions"
          @update:page="onUpdatePage"
          @click:row="orderModifyClick"
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
                <v-checkbox v-model="selected" :label="header" :value="header" color="primary"></v-checkbox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="orderModifyDialog" max-width="800">
      <v-card>
        <v-card-title>
          订单操作
        </v-card-title>
        <v-card-text>
          <v-row>
            <template v-for="header in orderModifyHeader">
              <v-col cols="4">
                <v-text-field v-model="orderModifyEntity[header.key]" :value="orderModifyEntity[header.key]"
                              :hint="header.title"
                              persistent-hint
                              color="primary"></v-text-field>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="outlined" append-icon="mdi-delete-circle-outline" color="error" @click="deleteModifyClick">
            删除
          </v-btn>
          <v-spacer/>
          <v-btn variant="outlined" append-icon="mdi-check" color="info" @click="updateModifyClick">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {BASE_URL, useZpAuthStore} from "@/stores/zpAuthStorage";
import {onMounted} from "vue";
import _ from "lodash";
import {useSnackbarStore} from "@/stores/snackbarStore";

const zpAuthStore = useZpAuthStore();
const snackbarStore = useSnackbarStore();
const route = useRoute();

const selectExcelType = ref('全部');
const orderTypes = ref(['全部']);
const settingDialog = ref<boolean>(false);
const allOrderHeaders = ref([]);
const selected = ref([]);

const orders = reactive({
  loading: true,
  totalRows: 0,
  options: {
    page: 1,
    itemsPerPage: 50
  },
  headers: [],
  playerRows: []
});

const startDates = ref<string[]>([]);
const endDates = ref<string[]>([]);
const startDate = ref("");
const endDate = ref("");


const fetchData = async () => {
  orders.loading = true;

  const query = "";
  const page = orders.options.page;
  const itemsPerPage = orders.options.itemsPerPage;
  console.log("------------------" + page)
  const response = await axios.post(BASE_URL + "/api/order/query", {
    query,
    startDate: startDate.value,
    endDate: endDate.value,
    orderType: selectExcelType.value,
    page,
    itemsPerPage
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
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

const downloadData = async () => {
  const query = "";
  const page = orders.options.page;
  const itemsPerPage = orders.options.itemsPerPage;
  const request = {
    query,
    startDate: startDate.value,
    endDate: endDate.value,
    orderType: selectExcelType.value,
    page,
    itemsPerPage
  };
  const json = JSON.stringify(request);
  const response = await axios.get(BASE_URL + "/api/order/download?json=" + json, {
    headers: {
      "zptoken": zpAuthStore.token,
    },
    responseType: "blob"
  });
  snackbarStore.showSuccessMessage("下载成功");
  const data = response.data;
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');// 创建a标签并点击， 即触发下载
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', selectExcelType.value + ".xlsx");
  document.body.appendChild(link);
  link.click();
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


function getFormatDate(date: Date): string {
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return date.getFullYear() + '-' + month + '-' + day;
}

const init = () => {
  const today = new Date();
  for (let i = 1; i <= 12; i++) {
    const tempDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    startDates.value.push(getFormatDate(tempDate));
    endDates.value.push(getFormatDate(tempDate));
  }
}

onMounted(() => {
  init();
  fetchData();
  fetchOrderTypes();
});

watch(
  () => orders.options,
  (newValue, oldValue) => {
    if (_.isEqual(newValue, oldValue)) {
      return;
    }
    if (_.isEqual(newValue.page, oldValue.page) && _.isEqual(newValue.itemsPerPage, oldValue.itemsPerPage)) {
      return;
    }
    console.log("----------------------------------------------------------")
    fetchData();
  }
);

watch(
  () => selected.value,
  (newValue, oldValue) => {
    zpAuthStore.setSelectedHeaders(newValue);
  }
);
watch(
  () => startDate.value,
  (newValue, oldValue) => {
    fetchData();
  }
);
watch(
  () => endDate.value,
  (newValue, oldValue) => {
    fetchData();
  }
);

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


// 订单操作-----------------------------------------------------------------------------------------------------------
const orderModifyDialog = ref<boolean>(false);
const orderModifyHeader = ref(null);
const orderModifyEntity = ref(null);

const orderModifyClick = async (event, item) => {
  const id = item.item.raw.id;
  orderModifyDialog.value = true;

  const response = await axios.post(BASE_URL + "/api/order/queryOne", {
    id: id
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  orderModifyHeader.value = response.data.data.headers;
  orderModifyEntity.value = response.data.data.entity;
  snackbarStore.showSuccessMessage(response.data.message);
  for (const ele of orderModifyHeader.value) {
    const key = ele.key;
    const title = ele.title;
    console.log(orderModifyEntity.value[key])
  }
}

const updateModifyClick = async () => {
  const response = await axios.post(BASE_URL + "/api/order/updateOne", {
    entity: orderModifyEntity.value
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  snackbarStore.showSuccessMessage(response.data.message);
  orderModifyDialog.value = false;
  fetchData();
}

const deleteModifyClick = async () => {
  const response = await axios.post(BASE_URL + "/api/order/deleteOne", {
    id: orderModifyEntity.value.id
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  snackbarStore.showSuccessMessage(response.data.message);
  orderModifyDialog.value = false;
  fetchData();
}

</script>
