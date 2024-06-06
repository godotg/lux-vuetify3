import IByteBuffer from '../IByteBuffer';
import MidSelectRequest from '../midjourney/MidSelectRequest';

class MidSelectAsk {
    requestSid: number = 0;
    request: MidSelectRequest | null = null;

    static PROTOCOL_ID: number = 305;

    protocolId(): number {
        return MidSelectAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidSelectAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 274);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): MidSelectAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidSelectAsk();
        const result0 = buffer.readPacket(274);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidSelectAsk;