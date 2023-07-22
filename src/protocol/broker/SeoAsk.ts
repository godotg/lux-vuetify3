import News from '../news/News';


class SeoAsk {

    news: News | null = null;

    static PROTOCOL_ID: number = 306;

    protocolId(): number {
        return SeoAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SeoAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.news, 200);
    }

    static read(buffer: any): SeoAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SeoAsk();
        const result0 = buffer.readPacket(200);
        packet.news = result0;
        return packet;
    }
}

export default SeoAsk;
