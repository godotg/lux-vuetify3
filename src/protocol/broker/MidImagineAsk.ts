import MidImagineRequest from '../midjourney/MidImagineRequest';


class MidImagineAsk {

    requestSid: number = 0;
    request: MidImagineRequest | null = null;

    static PROTOCOL_ID: number = 302;

    protocolId(): number {
        return MidImagineAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.request, 270);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: any): MidImagineAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineAsk();
        const result0 = buffer.readPacket(270);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        return packet;
    }
}

export default MidImagineAsk;
