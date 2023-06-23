

class MidRerollRequest {

    nonce: string = '';
    midjourneyId: number = 0;

    static PROTOCOL_ID: number = 273;

    protocolId(): number {
        return MidRerollRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidRerollRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.midjourneyId);
        buffer.writeString(packet.nonce);
    }

    static read(buffer: any): MidRerollRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidRerollRequest();
        const result0 = buffer.readLong();
        packet.midjourneyId = result0;
        const result1 = buffer.readString();
        packet.nonce = result1;
        return packet;
    }
}

export default MidRerollRequest;
