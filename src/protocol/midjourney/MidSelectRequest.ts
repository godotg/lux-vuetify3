

class MidSelectRequest {

    category: string = '';
    index: number = 0;
    nonce: string = '';
    rerollNonce: string = '';

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
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.rerollNonce);
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
        const result2 = buffer.readString();
        packet.nonce = result2;
        const result3 = buffer.readString();
        packet.rerollNonce = result3;
        return packet;
    }
}

export default MidSelectRequest;
