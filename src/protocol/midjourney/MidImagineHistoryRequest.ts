

class MidImagineHistoryRequest {

    nonce: string = '';

    static PROTOCOL_ID: number = 271;

    protocolId(): number {
        return MidImagineHistoryRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineHistoryRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.nonce);
    }

    static read(buffer: any): MidImagineHistoryRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineHistoryRequest();
        const result0 = buffer.readString();
        packet.nonce = result0;
        return packet;
    }
}

export default MidImagineHistoryRequest;
