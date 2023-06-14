import {isWebsocketReady, send} from "@/utils/websocket";
import {useSnackbarStore} from "@/stores/snackbarStore";
import {isMobile} from "@/utils/common";
import _ from "lodash";

import ChatgptMessageRequest from "@/protocol/chatgpt/ChatgptMessageRequest";
import ChatgptForceStopRequest from "@/protocol/chatgpt/ChatgptForceStopRequest";

const snackbarStore = useSnackbarStore();
let requestId = 0;

export function sendChatgpt(messages, ai) {
  if (!isWebsocketReady()) {
    snackbarStore.showErrorMessage("请稍等，无法连接服务器");
    return;
  }
  if (_.isEmpty(messages)) {
    snackbarStore.showErrorMessage("请输入聊天内容");
    return;
  }

  const request = new ChatgptMessageRequest();
  request.mobile = isMobile();
  requestId++;
  request.requestId = requestId;
  request.ai = ai;

  // const size = _.size(messages);
  // if (size < 2) {
  //   messages.forEach(it => request.messages.push(it.content));
  // } else {
  //   request.messages.push(messages[size - 2]);
  //   request.messages.push(messages[size - 1]);
  // }

  messages.forEach(it => request.messages.push(it.content));

  send(request);
}


export function forceStopChatgpt() {
  if (requestId <= 0) {
    return;
  }
  const request = new ChatgptForceStopRequest();
  request.requestId = requestId;
  send(request);
}
