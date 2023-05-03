import {defineStore} from "pinia";
import _ from "lodash";

export const useNewsStore = defineStore("newsInfos", {
  state: () => ({
    gnInfos: [],
    newsInfos: []
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["newsInfos"]}],
  },

  getters: {},

  actions: {
    isNewGn(id: number): boolean {
      const index = _.findIndex(this.gnInfos, it => it.id == id);
      if (index >= 0) {
        const gn = this.gnInfos[index];
        if (new Date().getTime() - gn.time < 7 * 24 * 60 * 60 * 1000) {
          return true;
        } else {
          return false;
        }
      }

      if (this.gnInfos.length >= 50) {
        this.gnInfos = _.drop(this.gnInfos, 10);
      }

      this.gnInfos.push({
        id: id,
        time: new Date().getTime()
      });
      return true;
    },

    isNew(id: number): boolean {
      const index = _.findIndex(this.newsInfos, it => it.id == id);
      if (index >= 0) {
        const news = this.newsInfos[index];
        if (new Date().getTime() - news.time < 3 * 60 * 1000) {
          return true;
        } else {
          return false;
        }
      }

      if (this.newsInfos.length >= 500) {
        this.newsInfos = _.drop(this.newsInfos, 100);
      }

      this.newsInfos.push({
        id: id,
        time: new Date().getTime()
      });
      return true;
    },
  }
});
