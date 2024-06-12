import {defineStore} from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    isShowReward: false,
    lastForceShow: 0,
    announce: {
      version: "",
      name: "",
      board: ""
    },
    account: {
      cost: 0
    },
    propmpt: "",
    baidu: true,
    xunfei: true,
    llama: true
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["announce", "account", "lastForceShow", "propmpt", "baidu", "xunfei", "llama"]}],
  },

  getters: {},

  actions: {}
});
