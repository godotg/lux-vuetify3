import ByteBuffer from '@/protocol/buffer/ByteBuffer';
import SignalAttachment from '@/protocol/attachment/SignalAttachment';
import ProtocolManager from '@/protocol/ProtocolManager';
import Ping from '@/protocol/common/Ping';
import Pong from '@/protocol/common/Pong';
import ChatBotRegisterRequest from '@/protocol/simulator/ChatBotRegisterRequest';
import ChatBotRegisterResponse from '@/protocol/simulator/ChatBotRegisterResponse';


import {useSnackbarStore} from "@/stores/snackbarStore";
import {useNewsStore} from "@/stores/newsStore";
const snackbarStore = useSnackbarStore();
const newsStore = useNewsStore();

const wsUrl: string = import.meta.env.VITE_API_BASE_URL_CHAT_BOT;
let pingTime: number = 0;
let ws: WebSocket = connect("init chat bot websocket");
let uuid: number = 0;

const signalAttachmentMap: Map<number, EncodedPacketInfo> = new Map<number, EncodedPacketInfo>();

setInterval(() => reconnect(), 30 * 1000);

// 如果服务器长时间没有回应，则重新连接
function reconnect() {
  if (new Date().getTime() - pingTime < 3 * 60 * 1000) {
    // 每30秒发送一次心跳包
    sendChatBot(new Ping())
    return;
  }
  console.log("正在连接Chat Bot服务器");
  ws.close(3999);
  ws = connect("timeout and reconnect chat bot");
}

// readyState的状态码定义
// 0 (CONNECTING)，正在链接中
// 1 (OPEN)，已经链接并且可以通讯
// 2 (CLOSING)，连接正在关闭
// 3 (CLOSED)，连接已关闭或者没有链接成功
function connect(desc): WebSocket {
  console.log(new Date(), 'start connect chat bot websocket: ' + desc);

  const webSocket = new WebSocket(wsUrl);

  webSocket.binaryType = 'arraybuffer';

  webSocket.onopen = async function () {
    console.log(new Date(), 'chat bot websocket open success');

    // websocket连接成功过后，先发送ping同步服务器时间，再发送登录请求
    sendChatBot(new Ping());

    pingTime = new Date().getTime();
    snackbarStore.showSuccessMessage("连接ChatBot服务器成功，开始白嫖之旅");
    newsStore.online = true;

    // 登录
    const chatBotRegisterRequest = new ChatBotRegisterRequest();
    const chatBotRegisterResponse: ChatBotRegisterResponse = await asyncAsk(chatBotRegisterRequest);
    console.log("机器人注册成功", chatBotRegisterResponse);
  };


  webSocket.onmessage = function (event) {
    const data = event.data;

    const buffer = new ByteBuffer();
    buffer.writeBytes(data as ArrayBuffer);
    buffer.setReadOffset(4);
    const packet = ProtocolManager.read(buffer);


    let attachment: any = null;
    if (buffer.isReadable() && buffer.readBoolean()) {
      console.log(new Date(), "Chat Bot Websocket收到异步answer <-- ", packet);
      attachment = ProtocolManager.read(buffer);
      const encodedPacketInfo = signalAttachmentMap.get(attachment.signalId);
      if (encodedPacketInfo == undefined) {
        throw "Chat Bot可能消息超时找不到对应的SignalAttachment:" + attachment;
      }
      encodedPacketInfo.promiseResolve(packet);
      return;
    }
    console.log(new Date(), "Chat Bot Websocket收到同步response <-- ", packet);
    if (packet.protocolId() == Pong.PROTOCOL_ID) {
      if (Number.isInteger(packet.time)) {
        pingTime = packet.time;
      } else {
        pingTime = Number.parseInt(packet.time);
      }
      return;
    }

    route(packet);
  };

  webSocket.onerror = function (event) {
    console.log(new Date(), 'chat bot websocket error', event);
    newsStore.online = true;
  };

  webSocket.onclose = function (event) {
    console.log(new Date(), 'chat bot websocket close', event);
    newsStore.online = true;
  };
  return webSocket;
}

export function isWebsocketReadyChatBot(): boolean {
  return ws.readyState == 1;
}

export function sendChatBot(packet: any, attachment: any = null) {
  switch (ws.readyState) {
    case 0:
      console.log(new Date(), "0, ws chatbot connecting server");
      break;
    case 1:
      const buffer = new ByteBuffer();
      buffer.setWriteOffset(4);
      ProtocolManager.write(buffer, packet);
      if (attachment == null) {
        buffer.writeBoolean(false);
        console.log(new Date(), "Chat Bot Websocket发送同步request --> ", packet)
      } else {
        buffer.writeBoolean(true);
        ProtocolManager.write(buffer, attachment)
        console.log(new Date(), "Chat BOt Websocket发送异步request --> ", packet)
      }
      const writeOffset = buffer.writeOffset;
      buffer.setWriteOffset(0);
      buffer.writeRawInt(writeOffset - 4);
      buffer.setWriteOffset(writeOffset);
      ws.send(buffer.buffer);
      break;
    case 2:
      pingTime = pingTime - 60 * 1000;
      console.log(new Date(), "2, chat bot ws is closing, trying to reconnect");
      break;
    case 3:
      pingTime = pingTime - 60 * 1000;
      console.log(new Date(), "3, chat bot ws is closing, trying to reconnect");
      break;
    default:
      console.log(new Date(), "4, chat bot chat bot server error");
  }
}

class EncodedPacketInfo {
  promiseResolve: any;
  promiseReject: any;
  attachment: SignalAttachment | null = null;
}

export async function asyncAsk(packet: any): Promise<any> {
  const currentTime = new Date().getTime();
  const attachment: SignalAttachment = new SignalAttachment();
  uuid++;
  const signalId = uuid;
  attachment.timestamp = currentTime;
  attachment.signalId = signalId;
  attachment.taskExecutorHash = -1;
  attachment.client = 12;
  const encodedPacketInfo = new EncodedPacketInfo();
  encodedPacketInfo.attachment = attachment;
  const promise = new Promise((resolve, reject) => {
    encodedPacketInfo.promiseResolve = resolve;
    encodedPacketInfo.promiseReject = reject;
  });
  // 遍历删除旧的attachment
  const deleteList = new Array<number>();
  signalAttachmentMap.forEach((value, key) => {
    if (value == null || value.attachment == null) {
      deleteList.push(key);
    }
    const att = value.attachment;
    if (att == null) {
      deleteList.push(key);
    }
    const time = att == null ? 0 : att.timestamp;
    if (currentTime - time > 60000) {
      deleteList.push(key);
    }
  });
  deleteList.forEach(it => signalAttachmentMap.delete(it));
  signalAttachmentMap.set(signalId, encodedPacketInfo);
  sendChatBot(packet, attachment);
  return promise;
}

const receiverMap = new Map<number, any>();
function route(packet: any) {
  const receiver = receiverMap.get(packet.protocolId());
  if (receiver == null) {
    console.log("chat bot router not exist ", packet);
    return;
  }
  receiver(packet);
}


export function registerPacketReceiverChatBot(protocolId: number, fun: any) {
  receiverMap.set(protocolId, fun);
}
