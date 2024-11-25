import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import ChatgptMessage from './ChatgptMessage';


class ChatgptMessageRequest {
    requestId: number = 0;
    ai: number = 0;
    mobile: boolean = false;
    messages: Array<ChatgptMessage> = [];
    // 不需要哪些AI
    ignoreAIs: Set<number> = new Set();
    // google联网搜索
    googleSearch: boolean = false;
    // bing联网搜索
    bingSearch: boolean = false;
    // bilibili联网搜索
    bilibiliSearch: boolean = false;
    // 微信联网搜索
    weixinSearch: boolean = false;
}

export class ChatgptMessageRequestRegistration implements IProtocolRegistration<ChatgptMessageRequest> {
    protocolId(): number {
        return 230;
    }

    write(buffer: IByteBuffer, packet: ChatgptMessageRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        const beforeWriteIndex = buffer.getWriteOffset();
        buffer.writeInt(125);
        buffer.writeInt(packet.ai);
        buffer.writeIntSet(packet.ignoreAIs);
        buffer.writePacketList(packet.messages, 234);
        buffer.writeBool(packet.mobile);
        buffer.writeLong(packet.requestId);
        buffer.writeBool(packet.googleSearch);
        buffer.writeBool(packet.bingSearch);
        buffer.writeBool(packet.bilibiliSearch);
        buffer.writeBool(packet.weixinSearch);
        buffer.adjustPadding(125, beforeWriteIndex);
    }

    read(buffer: IByteBuffer): ChatgptMessageRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatgptMessageRequest();
        const result0 = buffer.readInt();
        packet.ai = result0;
        const set1 = buffer.readIntSet();
        packet.ignoreAIs = set1;
        const list2 = buffer.readPacketList(234);
        packet.messages = list2;
        const result3 = buffer.readBool(); 
        packet.mobile = result3;
        const result4 = buffer.readLong();
        packet.requestId = result4;
        if (buffer.compatibleRead(beforeReadIndex, length)) {
            const result5 = buffer.readBool(); 
            packet.googleSearch = result5;
        }
        if (buffer.compatibleRead(beforeReadIndex, length)) {
            const result6 = buffer.readBool(); 
            packet.bingSearch = result6;
        }
        if (buffer.compatibleRead(beforeReadIndex, length)) {
            const result7 = buffer.readBool(); 
            packet.bilibiliSearch = result7;
        }
        if (buffer.compatibleRead(beforeReadIndex, length)) {
            const result8 = buffer.readBool(); 
            packet.weixinSearch = result8;
        }
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatgptMessageRequest;