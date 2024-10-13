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
        buffer.writeInt(-1);
        buffer.writeInt(packet.ai);
        buffer.writeIntSet(packet.ignoreAIs);
        buffer.writePacketList(packet.messages, 234);
        buffer.writeBool(packet.mobile);
        buffer.writeLong(packet.requestId);
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
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChatgptMessageRequest;