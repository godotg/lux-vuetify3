

class BrokerRegisterAsk {

    

    static PROTOCOL_ID: number = 300;

    protocolId(): number {
        return BrokerRegisterAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: BrokerRegisterAsk | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        
    }

    static read(buffer: any): BrokerRegisterAsk | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new BrokerRegisterAsk();
        
        return packet;
    }
}

export default BrokerRegisterAsk;
