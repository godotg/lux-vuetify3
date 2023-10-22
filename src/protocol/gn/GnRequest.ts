

class GnRequest {

    

    static PROTOCOL_ID: number = 221;

    protocolId(): number {
        return GnRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GnRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: any): GnRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GnRequest();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GnRequest;
