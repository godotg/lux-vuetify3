<script setup lang="ts">
import {useMyStore} from "@/stores/myStore";
import MdEditor from "md-editor-v3";
import axios from "axios";
import _ from "lodash";
const myStore = useMyStore();

const dialogRef = ref<boolean>(false);

onMounted(async () => {
  const response = await axios.get("https://jiucai.fun/aa/config/myconfig.json");
  console.log(response);
  const announcement = response.data;
  myStore.announce = announcement;
  if (_.isEqual(announcement.version, myStore.announce.version)) {
    return;
  }
  dialogRef.value = true;
});


</script>
<template>
  <v-dialog transition="dialog-top-transition" max-width="700px" v-model="dialogRef">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-trumpet">
        <template v-slot:title>
          {{ myStore.announce.title }}
        </template>
        <v-card-text>
          <md-editor v-model="myStore.announce.content" previewOnly/>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
