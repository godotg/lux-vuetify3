import MidSelectRequest from '../midjourney/MidSelectRequest';


class MidSelectAsk {

    requestSid: number = 0;
    request: MidSelectRequest | null = null;

    static PROTOCOL_ID: number = 305;

    protocolId(): number {
        return MidSelectAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidSelectAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.request, 274);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: any): MidSelectAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidSelectAsk();
        const result0 = buffer.readPacket(274);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        return packet;
    }
}

export default MidSelectAsk;
