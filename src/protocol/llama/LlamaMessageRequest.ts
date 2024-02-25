import IByteBuffer from '../IByteBuffer';


class LlamaMessageRequest {

    requestId: number = 0;
    messages: Array<string> = [];

    static PROTOCOL_ID: number = 400;

    protocolId(): number {
        return LlamaMessageRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: LlamaMessageRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeStringList(packet.messages);
        buffer.writeInt(packet.requestId);
    }

    static read(buffer: IByteBuffer): LlamaMessageRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LlamaMessageRequest();
        const list0 = buffer.readStringList();
        packet.messages = list0;
        const result1 = buffer.readInt();
        packet.requestId = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LlamaMessageRequest;
