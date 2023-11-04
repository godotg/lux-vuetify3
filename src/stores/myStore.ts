import {defineStore} from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    isShowReward: false,
    lastForceShow: 0,
    announce: {
      version: "",
      title: "",
      content: ""
    },
    account: {
      cost: 0
    }
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["announce", "account", "lastForceShow"]}],
  },

  getters: {},

  actions: {}
});
