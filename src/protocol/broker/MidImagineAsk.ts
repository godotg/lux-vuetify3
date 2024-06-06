import IByteBuffer from '../IByteBuffer';
import MidImagineRequest from '../midjourney/MidImagineRequest';

class MidImagineAsk {
    requestSid: number = 0;
    request: MidImagineRequest | null = null;

    static PROTOCOL_ID: number = 302;

    protocolId(): number {
        return MidImagineAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidImagineAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 270);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): MidImagineAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidImagineAsk();
        const result0 = buffer.readPacket(270);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidImagineAsk;