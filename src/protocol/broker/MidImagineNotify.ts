import MidImagineNotice from '../midjourney/MidImagineNotice';


class MidImagineNotify {

    noticeSid: number = 0;
    notice: MidImagineNotice | null = null;

    static PROTOCOL_ID: number = 303;

    protocolId(): number {
        return MidImagineNotify.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineNotify | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.notice, 271);
        buffer.writeLong(packet.noticeSid);
    }

    static read(buffer: any): MidImagineNotify | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineNotify();
        const result0 = buffer.readPacket(271);
        packet.notice = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        return packet;
    }
}

export default MidImagineNotify;
