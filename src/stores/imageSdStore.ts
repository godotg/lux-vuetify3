import {defineStore} from "pinia";


export const useImageSdStore = defineStore("imageSdStore", {
  state: () => ({
    sdPrompts: [],
    sdParameters: {
      prompt: "",
      negativePrompt: "",
      style: 0,
      step: 40,
      batchSize: 6,
      dimension: 1
    },
    sds: []
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["sdPrompts", "sdParameters", "sds"]}],
  },

  getters: {},

  actions: {}
});
