import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class DoBroadcastResponse {
    
}

export class DoBroadcastResponseRegistration implements IProtocolRegistration<DoBroadcastResponse> {
    protocolId(): number {
        return 10004;
    }

    write(buffer: IByteBuffer, packet: DoBroadcastResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    read(buffer: IByteBuffer): DoBroadcastResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new DoBroadcastResponse();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default DoBroadcastResponse;