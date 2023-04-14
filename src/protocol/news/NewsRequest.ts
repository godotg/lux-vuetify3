

class NewsRequest {

    query: string = '';
    page: number = 0;
    itemsPerPage: number = 0;

    static PROTOCOL_ID: number = 203

    protocolId(): number {
        return NewsRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsRequest | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeInt(packet.itemsPerPage);
        buffer.writeInt(packet.page);
        buffer.writeString(packet.query);
    }

    static read(buffer: any): NewsRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsRequest();
        const result0 = buffer.readInt();
        packet.itemsPerPage = result0;
        const result1 = buffer.readInt();
        packet.page = result1;
        const result2 = buffer.readString();
        packet.query = result2;
        return packet;
    }
}

export default NewsRequest;
