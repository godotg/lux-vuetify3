

class MidHistoryRequest {

    nonce: string = '';

    static PROTOCOL_ID: number = 271;

    protocolId(): number {
        return MidHistoryRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidHistoryRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.nonce);
    }

    static read(buffer: any): MidHistoryRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidHistoryRequest();
        const result0 = buffer.readString();
        packet.nonce = result0;
        return packet;
    }
}

export default MidHistoryRequest;
