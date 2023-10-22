<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">
import StatusMenu from "./StatusMenu.vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import StatusMenuJiucai from "./StatusMenuJiucai.vue";
import {useNewsStore} from "@/stores/newsStore";
const newsStore = useNewsStore();

const router = useRouter();

const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
  console.log("---");
  console.log(router);
};

const navs = [
  {
    title: "jiucai.profileDetails",
    link: "/team",
    icon: "mdi-account-box-outline",
  },
  {
    title: "jiucai.billing",
    link: "/team",
    icon: "mdi-credit-card-outline",
  },
  {
    title: "jiucai.team",
    link: "/team",
    icon: "mdi-account-group-outline",
  },
  {
    title: "jiucai.ask",
    link: "/ask-the-community",
    icon: "mdi-help-circle-outline",
  },
];
</script>

<template>
  <v-menu
    :close-on-content-click="false"
    location="bottom right"
    transition="slide-y-transition"
  >
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="2" :color="newsStore.online ? 'success' : 'error'" dot bordered>
          <v-avatar size="40">
            <v-img
              :src="newsStore.myAvatar()"
            ></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- ---------------------------------------------- -->
        <!-- Profile Area -->
        <!-- ---------------------------------------------- -->
        <v-list-item to="/profile">
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img
                :src="newsStore.myAvatar()"
              ></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            {{ newsStore.activeUid }}
            <StatusMenuJiucai />
          </v-list-item-title>
          <v-list-item-subtitle>
            <!-- {{ $store.state.user.email  }} -->
            {{ newsStore.ip }}
          </v-list-item-subtitle>
          <v-list-item-subtitle style="font-size: 9px">
            {{ newsStore.region }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Menu Area -->
      <!-- ---------------------------------------------- -->

      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item
          color="primary"
          v-for="(nav, i) in navs"
          :key="i"
          :to="nav.link"
          link
          density="compact"
        >
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>{{ nav.icon }}</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">{{
              $t(nav.title)
            }}</v-list-item-subtitle>
          </div>
        </v-list-item>
        <v-list-item color="primary" href="https://github.com/yangjiakai/lux-admin-vuetify3" link density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-vuetify</v-icon>
            </v-avatar>
          </template>
          <div>
            <v-list-item-subtitle class="text-body-2">{{ $t("jiucai.frontendGithub") }}</v-list-item-subtitle>
          </div>
        </v-list-item>
        <v-list-item color="primary" href="https://github.com/zfoo-project/zfoo" link density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-github</v-icon>
            </v-avatar>
          </template>
          <div>
            <v-list-item-subtitle class="text-body-2">{{ $t("jiucai.backendGithub") }}</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
      <v-divider />
    </v-card>
  </v-menu>
</template>

<style scoped lang="scss">
// ::v-deep .v-list-item__append,
// ::v-deep .v-list-item__prepend {
//   height: 100%;
// }
</style>
