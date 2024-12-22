import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class AnimationRequest {
    requestId: string = '';
    imageUrl: string = '';
    prompts: Array<string> = [];
}

export class AnimationRequestRegistration implements IProtocolRegistration<AnimationRequest> {
    protocolId(): number {
        return 1200;
    }

    write(buffer: IByteBuffer, packet: AnimationRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.imageUrl);
        buffer.writeStringArray(packet.prompts);
        buffer.writeString(packet.requestId);
    }

    read(buffer: IByteBuffer): AnimationRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new AnimationRequest();
        const result0 = buffer.readString();
        packet.imageUrl = result0;
        const array1 = buffer.readStringArray();
        packet.prompts = array1;
        const result2 = buffer.readString();
        packet.requestId = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default AnimationRequest;