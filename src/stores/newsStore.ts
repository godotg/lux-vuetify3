import {defineStore} from "pinia";
import _ from "lodash";

const newGnTimeout = 3 * 24 * 60 * 60 * 1000;
const newNewsTimeout = 3 * 60 * 1000;
const myAvatarDefault = avatarAutoUrl(1);
const aiAvatarDefault = avatarAutoUrl(2);

export function avatarAutoUrl(id: number): string {
  const avatarId = id % 800 + 1;
  const avatar = "ab/" + avatarId + ".jpg";
  return avatar;
}

export const useNewsStore = defineStore("newsStore", {
  state: () => ({
    gnInfos: [],
    newsInfos: [],
    newsLevelFilter: "D",
    newsLevelFilterValue: 5,

    ipLong: 0,
    sid: 0,
    activeUid: 0,
  }),

  persist: {
    enabled: true,
    strategies: [{storage: localStorage, paths: ["newsInfos", "gnInfos", "newsLevelFilter", "newsLevelFilterValue"]}],
  },

  getters: {},

  actions: {
    isNewGn(id: number): boolean {
      const index = _.findIndex(this.gnInfos, it => it.id == id);
      if (index >= 0) {
        const gn = this.gnInfos[index];
        if (new Date().getTime() - gn.time < newGnTimeout) {
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
        if (new Date().getTime() - news.time < newNewsTimeout) {
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

    totalNewNews(): number {
      const currentTime = new Date().getTime();
      const total = this.newsInfos.filter(it => currentTime - it.time < newNewsTimeout).length;
      return total;
    },

    updateNewsLevelFilter(level: string, value: number) {
      this.newsLevelFilter = level;
      this.newsLevelFilterValue = value;
    },

    myAvatar(): string {
      return this.ipLong == 0 ? myAvatarDefault : avatarAutoUrl(this.ipLong);
    },
    aiAvatar(): string {
      return this.ipLong == 0 ? aiAvatarDefault : avatarAutoUrl(this.ipLong + 1);
    },
  }
});
