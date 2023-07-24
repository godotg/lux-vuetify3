

class SdSimulateResponse {

    nonce: number = 0;
    costTime: number = 0;
    enPrompt: string = '';

    static PROTOCOL_ID: number = 343;

    protocolId(): number {
        return SdSimulateResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.costTime);
        buffer.writeString(packet.enPrompt);
        buffer.writeLong(packet.nonce);
    }

    static read(buffer: any): SdSimulateResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateResponse();
        const result0 = buffer.readLong();
        packet.costTime = result0;
        const result1 = buffer.readString();
        packet.enPrompt = result1;
        const result2 = buffer.readLong();
        packet.nonce = result2;
        return packet;
    }
}

export default SdSimulateResponse;
