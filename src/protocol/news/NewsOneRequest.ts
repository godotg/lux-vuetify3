

class NewsOneRequest {

    id: number = 0;

    static PROTOCOL_ID: number = 205;

    protocolId(): number {
        return NewsOneRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsOneRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.id);
    }

    static read(buffer: any): NewsOneRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new NewsOneRequest();
        const result0 = buffer.readLong();
        packet.id = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default NewsOneRequest;
