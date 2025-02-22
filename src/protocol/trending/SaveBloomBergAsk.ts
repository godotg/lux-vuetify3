import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';
import Trending from './Trending';


class SaveBloomBergAsk {
    trending: Array<Trending> = [];
}

export class SaveBloomBergAskRegistration implements IProtocolRegistration<SaveBloomBergAsk> {
    protocolId(): number {
        return 420;
    }

    write(buffer: IByteBuffer, packet: SaveBloomBergAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.trending, 427);
    }

    read(buffer: IByteBuffer): SaveBloomBergAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SaveBloomBergAsk();
        const list0 = buffer.readPacketList(427);
        packet.trending = list0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SaveBloomBergAsk;