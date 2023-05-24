import {defineStore} from "pinia";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const TokenKey = "zptoken";

export const useZpAuthStore = defineStore("zpAuth", {
  state: () => ({
    token: "",
    selectedHeaders: []
  }),

  persist: {
    enabled: true,
    strategies: [
      {storage: sessionStorage, paths: ["token"]},
      {storage: localStorage, paths: ["selectedHeaders"]}
    ],
  },

  getters: {},

  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setSelectedHeaders(selected) {
      this.selectedHeaders = selected
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
