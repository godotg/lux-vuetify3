import {asyncAsk, isWebsocketReady, send} from "@/utils/websocket";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {isMobile} from "@/utils/common";
import _ from "lodash";

import ChatgptMessageRequest from "@/protocol/chatgpt/ChatgptMessageRequest";
import ChatgptForceStopRequest from "@/protocol/chatgpt/ChatgptForceStopRequest";
import ChatgptForceStopResponse from "@/protocol/chatgpt/ChatgptForceStopResponse";
import ChatgptMessage from "@/protocol/chatgpt/ChatgptMessage";

const snackbarStore = useSnackbarStore();
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

  const request = new ChatgptMessageRequest();
  request.mobile = isMobile();
  request.requestId = ++requestId;
  request.ai = ai;
  request.messages = messages;
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
