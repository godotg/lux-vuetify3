import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import MidUpscaleRequest from '../midjourney/MidUpscaleRequest';


class MidUpscaleAsk {
    requestSid: number = 0;
    request: MidUpscaleRequest | null = null;
}

export class MidUpscaleAskRegistration implements IProtocolRegistration<MidUpscaleAsk> {
    protocolId(): number {
        return 306;
    }

    write(buffer: IByteBuffer, packet: MidUpscaleAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 275);
        buffer.writeLong(packet.requestSid);
    }

    read(buffer: IByteBuffer): MidUpscaleAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidUpscaleAsk();
        const result0 = buffer.readPacket(275);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidUpscaleAsk;