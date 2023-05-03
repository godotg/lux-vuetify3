import {defineStore} from "pinia";
import _ from "lodash";

export const useNewsStore = defineStore("newsInfos", {
  state: () => ({
    newsInfos: []
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["newsInfos"]}],
  },

  getters: {},

  actions: {
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

      if (this.newsInfos.length >= 1000) {
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
