import OssPolicyVO from './OssPolicyVO';


class OssPolicyResponse {

    ossPolicy: OssPolicyVO | null = null;

    static PROTOCOL_ID: number = 253;

    protocolId(): number {
        return OssPolicyResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: OssPolicyResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.ossPolicy, 254);
    }

    static read(buffer: any): OssPolicyResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new OssPolicyResponse();
        const result0 = buffer.readPacket(254);
        packet.ossPolicy = result0;
        return packet;
    }
}

export default OssPolicyResponse;
