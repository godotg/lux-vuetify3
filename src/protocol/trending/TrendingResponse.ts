import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import Trending from './Trending';


class TrendingResponse {
    douyin: Array<Trending> = [];
    weibo: Array<Trending> = [];
    xueqiu: Array<Trending> = [];
    dfcf1: Array<Trending> = [];
    dfcf2: Array<Trending> = [];
    bloomBerg: Array<Trending> = [];
}

export class TrendingResponseRegistration implements IProtocolRegistration<TrendingResponse> {
    protocolId(): number {
        return 426;
    }

    write(buffer: IByteBuffer, packet: TrendingResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.bloomBerg, 427);
        buffer.writePacketList(packet.dfcf1, 427);
        buffer.writePacketList(packet.dfcf2, 427);
        buffer.writePacketList(packet.douyin, 427);
        buffer.writePacketList(packet.weibo, 427);
        buffer.writePacketList(packet.xueqiu, 427);
    }

    read(buffer: IByteBuffer): TrendingResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new TrendingResponse();
        const list0 = buffer.readPacketList(427);
        packet.bloomBerg = list0;
        const list1 = buffer.readPacketList(427);
        packet.dfcf1 = list1;
        const list2 = buffer.readPacketList(427);
        packet.dfcf2 = list2;
        const list3 = buffer.readPacketList(427);
        packet.douyin = list3;
        const list4 = buffer.readPacketList(427);
        packet.weibo = list4;
        const list5 = buffer.readPacketList(427);
        packet.xueqiu = list5;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default TrendingResponse;