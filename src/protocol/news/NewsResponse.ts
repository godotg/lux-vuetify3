import News from './News';


class NewsResponse {

    page: number = 0;
    itemsPerPage: number = 0;
    news: Array<News> = [];

    static PROTOCOL_ID: number = 204;

    protocolId(): number {
        return NewsResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.itemsPerPage);
        buffer.writePacketList(packet.news, 200);
        buffer.writeInt(packet.page);
    }

    static read(buffer: any): NewsResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsResponse();
        const result0 = buffer.readInt();
        packet.itemsPerPage = result0;
        const list1 = buffer.readPacketList(200);
        packet.news = list1;
        const result2 = buffer.readInt();
        packet.page = result2;
        return packet;
    }
}

export default NewsResponse;
