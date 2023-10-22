import MidImagineNotice from '../midjourney/MidImagineNotice';


class MidImagineNotify {

    noticeSid: number = 0;
    notice: MidImagineNotice | null = null;

    static PROTOCOL_ID: number = 303;

    protocolId(): number {
        return MidImagineNotify.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineNotify | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.notice, 272);
        buffer.writeLong(packet.noticeSid);
    }

    static read(buffer: any): MidImagineNotify | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidImagineNotify();
        const result0 = buffer.readPacket(272);
        packet.notice = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidImagineNotify;
