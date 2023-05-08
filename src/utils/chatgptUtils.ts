import {send, isWebsocketReady} from "@/utils/websocket";
import {useSnackbarStore} from "@/stores/snackbarStore";
import { isMobile } from "@/utils/common";
import _ from "lodash";

import ChatgptMessageRequest from "@/protocol/chatgpt/ChatgptMessageRequest";

const snackbarStore = useSnackbarStore();
let requestId = 1;

export function sendChatgpt(messages) {
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
  request.requestId = requestId++;

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

const mdEnd = "\n```\n";

/**
 * 格式化stream的返回message，自动不全md文档
 * @param message old choice
 * @param choice new choice
 */
export function formatChatgptMarkdown(message: string, choice: string): string {
  if (choice.startsWith("```")) {
    message = message + choice + mdEnd;
  } else if (choice.startsWith("``")) {
    message = message + "\n";
  } else if (choice.startsWith("`\n")) {
    // do nothing
  } else if (message.endsWith(mdEnd)) {
    message = message.substring(0, message.lastIndexOf(mdEnd)) + choice + mdEnd;
  } else {
    message = message + choice;
  }
  console.log(message);
  return message;
}
