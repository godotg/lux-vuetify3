import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import MidImagineNotice from '../midjourney/MidImagineNotice';


class MidImagineNotify {
    noticeSid: number = 0;
    notice: MidImagineNotice | null = null;
}

export class MidImagineNotifyRegistration implements IProtocolRegistration<MidImagineNotify> {
    protocolId(): number {
        return 853;
    }

    write(buffer: IByteBuffer, packet: MidImagineNotify | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.notice, 802);
        buffer.writeLong(packet.noticeSid);
    }

    read(buffer: IByteBuffer): MidImagineNotify | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidImagineNotify();
        const result0 = buffer.readPacket(802);
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