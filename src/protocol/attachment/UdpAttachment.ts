

class UdpAttachment {

    host: string = '';
    port: number = 0;

    static PROTOCOL_ID: number = 3;

    protocolId(): number {
        return UdpAttachment.PROTOCOL_ID;
    }

    static write(buffer: any, packet: UdpAttachment | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.host);
        buffer.writeInt(packet.port);
    }

    static read(buffer: any): UdpAttachment | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new UdpAttachment();
        const result0 = buffer.readString();
        packet.host = result0;
        const result1 = buffer.readInt();
        packet.port = result1;
        return packet;
    }
}

export default UdpAttachment;
