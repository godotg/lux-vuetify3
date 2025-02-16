import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import EastMoneyRank from './EastMoneyRank';
import EastMoneyUSRank from './EastMoneyUSRank';


class RankResponse {
    ranks: Array<EastMoneyRank> = [];
    usRanks: Array<EastMoneyUSRank> = [];
    core: string = '';
}

export class RankResponseRegistration implements IProtocolRegistration<RankResponse> {
    protocolId(): number {
        return 411;
    }

    write(buffer: IByteBuffer, packet: RankResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.core);
        buffer.writePacketList(packet.ranks, 400);
        buffer.writePacketList(packet.usRanks, 401);
    }

    read(buffer: IByteBuffer): RankResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new RankResponse();
        const result0 = buffer.readString();
        packet.core = result0;
        const list1 = buffer.readPacketList(400);
        packet.ranks = list1;
        const list2 = buffer.readPacketList(401);
        packet.usRanks = list2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default RankResponse;