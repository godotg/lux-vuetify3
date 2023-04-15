

class NewsIndustry {

    name: string = '';
    rise: string = '';

    static PROTOCOL_ID: number = 202;

    protocolId(): number {
        return NewsIndustry.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsIndustry | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.name);
        buffer.writeString(packet.rise);
    }

    static read(buffer: any): NewsIndustry | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsIndustry();
        const result0 = buffer.readString();
        packet.name = result0;
        const result1 = buffer.readString();
        packet.rise = result1;
        return packet;
    }
}

export default NewsIndustry;
