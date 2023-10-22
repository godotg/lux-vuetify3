

class GatewaySynchronizeSidAsk {

    gatewayHostAndPort: string = '';
    sidMap: Map<number, number> = new Map();

    static PROTOCOL_ID: number = 24;

    protocolId(): number {
        return GatewaySynchronizeSidAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GatewaySynchronizeSidAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.gatewayHostAndPort);
        buffer.writeLongLongMap(packet.sidMap);
    }

    static read(buffer: any): GatewaySynchronizeSidAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GatewaySynchronizeSidAsk();
        const result0 = buffer.readString();
        packet.gatewayHostAndPort = result0;
        const map1 = buffer.readLongLongMap();
        packet.sidMap = map1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GatewaySynchronizeSidAsk;
