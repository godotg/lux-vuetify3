import IByteBuffer from '../IByteBuffer';
import ChatgptMessage from './ChatgptMessage';

class TransferChatgptAsk {
    requestSid: number = 0;
    requestId: number = 0;
    chatAI: number = 0;
    messages: Array<ChatgptMessage> = [];
    ignoreAIs: Set<number> = new Set();

    static PROTOCOL_ID: number = 402;

    protocolId(): number {
        return TransferChatgptAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: TransferChatgptAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.chatAI);
        buffer.writeIntSet(packet.ignoreAIs);
        buffer.writePacketList(packet.messages, 234);
        buffer.writeLong(packet.requestId);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): TransferChatgptAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new TransferChatgptAsk();
        const result0 = buffer.readInt();
        packet.chatAI = result0;
        const set1 = buffer.readIntSet();
        packet.ignoreAIs = set1;
        const list2 = buffer.readPacketList(234);
        packet.messages = list2;
        const result3 = buffer.readLong();
        packet.requestId = result3;
        const result4 = buffer.readLong();
        packet.requestSid = result4;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default TransferChatgptAsk;