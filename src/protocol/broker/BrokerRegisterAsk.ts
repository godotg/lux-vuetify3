

class BrokerRegisterAsk {

    

    static PROTOCOL_ID: number = 300;

    protocolId(): number {
        return BrokerRegisterAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: BrokerRegisterAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: any): BrokerRegisterAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new BrokerRegisterAsk();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default BrokerRegisterAsk;
