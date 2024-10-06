import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class User {
    id: number = 0;
    name: string = '';
    ctime: number = 0;
}

export class UserRegistration implements IProtocolRegistration<User> {
    protocolId(): number {
        return 260;
    }

    write(buffer: IByteBuffer, packet: User | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.ctime);
        buffer.writeLong(packet.id);
        buffer.writeString(packet.name);
    }

    read(buffer: IByteBuffer): User | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new User();
        const result0 = buffer.readLong();
        packet.ctime = result0;
        const result1 = buffer.readLong();
        packet.id = result1;
        const result2 = buffer.readString();
        packet.name = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default User;