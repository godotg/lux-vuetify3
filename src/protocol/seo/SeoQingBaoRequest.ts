

class SeoQingBaoRequest {

    id: number = 0;

    static PROTOCOL_ID: number = 260;

    protocolId(): number {
        return SeoQingBaoRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SeoQingBaoRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.id);
    }

    static read(buffer: any): SeoQingBaoRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SeoQingBaoRequest();
        const result0 = buffer.readLong();
        packet.id = result0;
        return packet;
    }
}

export default SeoQingBaoRequest;
