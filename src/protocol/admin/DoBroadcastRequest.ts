import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class DoBroadcastRequest {
    id: number = 0;
}

export class DoBroadcastRequestRegistration implements IProtocolRegistration<DoBroadcastRequest> {
    protocolId(): number {
        return 10003;
    }

    write(buffer: IByteBuffer, packet: DoBroadcastRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.id);
    }

    read(buffer: IByteBuffer): DoBroadcastRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new DoBroadcastRequest();
        const result0 = buffer.readLong();
        packet.id = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default DoBroadcastRequest;