import IByteBuffer from '../IByteBuffer';
import News from './News';


class NewsResponse {

    news: Array<News> = [];

    static PROTOCOL_ID: number = 204;

    protocolId(): number {
        return NewsResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: NewsResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacketList(packet.news, 200);
    }

    static read(buffer: IByteBuffer): NewsResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new NewsResponse();
        const list0 = buffer.readPacketList(200);
        packet.news = list0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default NewsResponse;
