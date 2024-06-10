import IByteBuffer from '../IByteBuffer';
import MidInpaintRequest from '../midjourney/MidInpaintRequest';

class MidInpaintAsk {
    requestSid: number = 0;
    request: MidInpaintRequest | null = null;

    static PROTOCOL_ID: number = 308;

    protocolId(): number {
        return MidInpaintAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidInpaintAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 277);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): MidInpaintAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidInpaintAsk();
        const result0 = buffer.readPacket(277);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidInpaintAsk;