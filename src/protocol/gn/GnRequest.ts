

class GnRequest {

    

    static PROTOCOL_ID: number = 221;

    protocolId(): number {
        return GnRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GnRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        
    }

    static read(buffer: any): GnRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GnRequest();
        
        return packet;
    }
}

export default GnRequest;
