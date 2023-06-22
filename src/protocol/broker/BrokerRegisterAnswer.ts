

class BrokerRegisterAnswer {

    

    static PROTOCOL_ID: number = 301;

    protocolId(): number {
        return BrokerRegisterAnswer.PROTOCOL_ID;
    }

    static write(buffer: any, packet: BrokerRegisterAnswer | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        
    }

    static read(buffer: any): BrokerRegisterAnswer | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new BrokerRegisterAnswer();
        
        return packet;
    }
}

export default BrokerRegisterAnswer;
