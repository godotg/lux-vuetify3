

class MidImagineRequest {

    nonce: string = '';
    prompt: string = '';

    static PROTOCOL_ID: number = 270;

    protocolId(): number {
        return MidImagineRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.prompt);
    }

    static read(buffer: any): MidImagineRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineRequest();
        const result0 = buffer.readString();
        packet.nonce = result0;
        const result1 = buffer.readString();
        packet.prompt = result1;
        return packet;
    }
}

export default MidImagineRequest;
