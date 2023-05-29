import News from '../news/News';


class SeoQingBaoResponse {

    news: News | null = null;
    keywords: string = '';
    description: string = '';
    comment: string = '';

    static PROTOCOL_ID: number = 261;

    protocolId(): number {
        return SeoQingBaoResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SeoQingBaoResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.comment);
        buffer.writeString(packet.description);
        buffer.writeString(packet.keywords);
        buffer.writePacket(packet.news, 200);
    }

    static read(buffer: any): SeoQingBaoResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SeoQingBaoResponse();
        const result0 = buffer.readString();
        packet.comment = result0;
        const result1 = buffer.readString();
        packet.description = result1;
        const result2 = buffer.readString();
        packet.keywords = result2;
        const result3 = buffer.readPacket(200);
        packet.news = result3;
        return packet;
    }
}

export default SeoQingBaoResponse;
