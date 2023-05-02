<template>
  <v-card class="mx-auto" max-width="700">

    <img class="white--text align-end" src="@/assets/tank/excel.jpg"/>

    <v-card-title>
      {{ $t("zp.createOrderFromExcel01") }}
    </v-card-title>

    <v-card-text>
      <v-file-input
        v-model="excelRef.excelFiles"
        multiple
        show-size
        prepend-icon="mdi-file-excel-outline"
        accept=".xls,.xlsx"
        :label="$t('zp.createOrderFromExcel02')"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn color="primary" variant="flat" @click="upload()">
        {{ $t("upload") }}
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script setup lang="ts">
import axios, {AxiosResponse} from "axios";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { BASE_URL, useZpAuthStore } from "@/stores/zpAuthStorage";
const zpAuthStore = useZpAuthStore();
const snackbarStore = useSnackbarStore();

const route = useRoute();

interface ExcelFiles {
  excelFiles: File[] | null
}

let excelFilesObj: ExcelFiles = {
  excelFiles: null
}

const excelRef = reactive(excelFilesObj);

const upload = async () => {
  if (excelRef.excelFiles === null) {
    return;
  }

  const formData = new FormData();
  for (const file of excelRef.excelFiles) {
    formData.append("files", file);
  }
  const response = await axios.post(BASE_URL + "/api/order/createFromExcel", formData, zpAuthStore.httpHeaders());

  const code = response.data.code;
  if (code != 1) {
    snackbarStore.showErrorMessage(response.data.message, code);
    return;
  }
  snackbarStore.showSuccessMessage(response.data.message);
}

</script>
