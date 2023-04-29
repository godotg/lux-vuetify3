import {asyncAsk, isWebsocketReady} from "@/utils/websocket";
import {useSnackbarStore} from "@/stores/snackbarStore";
import _ from "lodash";

import ChatMessageRequest from "@/protocol/chatgpt/ChatMessageRequest";
import ChatMessageResponse from "@/protocol/chatgpt/ChatMessageResponse";

const snackbarStore = useSnackbarStore();

export async function askChatgpt(messages) {
  if (!isWebsocketReady()) {
    snackbarStore.showErrorMessage("请稍等，无法连接服务器");
    return;
  }
  if (_.isEmpty(messages)) {
    snackbarStore.showErrorMessage("请输入聊天内容");
    return;
  }

  const request = new ChatMessageRequest();

  // const size = _.size(messages);
  // if (size < 2) {
  //   messages.forEach(it => request.messages.push(it.content));
  // } else {
  //   request.messages.push(messages[size - 2]);
  //   request.messages.push(messages[size - 1]);
  // }

  messages.forEach(it => request.messages.push(it.content));

  const response: ChatMessageResponse = await asyncAsk(request);
  return response;
}
