

class MidRerollRequest {

    nonce: string = '';
    midjourneyId: number = 0;

    static PROTOCOL_ID: number = 273;

    protocolId(): number {
        return MidRerollRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidRerollRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.midjourneyId);
        buffer.writeString(packet.nonce);
    }

    static read(buffer: any): MidRerollRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidRerollRequest();
        const result0 = buffer.readLong();
        packet.midjourneyId = result0;
        const result1 = buffer.readString();
        packet.nonce = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidRerollRequest;
