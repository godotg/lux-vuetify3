import {defineStore} from "pinia";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const TokenKey = "zptoken";

export const useZpAuthStore = defineStore("zpAuth", {
  state: () => ({
    token: ""
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["token"]}],
  },

  getters: {},

  actions: {
    setToken(token: string) {
      this.token = token;
    },
    removeToken() {
      this.token = "";
    },
    httpHeaders() {
      return {
        headers: {
          "zptoken": this.token,
        },
      };
    }
  },
});
