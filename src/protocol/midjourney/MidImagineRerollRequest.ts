

class MidImagineRerollRequest {

    nonce: string = '';
    rerollNonce: string = '';

    static PROTOCOL_ID: number = 273;

    protocolId(): number {
        return MidImagineRerollRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineRerollRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.rerollNonce);
    }

    static read(buffer: any): MidImagineRerollRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineRerollRequest();
        const result0 = buffer.readString();
        packet.nonce = result0;
        const result1 = buffer.readString();
        packet.rerollNonce = result1;
        return packet;
    }
}

export default MidImagineRerollRequest;
