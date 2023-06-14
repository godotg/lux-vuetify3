

class NewsIndustry {

    name: string = '';
    code: number = 0;
    rise: string = '';

    static PROTOCOL_ID: number = 202;

    protocolId(): number {
        return NewsIndustry.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsIndustry | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.code);
        buffer.writeString(packet.name);
        buffer.writeString(packet.rise);
    }

    static read(buffer: any): NewsIndustry | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsIndustry();
        const result0 = buffer.readInt();
        packet.code = result0;
        const result1 = buffer.readString();
        packet.name = result1;
        const result2 = buffer.readString();
        packet.rise = result2;
        return packet;
    }
}

export default NewsIndustry;
