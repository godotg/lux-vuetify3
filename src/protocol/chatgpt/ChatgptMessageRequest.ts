import IByteBuffer from '../IByteBuffer';
import ChatgptMessage from './ChatgptMessage';

class ChatgptMessageRequest {
    requestId: number = 0;
    ai: number = 0;
    mobile: boolean = false;
    messages: Array<ChatgptMessage> = [];
    // 不需要哪些AI
    ignoreAIs: Set<number> = new Set();

    static PROTOCOL_ID: number = 230;

    protocolId(): number {
        return ChatgptMessageRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: ChatgptMessageRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        const beforeWriteIndex = buffer.getWriteOffset();
        buffer.writeInt(121);
        buffer.writeInt(packet.ai);
        buffer.writePacketList(packet.messages, 234);
        buffer.writeBoolean(packet.mobile);
        buffer.writeLong(packet.requestId);
        buffer.writeIntSet(packet.ignoreAIs);
        buffer.adjustPadding(121, beforeWriteIndex);
    }

    static read(buffer: IByteBuffer): ChatgptMessageRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChatgptMessageRequest();
        const result0 = buffer.readInt();
        packet.ai = result0;
        const list1 = buffer.readPacketList(234);
        packet.messages = list1;
        const result2 = buffer.readBoolean(); 
        packet.mobile = result2;
        const result3 = buffer.readLong();
        packet.requestId = result3;
        if (buffer.compatibleRead(beforeReadIndex, length)) {
            const set4 = buffer.readIntSet();
            packet.ignoreAIs = set4;
        }
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatgptMessageRequest;