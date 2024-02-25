import IByteBuffer from '../IByteBuffer';


class LlamaMessageNotice {

    requestId: number = 0;
    choice: string = '';

    static PROTOCOL_ID: number = 401;

    protocolId(): number {
        return LlamaMessageNotice.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: LlamaMessageNotice | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.choice);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: IByteBuffer): LlamaMessageNotice | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LlamaMessageNotice();
        const result0 = buffer.readString();
        packet.choice = result0;
        const result1 = buffer.readInt();
        packet.requestId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LlamaMessageNotice;
