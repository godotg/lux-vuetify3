import {defineStore} from "pinia";


export const useImageStore = defineStore("imageStore", {
  state: () => ({
    midPrompts: [],
    sdPrompts: [],
    sdParameters: {
      prompt: "",
      negativePrompt: "",
      style: 0,
      step: 20,
      batchSize: 1,
      dimension: 0
    },
    sds: [],
    downloads: []
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["midPrompts", "sdPrompts", "sdParameters", "sds", "downloads"]}],
  },

  getters: {},

  actions: {}
});
