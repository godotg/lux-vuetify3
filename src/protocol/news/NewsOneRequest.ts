

class NewsOneRequest {

    id: number = 0;

    static PROTOCOL_ID: number = 205;

    protocolId(): number {
        return NewsOneRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsOneRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.id);
    }

    static read(buffer: any): NewsOneRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new NewsOneRequest();
        const result0 = buffer.readLong();
        packet.id = result0;
        return packet;
    }
}

export default NewsOneRequest;
