import {defineStore} from "pinia";


export const useImageStore = defineStore("imageStore", {
  state: () => ({
    midPrompts: [],
    sdPrompts: [],
    downloads: [],
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["midPrompts", "sdPrompts", "downloads"]}],
  },

  getters: {},

  actions: {
  }
});
