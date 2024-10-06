import {defineStore} from "pinia";

export const useMyStore = defineStore("myStore", {
  state: () => ({
    rewardTipDialog: false,
    lastForceShow: 0,
    announce: {
      version: "",
      name: "",
      board: ""
    },

    loginDialog: false,
    token: "",
    user: {
      id: 0,
      name: "",
      ctime: 0,
      cost: 0
    },
    propmpt: "",
    baidu: true,
    xunfei: true,
    tencent: true,
    alibaba: true,
    google: true,
    llama: true
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["announce", "token", "user", "lastForceShow", "propmpt", "baidu", "xunfei", "llama"]}],
  },

  getters: {},

  actions: {}
});
