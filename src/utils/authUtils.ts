
export const TokenKey = "zptoken";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getToken() {
    return null;
}

export function setToken(token) {
  return null;
}

export function removeToken() {
  return null;
}

export function httpHeaders() {
  return {
    headers: {
      "zptoken": getToken(),
    },
  };
}
