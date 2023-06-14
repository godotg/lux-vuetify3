import News from './News';


class NewsResponse {

    news: Array<News> = [];

    static PROTOCOL_ID: number = 204;

    protocolId(): number {
        return NewsResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacketList(packet.news, 200);
    }

    static read(buffer: any): NewsResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsResponse();
        const list0 = buffer.readPacketList(200);
        packet.news = list0;
        return packet;
    }
}

export default NewsResponse;
