import IByteBuffer from '../IByteBuffer';

class TransferChatgptAsk {
    requestSid: number = 0;
    requestId: number = 0;
    chatAI: number = 0;
    messages: Array<string> = [];

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
        buffer.writeStringList(packet.messages);
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
        const list1 = buffer.readStringList();
        packet.messages = list1;
        const result2 = buffer.readLong();
        packet.requestId = result2;
        const result3 = buffer.readLong();
        packet.requestSid = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default TransferChatgptAsk;