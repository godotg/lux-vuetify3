import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class AnimationNotice {
    requestId: string = '';
    imageUrl: string = '';
    imageUrlLow: string = '';
    imageUrlMiddle: string = '';
    imageUrlHigh: string = '';
}

export class AnimationNoticeRegistration implements IProtocolRegistration<AnimationNotice> {
    protocolId(): number {
        return 1201;
    }

    write(buffer: IByteBuffer, packet: AnimationNotice | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.imageUrl);
        buffer.writeString(packet.imageUrlHigh);
        buffer.writeString(packet.imageUrlLow);
        buffer.writeString(packet.imageUrlMiddle);
        buffer.writeString(packet.requestId);
    }

    read(buffer: IByteBuffer): AnimationNotice | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new AnimationNotice();
        const result0 = buffer.readString();
        packet.imageUrl = result0;
        const result1 = buffer.readString();
        packet.imageUrlHigh = result1;
        const result2 = buffer.readString();
        packet.imageUrlLow = result2;
        const result3 = buffer.readString();
        packet.imageUrlMiddle = result3;
        const result4 = buffer.readString();
        packet.requestId = result4;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default AnimationNotice;