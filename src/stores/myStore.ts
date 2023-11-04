import {defineStore} from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    isShowReward: true,
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
    strategies: [{storage: localStorage, paths: ["announce", "account"]}],
  },

  getters: {},

  actions: {}
});
