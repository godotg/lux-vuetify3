import {defineStore} from "pinia";


export const useImageStore = defineStore("imageStore", {
  state: () => ({
    midPrompts: [],
    sdPrompts: [],
    sdParameters: null,
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
