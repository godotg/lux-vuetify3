import MidRerollRequest from '../midjourney/MidRerollRequest';


class MidRerollAsk {

    requestSid: number = 0;
    request: MidRerollRequest | null = null;

    static PROTOCOL_ID: number = 304;

    protocolId(): number {
        return MidRerollAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidRerollAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.request, 273);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: any): MidRerollAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidRerollAsk();
        const result0 = buffer.readPacket(273);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        return packet;
    }
}

export default MidRerollAsk;
