import IByteBuffer from '../IByteBuffer';


class LlamaMessageAsk {

    requestSid: number = 0;
    requestId: number = 0;
    messages: Array<string> = [];

    static PROTOCOL_ID: number = 402;

    protocolId(): number {
        return LlamaMessageAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: LlamaMessageAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeStringList(packet.messages);
        buffer.writeInt(packet.requestId);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): LlamaMessageAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LlamaMessageAsk();
        const list0 = buffer.readStringList();
        packet.messages = list0;
        const result1 = buffer.readInt();
        packet.requestId = result1;
        const result2 = buffer.readLong();
        packet.requestSid = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LlamaMessageAsk;
