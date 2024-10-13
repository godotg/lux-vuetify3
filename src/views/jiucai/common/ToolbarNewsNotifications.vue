<!--
* @Component: ToolbarNotifications
* @Maintainer: J.K. Yang
* @Description:
-->
<script setup lang="ts">

</script>

<template>
  <v-btn v-if="newsStore.chatMessageIdDiff > 0" icon to="/square">
    <v-badge :content="newsStore.chatMessageIdDiff" color="primary">
      <v-icon>mdi-message-processing-outline</v-icon>
    </v-badge>
  </v-btn>
</template>
