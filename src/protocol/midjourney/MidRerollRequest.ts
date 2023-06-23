

class MidRerollRequest {

    nonce: string = '';
    rerollNonce: string = '';

    static PROTOCOL_ID: number = 273;

    protocolId(): number {
        return MidRerollRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidRerollRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.rerollNonce);
    }

    static read(buffer: any): MidRerollRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidRerollRequest();
        const result0 = buffer.readString();
        packet.nonce = result0;
        const result1 = buffer.readString();
        packet.rerollNonce = result1;
        return packet;
    }
}

export default MidRerollRequest;
