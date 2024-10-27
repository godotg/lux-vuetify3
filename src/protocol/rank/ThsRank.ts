import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class ThsRank {
    code: number = 0;
    name: string = '';
    rate: number = 0;
    analyse: string = '';
}

export class ThsRankRegistration implements IProtocolRegistration<ThsRank> {
    protocolId(): number {
        return 226;
    }

    write(buffer: IByteBuffer, packet: ThsRank | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.analyse);
        buffer.writeInt(packet.code);
        buffer.writeString(packet.name);
        buffer.writeInt(packet.rate);
    }

    read(buffer: IByteBuffer): ThsRank | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ThsRank();
        const result0 = buffer.readString();
        packet.analyse = result0;
        const result1 = buffer.readInt();
        packet.code = result1;
        const result2 = buffer.readString();
        packet.name = result2;
        const result3 = buffer.readInt();
        packet.rate = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ThsRank;