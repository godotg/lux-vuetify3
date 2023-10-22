import MidRerollRequest from '../midjourney/MidRerollRequest';


class MidRerollAsk {

    requestSid: number = 0;
    request: MidRerollRequest | null = null;

    static PROTOCOL_ID: number = 304;

    protocolId(): number {
        return MidRerollAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidRerollAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 273);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: any): MidRerollAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidRerollAsk();
        const result0 = buffer.readPacket(273);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidRerollAsk;
