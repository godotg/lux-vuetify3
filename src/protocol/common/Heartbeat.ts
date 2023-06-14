

class Heartbeat {

    

    static PROTOCOL_ID: number = 102;

    protocolId(): number {
        return Heartbeat.PROTOCOL_ID;
    }

    static write(buffer: any, packet: Heartbeat | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        
    }

    static read(buffer: any): Heartbeat | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new Heartbeat();
        
        return packet;
    }
}

export default Heartbeat;
