

class NewsRequest {

    query: string = '';
    startId: number = 0;
    endId: number = 0;

    static PROTOCOL_ID: number = 203;

    protocolId(): number {
        return NewsRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.endId);
        buffer.writeString(packet.query);
        buffer.writeLong(packet.startId);
    }

    static read(buffer: any): NewsRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsRequest();
        const result0 = buffer.readLong();
        packet.endId = result0;
        const result1 = buffer.readString();
        packet.query = result1;
        const result2 = buffer.readLong();
        packet.startId = result2;
        return packet;
    }
}

export default NewsRequest;
