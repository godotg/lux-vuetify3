import News from './News';


class NewsOneResponse {

    news: News | null = null;

    static PROTOCOL_ID: number = 206;

    protocolId(): number {
        return NewsOneResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsOneResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.news, 200);
    }

    static read(buffer: any): NewsOneResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsOneResponse();
        const result0 = buffer.readPacket(200);
        packet.news = result0;
        return packet;
    }
}

export default NewsOneResponse;
