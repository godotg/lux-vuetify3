

class Ping {

    

    static PROTOCOL_ID: number = 103

    protocolId(): number {
        return Ping.PROTOCOL_ID;
    }

    static write(buffer: any, packet: Ping | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        
    }

    static read(buffer: any): Ping | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new Ping();
        
        return packet;
    }
}

export default Ping;
