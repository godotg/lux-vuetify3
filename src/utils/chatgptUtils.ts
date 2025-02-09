import {asyncAsk, isWebsocketReady, send} from "@/utils/websocket";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {useMyStore} from "@/stores/myStore";
import {isMobile} from "@/utils/common";
import _ from "lodash";

import ChatgptMessageRequest from "@/protocol/chatgpt/ChatgptMessageRequest";
import ChatgptForceStopRequest from "@/protocol/chatgpt/ChatgptForceStopRequest";
import ChatgptForceStopResponse from "@/protocol/chatgpt/ChatgptForceStopResponse";
import ChatgptMessage from "@/protocol/chatgpt/ChatgptMessage";

const snackbarStore = useSnackbarStore();
const myStore = useMyStore();

let requestId = 0;

export function sendChatgpt(messages: Array<ChatgptMessage>, ai) {
  if (_.isEmpty(messages)) {
    snackbarStore.showErrorMessage("请输入聊天内容");
    return;
  }

  if (!isWebsocketReady()) {
    snackbarStore.showErrorMessage("请稍等，无法连接服务器");
    return;
  }

  const ignoreAIs = new Set<number>();
  if (!myStore.chatgpt) {
    ignoreAIs.add(1);
  }
  if (!myStore.xunfei) {
    ignoreAIs.add(1000);
  }
  if (!myStore.baidu) {
    ignoreAIs.add(2000);
  }
  if (!myStore.tencent) {
    ignoreAIs.add(3000);
  }
  if (!myStore.alibaba) {
    ignoreAIs.add(4000);
  }
  if (!myStore.deepseek) {
    ignoreAIs.add(5000);
  }
  if (!myStore.llama) {
    ignoreAIs.add(14000);
  }
  if (!myStore.google) {
    ignoreAIs.add(15000);
  }

  const characters: Map<number, string> = new Map();
  if (!_.isEmpty(myStore.chatgptCharacter)) {
    characters.set(1, myStore.chatgptCharacter)
  }
  if (!_.isEmpty(myStore.xunfeiCharacter)) {
    characters.set(1000, myStore.xunfeiCharacter)
  }
  if (!_.isEmpty(myStore.baiduCharacter)) {
    characters.set(2000, myStore.baiduCharacter)
  }
  if (!_.isEmpty(myStore.tencentCharacter)) {
    characters.set(3000, myStore.tencentCharacter)
  }
  if (!_.isEmpty(myStore.alibabaCharacter)) {
    characters.set(4000, myStore.alibabaCharacter)
  }
  if (!_.isEmpty(myStore.deepseekCharacter)) {
    characters.set(5000, myStore.deepseekCharacter)
  }
  if (!_.isEmpty(myStore.llamaCharacter)) {
    characters.set(14000, myStore.llamaCharacter)
  }
  if (!_.isEmpty(myStore.googleCharacter)) {
    characters.set(15000, myStore.googleCharacter)
  }

  const request = new ChatgptMessageRequest();
  request.mobile = isMobile();
  request.requestId = ++requestId;
  request.ai = ai;
  request.messages = messages;
  request.characters = characters;
  request.ignoreAIs = ignoreAIs;
  request.googleSearch = myStore.googleSearch;
  request.bingSearch = myStore.bingSearch;
  request.weixinSearch = myStore.weixinSearch;
  request.bilibiliSearch = myStore.bilibiliSearch;

  send(request);
}


export async function forceStopChatgpt() {
  if (requestId <= 0) {
    return;
  }
  const request = new ChatgptForceStopRequest();
  request.requestId = requestId;
  const answer: ChatgptForceStopResponse = await asyncAsk(request);
  console.log(answer);
}
