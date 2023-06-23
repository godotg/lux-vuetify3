import {defineStore} from "pinia";
import _ from "lodash";


export const useImageStore = defineStore("imageStore", {
  state: () => ({
    midPrompts: [],
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["midPrompts"]}],
  },

  getters: {},

  actions: {
  }
});
