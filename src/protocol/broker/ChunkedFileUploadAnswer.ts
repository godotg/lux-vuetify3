import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class ChunkedFileUploadAnswer {
    chunkIndex: number = 0;
}

export class ChunkedFileUploadAnswerRegistration implements IProtocolRegistration<ChunkedFileUploadAnswer> {
    protocolId(): number {
        return 871;
    }

    write(buffer: IByteBuffer, packet: ChunkedFileUploadAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.chunkIndex);
    }

    read(buffer: IByteBuffer): ChunkedFileUploadAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChunkedFileUploadAnswer();
        const result0 = buffer.readInt();
        packet.chunkIndex = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChunkedFileUploadAnswer;