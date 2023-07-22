

class SdHistoryRequest {

    nonce: number = 0;

    static PROTOCOL_ID: number = 342;

    protocolId(): number {
        return SdHistoryRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdHistoryRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.nonce);
    }

    static read(buffer: any): SdHistoryRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdHistoryRequest();
        const result0 = buffer.readLong();
        packet.nonce = result0;
        return packet;
    }
}

export default SdHistoryRequest;
