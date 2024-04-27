import IByteBuffer from '../IByteBuffer';


class SpiderChatAsk {

    requestId: number = 0;
    message: string = '';

    static PROTOCOL_ID: number = 1010;

    protocolId(): number {
        return SpiderChatAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SpiderChatAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.message);
        buffer.writeLong(packet.requestId);
    }

    static read(buffer: IByteBuffer): SpiderChatAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SpiderChatAsk();
        const result0 = buffer.readString();
        packet.message = result0;
        const result1 = buffer.readLong();
        packet.requestId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SpiderChatAsk;
