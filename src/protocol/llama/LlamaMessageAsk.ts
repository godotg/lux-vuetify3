import IByteBuffer from '../IByteBuffer';
import LlamaMessageRequest from './LlamaMessageRequest';


class LlamaMessageAsk {

    requestSid: number = 0;
    request: LlamaMessageRequest | null = null;

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
        buffer.writePacket(packet.request, 400);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): LlamaMessageAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LlamaMessageAsk();
        const result0 = buffer.readPacket(400);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LlamaMessageAsk;
