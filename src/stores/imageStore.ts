import {defineStore} from "pinia";


export const useImageStore = defineStore("imageStore", {
  state: () => ({
    midPrompts: [],
    sdPrompts: [],
    sdParameters: {
      prompt: "",
      negativePrompt: "",
      style: 0,
      step: 40,
      batchSize: 6,
      dimension: 1
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
