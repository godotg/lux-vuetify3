import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class AnimationNotice {
    nonce: string = '';
    requestId: string = '';
    originImageUrl: string = '';
    imageUrls: Array<string> = [];
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
        buffer.writeStringList(packet.imageUrls);
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.originImageUrl);
        buffer.writeString(packet.requestId);
    }

    read(buffer: IByteBuffer): AnimationNotice | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new AnimationNotice();
        const list0 = buffer.readStringList();
        packet.imageUrls = list0;
        const result1 = buffer.readString();
        packet.nonce = result1;
        const result2 = buffer.readString();
        packet.originImageUrl = result2;
        const result3 = buffer.readString();
        packet.requestId = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default AnimationNotice;