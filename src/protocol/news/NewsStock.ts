

class NewsStock {

    name: string = '';
    price: string = '';
    rise: string = '';

    static PROTOCOL_ID: number = 201

    protocolId(): number {
        return NewsStock.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsStock | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeString(packet.name);
        buffer.writeString(packet.price);
        buffer.writeString(packet.rise);
    }

    static read(buffer: any): NewsStock | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsStock();
        const result0 = buffer.readString();
        packet.name = result0;
        const result1 = buffer.readString();
        packet.price = result1;
        const result2 = buffer.readString();
        packet.rise = result2;
        return packet;
    }
}

export default NewsStock;
