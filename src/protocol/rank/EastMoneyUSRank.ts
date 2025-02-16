import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class EastMoneyUSRank {
    code: string = '';
    marketType: string = '';
    chineseName: string = '';
    rankChange: number = 0;
    primary: boolean = false;
    info: string = '';
}

export class EastMoneyUSRankRegistration implements IProtocolRegistration<EastMoneyUSRank> {
    protocolId(): number {
        return 401;
    }

    write(buffer: IByteBuffer, packet: EastMoneyUSRank | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.chineseName);
        buffer.writeString(packet.code);
        buffer.writeString(packet.info);
        buffer.writeString(packet.marketType);
        buffer.writeBool(packet.primary);
        buffer.writeInt(packet.rankChange);
    }

    read(buffer: IByteBuffer): EastMoneyUSRank | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new EastMoneyUSRank();
        const result0 = buffer.readString();
        packet.chineseName = result0;
        const result1 = buffer.readString();
        packet.code = result1;
        const result2 = buffer.readString();
        packet.info = result2;
        const result3 = buffer.readString();
        packet.marketType = result3;
        const result4 = buffer.readBool(); 
        packet.primary = result4;
        const result5 = buffer.readInt();
        packet.rankChange = result5;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default EastMoneyUSRank;