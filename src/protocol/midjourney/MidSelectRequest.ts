

class MidSelectRequest {

    category: string = '';
    index: number = 0;
    nonce: string = '';
    midjourneyId: number = 0;

    static PROTOCOL_ID: number = 274;

    protocolId(): number {
        return MidSelectRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidSelectRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.category);
        buffer.writeInt(packet.index);
        buffer.writeLong(packet.midjourneyId);
        buffer.writeString(packet.nonce);
    }

    static read(buffer: any): MidSelectRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidSelectRequest();
        const result0 = buffer.readString();
        packet.category = result0;
        const result1 = buffer.readInt();
        packet.index = result1;
        const result2 = buffer.readLong();
        packet.midjourneyId = result2;
        const result3 = buffer.readString();
        packet.nonce = result3;
        return packet;
    }
}

export default MidSelectRequest;
