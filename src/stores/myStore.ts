import {defineStore} from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    announce: {
      version: "",
      title: "",
      content: ""
    }
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["announce"]}],
  },

  getters: {},

  actions: {}
});
