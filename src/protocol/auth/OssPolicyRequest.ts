

class OssPolicyRequest {

    type: number = 0;

    static PROTOCOL_ID: number = 252;

    protocolId(): number {
        return OssPolicyRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: OssPolicyRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.type);
    }

    static read(buffer: any): OssPolicyRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new OssPolicyRequest();
        const result0 = buffer.readInt();
        packet.type = result0;
        return packet;
    }
}

export default OssPolicyRequest;
