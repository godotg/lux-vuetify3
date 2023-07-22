

class SdSimulateResponse {

    nonce: number = 0;
    costTime: number = 0;

    static PROTOCOL_ID: number = 343;

    protocolId(): number {
        return SdSimulateResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.costTime);
        buffer.writeLong(packet.nonce);
    }

    static read(buffer: any): SdSimulateResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateResponse();
        const result0 = buffer.readLong();
        packet.costTime = result0;
        const result1 = buffer.readLong();
        packet.nonce = result1;
        return packet;
    }
}

export default SdSimulateResponse;
