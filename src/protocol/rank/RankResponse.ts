import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import EastMoneyRank from './EastMoneyRank';
import ThsRank from './ThsRank';


class RankResponse {
    eastMoneyRanks: Array<EastMoneyRank> = [];
    thsRanks: Array<ThsRank> = [];
}

export class RankResponseRegistration implements IProtocolRegistration<RankResponse> {
    protocolId(): number {
        return 228;
    }

    write(buffer: IByteBuffer, packet: RankResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.eastMoneyRanks, 225);
        buffer.writePacketList(packet.thsRanks, 226);
    }

    read(buffer: IByteBuffer): RankResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new RankResponse();
        const list0 = buffer.readPacketList(225);
        packet.eastMoneyRanks = list0;
        const list1 = buffer.readPacketList(226);
        packet.thsRanks = list1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default RankResponse;