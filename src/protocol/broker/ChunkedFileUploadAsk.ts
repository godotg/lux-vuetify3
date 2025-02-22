import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class ChunkedFileUploadAsk {
    fileName: string = '';
    index: number = 0;
    bytes: Array<number> = [];
    end: boolean = false;
}

export class ChunkedFileUploadAskRegistration implements IProtocolRegistration<ChunkedFileUploadAsk> {
    protocolId(): number {
        return 870;
    }

    write(buffer: IByteBuffer, packet: ChunkedFileUploadAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeByteArray(packet.bytes);
        buffer.writeBool(packet.end);
        buffer.writeString(packet.fileName);
        buffer.writeInt(packet.index);
    }

    read(buffer: IByteBuffer): ChunkedFileUploadAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ChunkedFileUploadAsk();
        const array0 = buffer.readByteArray();
        packet.bytes = array0;
        const result1 = buffer.readBool(); 
        packet.end = result1;
        const result2 = buffer.readString();
        packet.fileName = result2;
        const result3 = buffer.readInt();
        packet.index = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ChunkedFileUploadAsk;