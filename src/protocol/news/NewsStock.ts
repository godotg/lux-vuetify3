

class NewsStock {

    name: string = '';
    code: number = 0;
    price: string = '';
    rise: string = '';

    static PROTOCOL_ID: number = 201;

    protocolId(): number {
        return NewsStock.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsStock | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.code);
        buffer.writeString(packet.name);
        buffer.writeString(packet.price);
        buffer.writeString(packet.rise);
    }

    static read(buffer: any): NewsStock | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsStock();
        const result0 = buffer.readInt();
        packet.code = result0;
        const result1 = buffer.readString();
        packet.name = result1;
        const result2 = buffer.readString();
        packet.price = result2;
        const result3 = buffer.readString();
        packet.rise = result3;
        return packet;
    }
}

export default NewsStock;
