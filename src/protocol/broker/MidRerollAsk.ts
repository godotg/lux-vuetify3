import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import MidRerollRequest from '../midjourney/MidRerollRequest';


class MidRerollAsk {
    requestSid: number = 0;
    request: MidRerollRequest | null = null;
}

export class MidRerollAskRegistration implements IProtocolRegistration<MidRerollAsk> {
    protocolId(): number {
        return 854;
    }

    write(buffer: IByteBuffer, packet: MidRerollAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 803);
        buffer.writeLong(packet.requestSid);
    }

    read(buffer: IByteBuffer): MidRerollAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidRerollAsk();
        const result0 = buffer.readPacket(803);
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