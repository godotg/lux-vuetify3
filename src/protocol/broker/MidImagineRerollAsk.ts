import MidImagineRerollRequest from '../midjourney/MidImagineRerollRequest';


class MidImagineRerollAsk {

    requestSid: number = 0;
    request: MidImagineRerollRequest | null = null;

    static PROTOCOL_ID: number = 304;

    protocolId(): number {
        return MidImagineRerollAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineRerollAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.request, 273);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: any): MidImagineRerollAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineRerollAsk();
        const result0 = buffer.readPacket(273);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        return packet;
    }
}

export default MidImagineRerollAsk;
