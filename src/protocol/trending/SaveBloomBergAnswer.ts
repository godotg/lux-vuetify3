import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class SaveBloomBergAnswer {
    message: string = '';
}

export class SaveBloomBergAnswerRegistration implements IProtocolRegistration<SaveBloomBergAnswer> {
    protocolId(): number {
        return 421;
    }

    write(buffer: IByteBuffer, packet: SaveBloomBergAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.message);
    }

    read(buffer: IByteBuffer): SaveBloomBergAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SaveBloomBergAnswer();
        const result0 = buffer.readString();
        packet.message = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SaveBloomBergAnswer;