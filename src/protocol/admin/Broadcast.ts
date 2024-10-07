import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class Broadcast {
    id: number = 0;
    content: string = '';
}

export class BroadcastRegistration implements IProtocolRegistration<Broadcast> {
    protocolId(): number {
        return 10002;
    }

    write(buffer: IByteBuffer, packet: Broadcast | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.content);
        buffer.writeLong(packet.id);
    }

    read(buffer: IByteBuffer): Broadcast | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new Broadcast();
        const result0 = buffer.readString();
        packet.content = result0;
        const result1 = buffer.readLong();
        packet.id = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default Broadcast;