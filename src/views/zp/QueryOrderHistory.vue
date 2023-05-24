<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-select
          v-model="selectOrderModifyType"
          :items="orderTypes"
          @update:modelValue="query()"
          density="compact"></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-list density="compact">
          <v-list-item
            v-for="(item, i) in histories"
            :key="i"
            active-color="primary"
            @click="queryOneHistoryClick(item.id)"
          >
            <template v-slot:prepend>
              <v-icon v-if="item.historyType == 1" icon="mdi-bookmark-plus-outline" color="success"></v-icon>
              <v-icon v-else-if="item.historyType == 2" icon="mdi-refresh" color="info"></v-icon>
              <v-icon v-else icon="mdi-minus-circle-outline" color="error"></v-icon>

              <v-chip size="x-small">
                {{ parseTime(item.time) }}
              </v-chip>

              <v-chip class="ma-2" size="x-small">
                {{ item.account }}
              </v-chip>

              <v-chip class="ma-2" size="x-small">
                {{ item.id }}
              </v-chip>

              <v-chip class="ma-2" size="x-small">
                {{ item.orderId }}
              </v-chip>
            </template>

          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-dialog v-model="orderModifyDialog" max-width="800">
      <v-card>
        <v-card-title>
          操作日志记录
        </v-card-title>
        <v-card-text>
          <v-row v-if="!_.isNil(orderModifyEntity)">
            <template v-for="header in orderModifyHeader">
              <v-col cols="4">
                <v-text-field v-model="orderModifyEntity[header.key]" :value="orderModifyEntity[header.key]"
                              :hint="header.title"
                              persistent-hint
                              disabled
                              color="primary"></v-text-field>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
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

const selectOrderModifyType = ref('全部');
const orderTypes = ref(['全部', '增加', '修改', '删除']);
const histories = ref([]);


const selected = ref([]);


const fetchData = async () => {
  let historyTypeInt = 0;
  if (selectOrderModifyType.value == "全部") {
  } else if (selectOrderModifyType.value == "增加") {
    historyTypeInt = 1;
  } else if (selectOrderModifyType.value == "修改") {
    historyTypeInt = 2;
  } else if (selectOrderModifyType.value == "删除") {
    historyTypeInt = 3;
  }

  const response = await axios.post(BASE_URL + "/api/order/queryHistory", {
    historyType: historyTypeInt
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    return;
  }

  const data = response.data.data;
  console.log(data);
  histories.value = data.histories;
  snackbarStore.showSuccessMessage(response.data.message);
}



onMounted(() => {
  fetchData();
});

function parseTime(time): string {
  console.log(time)
  const format = '{y}-{m}-{d} {h}:{i}:{s}';
  const date = new Date(_.toNumber(time));
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value;
  });
  return time_str;
}


// 订单操作-----------------------------------------------------------------------------------------------------------
const orderModifyDialog = ref<boolean>(false);
const orderModifyHeader = ref(null);
const orderModifyEntity = ref(null);

const queryOneHistoryClick = async (id) => {
  orderModifyDialog.value = true;
  const response = await axios.post(BASE_URL + "/api/order/queryOneHistory", {
    id: id
  }, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  snackbarStore.showSuccessMessage(response.data.message);
  orderModifyHeader.value = response.data.data.headers;
  orderModifyEntity.value = response.data.data.entity;
}


</script>
