import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import SdSimulateNotice from '../sdiffusion/SdSimulateNotice';


class SdSimulateNotify {
    noticeSid: number = 0;
    notice: SdSimulateNotice | null = null;
}

export class SdSimulateNotifyRegistration implements IProtocolRegistration<SdSimulateNotify> {
    protocolId(): number {
        return 903;
    }

    write(buffer: IByteBuffer, packet: SdSimulateNotify | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.notice, 1051);
        buffer.writeLong(packet.noticeSid);
    }

    read(buffer: IByteBuffer): SdSimulateNotify | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SdSimulateNotify();
        const result0 = buffer.readPacket(1051);
        packet.notice = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SdSimulateNotify;