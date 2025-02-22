import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class Trending {
    href: string = '';
    title: string = '';
    hot: string = '';
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
        buffer.writeString(packet.hot);
        buffer.writeString(packet.href);
        buffer.writeString(packet.title);
    }

    read(buffer: IByteBuffer): Trending | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new Trending();
        const result0 = buffer.readString();
        packet.hot = result0;
        const result1 = buffer.readString();
        packet.href = result1;
        const result2 = buffer.readString();
        packet.title = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default Trending;