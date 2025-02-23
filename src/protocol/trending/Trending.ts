import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class Trending {
    url: string = '';
    title: string = '';
    subTitle: string = '';
    ctime: number = 0;
}

export class TrendingRegistration implements IProtocolRegistration<Trending> {
    protocolId(): number {
        return 427;
    }

    write(buffer: IByteBuffer, packet: Trending | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.ctime);
        buffer.writeString(packet.subTitle);
        buffer.writeString(packet.title);
        buffer.writeString(packet.url);
    }

    read(buffer: IByteBuffer): Trending | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new Trending();
        const result0 = buffer.readLong();
        packet.ctime = result0;
        const result1 = buffer.readString();
        packet.subTitle = result1;
        const result2 = buffer.readString();
        packet.title = result2;
        const result3 = buffer.readString();
        packet.url = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default Trending;