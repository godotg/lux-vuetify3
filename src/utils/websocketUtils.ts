import ByteBuffer from '@/protocol/buffer/ByteBuffer';
import ProtocolManager from '@/protocol/ProtocolManager.js';
import Error from '@/protocol/common/Error.js';
import Message from '@/protocol/common/Message.js';
import Ping from '@/protocol/common/Ping';
import Pong from '@/protocol/common/Pong';
import _ from "lodash";
import {useSnackbarStore} from "@/stores/snackbarStore";

const snackbarStore = useSnackbarStore();


class MyWebsocket {
  ws: WebSocket | null = null;
  token: string | null = null;
  wsUrl: string = "";
  serverTime: number = new Date().getTime();
}

export const websocket = new MyWebsocket();

websocket.wsUrl = import.meta.env.VITE_API_BASE_URL;


// 每30秒发送一次心跳包
setInterval(function () {
  // 如果没有登录，则不需要发送心跳包
  if (websocket.token == null) {
    return;
  }

  if (_.isEmpty(websocket.wsUrl)) {
    return;
  }

  // 如果服务器长时间没有回应，则重新连接
  if (new Date().getTime() - websocket.serverTime >= 3 * 60 * 1000) {
    connect('服务器长时间没有相应，进行重连尝试');
    return;
  }

  sendPacket(new Ping());
}, 30000);

// readyState的状态码定义
// 0 (CONNECTING)，正在链接中
// 1 (OPEN)，已经链接并且可以通讯
// 2 (CLOSING)，连接正在关闭
// 3 (CLOSED)，连接已关闭或者没有链接成功
export function connect(desc) {
  console.log('start connect websocket: ' + desc);

  closeWebsocket();

  // const ws = new WebSocket('ws://127.0.0.1:9000/websocket');
  const ws = new WebSocket(websocket.wsUrl);
  websocket.ws = ws;

  ws.binaryType = 'arraybuffer';

  ws.onopen = function () {
    console.log('websocket open success');

    // websocket连接成功过后，先发送ping同步服务器时间，再发送登录请求
    sendPacket(new Ping());

    snackbarStore.showSuccessMessage("连接服务器成功");
    websocket.serverTime = new Date().getTime();
  };


  ws.onmessage = function (event) {
    const data = event.data;

    const byteBuffer = new ByteBuffer();
    byteBuffer.writeBytes(data);
    byteBuffer.setReadOffset(4);
    const packet = ProtocolManager.read(byteBuffer);
    byteBuffer.readBoolean();
    console.log('Websocket收到:', packet);
    if (packet.protocolId() == Pong.PROTOCOL_ID) {
      websocket.serverTime = _.toNumber(packet.time);
    } else if (packet.protocolId() == Message.PROTOCOL_ID) {
      if (packet.code == 1) {
        snackbarStore.showSuccessMessage(packet.message);
      } else if (packet.code == 2) {
        // do noting
      } else {
        snackbarStore.showErrorMessage(packet.message);
      }
    } else if (packet.protocolId() == Error.PROTOCOL_ID) {
      snackbarStore.showErrorMessage(packet.messerrorMessageage);
    } else {
      ProtocolManager.getProtocol(packet.protocolId()).receiver(packet);
    }
  };

  ws.onerror = function (event) {
    console.log('websocket error');
    console.log(event);
  };

  ws.onclose = function (event) {
    console.log('websocket close');
    console.log(event);
  };
}

export function closeWebsocket() {
  if (websocket.ws == null) {
    return;
  }
  if (websocket.ws.readyState == 0 || websocket.ws.readyState == 1) {
    websocket.ws.close();
    return;
  }
  websocket.ws = null;
}

export function sendPacket(packet) {
  console.log('Websocket发送:', packet);

  if (_.isNil(websocket.ws)) {
    connect('发送消息的时候ws是空的，重连ws');
    return;
  }

  switch (websocket.ws.readyState) {
    case 0:
      snackbarStore.showSuccessMessage("正在连接服务器");
      break;
    case 1:
      // eslint-disable-next-line no-case-declarations
      const byteBuffer = new ByteBuffer();
      byteBuffer.setWriteOffset(4);
      ProtocolManager.write(byteBuffer, packet);
      byteBuffer.writeBoolean(false);
      // eslint-disable-next-line no-case-declarations
      const writeOffset = byteBuffer.writeOffset;
      byteBuffer.setWriteOffset(0);
      byteBuffer.writeRawInt(writeOffset - 4);
      byteBuffer.setWriteOffset(writeOffset);
      websocket.ws.send(byteBuffer.buffer);
      break;
    case 2:
      snackbarStore.showErrorMessage("正在连接服务器");
      connect('发送消息的时候ws正在关闭，进行重连尝试');
      break;
    case 3:
      snackbarStore.showErrorMessage("正在连接服务器");
      connect('发送消息的时候ws连接关闭，进行重连尝试');
      break;
    default:
      snackbarStore.showErrorMessage("服务器异常");
  }
}


export function packetReceiver(protocol, receiverCallback) {
  if (_.isNil(protocol.receiver)) {
    protocol.receiver = receiverCallback;
  }
}
